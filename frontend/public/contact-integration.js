// Contact Form Integration Script
(function() {
  'use strict';
  
  const API_URL = window.location.origin + '/api/contact';
  
  function initContactForm() {
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupFormHandler);
    } else {
      setupFormHandler();
    }
  }
  
  function setupFormHandler() {
    // Find all forms on the page
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Check if it looks like a contact form
      const hasNameField = form.querySelector('input[name*="name"], input[placeholder*="name" i]');
      const hasEmailField = form.querySelector('input[type="email"], input[name*="email"]');
      const hasMessageField = form.querySelector('textarea');
      
      if (hasNameField && hasEmailField && hasMessageField) {
        console.log('✓ Contact form found and connected to backend');
        
        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Get form data
          const formData = new FormData(form);
          const data = {
            name: formData.get('name') || form.querySelector('input[name*="name"], input[placeholder*="name" i]')?.value || '',
            email: formData.get('email') || form.querySelector('input[type="email"], input[name*="email"]')?.value || '',
            phone: formData.get('phone') || form.querySelector('input[type="tel"], input[name*="phone"]')?.value || '',
            message: formData.get('message') || form.querySelector('textarea')?.value || ''
          };
          
          // Show loading state
          const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
          const originalText = submitBtn?.textContent || submitBtn?.value || '';
          if (submitBtn) {
            submitBtn.disabled = true;
            if (submitBtn.tagName === 'BUTTON') {
              submitBtn.textContent = 'Sending...';
            } else {
              submitBtn.value = 'Sending...';
            }
          }
          
          try {
            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
              // Success - show message and reset form
              showNotification('Message sent successfully!', 'success');
              form.reset();
            } else {
              showNotification('Error sending message. Please try again.', 'error');
            }
          } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Error sending message. Please try again.', 'error');
          } finally {
            // Restore button
            if (submitBtn) {
              submitBtn.disabled = false;
              if (submitBtn.tagName === 'BUTTON') {
                submitBtn.textContent = originalText;
              } else {
                submitBtn.value = originalText;
              }
            }
          }
        });
      }
    });
  }
  
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#00e1ff' : '#ef4444'};
      color: ${type === 'success' ? '#0a0c10' : '#fff'};
      border-radius: 8px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 10px 30px rgba(0, 225, 255, 0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // Add animation styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Initialize
  initContactForm();
})();
