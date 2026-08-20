# Modal Popup System - Technical Reference

## 📑 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [File Descriptions](#file-descriptions)
3. [API Reference](#api-reference)
4. [HTML Structure](#html-structure)
5. [CSS Classes Reference](#css-classes-reference)
6. [JavaScript Functions](#javascript-functions)
7. [Form Data Structure](#form-data-structure)
8. [Events & Listeners](#events--listeners)
9. [Error Handling](#error-handling)
10. [Performance Notes](#performance-notes)

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FLEXORA.AI WEBSITE                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────┐         ┌────────────────────┐      │
│  │  Floating Buttons  │         │  Modal Overlays    │      │
│  │  (FAB)             │◄───────►│  (Hidden/Visible)  │      │
│  │  - Contact (✉)    │         │                    │      │
│  │  - Submit (+)      │         │  - Contact Form    │      │
│  └────────────────────┘         │  - Submit Form     │      │
│          ▲                       └────────────────────┘      │
│          │                               ▲                   │
│          └───────────────────────────────┘                   │
│                  (Event Listeners)                            │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│           assets/js/modals.js (Event Handler)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Form Submission ────────────────┐                          │
│                                  ▼                           │
│                         Formspree.io API                     │
│                    (HTTPS POST Request)                      │
│                                                               │
│  ├─ Contact Form ──► f/xyegnwpy                             │
│  └─ Submit Form ───► f/xzepjrvz                             │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│           Browser localStorage (Data Persistence)            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  - contactFormData (auto-save)                              │
│  - submitFormData (auto-save)                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## File Descriptions

### `assets/js/modals.js` (315 lines)
**Purpose:** Complete modal management and form handling

**Key Sections:**
- Modal element references (lines 17-25)
- Open/close functions (lines 28-72)
- Event listeners (lines 75-96)
- Contact form handler (lines 99-138)
- Submit form handler (lines 141-180)
- Toast notifications (lines 183-194)
- Keyboard controls (lines 197-203)
- Form validation (lines 206-215)
- Data persistence (lines 218-240)

### `index.html` (Modified)
**Purpose:** HTML structure and form markup

**New Elements:**
- Lines 265-270: Floating action buttons (FAB)
- Lines 272-292: Contact modal
- Lines 294-326: Submit tool modal
- Line 329: Script reference for modals.js

### `assets/css/style.css` (Updated)
**Purpose:** Styling and animations

**New CSS Sections:**
- Lines 352-401: Modal overlay & box
- Lines 404-438: Modal animations
- Lines 441-485: Form input styling
- Lines 488-512: Mobile responsive
- Lines 344-350: Floating action buttons (FAB)

---

## API Reference

### Formspree Contact Endpoint
```
POST https://formspree.io/f/xyegnwpy
Content-Type: application/x-www-form-urlencoded

Request Payload:
{
  name: string,
  email: string (valid email),
  message: string
}

Response:
{
  ok: boolean,
  next: string (redirect URL)
}
```

### Formspree Submit Tool Endpoint
```
POST https://formspree.io/f/xzepjrvz
Content-Type: application/x-www-form-urlencoded

Request Payload:
{
  tool_name: string,
  website: string (valid URL),
  category: string (enum: Writing, Image, Video, Coding, SEO, Audio, Automation, Other),
  pricing: string (enum: Free, Freemium, Paid only),
  description: string,
  contact_email: string (valid email)
}

Response:
{
  ok: boolean,
  next: string (redirect URL)
}
```

---

## HTML Structure

### Contact Modal
```html
<div class="modal-overlay" id="contactModal">
  <div class="modal-box">
    <button class="modal-close" id="contactModalClose">✕</button>
    <span class="eyebrow"><span class="dot"></span>Get in touch</span>
    <h3>Contact us</h3>
    <p class="modal-sub">We usually reply within a day or two.</p>
    
    <form id="popupContactForm" class="mini-form" 
          action="https://formspree.io/f/xyegnwpy" method="POST">
      <!-- Form fields here -->
    </form>
    
    <div class="mf-success" id="popupContactSuccess">
      <!-- Success message -->
    </div>
  </div>
</div>
```

### Form Fields Reference

**Contact Form:**
```html
<input type="text" name="name" required />
<input type="email" name="email" required />
<textarea name="message" required rows="4"></textarea>
```

**Submit Tool Form:**
```html
<input type="text" name="tool_name" required />
<input type="url" name="website" required />
<select name="category" required>
  <option>Writing</option>
  <option>Image</option>
  <option>Video</option>
  <option>Coding</option>
  <option>SEO</option>
  <option>Audio</option>
  <option>Automation</option>
  <option>Other</option>
</select>
<select name="pricing" required>
  <option>Free</option>
  <option>Freemium</option>
  <option>Paid only</option>
</select>
<textarea name="description" required rows="3"></textarea>
<input type="email" name="contact_email" required />
```

---

## CSS Classes Reference

### Modal Classes
```css
.modal-overlay          /* Full-screen overlay container */
.modal-overlay.open     /* Adds display:flex and animation */
.modal-box              /* Modal content box */
.modal-close            /* Close button (X) */
.modal-sub              /* Subtitle text inside modal */
```

### Form Classes
```css
.mini-form              /* Form container */
.mf-row                 /* Form row with 2 columns */
.mf-success             /* Success message container */
.mf-success.show        /* Shows success message */
.mini-form input        /* Input styling */
.mini-form select       /* Select/dropdown styling */
.mini-form textarea     /* Textarea styling */
```

### Button Classes
```css
.fab                    /* Floating action button */
.fab-contact            /* Contact button (bottom: 24px) */
.fab-submit             /* Submit button (bottom: 80px) */
.fab-icon               /* Icon inside FAB */
.btn                    /* Base button style */
.btn-primary            /* Primary button (teal) */
```

### Animation Classes
```css
@keyframes modalFade    /* Overlay fade-in */
@keyframes modalPop     /* Modal scale-up with spring */
@keyframes successPop   /* Success message pop-in */
```

---

## JavaScript Functions

### Modal Management

#### `openContactModal()`
```javascript
/**
 * Opens the contact modal
 * - Adds 'open' class to trigger CSS animation
 * - Prevents body scroll
 * - Loads saved form data from localStorage
 */
```

#### `closeContactModal()`
```javascript
/**
 * Closes the contact modal
 * - Removes 'open' class
 * - Re-enables body scroll
 * - Hides success message
 * - Resets form fields
 * - Clears from DOM
 */
```

#### `openSubmitModal()`
```javascript
/**
 * Opens the submit tool modal
 * - Adds 'open' class to trigger CSS animation
 * - Prevents body scroll
 * - Loads saved form data from localStorage
 */
```

#### `closeSubmitModal()`
```javascript
/**
 * Closes the submit tool modal
 * - Removes 'open' class
 * - Re-enables body scroll
 * - Hides success message
 * - Resets form fields
 * - Clears from DOM
 */
```

### Form Handling

#### Contact Form Handler
```javascript
popupContactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(popupContactForm);
  
  try {
    const response = await fetch(popupContactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok || response.status === 200) {
      popupContactForm.classList.add('hidden');
      popupContactSuccess.classList.add('show');
      setTimeout(closeContactModal, 3000);
    } else {
      showToast('❌ Error sending message. Please try again.');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showToast('❌ Error sending message. Please check your connection.');
  }
});
```

#### Submit Form Handler
```javascript
popupSubmitForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(popupSubmitForm);
  
  try {
    const response = await fetch(popupSubmitForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok || response.status === 200) {
      popupSubmitForm.classList.add('hidden');
      popupSubmitSuccess.classList.add('show');
      setTimeout(closeSubmitModal, 3000);
    } else {
      showToast('❌ Error submitting tool. Please try again.');
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showToast('❌ Error submitting tool. Please check your connection.');
  }
});
```

### Utility Functions

#### `showToast(message)`
```javascript
/**
 * Displays temporary notification
 * @param {string} message - Message to display
 * 
 * Usage:
 * showToast('✅ Form submitted successfully!');
 * showToast('❌ Error occurred!');
 */
```

#### `saveFormData(form, storageKey)`
```javascript
/**
 * Auto-saves form data to localStorage
 * @param {HTMLFormElement} form - Form to watch
 * @param {string} storageKey - Key for storage
 * 
 * Listens to 'change' events on all inputs
 * Saves data on each change
 */
```

#### `loadFormData(form, storageKey)`
```javascript
/**
 * Loads previously saved form data
 * @param {HTMLFormElement} form - Form to populate
 * @param {string} storageKey - Key to retrieve from storage
 * 
 * Runs on modal open
 * Populates all form fields
 */
```

---

## Form Data Structure

### Contact Form Storage
```javascript
// localStorage key: 'contactFormData'
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I have a question about..."
}
```

### Submit Tool Form Storage
```javascript
// localStorage key: 'submitFormData'
{
  "tool_name": "ChatGPT",
  "website": "https://openai.com",
  "category": "Writing",
  "pricing": "Freemium",
  "description": "Advanced AI assistant for...",
  "contact_email": "contact@example.com"
}
```

---

## Events & Listeners

### Button Click Events
```javascript
fabContact.addEventListener('click', openContactModal);
fabSubmit.addEventListener('click', openSubmitModal);
contactModalClose.addEventListener('click', closeContactModal);
submitModalClose.addEventListener('click', closeSubmitModal);
```

### Modal Overlay Click
```javascript
// Close when clicking outside modal (on overlay)
contactModal.addEventListener('click', (e) => {
  if (e.target === contactModal) closeContactModal();
});
```

### Form Submit Events
```javascript
popupContactForm.addEventListener('submit', handleContactSubmit);
popupSubmitForm.addEventListener('submit', handleSubmitSubmit);
```

### Keyboard Events
```javascript
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (contactModal.classList.contains('open')) closeContactModal();
    if (submitModal.classList.contains('open')) closeSubmitModal();
  }
});
```

### Form Change Events (for localStorage)
```javascript
form.querySelectorAll('input, textarea, select').forEach(input => {
  input.addEventListener('change', () => {
    // Save to localStorage
  });
});
```

---

## Error Handling

### Network Errors
```javascript
try {
  const response = await fetch(url, options);
  // Handle response
} catch (error) {
  console.error('Network error:', error);
  showToast('❌ Error. Please check your connection.');
}
```

### Validation Errors
```javascript
// HTML5 validation triggered on form submit
// Required fields: <input required>
// Email validation: <input type="email" required>
// URL validation: <input type="url" required>
```

### localStorage Errors
```javascript
// Check if localStorage is available
if (typeof(Storage) !== "undefined") {
  localStorage.setItem(key, value);
} else {
  console.warn('localStorage not available');
}
```

---

## Performance Notes

### Optimization Techniques Used

1. **Event Delegation**
   - Single listener on document for ESC key
   - Reduces number of event listeners

2. **CSS Animations Over JS**
   - Modal animations use CSS transitions
   - Better performance and smoother rendering

3. **Lazy Loading**
   - Form data only loads when modal opens
   - No unnecessary DOM queries on page load

4. **localStorage Efficiency**
   - Data saved as JSON string
   - Only saves on change events
   - Minimal memory footprint

5. **Fetch API**
   - Async/await for non-blocking requests
   - Native browser API (no jQuery required)

### Bundle Impact
- `modals.js`: ~9.2 KB (uncompressed)
- `modals.js`: ~2.1 KB (gzipped)
- Added CSS: ~1.8 KB (uncompressed)
- Added CSS: ~0.6 KB (gzipped)

**Total Impact: ~3 KB gzipped**

---

## Debugging Tips

### Check Modal State
```javascript
// In browser console:
console.log(contactModal.classList.contains('open')); // true/false
console.log(document.body.style.overflow); // 'hidden' or ''
```

### Verify Form Data
```javascript
// Check localStorage:
console.log(JSON.parse(localStorage.getItem('contactFormData')));
```

### Monitor Network Requests
```javascript
// In DevTools Network tab:
// Filter by XHR/Fetch
// Look for POST requests to formspree.io
```

### Check Form Submission
```javascript
// Add to form handler:
popupContactForm.addEventListener('submit', (e) => {
  const formData = new FormData(popupContactForm);
  console.log(Object.fromEntries(formData)); // Log all fields
});
```

---

## Compatibility Matrix

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| Fetch API | ✅ | ✅ | ✅ | ✅ | ❌ |
| localStorage | ✅ | ✅ | ✅ | ✅ | ✅ |
| backdrop-filter | ✅ | ✅ | ✅ | ✅ | ❌ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| CSS Animations | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| FormData API | ✅ | ✅ | ✅ | ✅ | ⚠️ |

---

## Version History

### v1.0 (August 2026)
- ✅ Initial release
- ✅ Contact form with Formspree integration
- ✅ Submit tool form with Formspree integration
- ✅ Modal animations and transitions
- ✅ Form data persistence with localStorage
- ✅ Mobile responsive design
- ✅ Keyboard accessibility
- ✅ Toast notifications
- ✅ Email validation

---

## Contributing Guidelines

If you want to extend this system:

1. **Add New Modal:**
   - Create HTML structure in index.html
   - Add CSS classes to style.css
   - Create open/close functions in modals.js
   - Add form handler for submission

2. **Modify Animations:**
   - Update @keyframes in style.css
   - Adjust animation duration/timing-function
   - Test on different browsers

3. **Change Formspree Endpoints:**
   - Update `action` attribute in HTML
   - Get new endpoint from Formspree dashboard
   - Test form submission

---

## Related Documentation

- **Quick Start:** `MODAL_QUICKSTART.md`
- **Full Guide:** `MODAL_DOCUMENTATION.md`
- **Formspree Docs:** https://formspree.io/docs
- **MDN - Fetch API:** https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- **MDN - localStorage:** https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

**Last Updated:** August 20, 2026  
**Status:** Active & Maintained ✅
