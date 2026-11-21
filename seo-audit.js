const fs = require('fs');
const path = require('path');

const results = {
  pass: [],
  fail: [],
  warnings: []
};

function log(status, message) {
  if (status === 'PASS') results.pass.push(message);
  else if (status === 'FAIL') results.fail.push(message);
  else results.warnings.push(message);
  console.log(`[${status}] ${message}`);
}

// Check for H1 tags and heading hierarchy in a file
function checkHeadings(filePath, content) {
  const h1Matches = content.match(/<h1[^>]*>|className="[^"]*text-\d+xl[^"]*"/g);
  const h1Count = (content.match(/<h1[^>]*>/g) || []).length;
  
  if (h1Count === 0) {
    log('FAIL', `${filePath}: No H1 found`);
  } else if (h1Count > 1) {
    log('FAIL', `${filePath}: Multiple H1 tags found (${h1Count})`);
  } else {
    log('PASS', `${filePath}: Exactly one H1`);
  }
}

// Check for images without alt text
function checkImages(filePath, content) {
  const imgTags = content.match(/<img[^>]*>/g) || [];
  const imagesWithoutAlt = imgTags.filter(img => !img.includes('alt='));
  
  if (imagesWithoutAlt.length > 0) {
    log('FAIL', `${filePath}: ${imagesWithoutAlt.length} <img> tags without alt`);
  } else if (imgTags.length > 0) {
    log('PASS', `${filePath}: All ${imgTags.length} <img> tags have alt`);
  }
  
  // Check Next.js Image components
  const imageComponents = content.match(/<Image[^>]*>/g) || [];
  const imagesWithoutAltProp = imageComponents.filter(img => !img.includes('alt='));
  
  if (imagesWithoutAltProp.length > 0) {
    log('FAIL', `${filePath}: ${imagesWithoutAltProp.length} <Image> components without alt`);
  }
}

// Check for # links
function checkHashLinks(filePath, content) {
  const hashLinks = content.match(/href=["']#["']/g) || [];
  
  if (hashLinks.length > 0) {
    log('FAIL', `${filePath}: ${hashLinks.length} empty href="#" links`);
  } else {
    log('PASS', `${filePath}: No empty # links`);
  }
}

// Scan all page files
const pagesToCheck = [
  'app/page.tsx',
  'app/(public)/about/page.tsx',
  'app/(public)/blog/page.tsx',
  'app/(public)/blog/[slug]/page.tsx',
  'app/(public)/cookies/page.tsx',
  'app/(public)/course-finder/page.tsx',
  'app/(public)/course/[id]/page.tsx',
  'app/(public)/courses/page.tsx',
  'app/(public)/privacy/page.tsx',
  'app/(public)/terms/page.tsx',
  'app/(auth)/login/page.tsx',
  'app/(auth)/register/page.tsx',
  'app/(auth)/forgot-password/page.tsx',
  'app/(auth)/reset-password/page.tsx',
];

console.log('\n=== SEO AUDIT ===\n');

pagesToCheck.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    console.log(`\nChecking: ${pagePath}`);
    checkHeadings(pagePath, content);
    checkImages(pagePath, content);
    checkHashLinks(pagePath, content);
  } else {
    log('WARN', `${pagePath}: File not found`);
  }
});

// Check robots.txt
console.log('\n--- Checking robots.txt ---');
const robotsPath = path.join(__dirname, 'app/robots.ts');
if (fs.existsSync(robotsPath)) {
  const robotsContent = fs.readFileSync(robotsPath, 'utf8');
  if (robotsContent.includes('sitemap:')) {
    log('PASS', 'robots.txt: Contains sitemap reference');
  } else {
    log('FAIL', 'robots.txt: Missing sitemap reference');
  }
  if (robotsContent.includes('/student')) {
    log('PASS', 'robots.txt: Blocks /student routes');
  }
} else {
  log('FAIL', 'robots.txt: File not found');
}

// Summary
console.log('\n=== SUMMARY ===');
console.log(`✅ PASS: ${results.pass.length}`);
console.log(`❌ FAIL: ${results.fail.length}`);
console.log(`⚠️  WARN: ${results.warnings.length}`);

if (results.fail.length > 0) {
  console.log('\n=== FAILURES ===');
  results.fail.forEach(f => console.log(`  ❌ ${f}`));
}

process.exit(results.fail.length > 0 ? 1 : 0);
