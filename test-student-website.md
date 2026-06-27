# Student Website Testing Plan

## Overview
This document outlines a comprehensive testing strategy for the PlayFit LMS Student Portal.

## Environment Setup
- **Backend API:** http://localhost:5001/api
- **Frontend:** http://localhost:3000
- **Socket Server:** http://localhost:5001

---

## 1. Authentication & Authorization Tests

### 1.1 Registration Flow
- [ ] Navigate to `/register`
- [ ] Test with invalid email format
- [ ] Test with weak password
- [ ] Test with mismatched password confirmation
- [ ] Test successful registration with valid data
- [ ] Verify email validation if enabled
- [ ] Check redirect after successful registration

### 1.2 Login Flow
- [ ] Navigate to `/login`
- [ ] Test with invalid credentials
- [ ] Test with valid student credentials
- [ ] Test "Remember Me" functionality
- [ ] Verify token storage in localStorage/cookies
- [ ] Check redirect to dashboard after login
- [ ] Test role-based access (student role only)

### 1.3 Password Management
- [ ] Navigate to `/forgot-password`
- [ ] Submit valid email
- [ ] Check email notification
- [ ] Navigate to `/reset-password` with token
- [ ] Test password reset with valid token
- [ ] Test password reset with expired token
- [ ] Test password reset with invalid token

### 1.4 Logout Flow
- [ ] Test logout from dashboard
- [ ] Verify token removal
- [ ] Verify redirect to login page
- [ ] Test multi-device logout if applicable

---

## 2. Dashboard & Navigation Tests

### 2.1 Student Dashboard
- [ ] Navigate to `/student` (main dashboard)
- [ ] Verify enrolled courses display
- [ ] Check course progress indicators
- [ ] Verify upcoming live classes widget
- [ ] Check notifications badge
- [ ] Test quick access links
- [ ] Verify course recommendations section

### 2.2 Global Navigation
- [ ] Test all navigation menu items
- [ ] Test global search functionality (`GlobalSearch.tsx`)
- [ ] Test responsive navigation (mobile/tablet)
- [ ] Verify active route highlighting
- [ ] Test footer links and information

---

## 3. Course Discovery & Enrollment Tests

### 3.1 Course Browsing
- [ ] Navigate to `/student/courses`
- [ ] Test course listing display
- [ ] Test course filters (category, level, price)
- [ ] Test course search functionality
- [ ] Test course sorting options
- [ ] Verify course card information accuracy
- [ ] Test pagination if implemented

### 3.2 Course Finder
- [ ] Navigate to `/course-finder`
- [ ] Test recommendation algorithm input
- [ ] Submit preferences
- [ ] Navigate to `/course-finder/results`
- [ ] Verify personalized recommendations
- [ ] Test course card interactions

### 3.3 Course Details
- [ ] Navigate to `/student/course/[id]`
- [ ] Verify course information display
- [ ] Check course curriculum/sections
- [ ] Verify instructor information
- [ ] Test enrollment button functionality
- [ ] Check prerequisite warnings if applicable
- [ ] Test course preview if available

### 3.4 Checkout Process
- [ ] Navigate to `/student/checkout/[courseId]`
- [ ] Verify course details in checkout
- [ ] Test payment form validation
- [ ] Test different payment methods
- [ ] Test promo code application
- [ ] Complete mock payment
- [ ] Navigate to `/student/payment-success`
- [ ] Verify enrollment confirmation

---

## 4. Learning Experience Tests

### 4.1 My Courses
- [ ] Navigate to `/student/my-courses`
- [ ] Verify enrolled courses list
- [ ] Check course progress bars
- [ ] Test "Continue Learning" buttons
- [ ] Test course filtering (in-progress, completed)
- [ ] Verify course certificates display

### 4.2 Course Learning Interface
- [ ] Navigate to `/student/learn/[courseId]`
- [ ] Verify course structure sidebar
- [ ] Test lesson navigation
- [ ] Test video playback functionality
- [ ] Test lesson completion marking
- [ ] Test previous/next lesson navigation
- [ ] Verify progress saving
- [ ] Test course materials download
- [ ] Test lesson notes/comments if available

### 4.3 PDF Viewer
- [ ] Navigate to `/student/pdf-viewer` with document
- [ ] Test PDF rendering
- [ ] Test zoom controls
- [ ] Test page navigation
- [ ] Test download functionality
- [ ] Test secure viewer features (`SecureViewer.tsx`)

### 4.4 Course Materials
- [ ] Access course materials section
- [ ] Test file downloads
- [ ] Verify material access restrictions
- [ ] Test supplementary resources

---

## 5. Live Classes Tests

### 5.1 Scheduled Classes
- [ ] Navigate to `/student/scheduled-classes`
- [ ] Verify upcoming classes display
- [ ] Check class schedule information
- [ ] Test calendar view if available
- [ ] Test filter by course/instructor
- [ ] Verify timezone handling

### 5.2 Live Classes List
- [ ] Navigate to `/student/live-classes`
- [ ] Verify all available live classes
- [ ] Test booking/registration for classes
- [ ] Check slot availability
- [ ] Test waitlist functionality if applicable
- [ ] Verify booking confirmations

### 5.3 Joining Live Classes
- [ ] Navigate to `/student/live-class-join/[classId]`
- [ ] Test joining before class starts (should be restricted)
- [ ] Join during class time
- [ ] Verify video/audio connectivity
- [ ] Test chat functionality
- [ ] Test screen sharing view
- [ ] Test participant list
- [ ] Test raise hand feature if available
- [ ] Test leaving class
- [ ] Verify attendance recording

---

