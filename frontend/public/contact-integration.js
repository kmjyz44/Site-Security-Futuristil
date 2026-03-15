// Contact Form Integration - Mobile Friendly with Photos
(function() {
  'use strict';
  
  const API_URL = window.location.origin + '/api/contact';
  let formProcessed = false;
  
  console.log('📱 Mobile Contact Form Integration Loading...');
  
  function findAndEnhanceForm() {
    if (formProcessed) return;
    
    console.log('🔍 Looking for contact form...');
    
    // Find form with email and textarea
    const forms = document.querySelectorAll('form');
    
    forms.forEach((form, idx) => {
      if (form.dataset.enhanced) return;
      
      const hasEmail = form.querySelector('input[type="email"]');
      const hasTextarea = form.querySelector('textarea');
      const hasSubmit = form.querySelector('button[type="submit"], button');
      
      if (hasEmail && hasTextarea && hasSubmit) {
        console.log(`✅ Found contact form (index ${idx})!`);
        enhanceForm(form);
        form.dataset.enhanced = 'true';
        formProcessed = true;
      }
    });
  }
  
  function enhanceForm(form) {
    console.log('🔧 Enhancing form with photo upload...');
    
    // Find the message field (textarea)
    const messageField = form.querySelector('textarea');
    if (!messageField) return;
    
    const messageContainer = messageField.parentElement;
    
    // Create photo upload field
    const photoContainer = document.createElement('div');
    photoContainer.style.cssText = 'margin-top: 1.5rem; width: 100%;';
    photoContainer.innerHTML = `
      <label style="display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 500;">
        Attach Photos (Optional)
      </label>
      <input 
        type="file" 
        name="photos" 
        multiple 
        accept="image/*"
        style="
          width: 100%;
          padding: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(0,225,255,0.3);
          border-radius: 8px;
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          cursor: pointer;
        "
      />
      <div class="photo-preview" style="
        display: flex;
        gap: 8px;
        margin-top: 12px;
        flex-wrap: wrap;
        min-height: 20px;
      "></div>
    `;
    
    // Insert after message container
    if (messageContainer.nextSibling) {
      messageContainer.parentNode.insertBefore(photoContainer, messageContainer.nextSibling);
    } else {
      messageContainer.parentNode.appendChild(photoContainer);
    }
    
    // Photo preview
    const fileInput = photoContainer.querySelector('input[type="file"]');
    const preview = photoContainer.querySelector('.photo-preview');
    
    fileInput.addEventListener('change', function(e) {
      preview.innerHTML = '';
      const files = e.target.files;
      
      if (files.length > 0) {
        for (let i = 0; i < Math.min(files.length, 5); i++) {
          const file = files[i];
          const reader = new FileReader();
          
          reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.cssText = `
              width: 70px;
              height: 70px;
              object-fit: cover;
              border-radius: 8px;
              border: 2px solid rgba(0,225,255,0.5);
            `;
            preview.appendChild(img);
          };
          
          reader.readAsDataURL(file);
        }
        
        if (files.length > 5) {
          const more = document.createElement('div');
          more.textContent = `+${files.length - 5}`;
          more.style.cssText = `
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(0,225,255,0.1);
            border: 2px solid rgba(0,225,255,0.3);
            border-radius: 8px;
            color: #00e1ff;
            font-weight: bold;
          `;
          preview.appendChild(more);
        }
      }
    });
    
    console.log('📸 Photo upload field added');
    
    // Intercept form submission
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('📤 Form submitted!');
      
      const formData = new FormData();
      
      // Get all input fields
      const nameInput = form.querySelector('input[type="text"]') || 
                        form.querySelector('input[placeholder*="name" i]');
      const emailInput = form.querySelector('input[type="email"]');
      const phoneInput = form.querySelector('input[type="tel"]');
      const messageInput = form.querySelector('textarea');
      const photoInput = form.querySelector('input[name="photos"]');
      
      // Required fields
      if (nameInput && nameInput.value) {
        formData.append('name', nameInput.value.trim());
      } else {
        formData.append('name', 'Anonymous');
      }
      
      if (emailInput && emailInput.value) {
        formData.append('email', emailInput.value.trim());
      } else {
        showNotification('❌ Email is required', 'error');
        return;
      }
      
      if (messageInput && messageInput.value) {
        formData.append('message', messageInput.value.trim());
      } else {
        showNotification('❌ Message is required', 'error');
        return;
      }
      
      // Optional fields
      if (phoneInput && phoneInput.value) {
        formData.append('phone', phoneInput.value.trim());
      } else {
        formData.append('phone', '');
      }
      
      // Photos
      if (photoInput && photoInput.files.length > 0) {
        for (let file of photoInput.files) {
          formData.append('photos', file);
        }
        console.log(`📷 ${photoInput.files.length} photos attached`);
      }
      
      // Show loading
      const submitBtn = form.querySelector('button[type="submit"], button');
      let originalText = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        originalText = submitBtn.textContent;
        submitBtn.textContent = 'SENDING...';
      }
      
      try {
        console.log('🌐 Sending to:', API_URL);
        
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData
        });
        
        console.log('📥 Response:', response.status);
        
        if (!response.ok) {
          throw new Error('Server error');
        }
        
        const result = await response.json();
        
        if (result.success) {
          console.log('✅ SUCCESS!');
          showNotification('✅ Message sent successfully!', 'success');
          
          // Clear form
          if (nameInput) nameInput.value = '';
          if (emailInput) emailInput.value = '';
          if (phoneInput) phoneInput.value = '';
          if (messageInput) messageInput.value = '';
          if (photoInput) photoInput.value = '';
          preview.innerHTML = '';
        } else {
          throw new Error('Send failed');
        }
      } catch (error) {
        console.error('❌ Error:', error);
        showNotification('❌ Error sending message', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
    
    console.log('✅ Form fully enhanced!');
  }
  
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 16px 24px;
      background: ${type === 'success' ? '#00e1ff' : '#ef4444'};
      color: ${type === 'success' ? '#0a0c10' : '#fff'};
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      max-width: 90%;
      text-align: center;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
  }
  
  // Initialize with multiple attempts
  function init() {
    console.log('🚀 Initializing...');
    
    findAndEnhanceForm();
    setTimeout(findAndEnhanceForm, 500);
    setTimeout(findAndEnhanceForm, 1000);
    setTimeout(findAndEnhanceForm, 2000);
    setTimeout(findAndEnhanceForm, 3000);
    
    // Watch for DOM changes
    const observer = new MutationObserver(findAndEnhanceForm);
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
  
  console.log('✅ Mobile Form Integration Ready');
})();
