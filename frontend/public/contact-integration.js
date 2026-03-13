// Enhanced Contact Form Integration with Better Detection
(function() {
  'use strict';
  
  const API_URL = window.location.origin + '/api/contact';
  let formConnected = false;
  
  console.log('🚀 Contact Form Integration Loading...');
  
  function waitForForm() {
    const maxAttempts = 20;
    let attempts = 0;
    
    const interval = setInterval(() => {
      attempts++;
      
      if (formConnected) {
        clearInterval(interval);
        return;
      }
      
      const forms = document.querySelectorAll('form');
      console.log(`📝 Attempt ${attempts}: Found ${forms.length} forms`);
      
      forms.forEach(form => {
        if (formConnected) return;
        
        const hasEmail = form.querySelector('input[type="email"]');
        const hasTextarea = form.querySelector('textarea');
        
        if (hasEmail && hasTextarea && !form.dataset.connected) {
          console.log('✅ Contact form found! Connecting...');
          connectForm(form);
          form.dataset.connected = 'true';
          formConnected = true;
          clearInterval(interval);
        }
      });
      
      if (attempts >= maxAttempts) {
        console.warn('⚠️ Contact form not found after', maxAttempts, 'attempts');
        clearInterval(interval);
      }
    }, 500);
  }
  
  function connectForm(form) {
    console.log('🔌 Connecting form to API:', API_URL);
    
    // Add photo upload if not exists
    addPhotoUpload(form);
    
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('📤 Form submitted!');
      
      const formData = new FormData();
      
      // Get all inputs
      const inputs = form.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        if (input.type === 'file') {
          if (input.files) {
            for (let file of input.files) {
              formData.append('photos', file);
            }
          }
        } else if (input.name) {
          formData.append(input.name, input.value);
        } else {
          // Try to guess field by type/placeholder
          if (input.type === 'email') {
            formData.append('email', input.value);
          } else if (input.type === 'tel') {
            formData.append('phone', input.value);
          } else if (input.type === 'text') {
            if (!formData.has('name')) {
              formData.append('name', input.value);
            }
          }
        }
      });
      
      // Textarea
      const textarea = form.querySelector('textarea');
      if (textarea) {
        formData.append('message', textarea.value);
      }
      
      console.log('📦 FormData prepared');
      
      // Show loading
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      let originalText = '';
      if (submitBtn) {
        submitBtn.disabled = true;
        originalText = submitBtn.textContent || submitBtn.value;
        if (submitBtn.tagName === 'BUTTON') {
          submitBtn.textContent = 'Sending...';
        } else {
          submitBtn.value = 'Sending...';
        }
      }
      
      try {
        console.log('🌐 Sending to:', API_URL);
        
        const response = await fetch(API_URL, {
          method: 'POST',
          body: formData
        });
        
        console.log('📥 Response status:', response.status);
        
        const result = await response.json();
        console.log('📋 Response data:', result);
        
        if (response.ok && result.success) {
          showNotification('✅ Message sent successfully!', 'success');
          form.reset();
          clearPhotoPreview(form);
        } else {
          showNotification('❌ Error sending message', 'error');
        }
      } catch (error) {
        console.error('❌ Error:', error);
        showNotification('❌ Error sending message', 'error');
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
    
    console.log('✅ Form connected successfully!');
  }
  
  function addPhotoUpload(form) {
    if (form.querySelector('input[name="photos"]')) return;
    
    const textarea = form.querySelector('textarea');
    if (!textarea) return;
    
    const container = textarea.parentElement;
    
    const photoDiv = document.createElement('div');
    photoDiv.style.marginTop = '1rem';
    photoDiv.innerHTML = `
      <label style="display: block; margin-bottom: 0.5rem; color: rgba(255,255,255,0.8);">
        Attach Photos (optional)
      </label>
      <input 
        type="file" 
        name="photos" 
        accept="image/*" 
        multiple 
        style="width: 100%; padding: 0.75rem; background: hsl(220, 20%, 10%); border: 1px solid rgba(255,255,255,0.2); border-radius: 0.5rem; color: white;"
      />
      <div class="photo-preview" style="display: flex; gap: 0.5rem; margin-top: 0.5rem; flex-wrap: wrap;"></div>
    `;
    
    container.parentElement.insertBefore(photoDiv, container.nextSibling);
    
    const fileInput = photoDiv.querySelector('input[type="file"]');
    const preview = photoDiv.querySelector('.photo-preview');
    
    fileInput.addEventListener('change', function(e) {
      preview.innerHTML = '';
      for (let i = 0; i < Math.min(e.target.files.length, 5); i++) {
        const file = e.target.files[i];
        const reader = new FileReader();
        reader.onload = function(event) {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.cssText = 'width: 80px; height: 80px; object-fit: cover; border-radius: 0.5rem; border: 2px solid rgba(0,225,255,0.3);';
          preview.appendChild(img);
        };
        reader.readAsDataURL(file);
      }
    });
  }
  
  function clearPhotoPreview(form) {
    const preview = form.querySelector('.photo-preview');
    if (preview) preview.innerHTML = '';
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
  
  // Start watching for form
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForForm);
  } else {
    waitForForm();
  }
  
  // Also watch for URL changes (for React Router)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (!formConnected) {
        console.log('🔄 URL changed, searching for form again...');
        setTimeout(waitForForm, 500);
      }
    }
  }).observe(document, {subtree: true, childList: true});
  
  console.log('✅ Contact Form Integration Ready');
})();
