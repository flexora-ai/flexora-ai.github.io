/**
 * Flexora.Ai — Modal & Form Handler (assets/js/modals.js)
 * Manages modal popups, Google Sheets & Formspree AJAX submissions, validation & toast feedback.
 */

// Central Forms & Email Automation Endpoint
// Connected to Google Apps Script Web App (100% free, unlimited submissions & auto-emails):
window.FLEXORA_FORMS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyzS--DlkIfG2OFNHZFYBBt47MtIWG9FHJJypyh8UYwBw1E5UukSpmj9MTvi_vwb8id/exec';

(function () {
  'use strict';

  // Helper to attach modal open/close
  function wireModal(triggerSelector, modalId, closeId) {
    const triggers = document.querySelectorAll(triggerSelector);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);

    if (!modal) return;

    triggers.forEach(trig => {
      trig.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        const firstInput = modal.querySelector('input:not([type="hidden"]), textarea, select');
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
      });
    });

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Load timestamp for timing-based bot protection
  const pageLoadedAt = Date.now();

  // Helper to handle Google Sheets / Formspree AJAX submission with Anti-Bot Armor
  function wireFormspree(formId, successId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      // 1. Client-Side Anti-Bot Honeypot Trap
      const hp = (formData.get('website_hp') || formData.get('hp_field') || '').trim();
      const timeElapsed = Date.now() - pageLoadedAt;

      // Automated scrapers & headless bots fill hidden fields or submit in < 1 second
      if (hp.length > 0 || timeElapsed < 1000) {
        // Silently drop - pretend success so bot does not retry or adapt
        form.style.display = 'none';
        const successBox = document.getElementById(successId);
        if (successBox) successBox.classList.add('show');
        if (window.showToast) window.showToast('Message sent successfully!');
        form.reset();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const endpoint = window.FLEXORA_FORMS_ENDPOINT || form.getAttribute('action') || 'https://script.google.com/macros/s/AKfycbyzS--DlkIfG2OFNHZFYBBt47MtIWG9FHJJypyh8UYwBw1E5UukSpmj9MTvi_vwb8id/exec';
        const res = await fetch(endpoint, {
          method: 'POST',
          body: new URLSearchParams(formData),
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          form.style.display = 'none';
          const successBox = document.getElementById(successId);
          if (successBox) successBox.classList.add('show');
          if (window.showToast) window.showToast('Message sent successfully!');
          form.reset();
        } else {
          const data = await res.json().catch(() => ({}));
          const errMsg = data.error || 'Failed to send — please try again.';
          if (window.showToast) window.showToast(errMsg);
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      } catch (err) {
        if (window.showToast) window.showToast('Network error — please check your connection.');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }

  // Initialize all modals when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    // 1. Floating Action Buttons & Modals
    wireModal('#fabContact, .trigger-contact-modal', 'contactModal', 'contactModalClose');
    wireModal('#fabSubmit, .trigger-submit-modal', 'submitModal', 'submitModalClose');
    wireModal('#claimListingBtn, .trigger-claim-modal', 'claimModal', 'claimModalClose');
    wireModal('#getFeaturedBtn, .trigger-featured-modal', 'featuredModal', 'featuredModalClose');

    // 2. Wire Forms
    wireFormspree('popupContactForm', 'popupContactSuccess');
    wireFormspree('popupSubmitForm', 'popupSubmitSuccess');
    wireFormspree('claimForm', 'claimSuccess');
    wireFormspree('featuredForm', 'featuredSuccess');
  });

})();