## 6. User Profile & Settings Tests

### 6.1 Profile Management
- [ ] Navigate to `/student/profile`
- [ ] View current profile information
- [ ] Test profile picture upload
- [ ] Test profile information update
- [ ] Test password change
- [ ] Test email change
- [ ] Verify validation rules
- [ ] Test save functionality

### 6.2 Notifications
- [ ] Navigate to `/student/notifications`
- [ ] Verify notification list display
- [ ] Test mark as read functionality
- [ ] Test notification filtering
- [ ] Test notification preferences
- [ ] Verify real-time notifications (Socket.IO)
- [ ] Test notification badge updates

---

## 7. Progress & Certificates Tests

### 7.1 Learning Progress
- [ ] View overall progress dashboard
- [ ] Check individual course progress
- [ ] Verify completion percentages
- [ ] Test progress charts/visualizations
- [ ] Check learning streak if available
- [ ] Verify time spent tracking

### 7.2 Certificates
- [ ] Navigate to `/student/certificates`
- [ ] Verify earned certificates display
- [ ] Test certificate download
- [ ] Test certificate sharing
- [ ] Verify certificate authenticity features
- [ ] Check certificate details

---

## 8. Search & Discovery Tests

### 8.1 Global Search
- [ ] Test global search from any page
- [ ] Search for courses
- [ ] Search for instructors
- [ ] Search for topics
- [ ] Verify search results accuracy
- [ ] Test search filters
- [ ] Test search history

### 8.2 Course Search
- [ ] Navigate to `/student/search`
- [ ] Test advanced search filters
- [ ] Test search suggestions
- [ ] Test empty search results handling
- [ ] Verify search performance

---

## 9. Recommendations Tests

### 9.1 Course Recommendations
- [ ] View recommendations on dashboard
- [ ] Test `CourseRecommendationSection.tsx` component
- [ ] Verify recommendation accuracy
- [ ] Test "Why recommended" explanations
- [ ] Test recommendation refresh
- [ ] Verify personalization based on history

---

## 10. Responsive & UI/UX Tests

### 10.1 Responsive Design
- [ ] Test on mobile devices (320px, 375px, 414px)
- [ ] Test on tablets (768px, 1024px)
- [ ] Test on desktop (1280px, 1920px)
- [ ] Test landscape and portrait orientations
- [ ] Verify touch interactions on mobile
- [ ] Test hamburger menu functionality

### 10.2 UI Components
- [ ] Test all buttons and links
- [ ] Verify form input interactions
- [ ] Test modal dialogs
- [ ] Test toast notifications
- [ ] Test loading states
- [ ] Test error states
- [ ] Verify tooltips and help text
- [ ] Test accessibility features

---

## 11. Performance Tests

### 11.1 Load Performance
- [ ] Measure initial page load time
- [ ] Test time to interactive
- [ ] Check bundle size
- [ ] Verify lazy loading of routes
- [ ] Test image optimization
- [ ] Check API response times

### 11.2 Runtime Performance
- [ ] Test smooth scrolling
- [ ] Verify video playback performance
- [ ] Test large list rendering
- [ ] Check memory usage
- [ ] Test concurrent user interactions

---

## 12. Integration Tests

### 12.1 API Integration
- [ ] Verify all API endpoints connectivity
- [ ] Test error handling for API failures
- [ ] Test rate limiting behavior
- [ ] Verify proper error messages
- [ ] Test network offline scenarios

### 12.2 Real-time Features
- [ ] Test Socket.IO connection
- [ ] Verify real-time notifications
- [ ] Test live class real-time updates
- [ ] Check connection recovery after disconnect

---

## 13. Security Tests

### 13.1 Authentication Security
- [ ] Test JWT token expiration handling
- [ ] Verify protected routes redirect
- [ ] Test CSRF protection if implemented
- [ ] Verify secure cookie settings
- [ ] Test XSS protection

### 13.2 Authorization
- [ ] Test role-based access control
- [ ] Verify student can't access instructor routes
- [ ] Test course access restrictions
- [ ] Verify payment verification

### 13.3 Data Security
- [ ] Test sensitive data handling
- [ ] Verify HTTPS in production
- [ ] Test file upload security
- [ ] Check API authentication headers

---

## 14. Error Handling Tests

### 14.1 Error Pages
- [ ] Test 404 page for invalid routes
- [ ] Test 500 error page simulation
- [ ] Verify error boundary functionality
- [ ] Test network error handling

### 14.2 User Error Feedback
- [ ] Test form validation errors
- [ ] Verify API error messages
- [ ] Test timeout handling
- [ ] Check user-friendly error messages

---

## 15. Browser Compatibility Tests

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## 16. Accessibility Tests

- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Test focus indicators
- [ ] Verify ARIA labels
- [ ] Test with browser accessibility tools

---

## Testing Tools Recommendations

1. **Manual Testing:** Browser DevTools
2. **Automated Testing:** Playwright, Cypress
3. **Performance:** Lighthouse, WebPageTest
4. **Accessibility:** axe DevTools, WAVE
5. **API Testing:** Postman, Thunder Client
6. **Responsive Testing:** Browser DevTools Device Mode
7. **Load Testing:** k6, Artillery

---

## Test Execution Checklist

### Pre-Testing
- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 3000
- [ ] Database populated with test data
- [ ] Test user accounts created

### During Testing
- [ ] Document all bugs found
- [ ] Take screenshots of issues
- [ ] Note reproduction steps
- [ ] Record browser console errors

### Post-Testing
- [ ] Compile bug report
- [ ] Prioritize issues
- [ ] Create GitHub issues
- [ ] Update test coverage report
