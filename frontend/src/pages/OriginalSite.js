import { useEffect } from 'react';

export default function OriginalSite() {
  useEffect(() => {
    // Load the original site's CSS and JS
    const loadOriginalSite = async () => {
      try {
        // Load CSS
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = '/assets/index-CqYjuW3T.css';
        document.head.appendChild(cssLink);
        
        // Load JS
        const script = document.createElement('script');
        script.type = 'module';
        script.src = '/assets/index-DEQl-a8G.js';
        document.body.appendChild(script);
        
        // Load SEO and contact integration
        const seoScript = document.createElement('script');
        seoScript.src = '/seo-schema.js';
        document.body.appendChild(seoScript);
        
        const contactScript = document.createElement('script');
        contactScript.src = '/contact-integration.js?v=' + Date.now();
        document.body.appendChild(contactScript);
        
      } catch (error) {
        console.error('Error loading original site:', error);
      }
    };
    
    loadOriginalSite();
    
    // Cleanup
    return () => {
      // Remove added styles and scripts when component unmounts
      const links = document.querySelectorAll('link[href*="index-CqYjuW3T"]');
      links.forEach(link => link.remove());
    };
  }, []);

  return null; // The original site will render in the root div
}
