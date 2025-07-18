#!/usr/bin/env node

/**
 * Build optimization script
 * This script helps optimize the build process for better Lighthouse scores
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build optimization...');

// 1. Check for unused dependencies
function checkUnusedDependencies() {
  console.log('📦 Checking for unused dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = Object.keys(packageJson.dependencies || {});
  
  console.log(`Found ${dependencies.length} dependencies`);
  
  // List of known heavy dependencies that might be unused
  const heavyDeps = [
    'framer-motion',
    'embla-carousel-react',
    'react-resizable-panels',
    'recharts',
    'react-day-picker'
  ];
  
  const foundHeavyDeps = dependencies.filter(dep => heavyDeps.includes(dep));
  
  if (foundHeavyDeps.length > 0) {
    console.log('⚠️  Found potentially heavy dependencies:');
    foundHeavyDeps.forEach(dep => console.log(`  - ${dep}`));
    console.log('💡 Consider lazy loading these or removing if unused');
  }
}

// 2. Optimize images
function optimizeImages() {
  console.log('🖼️  Checking image optimization...');
  
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    console.log('❌ Public directory not found');
    return;
  }
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const images = [];
  
  function scanDirectory(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    files.forEach(file => {
      const fullPath = path.join(dir, file.name);
      
      if (file.isDirectory()) {
        scanDirectory(fullPath);
      } else if (imageExtensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
        const stats = fs.statSync(fullPath);
        images.push({
          path: fullPath,
          size: stats.size,
          name: file.name
        });
      }
    });
  }
  
  scanDirectory(publicDir);
  
  console.log(`Found ${images.length} images`);
  
  const largeImages = images.filter(img => img.size > 100000); // 100KB
  if (largeImages.length > 0) {
    console.log('⚠️  Found large images (>100KB):');
    largeImages.forEach(img => {
      console.log(`  - ${img.name}: ${(img.size / 1024).toFixed(1)}KB`);
    });
    console.log('💡 Consider compressing these images');
  }
}

// 3. Check for critical CSS
function checkCriticalCSS() {
  console.log('🎨 Checking for critical CSS optimization...');
  
  const criticalCSSPath = path.join(process.cwd(), 'app', 'critical.css');
  if (fs.existsSync(criticalCSSPath)) {
    console.log('✅ Critical CSS file found');
  } else {
    console.log('💡 Consider creating critical CSS for above-the-fold content');
  }
}

// 4. Check bundle size
function checkBundleConfig() {
  console.log('📦 Checking bundle configuration...');
  
  const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (config.includes('optimizePackageImports')) {
      console.log('✅ Package imports optimization enabled');
    } else {
      console.log('⚠️  Package imports optimization not found');
    }
    
    if (config.includes('splitChunks')) {
      console.log('✅ Chunk splitting configuration found');
    } else {
      console.log('💡 Consider adding chunk splitting configuration');
    }
  }
}

// 5. Performance recommendations
function performanceRecommendations() {
  console.log('\n🎯 Performance Recommendations:');
  
  console.log('1. 🚀 Enable static generation where possible');
  console.log('2. 💾 Implement proper caching headers');
  console.log('3. 📦 Use dynamic imports for heavy components');
  console.log('4. 🖼️  Optimize images with next/image');
  console.log('5. 🔄 Implement service worker for caching');
  console.log('6. 📊 Monitor Core Web Vitals');
  console.log('7. 🎨 Inline critical CSS');
  console.log('8. 🔗 Preload important resources');
  console.log('9. 📱 Test on mobile devices');
  console.log('10. 🔍 Run Lighthouse audits regularly');
}

// Run all checks
async function runOptimization() {
  checkUnusedDependencies();
  console.log('');
  optimizeImages();
  console.log('');
  checkCriticalCSS();
  console.log('');
  checkBundleConfig();
  console.log('');
  performanceRecommendations();
  
  console.log('\n✅ Build optimization check complete!');
  console.log('💡 Run "npm run build" to see the actual bundle sizes');
}

runOptimization().catch(console.error);