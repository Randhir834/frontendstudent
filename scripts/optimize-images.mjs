#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PUBLIC_DIR = join(__dirname, '..', 'public');
const MAX_WIDTH = 1600;
const JPEG_QUALITY = 85;
const WEBP_QUALITY = 85;
const MAX_FILE_SIZE_KB = 200;

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size / 1024; // KB
}

async function optimizeImage(inputPath, outputPath) {
  const ext = extname(inputPath).toLowerCase();
  const baseName = basename(inputPath, ext);
  const dirName = dirname(outputPath);
  const tempPath = outputPath + '.tmp';

  try {
    // Get image metadata
    const metadata = await sharp(inputPath).metadata();
    const originalSize = await getFileSize(inputPath);
    
    console.log(`\n📸 Processing: ${basename(inputPath)}`);
    console.log(`   Original: ${metadata.width}x${metadata.height}, ${originalSize.toFixed(1)} KB`);

    // Resize if needed
    let pipeline = sharp(inputPath);
    if (metadata.width > MAX_WIDTH) {
      pipeline = pipeline.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Optimize based on file type
    if (ext === '.png') {
      // For PNGs, convert to WebP if large, otherwise optimize PNG
      if (originalSize > MAX_FILE_SIZE_KB) {
        await pipeline
          .webp({ quality: WEBP_QUALITY })
          .toFile(outputPath.replace('.png', '.webp'));
        
        const newSize = await getFileSize(outputPath.replace('.png', '.webp'));
        console.log(`   ✅ Converted to WebP: ${newSize.toFixed(1)} KB (saved ${(originalSize - newSize).toFixed(1)} KB)`);
      } else {
        await pipeline
          .png({ quality: 85, compressionLevel: 9 })
          .toFile(tempPath);
        
        const newSize = await getFileSize(tempPath);
        console.log(`   ✅ Optimized PNG: ${newSize.toFixed(1)} KB (saved ${(originalSize - newSize).toFixed(1)} KB)`);
        
        // Replace original with optimized
        const { rename, unlink } = await import('fs/promises');
        await unlink(outputPath);
        await rename(tempPath, outputPath);
      }
    } else if (ext === '.jpg' || ext === '.jpeg') {
      // Optimize JPEG to temp file first
      await pipeline
        .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
        .toFile(tempPath);
      
      const newSize = await getFileSize(tempPath);
      console.log(`   ✅ Optimized JPEG: ${newSize.toFixed(1)} KB (saved ${(originalSize - newSize).toFixed(1)} KB)`);
      
      // Replace original with optimized
      const { rename, unlink } = await import('fs/promises');
      await unlink(outputPath);
      await rename(tempPath, outputPath);
    }

    return true;
  } catch (error) {
    console.error(`   ❌ Error processing ${inputPath}:`, error.message);
    // Clean up temp file if it exists
    try {
      const { unlink } = await import('fs/promises');
      await unlink(tempPath);
    } catch {}
    return false;
  }
}

async function processDirectory(dir) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const fullPath = join(dir, file);
    const stats = await stat(fullPath);
    
    if (stats.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        await optimizeImage(fullPath, fullPath);
      }
    }
  }
}

async function createOptimizedFavicons() {
  console.log('\n🎨 Creating optimized favicon set...');
  
  const logoPath = join(PUBLIC_DIR, 'logo.jpg');
  
  // favicon.ico (32x32)
  await sharp(logoPath)
    .resize(32, 32, { fit: 'cover' })
    .toFile(join(PUBLIC_DIR, 'favicon.ico'));
  console.log('   ✅ Created favicon.ico (32x32)');
  
  // icon.png (512x512) for modern browsers
  await sharp(logoPath)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(join(PUBLIC_DIR, 'icon.png'));
  console.log('   ✅ Created icon.png (512x512)');
  
  // apple-icon.png (180x180)
  await sharp(logoPath)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(join(PUBLIC_DIR, 'apple-icon.png'));
  console.log('   ✅ Created apple-icon.png (180x180)');
}

async function createOGImage() {
  console.log('\n🖼️  Creating Open Graph image...');
  
  const logoPath = join(PUBLIC_DIR, 'logo.jpg');
  
  // Create a 1200x630 OG image with branded background
  const ogImage = await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: { r: 79, g: 70, b: 229, alpha: 1 } // Primary purple color
    }
  })
  .composite([
    {
      input: await sharp(logoPath)
        .resize(400, 400, { fit: 'inside' })
        .toBuffer(),
      gravity: 'center'
    }
  ])
  .jpeg({ quality: 90 })
  .toFile(join(PUBLIC_DIR, 'og-image.jpg'));
  
  console.log('   ✅ Created og-image.jpg (1200x630)');
}

async function main() {
  console.log('🚀 Starting image optimization...\n');
  console.log(`📁 Public directory: ${PUBLIC_DIR}`);
  
  // Process all images in public directory
  await processDirectory(PUBLIC_DIR);
  
  // Create favicon set
  await createOptimizedFavicons();
  
  // Create OG image
  await createOGImage();
  
  console.log('\n✨ Image optimization complete!\n');
  console.log('📋 Summary:');
  console.log('   - All images resized to max 1600px width');
  console.log('   - JPEGs optimized with 85% quality');
  console.log('   - Large PNGs converted to WebP');
  console.log('   - Created favicon.ico, icon.png, apple-icon.png');
  console.log('   - Created og-image.jpg (1200x630)\n');
}

main().catch(console.error);
