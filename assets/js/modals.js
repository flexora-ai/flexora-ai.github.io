/**
 * Flexora.Ai — Modal & Form Handler (assets/js/modals.js)
 * Manages modal popups, Formspree AJAX submissions, validation & toast feedback.
 */

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

  // Helper to handle Formspree AJAX submission
  function wireFormspree(formId, successId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const formData = new FormData(form);
        const endpoint = form.getAttribute('action') || 'https://formspree.io/f/xyegnwpy';
        const res = await fetch(endpoint, {
          method: 'POST',
          body: formData,
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

    // 2. Wire Formspree Forms
    wireFormspree('popupContactForm', 'popupContactSuccess');
    wireFormspree('popupSubmitForm', 'popupSubmitSuccess');
    wireFormspree('claimForm', 'claimSuccess');
    wireFormspree('featuredForm', 'featuredSuccess');
    wireFormspree('submitPageForm', 'submitPageSuccess');
  });

})();
