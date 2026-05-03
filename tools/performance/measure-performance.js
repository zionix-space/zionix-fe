#!/usr/bin/env node

/**
 * Performance Measurement Script
 * Measures key performance metrics for the Zionix application
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════════╗
║  📊 Zionix Performance Measurement Tool                   ║
╚════════════════════════════════════════════════════════════╝
`);

// Check if app is running
function checkAppRunning() {
    try {
        const http = require('http');
        return new Promise((resolve) => {
            const req = http.get('http://localhost:4200', (res) => {
                resolve(res.statusCode === 200);
            });
            req.on('error', () => resolve(false));
            req.setTimeout(2000, () => {
                req.destroy();
                resolve(false);
            });
        });
    } catch {
        return Promise.resolve(false);
    }
}

// Measure bundle sizes
function measureBundleSizes() {
    console.log('\n📦 Measuring Bundle Sizes...\n');

    const distPath = path.resolve('dist/platform/shell/main-shell/zionix-main-host');

    if (!fs.existsSync(distPath)) {
        console.log('⚠️  No build found. Run: npm run build-zionix-main dev zionix-main-host');
        return;
    }

    const files = fs.readdirSync(distPath);
    const jsFiles = files.filter(f => f.endsWith('.js'));
    const cssFiles = files.filter(f => f.endsWith('.css'));

    let totalSize = 0;
    const fileSizes = [];

    [...jsFiles, ...cssFiles].forEach(file => {
        const filePath = path.join(distPath, file);
        const stats = fs.statSync(filePath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        totalSize += stats.size;
        fileSizes.push({ file, size: sizeKB });
    });

    // Sort by size
    fileSizes.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));

    console.log('Top 10 Largest Files:');
    fileSizes.slice(0, 10).forEach(({ file, size }) => {
        const bar = '█'.repeat(Math.min(50, Math.floor(size / 10)));
        console.log(`  ${file.padEnd(40)} ${size.padStart(8)} KB ${bar}`);
    });

    console.log(`\n  Total Bundle Size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`  Total Files: ${fileSizes.length}`);

    // Performance budget check
    const budgetKB = 500;
    const totalKB = totalSize / 1024;
    if (totalKB > budgetKB) {
        console.log(`\n  ⚠️  WARNING: Bundle exceeds ${budgetKB}KB budget by ${(totalKB - budgetKB).toFixed(2)}KB`);
    } else {
        console.log(`\n  ✅ Bundle is within ${budgetKB}KB budget`);
    }
}

// Analyze module federation manifest
function analyzeManifest() {
    console.log('\n🔗 Analyzing Module Federation...\n');

    const manifestPath = path.resolve('dist/platform/shell/main-shell/zionix-main-host/assets/module-federation.manifest.json');

    if (!fs.existsSync(manifestPath)) {
        console.log('⚠️  Manifest not found');
        return;
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

    console.log('  Remote Applications:');
    Object.entries(manifest).forEach(([name, url]) => {
        console.log(`    • ${name}: ${url}`);
    });
}

// Check shared dependencies configuration
function checkSharedDeps() {
    console.log('\n📚 Checking Shared Dependencies...\n');

    const configPath = path.resolve('platform/shell/main-shell/zionix-main-host/module-federation.config.js');

    if (!fs.existsSync(configPath)) {
        console.log('⚠️  Config not found');
        return;
    }

    const config = require(path.resolve(configPath));

    // Test shared function
    const testPackages = ['react', 'react-dom', 'framer-motion'];

    console.log('  Shared Package Configuration:');
    testPackages.forEach(pkg => {
        const sharedConfig = config.shared(pkg);
        if (sharedConfig) {
            const eagerStatus = sharedConfig.eager ? '⚡ EAGER' : '💤 LAZY';
            console.log(`    • ${pkg.padEnd(20)} ${eagerStatus}  singleton: ${sharedConfig.singleton}`);
        }
    });
}

// Performance recommendations
function showRecommendations() {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  💡 Performance Recommendations                            ║
╚════════════════════════════════════════════════════════════╝

1. Font Loading:
   ✅ Load only 400 & 600 weights initially
   ✅ Lazy load other weights after render

2. Module Federation:
   ✅ Make React/React-DOM eager in development
   ⚠️  Keep other deps lazy to reduce initial bundle

3. Animations:
   ✅ Use 150ms transitions (not 500ms)
   ⚠️  Disable animations for internal navigation

4. Code Splitting:
   ✅ Enable chunk splitting in development
   ✅ Use route-based lazy loading

5. Network:
   ✅ Add preconnect hints for remote apps
   ✅ Preload critical resources

6. Monitoring:
   📊 Run lighthouse: npm run perf:audit
   📊 Check bundle: npm run perf:bundle-analyze

`);
}

// Main execution
async function main() {
    const isRunning = await checkAppRunning();

    if (!isRunning) {
        console.log('⚠️  App is not running on http://localhost:4200');
        console.log('   Start it with: npm run start-zionix-main\n');
    } else {
        console.log('✅ App is running on http://localhost:4200\n');
    }

    measureBundleSizes();
    analyzeManifest();
    checkSharedDeps();
    showRecommendations();

    console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ Performance Analysis Complete                          ║
╚════════════════════════════════════════════════════════════╝
`);
}

main().catch(console.error);
