// ============================================
// MODAL POPUP HANDLER FOR FORMSPREE INTEGRATION
// ============================================
// This file manages the pop-up modals for Contact and Submit Tool forms
// Both forms are integrated with Formspree.io for easy form submissions
//
// Formspree Endpoints:
// - Contact Form: https://formspree.io/f/xyegnwpy
// - Submit Tool Form: https://formspree.io/f/xzepjrvz
//
// HOW IT WORKS:
// 1. User clicks Contact (✉) or Submit (+) floating button
// 2. Modal overlay appears with backdrop blur
// 3. User fills form and submits
// 4. Form data is sent to Formspree endpoint via POST
// 5. Success message displays, modal auto-closes after 3 seconds
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ---- MODAL & FORM ELEMENTS ----
  const contactModal = document.getElementById('contactModal');
  const submitModal = document.getElementById('submitModal');
  const contactModalClose = document.getElementById('contactModalClose');
  const submitModalClose = document.getElementById('submitModalClose');
  const fabContact = document.getElementById('fabContact');
  const fabSubmit = document.getElementById('fabSubmit');
  const popupContactForm = document.getElementById('popupContactForm');
  const popupSubmitForm = document.getElementById('popupSubmitForm');
  const popupContactSuccess = document.getElementById('popupContactSuccess');
  const popupSubmitSuccess = document.getElementById('popupSubmitSuccess');
  const toast = document.getElementById('toast');

  // ============================================
  // MODAL OPEN/CLOSE FUNCTIONS
  // ============================================

  /**
   * Opens the Contact Modal
   * - Adds 'open' class to trigger CSS animation
   * - Prevents body scroll
   */
  function openContactModal() {
    contactModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the Contact Modal
   * - Removes 'open' class
   * - Re-enables body scroll
   * - Hides success message
   * - Resets form fields
   */
  function closeContactModal() {
    contactModal.classList.remove('open');
    document.body.style.overflow = 'auto';
    popupContactSuccess.classList.remove('show');
    popupContactForm.classList.remove('hidden');
    popupContactForm.reset();
  }

  /**
   * Opens the Submit Modal
   * - Adds 'open' class to trigger CSS animation
   * - Prevents body scroll
   */
  function openSubmitModal() {
    submitModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the Submit Modal
   * - Removes 'open' class
   * - Re-enables body scroll
   * - Hides success message
   * - Resets form fields
   */
  function closeSubmitModal() {
    submitModal.classList.remove('open');
    document.body.style.overflow = 'auto';
    popupSubmitSuccess.classList.remove('show');
    popupSubmitForm.classList.remove('hidden');
    popupSubmitForm.reset();
  }

  // ============================================
  // EVENT LISTENERS - OPEN/CLOSE BUTTONS
  // ============================================

  fabContact.addEventListener('click', openContactModal);
  fabSubmit.addEventListener('click', openSubmitModal);
  contactModalClose.addEventListener('click', closeContactModal);
  submitModalClose.addEventListener('click', closeSubmitModal);

  // Close modals when clicking the overlay background
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });
  
  submitModal.addEventListener('click', (e) => {
    if (e.target === submitModal) closeSubmitModal();
  });

  // ============================================
  // CONTACT FORM HANDLER
  // ============================================
  /**
   * Handles Contact Form Submission
   * - Prevents default form behavior
   * - Sends data to Formspree endpoint: https://formspree.io/f/xyegnwpy
   * - Expected fields: name, email, message
   * - Shows success message on completion
   * - Auto-closes modal after 3 seconds
   */
  popupContactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(popupContactForm);
    
    try {
      const response = await fetch(popupContactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      // Check if submission was successful
      if (response.ok || response.status === 200) {
        // Hide form, show success message
        popupContactForm.classList.add('hidden');
        popupContactSuccess.classList.add('show');
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          closeContactModal();
        }, 3000);
      } else {
        showToast('❌ Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      showToast('❌ Error sending message. Please check your connection.');
    }
  });

  // ============================================
  // SUBMIT TOOL FORM HANDLER
  // ============================================
  /**
   * Handles Submit Tool Form Submission
   * - Prevents default form behavior
   * - Sends data to Formspree endpoint: https://formspree.io/f/xzepjrvz
   * - Expected fields: tool_name, website, category, pricing, description, contact_email
   * - Shows success message on completion
   * - Auto-closes modal after 3 seconds
   */
  popupSubmitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(popupSubmitForm);
    
    try {
      const response = await fetch(popupSubmitForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      // Check if submission was successful
      if (response.ok || response.status === 200) {
        // Hide form, show success message
        popupSubmitForm.classList.add('hidden');
        popupSubmitSuccess.classList.add('show');
        
        // Auto-close modal after 3 seconds
        setTimeout(() => {
          closeSubmitModal();
        }, 3000);
      } else {
        showToast('❌ Error submitting tool. Please try again.');
      }
    } catch (error) {
      console.error('Submit form submission error:', error);
      showToast('❌ Error submitting tool. Please check your connection.');
    }
  });

  // ============================================
  // TOAST NOTIFICATION HELPER
  // ============================================
  /**
   * Displays a temporary notification at the bottom of the screen
   * @param {string} message - The message to display
   * Duration: 3 seconds
   */
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ============================================
  // KEYBOARD CONTROLS
  // ============================================
  /**
   * Press ESC to close any open modal
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal.classList.contains('open')) closeContactModal();
      if (submitModal.classList.contains('open')) closeSubmitModal();
    }
  });

  // ============================================
  // FORM FIELD VALIDATION (OPTIONAL ENHANCEMENT)
  // ============================================
  /**
   * Real-time email validation for contact form
   */
  const contactEmailInput = popupContactForm.querySelector('input[type="email"]');
  if (contactEmailInput) {
    contactEmailInput.addEventListener('blur', function() {
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
      if (!isValid && this.value) {
        this.style.borderColor = 'var(--teal)';
      }
    });
  }

  // ============================================
  // FORM DATA PERSISTENCE (OPTIONAL)
  // ============================================
  /**
   * Auto-save form data to localStorage while typing
   * This prevents data loss if user accidentally closes modal
   */
  
  function saveFormData(form, storageKey) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        localStorage.setItem(storageKey, JSON.stringify(data));
      });
    });
  }

  function loadFormData(form, storageKey) {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved);
      Object.entries(data).forEach(([key, value]) => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) input.value = value;
      });
    }
  }

  // Load and save form data
  loadFormData(popupContactForm, 'contactFormData');
  loadFormData(popupSubmitForm, 'submitFormData');
  saveFormData(popupContactForm, 'contactFormData');
  saveFormData(popupSubmitForm, 'submitFormData');

});
