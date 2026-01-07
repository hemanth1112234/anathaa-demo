/**
 * Form Utilities
 * Handles form submission, validation, and toast notifications
 */

class FormUtils {
  constructor() {
    this.forms = document.querySelectorAll('form[data-validate]');
    this.init();
  }

  init() {
    // Initialize all forms with data-validate attribute
    this.forms.forEach(form => {
      this.setupFormValidation(form);
      this.setupFormSubmission(form);
    });

    // Initialize toast container if it doesn't exist
    this.setupToastContainer();
  }

  setupFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Add input event listeners for real-time validation
      input.addEventListener('input', () => this.validateField(input));
      
      // Add blur event for when user leaves the field
      input.addEventListener('blur', () => this.validateField(input));
      
      // Add focus event to clear validation state
      input.addEventListener('focus', () => {
        input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error')) {
          errorElement.textContent = '';
        }
      });
    });
    
    // Add submit event listener
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        this.validateForm(form);
      }
    }, false);
  }

  setupFormSubmission(form) {
    form.addEventListener('submit', async (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        this.validateForm(form);
        return;
      }

      // If form has data-ajax attribute, handle with AJAX
      if (form.hasAttribute('data-ajax') || form.id === 'home-contact-form') {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.innerHTML : '';
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Sending...
        `;

        try {
          // Special-case: home contact form uses Google Apps Script endpoint (no-cors)
          if (form.id === 'home-contact-form') {
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz198-8iYUgYJpjRDQtNXwOggtTCGqWQ3cTjiuCAQ7jGQinctiy81NIJJx6_zaWXE5h_A/exec';

            const payload = {};
            new FormData(form).forEach((v, k) => payload[k] = v);

            // Use no-cors mode as the existing implementation did. We cannot read response.
            await fetch(SCRIPT_URL, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            });

            this.showToast('Success!', 'Message sent — we will contact you soon.', 'success');
            form.reset();
          } else {
            const formData = new FormData(form);
            const action = form.getAttribute('action') || window.location.href;
            const response = await fetch(action, {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
              }
            });

            let result = {};
            try { result = await response.json(); } catch (err) { /* ignore parse errors */ }

            if (response.ok) {
              this.showToast('Success!', 'We\'ll contact you soon.', 'success');
              form.reset();
            } else {
              const errorMessage = result.message || 'An error occurred. Please try again.';
              this.showToast('Error', errorMessage, 'error');
            }
          }
        } catch (error) {
          this.showToast('Error', 'An error occurred. Please try again.', 'error');
        } finally {
          // Reset button state
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
          }
        }
      }
    });
  }

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(input) {
    // Skip validation for hidden fields
    if (input.type === 'hidden') return true;

    // Check validity
    const isValid = input.checkValidity();
    const errorElement = input.nextElementSibling;
    
    if (!isValid) {
      input.classList.add('border-red-500', 'ring-2', 'ring-red-200');
      
      // Create or update error message
      let errorMessage = '';
      if (input.validity.valueMissing) {
        errorMessage = 'This field is required';
      } else if (input.validity.typeMismatch) {
        if (input.type === 'email') {
          errorMessage = 'Please enter a valid email address';
        } else if (input.type === 'url') {
          errorMessage = 'Please enter a valid URL';
        }
      } else if (input.validity.tooShort) {
        errorMessage = `Please enter at least ${input.minLength} characters`;
      } else if (input.validity.tooLong) {
        errorMessage = `Please enter no more than ${input.maxLength} characters`;
      } else if (input.validity.patternMismatch) {
        errorMessage = input.dataset.errorMessage || 'Please match the requested format';
      }
      
      // Show error message
      if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.textContent = errorMessage;
      } else {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'form-error text-sm text-red-600 mt-1 block';
        errorSpan.textContent = errorMessage;
        input.parentNode.insertBefore(errorSpan, input.nextSibling);
      }
      
      return false;
    } else {
      // Clear error state
      input.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
      if (errorElement && errorElement.classList.contains('form-error')) {
        errorElement.textContent = '';
      }
      return true;
    }
  }

  setupToastContainer() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'fixed bottom-6 right-6 space-y-4 z-50';
      document.body.appendChild(toastContainer);
    }
  }

  showToast(title, message, type = 'info') {
    const toastContainer = document.getElementById('toast-container') || this.setupToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    // Add toast content
    toast.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${type === 'success' ? 
            '<svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>' : 
            '<svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>'
          }
        </div>
        <div class="ml-3">
          <h4 class="font-medium">${title}</h4>
          <p class="text-sm">${message}</p>
        </div>
        <button type="button" class="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none" data-dismiss="toast">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    `;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Auto-remove after delay
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      toast.addEventListener('transitionend', () => toast.remove());
    }, 5000);
    
    // Dismiss on click
    const dismissButton = toast.querySelector('[data-dismiss="toast"]');
    if (dismissButton) {
      dismissButton.addEventListener('click', () => {
        toast.classList.add('opacity-0', 'translate-y-4');
        toast.addEventListener('transitionend', () => toast.remove());
      });
    }
    
    return toast;
  }
}

// Initialize form utils when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.formUtils = new FormUtils();
});

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormUtils;
}
