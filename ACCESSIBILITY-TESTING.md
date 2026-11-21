# Accessibility Testing Guide

## Quick Test Checklist

### 1. Lighthouse Audit (2 minutes)
```
1. Open Chrome DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Accessibility" only
4. Click "Analyze page load"
5. Verify score is 100 (was 82)
```

**Expected Result:** Score 100/100

### 2. Keyboard Navigation Test (5 minutes)

**Test on Homepage:**
1. Press Tab key repeatedly
2. Verify you can reach:
   - [ ] Logo link
   - [ ] All navigation links
   - [ ] Mobile menu button (on mobile)
   - [ ] "Explore Courses" button
   - [ ] "Start Free Trial" button
   - [ ] All form fields
   - [ ] Submit button
   - [ ] Footer links

**Verify:**
- [ ] Focus indicator is visible on all elements
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] No focus traps
- [ ] Can activate buttons with Enter/Space

### 3. Screen Reader Test (5 minutes)

**VoiceOver (Mac):**
```
1. Press Cmd + F5 to enable
2. Press Ctrl + Option + U for rotor
3. Navigate headings (H1, H2, H3)
4. Navigate landmarks (Main, Nav, Footer)
```

**NVDA (Windows):**
```
1. Start NVDA
2. Press Insert + F7 for elements list
3. Navigate by headings
4. Navigate by landmarks
```

**What to Verify:**
- [ ] H1 is announced correctly
- [ ] Main landmark is announced
- [ ] Form labels are read with inputs
- [ ] Decorative emojis are NOT announced
- [ ] Buttons have clear names

### 4. Visual Contrast Test (2 minutes)

**Use WebAIM Contrast Checker:**
https://webaim.org/resources/contrastchecker/

Test these combinations:
- [ ] Gray-900 (#111827) on white → Should pass AAA (15.01:1)
- [ ] Gray-600 (#4B5563) on white → Should pass AA (7.24:1)
- [ ] Purple-600 (#9333EA) on white → Should pass AA (5.61:1)

### 5. Color Blind Test (Optional)

Use Chrome extension "Colorblindly" or "NoCoffee Vision Simulator"

Test modes:
- [ ] Deuteranopia (red-green)
- [ ] Protanopia (red-green)
- [ ] Tritanopia (blue-yellow)

Verify:
- [ ] All information is still visible
- [ ] Links are distinguishable (not just by color)
- [ ] Form errors are clear

---

## Detailed Testing

### Forms Testing

**Trial Form (Homepage):**
1. Navigate with keyboard only
2. Verify each field:
   - [ ] Parent Name - label reads "Parent Name"
   - [ ] Child Name - label reads "Child Name"  
   - [ ] Email - label reads "Email Address"
   - [ ] Phone - label reads "Phone Number"
   - [ ] Course Interest - label reads "Which course interests you?"
   - [ ] Message - label reads "Additional Message"

3. Try submitting:
   - [ ] Empty form shows validation
   - [ ] Error messages are announced by screen reader
   - [ ] Can correct errors with keyboard

### Emoji Testing

**Verify decorative emojis are hidden from screen readers:**

With VoiceOver/NVDA enabled:
1. Navigate statistics section
   - [ ] Emoji icons (⭐, 💬, 🏆, ❤️) should be SKIPPED
   - [ ] Only numbers and labels read: "4.9 out of 5, Average Rating"

2. Navigate course selection dropdown
   - [ ] Options should read without emojis
   - [ ] "Art & Drawing" (not "🎨 Art & Drawing")

3. Navigate blog article headers
   - [ ] Article titles should not include emoji
   - [ ] "10 Benefits of Online Learning" (not "✍️ 10 Benefits...")

### Landmark Testing

**Verify page structure with screen reader rotor:**

Expected landmarks on homepage:
- [ ] Banner (navigation)
- [ ] Main (main content)
- [ ] Contentinfo (footer)

Expected headings on homepage:
- [ ] H1: "Live Online & Kolkata Classes for Kids"
- [ ] H2: "Why Choose PlayFit"
- [ ] H2: "Explore Our Skill Development Courses"
- [ ] H2: "What Sets Us Apart"
- [ ] H2: "Meet Our Expert Instructors"

---

## Common Issues & Fixes

### Issue: Emojis are being announced
**Fix:** Verify `aria-hidden="true"` is on emoji span:
```tsx
<span aria-hidden="true">🎨</span>
```

### Issue: Focus indicator not visible
**Fix:** Check CSS doesn't remove outline:
```css
/* Bad */
button:focus { outline: none; }

/* Good */
button:focus { outline: 2px solid blue; }
```

### Issue: Form field not announced properly
**Fix:** Verify label has `htmlFor` matching input `id`:
```tsx
<label htmlFor="email">Email</label>
<input id="email" name="email" />
```

### Issue: Heading skip (H1 → H3)
**Fix:** Add missing H2:
```tsx
<h1>Page Title</h1>
<h2>Section Title</h2> {/* Don't skip to H3 */}
<h3>Subsection</h3>
```

---

## Automated Testing Tools

### Browser Extensions
1. **axe DevTools** (Free)
   - Comprehensive accessibility testing
   - Highlights issues directly on page

2. **WAVE** (Free)
   - Visual feedback about accessibility
   - Shows ARIA labels, landmarks

3. **Lighthouse** (Built into Chrome)
   - Overall score and recommendations
   - Performance, SEO, Best Practices

### Command Line Tools
```bash
# pa11y (requires Node.js)
npm install -g pa11y
pa11y https://playfitclasses.com

# axe-core CLI
npm install -g @axe-core/cli  
axe https://playfitclasses.com
```

---

## Expected Results

### Lighthouse Scores
- Accessibility: **100** ✅ (was 82)
- Performance: **90-95** ✅
- Best Practices: **95+** ✅
- SEO: **100** ✅

### WCAG 2.1 Compliance
- **Level A:** Pass ✅
- **Level AA:** Pass ✅
- **Level AAA:** Most criteria pass

### Screen Reader Compatibility
- ✅ VoiceOver (Mac/iOS)
- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ TalkBack (Android)

---

## Quick Command Reference

### VoiceOver (Mac)
- Enable/Disable: `Cmd + F5`
- Web rotor: `Ctrl + Option + U`
- Next element: `Ctrl + Option + →`
- Read page: `Ctrl + Option + A`

### NVDA (Windows)
- Start: `Ctrl + Alt + N`
- Elements list: `Insert + F7`
- Next heading: `H`
- Next landmark: `D`

### JAWS (Windows)
- Headings list: `Insert + F6`
- Links list: `Insert + F7`
- Forms mode: `Enter` on form field

---

## Success Criteria

✅ **All pages pass Lighthouse accessibility audit with 100 score**  
✅ **All interactive elements keyboard accessible**  
✅ **All form fields have proper labels**  
✅ **Decorative content hidden from screen readers**  
✅ **Proper heading hierarchy on all pages**  
✅ **WCAG AA color contrast ratios met**  
✅ **All pages have main landmark**  
✅ **Focus indicators visible**

---

## Contact for Issues

If you find any accessibility issues:
1. Note the URL
2. Describe the issue
3. Include browser/OS version
4. Include assistive technology used (if any)

Report to: [accessibility@playfitclasses.com]
