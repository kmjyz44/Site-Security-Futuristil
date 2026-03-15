# SEO & Contact Form Setup Guide

## ✅ What's Implemented

### 1. Contact Form with Photo Upload
- **Location:** Main website contact form
- **Features:**
  - Text fields: Name, Email, Phone, Message
  - **NEW:** Photo upload (up to 5 images)
  - Photo preview before sending
  - Automatic form submission to backend
  - Email notification with photo links
  - Success/error notifications

### 2. SEO Optimization Files

#### robots.txt
- Location: `/app/frontend/public/robots.txt`
- Purpose: Tell search engines what to crawl
- Current settings: Allow all except /admin/

#### sitemap.xml
- Location: `/app/frontend/public/sitemap.xml`
- Purpose: Help Google index your pages
- Pages included:
  - Home page
  - Services section
  - About section
  - Contact section

#### Structured Data (JSON-LD)
- Location: `/app/frontend/public/seo-schema.js`
- Schemas included:
  - **LocalBusiness**: Business info, address, hours
  - **Service**: Services offered, areas served
  - **Organization**: Company details, social links
  - **Breadcrumb**: Page navigation structure

#### SEO Keywords
- Location: `/app/frontend/public/seo-keywords.txt`
- Contains:
  - Primary keywords (home security, Chicago)
  - Location-based keywords (Niles, Skokie, Glenview)
  - Service-specific keywords
  - Long-tail keywords
  - Meta description templates
  - Title tag templates

## 📋 How to Use

### Testing Contact Form with Photos

1. Go to website: https://contact-system-test.preview.emergentagent.com/
2. Scroll to contact form
3. Fill in details
4. Click "Attach Photos" - you can select multiple images
5. Preview shows thumbnails
6. Click "Send"
7. Check admin panel → Messages to see submission

### Viewing Submitted Photos

Photos are saved in: `/app/frontend/public/uploads/`

Access via: `https://contact-system-test.preview.emergentagent.com/uploads/filename.jpg`

### Email Notifications

After you configure email in admin panel:
- Client submits form → Email sent to you
- Email includes:
  - Client info (name, phone, email)
  - Message
  - Links to uploaded photos

## 🔍 SEO Files Purpose

### For Google Search Console
1. Verify your site in Google Search Console
2. Submit sitemap: `https://yoursite.com/sitemap.xml`
3. Check robots.txt: `https://yoursite.com/robots.txt`

### For Better Rankings
- **Structured Data**: Helps Google understand your business
  - Shows in Google Business listings
  - Rich snippets in search results
  - Better local SEO

- **Keywords**: Use these in:
  - Page content
  - Meta descriptions
  - Title tags
  - Alt text for images
  - Blog posts

## 📊 Monitoring & Analytics

### Recommended Tools
1. **Google Search Console**: Monitor search performance
2. **Google Analytics**: Track visitors
3. **Google Business Profile**: Local visibility

### What to Track
- Form submissions (contact form)
- Keywords bringing traffic
- Page views
- Bounce rate
- Geographic location of visitors

## 🎯 Next Steps for Better SEO

1. **Create Blog Content**
   - Use keywords from seo-keywords.txt
   - Write about: "Best security systems", "How to choose cameras", etc.

2. **Get Reviews**
   - Google Business Profile reviews
   - Facebook reviews
   - Build trust & ranking

3. **Local Citations**
   - List business on:
     - Yelp
     - Yellow Pages
     - Local directories

4. **Backlinks**
   - Partner with local businesses
   - Guest posts on security blogs
   - Local news features

## 📁 File Locations

```
/app/frontend/public/
├── robots.txt              # Search engine instructions
├── sitemap.xml             # Page list for Google
├── seo-schema.js           # Structured data
├── seo-keywords.txt        # Keyword research
├── contact-integration.js  # Form handler with photos
└── uploads/                # Uploaded photos stored here
```

## 🚀 Testing Checklist

- [ ] Test contact form (text fields)
- [ ] Test photo upload (multiple images)
- [ ] Check email notification arrives
- [ ] Verify photos saved in /uploads/
- [ ] View submission in admin panel
- [ ] Check robots.txt loads: /robots.txt
- [ ] Check sitemap loads: /sitemap.xml
- [ ] Validate structured data: https://search.google.com/test/rich-results

## 🔧 Customization

### Update Business Info in SEO Schema
Edit: `/app/frontend/public/seo-schema.js`

Change:
- Business name
- Phone number
- Address
- Opening hours
- Service areas
- Social media links

### Add More Keywords
Edit: `/app/frontend/public/seo-keywords.txt`

Add keywords relevant to:
- Your specific services
- Your service areas
- Your unique selling points

---

**All set!** Contact form accepts photos and SEO files are ready for Google indexing.
