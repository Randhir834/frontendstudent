# Site Configuration Usage Guide

## Quick Reference for Using SITE_CONFIG

### Import Statement
```typescript
import { SITE_CONFIG, getMailtoLink, getPhoneLink } from '@/lib/siteConfig';
```

---

## Common Use Cases

### 1. Display Business Name
```tsx
<h1>{SITE_CONFIG.business.name}</h1>
// Output: "PlayFit Classes"
```

### 2. Display Contact Email
```tsx
<a href={getMailtoLink()}>{SITE_CONFIG.contact.email}</a>
// Output: <a href="mailto:cplayfit@gmail.com">cplayfit@gmail.com</a>
```

### 3. Display Phone Number
```tsx
<a href={getPhoneLink()}>{SITE_CONFIG.contact.phoneDisplay}</a>
// Output: <a href="tel:+91-8910484299">+91 891 048 4299</a>
```

### 4. Display Address
```tsx
<address>
  {SITE_CONFIG.address.street}<br />
  {SITE_CONFIG.address.street2}<br />
  {SITE_CONFIG.address.city}, {SITE_CONFIG.address.state} {SITE_CONFIG.address.postalCode}
</address>
```

### 5. Display Student Count
```tsx
<p>Join {SITE_CONFIG.stats.students} happy students!</p>
// Output: "Join 5,000+ happy students!"
```

### 6. Display Age Range
```tsx
<p>For kids aged {SITE_CONFIG.audience.ageRange}</p>
// Output: "For kids aged 4-10 years"

// Or use display format:
<p>Ages {SITE_CONFIG.audience.ageDisplay}</p>
// Output: "Ages 4–10"
```

### 7. Display Rating
```tsx
<div>{SITE_CONFIG.stats.rating}/5 ⭐</div>
// Output: "4.9/5 ⭐"
```

### 8. Featured Courses
```tsx
<p>Learn {SITE_CONFIG.courses.featured.join(', ')}</p>
// Output: "Learn Phonics, Public Speaking, Grammar, Spell Bee"
```

### 9. Social Media Links
```tsx
<a href={SITE_CONFIG.social.instagram}>Instagram</a>
<a href={SITE_CONFIG.social.facebook}>Facebook</a>
```

### 10. Website URLs
```tsx
<link rel="canonical" href={SITE_CONFIG.urls.main} />
<img src={SITE_CONFIG.urls.logo} alt={SITE_CONFIG.business.name} />
```

---

## Available Helper Functions

```typescript
// Full formatted address
getFullAddress()
// Returns: "Gate No. 3, 4th Floor, Poddar Court, 18 Rabindra Sarani, Kolkata, West Bengal 700001, India"

// Email link
getMailtoLink()
// Returns: "mailto:cplayfit@gmail.com"

// Phone link
getPhoneLink()
// Returns: "tel:+91-8910484299"

// Schema.org address object
getSchemaAddress()
// Returns: { "@type": "PostalAddress", "streetAddress": "...", ... }

// Social links array
getSocialLinks()
// Returns: [{ platform: "instagram", url: "...", username: "..." }, ...]

// Formatted age range
getAgeRangeText()
// Returns: "Ages 4-10"

// Business hours text
getBusinessHours()
// Returns: "Monday - Saturday, 11:00 AM - 7:00 PM IST"
```

---

## Complete SITE_CONFIG Structure

