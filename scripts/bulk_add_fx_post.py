#!/usr/bin/env python3
"""
scripts/bulk_add_fx_post.py  —  ONE-TIME MIGRATION HELPER
============================================================
You don't run this in CI. Run it once, locally, after cloning your repo,
to retrofit an <!-- FX:POST ... FX:POST --> block onto every existing file
in /blog/*.html that doesn't have one yet — so you don't have to hand-type
36 of them.

WHAT IT DOES
------------
For each blog/*.html file that has NO FX:POST block yet, it:
  1. Pulls the post title from <title>...</title> (stripping a trailing
     " — Flexora.Ai" / " | Flexora.Ai" site suffix if present, or falls
     back to <meta property="og:title">).
  2. Pulls the excerpt from <meta name="description"> or
     <meta property="og:description">.
  3. Figures out the card thumbnail image by, in order:
       a) reading <meta property="og:image"> if the post already has one
          pointing at a local file (not some other domain's CDN),
       b) actually searching the filesystem for a file named after the
          slug (any of .webp/.jpg/.jpeg/.png/.avif/.gif) inside the usual
          image folders (assets/images/blog/, assets/images/, images/blog/,
          images/, static/images/blog/),
       c) if nothing is found anywhere, leaving the image field blank —
          the card then shows the 📝 emoji fallback instead of a broken
          image, and this file gets a TODO note so you know it still
          needs a real thumbnail.
     It never guesses a path that doesn't correspond to a real file on
     disk — that was the old behaviour and it silently produced broken
     image links whenever the guessed filename didn't exist.
  4. Tries to find a date from <meta property="article:published_time">;
     if none exists, falls back to the file's `git log` first-commit date;
     if git isn't available, falls back to today's date and flags it with
     a TODO so you know to fix it by hand.
  5. Uses the filename (minus .html) as the slug.
  6. Defaults category to "Guide", icon to "📝", published to true,
     featured to false, author to "Prashant Lalwani", readMins to a
     rough estimate from word count (min 3, max 15).
  7. Inserts the block right after the opening <head> tag.

Files that ALREADY have an FX:POST block are left completely untouched —
safe to re-run.

HOW TO USE
----------
1. Clone your repo locally (or open it in Codespaces / VS Code's
   "Clone Repository").
2. From the repo root, run:
       python3 scripts/bulk_add_fx_post.py
3. It prints a summary of every file it touched and every field it had to
   guess at (marked "TODO:"). Open a few of those files and fix the
   guessed date/category/excerpt if they're wrong — this is meant to get
   you 90% of the way there, not be perfect.
4. Run `python3 scripts/update_blog_data.py` to regenerate blog-data.js
   locally and sanity-check the output.
5. Commit everything and push:
       git add blog/ assets/js/blog-data.js
       git commit -m "Add FX:POST metadata to existing posts"
       git push
   (Pushing will also trigger the GitHub Actions workflow, which will
   regenerate blog-data.js again on the server side — that's fine, it's
   idempotent.)
"""

import glob
import os
import re
import subprocess
import sys
from datetime import date

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_GLOB = os.path.join(REPO_ROOT, "blog", "*.html")

FX_BLOCK_RE = re.compile(r"<!--\s*FX:POST.*?FX:POST\s*-->", re.DOTALL)
TITLE_TAG_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)

