// Contact Form Integration Script with Photo Upload
(function() {
  'use strict';
  
  const API_URL = window.location.origin + '/api/contact';
  
  function initContactForm() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupFormHandler);
    } else {
      setupFormHandler();
    }
  }
  
  function setupFormHandler() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      const hasNameField = form.querySelector('input[name*="name"], input[placeholder*="name" i]');
      const hasEmailField = form.querySelector('input[type="email"], input[name*="email"]');
      const hasMessageField = form.querySelector('textarea');
      
      if (hasNameField && hasEmailField && hasMessageField) {
        console.log('✓ Contact form found and enhanced with photo upload');
        
        // Add photo upload field if not exists
        addPhotoUploadField(form);
        
        form.addEventListener('submit', async function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          // Create FormData
          const formData = new FormData();
          
          // Get text fields
          const nameInput = form.querySelector('input[name*="name"], input[placeholder*="name" i]');
          const emailInput = form.querySelector('input[type="email"], input[name*="email"]');
          const phoneInput = form.querySelector('input[type="tel"], input[name*="phone"]');
          const messageInput = form.querySelector('textarea');
          
          formData.append('name', nameInput?.value || '');
          formData.append('email', emailInput?.value || '');
          formData.append('phone', phoneInput?.value || '');
          formData.append('message', messageInput?.value || '');
          
          // Add photos
          const photoInput = form.querySelector('input[type="file"][name="photos"]');
          if (photoInput && photoInput.files) {
            for (let i = 0; i < photoInput.files.length; i++) {
              formData.append('photos', photoInput.files[i]);
            }
          }
          
          // Show loading
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
              body: formData
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
              showNotification('Message sent successfully! We will contact you soon.', 'success');
              form.reset();
              clearPhotoPreview(form);
            } else {
              showNotification('Error sending message. Please try again.', 'error');
            }
          } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Error sending message. Please try again.', 'error');
          } finally {
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
  
  function addPhotoUploadField(form) {
    // Check if already added
    if (form.querySelector('input[name="photos"]')) return;
    
    // Find the best place to insert (after message field)
    const messageField = form.querySelector('textarea');
    if (!messageField) return;
    
    const messageContainer = messageField.parentElement;
    
    // Create photo upload container
    const photoContainer = document.createElement('div');
    photoContainer.style.cssText = 'margin-top: 1rem;';
    
    const label = document.createElement('label');
    label.style.cssText = 'display: block; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; font-family: Rajdhani, sans-serif;';
    label.textContent = 'Attach Photos (optional)';
    
    const input = document.createElement('input');
    input.type = 'file';
    input.name = 'photos';
    input.accept = 'image/*';
    input.multiple = true;
    input.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      background: hsl(220, 20%, 10%);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      color: white;
      font-family: Rajdhani, sans-serif;
      cursor: pointer;
    `;
    
    // Preview container
    const previewContainer = document.createElement('div');
    previewContainer.className = 'photo-preview-container';
    previewContainer.style.cssText = `
      display: flex;
      gap: 0.5rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    `;
    
    input.addEventListener('change', function(e) {
      previewContainer.innerHTML = '';
      const files = e.target.files;
      
      for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = function(event) {
          const preview = document.createElement('div');
          preview.style.cssText = `
            position: relative;
            width: 80px;
            height: 80px;
            border-radius: 0.5rem;
            overflow: hidden;
            border: 2px solid rgba(0, 225, 255, 0.3);
          `;
          
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
          
          preview.appendChild(img);
          previewContainer.appendChild(preview);
        };
        
        reader.readAsDataURL(file);
      }
      
      if (files.length > 5) {
        const moreText = document.createElement('div');
        moreText.textContent = `+${files.length - 5} more`;
        moreText.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: rgba(0, 225, 255, 0.1);
          border: 2px solid rgba(0, 225, 255, 0.3);
          border-radius: 0.5rem;
          color: #00e1ff;
          font-size: 0.875rem;
          font-weight: 600;
        `;
        previewContainer.appendChild(moreText);
      }
    });
    
    photoContainer.appendChild(label);
    photoContainer.appendChild(input);
    photoContainer.appendChild(previewContainer);
    
    // Insert after message container
    messageContainer.parentElement.insertBefore(photoContainer, messageContainer.nextSibling);
  }
  
  function clearPhotoPreview(form) {
    const previewContainer = form.querySelector('.photo-preview-container');
    if (previewContainer) {
      previewContainer.innerHTML = '';
    }
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
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 10px 30px rgba(0, 225, 255, 0.3);
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
  
  initContactForm();
})();