```typescript
SITE_CONFIG = {
  business: {
    name: string
    legalName: string
    alternateName: string
    tagline: string
    description: string
  }
  
  contact: {
    email: string
    phone: string
    phoneDisplay: string
    supportEmail: string
  }
  
  address: {
    full: string
    street: string
    street2: string
    city: string
    state: string
    stateCode: string
    postalCode: string
    country: string
    countryCode: string
  }
  
  hours: {
    days: string
    times: string
    timeZone: string
    openingHours: string
  }
  
  audience: {
    ageRange: string
    ageMin: number
    ageMax: number
    ageDisplay: string
    studentCount: string
    studentCountNumeric: number
  }
  
  courses: {
    featured: string[]
    all: string[]
    categories: Array<{
      name: string
      icon: string
      courses: string[]
    }>
  }
  
  social: {
    instagram?: string
    facebook?: string
    twitter?: string
    youtube?: string
    linkedin?: string
  }
  
  urls: {
    main: string
    baseUrl: string
    logo: string
    ogImage: string
    instructor: string
    admin: string
  }
  
  seo: {
    defaultTitle: string
    titleTemplate: string
    defaultDescription: string
    keywords: string[]
    twitterHandle: string
  }
  
  stats: {
    students: string
    studentsNumeric: number
    rating: number
    ratingMax: number
    reviewCount: string
    reviewCountNumeric: number
    courseCount: string
    courseCountNumeric: number
    satisfactionRate: string
    satisfactionRateNumeric: number
  }
  
  features: {
    trial: {
      available: boolean
      duration: string
      price: string
    }
    formats: string[]
    languages: string[]
    certifications: boolean
    flexibleScheduling: boolean
    expertInstructors: boolean
  }
  
  legal: {
    registeredName: string
    gstNumber?: string
    cin?: string
  }
  
  credits: {
    developedBy: string
    developedByUrl: string
  }
}
```

---

## How to Update Values

### Step 1: Edit the Config File
Open `/lib/siteConfig.ts` and update the value:

```typescript
// Example: Change phone number
contact: {
  email: "newemail@playfit.com",     // ← Update here
  phone: "+91-XXXXXXXXXX",            // ← Update here
  phoneDisplay: "+91 XXX XXX XXXX",   // ← Update here
}
```

### Step 2: That's It!
The changes automatically propagate to:
- ✅ All pages (home, about, contact, legal pages)
- ✅ Footer
- ✅ Metadata and SEO tags
- ✅ Schema.org structured data
- ✅ All links and CTAs

### Step 3: Rebuild (for production)
```bash
npm run build
```

---

## TypeScript Benefits

### Autocomplete
```typescript
SITE_CONFIG.contact.  // IDE shows: email, phone, phoneDisplay, supportEmail
```

### Type Safety
```typescript
// ❌ This will error at compile time:
SITE_CONFIG.contact.telephone // Property 'telephone' does not exist

// ✅ This is correct:
SITE_CONFIG.contact.phone
```

### Const Assertions
All values are readonly, preventing accidental modifications:
```typescript
// ❌ This will error:
SITE_CONFIG.contact.email = "wrong@email.com"
```

---

## Best Practices

### DO ✅
- Import SITE_CONFIG at the top of your file
- Use helper functions for formatted data (getMailtoLink, getPhoneLink)
- Use SITE_CONFIG for any business-related information
- Update lib/siteConfig.ts for any business detail changes

### DON'T ❌
- Hardcode phone numbers, emails, addresses anywhere
- Copy-paste values from SITE_CONFIG (always reference it)
- Create local variables for business details
- Modify SITE_CONFIG values at runtime

---

## Examples from the Codebase

### Homepage Hero Section
```tsx
import { SITE_CONFIG } from '@/lib/siteConfig';

<div className="badge">
  Trusted by {SITE_CONFIG.stats.students} Students
</div>

<h1>{SITE_CONFIG.business.tagline}</h1>
<p>For kids aged {SITE_CONFIG.audience.ageRange}</p>
```

### Footer Contact Section
```tsx
import { SITE_CONFIG, getMailtoLink, getPhoneLink } from '@/lib/siteConfig';

<a href={getMailtoLink()}>
  {SITE_CONFIG.contact.email}
</a>

<a href={getPhoneLink()}>
  {SITE_CONFIG.contact.phoneDisplay}
</a>
```

### Metadata
```tsx
import { SITE_CONFIG } from '@/lib/siteConfig';

export const metadata = {
  title: `About ${SITE_CONFIG.business.name}`,
  description: `${SITE_CONFIG.business.description}`,
}
```

---

## File Location
`/frontend/frontendstudent/lib/siteConfig.ts`

## Last Updated
2026-11-19

## Questions?
Refer to inline documentation in `lib/siteConfig.ts`