# NOTE: these all capture the opening quote char in group 1 and require the
# SAME quote to close the attribute (backreference \2 / \1). Using a plain
# ["\'] class on both ends is a bug — an apostrophe inside the content
# itself (e.g. a description containing "won't") would match as the
# closing quote and silently truncate the value.
OG_TITLE_RE = re.compile(r'<meta[^>]+property=["\']og:title["\'][^>]+content=(["\'])(.*?)\1', re.IGNORECASE)
DESC_RE = re.compile(r'<meta[^>]+name=["\']description["\'][^>]+content=(["\'])(.*?)\1', re.IGNORECASE)
OG_DESC_RE = re.compile(r'<meta[^>]+property=["\']og:description["\'][^>]+content=(["\'])(.*?)\1', re.IGNORECASE)
PUBLISHED_TIME_RE = re.compile(
    r'<meta[^>]+property=["\']article:published_time["\'][^>]+content=(["\'])([\d-]{10})', re.IGNORECASE
)
OG_IMAGE_RE = re.compile(r'<meta[^>]+property=["\']og:image["\'][^>]+content=(["\'])(.*?)\1', re.IGNORECASE)
HEAD_OPEN_RE = re.compile(r"(<head[^>]*>)", re.IGNORECASE)

SITE_SUFFIX_RE = re.compile(r"\s*[—\-|]\s*Flexora\.?Ai\s*$", re.IGNORECASE)

DEFAULT_CATEGORY = "Guide"
DEFAULT_ICON = "📝"
DEFAULT_AUTHOR = "Prashant Lalwani"

IMAGE_EXTENSIONS = (".webp", ".jpg", ".jpeg", ".png", ".avif", ".gif")
# Every folder we'll actually check on disk, in priority order. Relative to
# the repo root — add another entry here if your images live somewhere else.
IMAGE_SEARCH_DIRS = (
    "assets/images/blog",
    "assets/images",
    "images/blog",
    "images",
    "static/images/blog",
)


def extract_og_image(html):
    """Return a repo-relative image path from <meta property="og:image">,
    but only if it points at a same-site local file — an absolute URL to
    flexora-ai.github.io/... gets stripped down to the relative part, and
    a URL to any other domain (a CDN, a stock photo site, etc.) is ignored
    since we can't verify that file exists in THIS repo."""
    m = OG_IMAGE_RE.search(html)
    if not m:
        return None
    raw = unescape_html_entities(m.group(2))

    # Strip a same-site absolute URL down to its path.
    site_match = re.match(r"https?://(?:www\.)?flexora-ai\.github\.io/(.+)", raw, re.IGNORECASE)
    if site_match:
        raw = site_match.group(1)
    elif re.match(r"https?://", raw, re.IGNORECASE):
        return None  # points at some other domain — can't confirm it's a local file

    return raw.lstrip("/")


def find_existing_image(slug):
    """Actually look on disk for a file named after this slug in any of the
    usual image folders, trying each extension in IMAGE_EXTENSIONS. Returns
    a repo-relative path if found, else None. This is the difference
    between guessing a path and confirming a path — a card pointed at a
    file that doesn't exist just falls back to the emoji icon silently, so
    a wrong guess here is easy to miss unless you check every card by eye.
    """
    for folder in IMAGE_SEARCH_DIRS:
        for ext in IMAGE_EXTENSIONS:
            candidate = os.path.join(REPO_ROOT, folder, f"{slug}{ext}")
            if os.path.isfile(candidate):
                return f"{folder}/{slug}{ext}"
    return None


def unescape_html_entities(text):
    return (
        text.replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
        .replace("&quot;", '"')
        .replace("&#39;", "'")
        .strip()
    )


def extract_title(html):
    m = TITLE_TAG_RE.search(html)
    if m:
        title = unescape_html_entities(m.group(1))
        title = SITE_SUFFIX_RE.sub("", title).strip()
        if title:
            return title
    m = OG_TITLE_RE.search(html)
    if m:
        return unescape_html_entities(m.group(2))
    return None


def extract_excerpt(html):
    m = DESC_RE.search(html)
    if m:
        return unescape_html_entities(m.group(2))
    m = OG_DESC_RE.search(html)
    if m:
        return unescape_html_entities(m.group(2))
    return ""


def git_first_commit_date(filepath):
    try:
        result = subprocess.run(
            ["git", "log", "--diff-filter=A", "--follow", "--format=%as", "--", filepath],
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=10,
        )
        lines = [l.strip() for l in result.stdout.strip().splitlines() if l.strip()]
        if lines:
            return lines[-1]  # earliest entry
    except Exception:
        pass
    return None


