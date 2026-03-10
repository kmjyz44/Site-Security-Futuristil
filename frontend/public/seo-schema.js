// SEO Structured Data (JSON-LD)
(function() {
  'use strict';
  
  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "SecureHome Chicago",
    "image": window.location.origin + "/images/logo.png",
    "@id": window.location.origin,
    "url": window.location.origin,
    "telephone": "+1-331-771-3444",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "",
      "addressLocality": "Chicago",
      "addressRegion": "IL",
      "postalCode": "",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 41.8781,
      "longitude": -87.6298
    },
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    }],
    "sameAs": [
      "https://www.facebook.com/SecureHomeChicago",
      "https://www.instagram.com/SecureHomeChicago"
    ]
  };
  
  // Service Schema
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Home Security Systems",
    "provider": {
      "@type": "LocalBusiness",
      "name": "SecureHome Chicago"
    },
    "areaServed": [{
      "@type": "City",
      "name": "Chicago"
    }, {
      "@type": "City",
      "name": "Niles"
    }, {
      "@type": "City",
      "name": "Skokie"
    }, {
      "@type": "City",
      "name": "Glenview"
    }],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Home Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Security System Installation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Video Surveillance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Smart Home Automation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Electrical Work"
          }
        }
      ]
    }
  };
  
  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [{
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": window.location.origin
    }, {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": window.location.origin + "/#services"
    }, {
      "@type": "ListItem",
      "position": 3,
      "name": "Contact",
      "item": window.location.origin + "/#contact"
    }]
  };
  
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SecureHome Chicago",
    "url": window.location.origin,
    "logo": window.location.origin + "/images/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-331-771-3444",
      "contactType": "customer service",
      "areaServed": "US",
      "availableLanguage": ["en"]
    },
    "sameAs": [
      "https://www.facebook.com/SecureHomeChicago",
      "https://www.instagram.com/SecureHomeChicago"
    ]
  };
  
  // Insert all schemas
  function insertSchema(schema, id) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
  
  // Add all schemas
  insertSchema(localBusinessSchema, 'schema-local-business');
  insertSchema(serviceSchema, 'schema-service');
  insertSchema(breadcrumbSchema, 'schema-breadcrumb');
  insertSchema(organizationSchema, 'schema-organization');
  
  console.log('✓ SEO Structured Data (JSON-LD) added');
})();
