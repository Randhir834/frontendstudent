const fs = require('fs');
const path = require('path');

// Files to process (from grep results)
const filesToProcess = [
  'app/(public)/cookies/page.tsx',
  'app/(public)/courses/page.tsx',
  'components/CoursesSection/CoursesSection.tsx',
  'app/(public)/course/[id]/page.tsx',
  'app/(public)/course-finder/results/page.tsx',
  'app/(public)/blog/[slug]/page.tsx',
  'app/(public)/terms/page.tsx',
  'components/ui/CourseCard.tsx',
  'app/(public)/privacy/page.tsx',
  'components/layouts/SidebarLayout.tsx',
  'components/CourseRecommendation/RecommendationResults.tsx',
  'components/layouts/Footer.tsx',
  'components/layouts/Header.tsx',
  'components/layouts/AuthLayout.tsx',
  'components/layouts/StudentAuthSplitShell.tsx',
  'components/layouts/StudentDashboardLayout.tsx',
];

const baseDir = '/Users/randhirkumar/Desktop/playfit-lms/frontend/frontendstudent';

// Image size mappings for different use cases
const imageSizes = {
  '/logo.jpg': { width: 100, height: 100 },
  '/images/puja.jpg': { width: 96, height: 96 },
  '/images/sonika.jpg': { width: 96, height: 96 },
  '/images/loginstudentpage.webp': { width: 1574, height: 1500 },
  '/images/navbarstudentdown.webp': { width: 1486, height: 1414 },
  '/images/navbarlogo.webp': { width: 1254, height: 1254 },
  '/images/playfit-logo.jpg': { width: 1254, height: 1254 },
};

filesToProcess.forEach(file => {
  const filePath = path.join(baseDir, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${file} (not found)`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Check if Image is already imported
  const hasImageImport = content.includes("from 'next/image'") || content.includes('from "next/image"');
  
  // Add Image import if not present
  if (!hasImageImport && content.includes('<img')) {
    if (content.includes("import Link from 'next/link'")) {
      content = content.replace(
        /import Link from ['"]next\/link['"]/,
        "import Link from 'next/link';\nimport Image from 'next/image'"
      );
    } else if (content.includes('import')) {
      const firstImport = content.match(/^import .+$/m)[0];
      content = content.replace(firstImport, firstImport + ";\nimport Image from 'next/image'");
    }
  }
  
  // Replace <img> tags with <Image>
  // Pattern 1: Simple img tags with src, alt, className
  content = content.replace(
    /<img\s+([^>]*src=["']([^"']+)["'][^>]*)>/g,
    (match, attrs, src) => {
      // Skip if already an Image component
      if (match.includes('Image')) return match;
      
      // Extract attributes
      const altMatch = attrs.match(/alt=["']([^"']*)["']/);
      const classMatch = attrs.match(/className=["']([^"']*)["']/);
      
      const alt = altMatch ? altMatch[1] : '';
      const className = classMatch ? classMatch[1] : '';
      
      // Determine size based on src
      let size = imageSizes[src] || { width: 800, height: 600 };
      
      // For course thumbnails and dynamic images, use fill layout
      if (src.startsWith('http') || src.includes('thumbnail') || src.includes('avatar') || src.includes('featured_image')) {
        return `<Image\n              fill\n              src={${src.includes('{') || src.includes('?') ? src : `"${src}"`}}\n              alt="${alt}"\n              className="${className}"\n              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"\n            />`;
      }
      
      return `<Image\n              width={${size.width}}\n              height={${size.height}}\n              src="${src}"\n              alt="${alt}"\n              className="${className}"\n            />`;
    }
  );
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${file}`);
  } else {
    console.log(`ℹ️  No changes needed for ${file}`);
  }
});

console.log('\n✨ Image replacement complete!');