def estimate_read_mins(html):
    text = re.sub(r"<[^>]+>", " ", html)
    words = len(text.split())
    mins = max(3, min(15, round(words / 220)))
    return mins


def build_fx_block(fields, notes):
    lines = ["<!-- FX:POST"]
    for key in ("slug", "title", "category", "icon", "image", "excerpt", "readMins", "date", "published", "featured", "author"):
        if key == "image" and not fields.get("image"):
            continue  # no confirmed image — omit the field so the card falls back to the emoji icon cleanly
        lines.append(f"{key}: {fields[key]}")
    lines.append("FX:POST -->")
    block = "\n".join(lines)
    if notes:
        block += "\n<!-- " + " | ".join(notes) + " -->"
    return block


def process_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        html = f.read()

    if FX_BLOCK_RE.search(html):
        return "skipped", None  # already has a block

    slug = os.path.splitext(os.path.basename(filepath))[0]
    notes = []

    title = extract_title(html)
    if not title:
        title = slug.replace("-", " ").title()
        notes.append("TODO: no <title> found, guessed from filename")

    excerpt = extract_excerpt(html)
    if not excerpt:
        notes.append("TODO: no meta description found, excerpt left blank")

    # Image: try og:image first (only if it points at a local file we can
    # verify), then actually search the filesystem for slug.<ext>. Never
    # fall back to a guessed-but-unconfirmed path.
    image_path = extract_og_image(html)
    if image_path and not os.path.isfile(os.path.join(REPO_ROOT, image_path)):
        image_path = None  # og:image pointed at something that isn't actually there
    if not image_path:
        image_path = find_existing_image(slug)
    if not image_path:
        notes.append(f"TODO: no image file found for slug '{slug}' — card will show the 📝 icon until you add one")

    date_match = PUBLISHED_TIME_RE.search(html)
    if date_match:
        post_date = date_match.group(2)
    else:
        git_date = git_first_commit_date(filepath)
        if git_date:
            post_date = git_date
            notes.append("date guessed from git history — verify it's correct")
        else:
            post_date = date.today().isoformat()
            notes.append("TODO: no date source found, defaulted to today — please fix")

    fields = {
        "slug": slug,
        "title": title,
        "category": DEFAULT_CATEGORY,
        "icon": DEFAULT_ICON,
        "image": image_path,
        "excerpt": excerpt,
        "readMins": estimate_read_mins(html),
        "date": post_date,
        "published": "true",
        "featured": "false",
        "author": DEFAULT_AUTHOR,
    }

    if not excerpt:
        notes.append("TODO: category defaulted to 'Guide' — change if wrong")

    block = build_fx_block(fields, notes)

    new_html, count = HEAD_OPEN_RE.subn(lambda m: f"{m.group(1)}\n{block}\n", html, count=1)
    if count == 0:
        return "error", "no <head> tag found — block not inserted"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_html)

    return "updated", notes


def main():
    files = sorted(glob.glob(BLOG_GLOB))
    if not files:
        print("No files found under /blog/*.html")
        return

    updated, skipped, errors = 0, 0, 0
    for filepath in files:
        rel = os.path.relpath(filepath, REPO_ROOT)
        status, info = process_file(filepath)
        if status == "updated":
            updated += 1
            print(f"[updated] {rel}")
            for note in info:
                print(f"           - {note}")
        elif status == "skipped":
            skipped += 1
            print(f"[skipped] {rel} — already has an FX:POST block")
        else:
            errors += 1
            print(f"[ERROR]   {rel} — {info}")

    print()
    print(f"Done: {updated} updated, {skipped} skipped, {errors} errors.")
    if updated:
        print("Review the TODO notes above, fix any wrong guesses, then run:")
        print("  python3 scripts/update_blog_data.py")
        print("to regenerate blog-data.js locally before committing.")


if __name__ == "__main__":
    main()
