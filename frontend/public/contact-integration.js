// Simplified Contact Form Integration - Always Works
(function() {
  'use strict';
  
  const API_URL = window.location.origin + '/api/contact';
  
  console.log('🚀 Contact Form Integration v2 Loading...');
  
  function findAndConnectForm() {
    console.log('🔍 Searching for contact form...');
    
    const forms = document.querySelectorAll('form');
    console.log(`Found ${forms.length} forms on page`);
    
    forms.forEach((form, index) => {
      if (form.dataset.apiConnected) {
        console.log(`Form ${index} already connected, skipping`);
        return;
      }
      
      const emailInput = form.querySelector('input[type="email"]');
      const textarea = form.querySelector('textarea');
      
      if (emailInput && textarea) {
        console.log(`✅ Contact form found at index ${index}! Connecting...`);
        connectForm(form);
        form.dataset.apiConnected = 'true';
      }
    });
  }
  
  function connectForm(form) {
    console.log('🔌 Connecting form to:', API_URL);
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('📤 Form submit intercepted!');
      
      try {
        // Collect form data
        const formData = new FormData();
        
        // Find fields by type/selector
        const nameInput = form.querySelector('input[type="text"]') || 
                          form.querySelector('input[placeholder*="name" i]') ||
                          form.querySelector('input[placeholder*="ім" i]');
        
        const emailInput = form.querySelector('input[type="email"]');
        
        const phoneInput = form.querySelector('input[type="tel"]') ||
                           form.querySelector('input[placeholder*="phone" i]') ||
                           form.querySelector('input[placeholder*="телефон" i]');
        
        const messageInput = form.querySelector('textarea');
        
        const photoInput = form.querySelector('input[type="file"]');
        
        // Add required fields
        if (nameInput && nameInput.value) {
          formData.append('name', nameInput.value.trim());
          console.log('✓ Name:', nameInput.value.trim());
        } else {
          console.warn('⚠️ Name field not found or empty');
          formData.append('name', 'Anonymous');
        }
        
        if (emailInput && emailInput.value) {
          formData.append('email', emailInput.value.trim());
          console.log('✓ Email:', emailInput.value.trim());
        } else {
          console.error('❌ Email field required but not found!');
          showNotification('Please fill in email field', 'error');
          return;
        }
        
        if (messageInput && messageInput.value) {
          formData.append('message', messageInput.value.trim());
          console.log('✓ Message:', messageInput.value.substring(0, 50) + '...');
        } else {
          console.error('❌ Message field required but not found!');
          showNotification('Please fill in message field', 'error');
          return;
        }
        
        // Add optional fields
        if (phoneInput && phoneInput.value) {
          formData.append('phone', phoneInput.value.trim());
          console.log('✓ Phone:', phoneInput.value.trim());
        } else {
          formData.append('phone', '');
          console.log('○ Phone: not provided');
        }
        
        // Add photos if any
        if (photoInput && photoInput.files && photoInput.files.length > 0) {
          for (let i = 0; i < photoInput.files.length; i++) {
            formData.append('photos', photoInput.files[i]);
          }
          console.log('✓ Photos:', photoInput.files.length, 'files');
        } else {
          console.log('○ Photos: none');
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
        let originalText = '';
        let originalDisabled = false;
        
        if (submitBtn) {
          originalDisabled = submitBtn.disabled;
          submitBtn.disabled = true;
          originalText = submitBtn.textContent || submitBtn.value || '';
          if (submitBtn.tagName === 'BUTTON') {
            submitBtn.textContent = 'Sending...';
          } else {
            submitBtn.value = 'Sending...';
          }
        }
        
        console.log('🌐 Sending to API...');
        
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData
        });
        
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Server error:', errorText);
          throw new Error(`Server returned ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📋 Response:', result);
        
        if (result.success) {
          console.log('✅ SUCCESS! Message sent');
          showNotification('✅ Message sent successfully!', 'success');
          
          // Reset form
          if (nameInput) nameInput.value = '';
          if (emailInput) emailInput.value = '';
          if (phoneInput) phoneInput.value = '';
          if (messageInput) messageInput.value = '';
          if (photoInput) photoInput.value = '';
          
          // Clear photo preview if exists
          const preview = form.querySelector('.photo-preview');
          if (preview) preview.innerHTML = '';
        } else {
          console.warn('⚠️ Server returned success=false');
          showNotification('Error sending message', 'error');
        }
        
        // Restore button
        if (submitBtn) {
          submitBtn.disabled = originalDisabled;
          if (submitBtn.tagName === 'BUTTON') {
            submitBtn.textContent = originalText;
          } else {
            submitBtn.value = originalText;
          }
        }
        
      } catch (error) {
        console.error('❌ Error:', error);
        showNotification('❌ Error: ' + error.message, 'error');
        
        // Restore button
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])');
        if (submitBtn) {
          submitBtn.disabled = false;
        }
      }
    });
    
    console.log('✅ Form connected successfully!');
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#00e1ff' : '#ef4444'};
      color: ${type === 'success' ? '#0a0c10' : '#fff'};
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 10px 30px rgba(0,225,255,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }
  
  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(400px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(400px); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Initialize
  function init() {
    console.log('🎯 Initializing form connector...');
    
    // Try immediately
    findAndConnectForm();
    
    // Try again after delays (for dynamic content)
    setTimeout(findAndConnectForm, 500);
    setTimeout(findAndConnectForm, 1000);
    setTimeout(findAndConnectForm, 2000);
    
    // Watch for new forms added to page
    const observer = new MutationObserver(() => {
      findAndConnectForm();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('✅ Contact Form Integration v2 Ready');
})();
