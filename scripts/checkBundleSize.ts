#!/usr/bin/env tsx

import fs from 'fs';
import path from 'path';

interface BundleSizeConfig {
  maxMainBundleSize: number; // in KB
  maxVendorBundleSize: number; // in KB
  maxTotalBundleSize: number; // in KB
}

const BUNDLE_SIZE_LIMITS: BundleSizeConfig = {
  maxMainBundleSize: 500, // 500KB
  maxVendorBundleSize: 1000, // 1MB
  maxTotalBundleSize: 2000 // 2MB
};

function getFileSizeInKB(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return Math.round(stats.size / 1024);
  } catch (error) {
    console.warn(`Could not get size for ${filePath}: ${error}`);
    return 0;
  }
}

function analyzeBundleSize(): { success: boolean; errors: string[]; warnings: string[] } {
  const result = {
    success: true,
    errors: [] as string[],
    warnings: [] as string[]
  };

  console.log('📦 Analyzing bundle size...');

  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    result.errors.push('dist directory not found. Run "npm run build" first.');
    return result;
  }

  const files = fs.readdirSync(distDir);
  let totalSize = 0;
  let mainBundleSize = 0;
  let vendorBundleSize = 0;

  for (const file of files) {
    if (file.endsWith('.js') || file.endsWith('.css')) {
      const filePath = path.join(distDir, file);
      const size = getFileSizeInKB(filePath);
      totalSize += size;

      if (file.includes('main') || file.includes('index')) {
        mainBundleSize += size;
      } else if (file.includes('vendor') || file.includes('chunk')) {
        vendorBundleSize += size;
      }

      console.log(`  ${file}: ${size}KB`);
    }
  }

  console.log(`\n📊 Bundle Size Summary:`);
  console.log(`  Main Bundle: ${mainBundleSize}KB`);
  console.log(`  Vendor Bundle: ${vendorBundleSize}KB`);
  console.log(`  Total: ${totalSize}KB`);

  // Check against limits
  if (mainBundleSize > BUNDLE_SIZE_LIMITS.maxMainBundleSize) {
    result.errors.push(
      `Main bundle size (${mainBundleSize}KB) exceeds limit (${BUNDLE_SIZE_LIMITS.maxMainBundleSize}KB)`
    );
    result.success = false;
  }

  if (vendorBundleSize > BUNDLE_SIZE_LIMITS.maxVendorBundleSize) {
    result.errors.push(
      `Vendor bundle size (${vendorBundleSize}KB) exceeds limit (${BUNDLE_SIZE_LIMITS.maxVendorBundleSize}KB)`
    );
    result.success = false;
  }

  if (totalSize > BUNDLE_SIZE_LIMITS.maxTotalBundleSize) {
    result.errors.push(
      `Total bundle size (${totalSize}KB) exceeds limit (${BUNDLE_SIZE_LIMITS.maxTotalBundleSize}KB)`
    );
    result.success = false;
  }

  // Warnings for approaching limits
  if (mainBundleSize > BUNDLE_SIZE_LIMITS.maxMainBundleSize * 0.8) {
    result.warnings.push(
      `Main bundle size (${mainBundleSize}KB) is approaching limit (${BUNDLE_SIZE_LIMITS.maxMainBundleSize}KB)`
    );
  }

  if (vendorBundleSize > BUNDLE_SIZE_LIMITS.maxVendorBundleSize * 0.8) {
    result.warnings.push(
      `Vendor bundle size (${vendorBundleSize}KB) is approaching limit (${BUNDLE_SIZE_LIMITS.maxVendorBundleSize}KB)`
    );
  }

  return result;
}

// Run bundle size check
function main() {
  const result = analyzeBundleSize();

  console.log('\n📊 Bundle Size Check Results:');
  
  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`  - ${error}`));
  }

  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`  - ${warning}`));
  }

  if (result.success) {
    console.log('\n✅ Bundle size check passed!');
    process.exit(0);
  } else {
    console.log('\n❌ Bundle size check failed!');
    console.log('\n💡 Suggestions:');
    console.log('  - Use code splitting with React.lazy()');
    console.log('  - Optimize images and assets');
    console.log('  - Remove unused dependencies');
    console.log('  - Use dynamic imports for heavy libraries');
    process.exit(1);
  }
}

main(); 