#!/usr/bin/env python3
"""
Flexora.Ai — auto-update assets/js/blog-data.js from your /blog/*.html posts.

Run manually with:   python3 scripts/update_blog_data.py
Runs automatically via .github/workflows/update-blog-data.yml on every push.

WHAT THIS TOUCHES
------------------
ONLY assets/js/blog-data.js. It never edits blog.html, and it never touches
sitemap.xml or sitemap.html — you said you already have your own sitemap, so
this script doesn't go near it.

HOW THIS WORKS
--------------
Every blog post file in /blog/*.html must contain ONE metadata comment
block somewhere in its <head>, like this:

<!-- FX:POST
slug: my-post-slug
title: My Post Title
category: Guide
icon: 📣
image: assets/images/blog/my-post-slug.webp
imageAlt: Alt text for the cover image
excerpt: One or two sentence summary shown on the card.
readMins: 8
date: 2026-09-10
author: Piyush Lalwani
published: true
featured: false
-->

Only slug, title, category, and date are required. Everything else has a
sensible default if you leave it out (see collect_posts() below).

"featured: true" on exactly one post makes it show in the big spotlight box
at the top of blog.html — if none is marked featured, the most recent
published post is used automatically.

WHAT IT DOES, EVERY TIME IT RUNS
---------------------------------
  1. Scans every file in /blog/*.html (skipping files starting with "_",
     like _template.html) and reads its FX:POST block.
  2. Rewrites assets/js/blog-data.js — the BLOG_POSTS array is regenerated
     from scratch every time. The blogCardHTML()/formatDate() helper
     functions further down in that file are left untouched, so you can
     safely hand-edit how a card looks without this script overwriting it.

TO ADD A NEW POST
------------------
  1. Drop the new .html file in /blog/, with an FX:POST block in its <head>.
  2. Commit and push. GitHub Actions runs this script automatically.

TO REMOVE A POST
------------------
  Delete the file from /blog/, OR set "published: false" in its FX:POST
  block to hide it without deleting the file.
"""

import re
import os
import glob
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BLOG_DIR = os.path.join(ROOT, "blog")
BLOG_DATA_JS = os.path.join(ROOT, "assets", "js", "blog-data.js")

META_BLOCK_RE = re.compile(r"<!--\s*FX:POST(.*?)-->", re.DOTALL)
BLOG_POSTS_RE = re.compile(r"const BLOG_POSTS = \[.*?\];", re.DOTALL)


def parse_post_file(path):
    """Extract the FX:POST metadata block from one blog post file. Returns
    a dict, or None (with a printed reason) if the file should be skipped."""
    with open(path, encoding="utf-8") as f:
        content = f.read()
    m = META_BLOCK_RE.search(content)
    if not m:
        print(f"  ! skipping {os.path.basename(path)} — no <!-- FX:POST ... --> block found in <head>")
        return None

    data = {}
    for line in m.group(1).strip().splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, _, value = line.partition(":")
        data[key.strip()] = value.strip()

    required = ["slug", "title", "category", "date"]
    missing = [k for k in required if k not in data or not data[k]]
    if missing:
        print(f"  ! skipping {os.path.basename(path)} — missing required field(s): {missing}")
        return None

    try:
        data["readMins"] = int(data.get("readMins", 5))
    except ValueError:
        data["readMins"] = 5
    data["published"] = data.get("published", "true").strip().lower() == "true"
    data["featured"] = data.get("featured", "false").strip().lower() == "true"
    data.setdefault("icon", "📝")
    data.setdefault("author", "Piyush Lalwani")
    data.setdefault("image", "")
    data.setdefault("imageAlt", data["title"])
    data.setdefault("excerpt", "")
    return data


def collect_posts():
    posts = []
    if not os.path.isdir(BLOG_DIR):
        print(f"  ! no /blog directory found at {BLOG_DIR} — no posts to collect")
        return posts
    for path in sorted(glob.glob(os.path.join(BLOG_DIR, "*.html"))):
        name = os.path.basename(path)
        if name.startswith("_"):
            continue  # templates like _template.html are never posts
        data = parse_post_file(path)
        if data:
            posts.append(data)
    return posts


def build_blog_posts_js(posts):
    lines = ["const BLOG_POSTS = ["]
    for p in posts:
        lines.append(
            "  { slug:'%s', title:%s, category:'%s', icon:'%s', "
            "image:'%s', imageAlt:%s, excerpt:%s, readMins:%d, "
            "date:'%s', published:%s, featured:%s, author:'%s' },"
            % (
                p["slug"],
                json.dumps(p["title"], ensure_ascii=False),
                p["category"],
                p["icon"],
                p["image"],
                json.dumps(p["imageAlt"], ensure_ascii=False),
                json.dumps(p["excerpt"], ensure_ascii=False),
                p["readMins"],
                p["date"],
                "true" if p["published"] else "false",
                "true" if p["featured"] else "false",
                p["author"],
            )
        )
    lines.append("];")
    return "\n".join(lines)


def update_blog_data_js(posts):
    if not os.path.isfile(BLOG_DATA_JS):
        print(f"  ! {BLOG_DATA_JS} doesn't exist yet — creating it fresh")
        os.makedirs(os.path.dirname(BLOG_DATA_JS), exist_ok=True)
        with open(BLOG_DATA_JS, "w", encoding="utf-8") as f:
            f.write(build_blog_posts_js(posts) + "\n")
        print(f"  ✓ created {BLOG_DATA_JS} — you'll want to add blogCardHTML()/formatDate() "
              "helper functions to it by hand once (copy from a working version).")
        return

    with open(BLOG_DATA_JS, encoding="utf-8") as f:
        content = f.read()

    new_block = build_blog_posts_js(posts)

    if BLOG_POSTS_RE.search(content):
        content = BLOG_POSTS_RE.sub(new_block.replace("\\", "\\\\"), content, count=1)
    else:
        # No existing array found — prepend one at the top of the file.
        content = new_block + "\n\n" + content
        print("  ! no existing 'const BLOG_POSTS = [...]' found — added one at the top of the file")

    with open(BLOG_DATA_JS, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  ✓ {os.path.relpath(BLOG_DATA_JS, ROOT)} updated — {len(posts)} post(s) in BLOG_POSTS")


def main():
    print("Flexora.Ai — scanning /blog for posts...")
    posts = collect_posts()
    posts.sort(key=lambda p: p["date"], reverse=True)
    print(f"Found {len(posts)} valid post file(s).")
    update_blog_data_js(posts)
    print("Done. (blog.html and your sitemap were not touched.)")


if __name__ == "__main__":
    main()
