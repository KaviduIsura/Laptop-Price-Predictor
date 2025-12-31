// Utility function to show toast notifications
export const showToast = (message, type = 'success') => {
  const event = new CustomEvent('show-toast', {
    detail: { message, type }
  });
  window.dispatchEvent(event);
};

// Types of notifications
export const ToastType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Example usage in components:
// showToast('Product added to cart!', ToastType.SUCCESS);