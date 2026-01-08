#!/usr/bin/env node

/**
 * Deploy to Vercel and Show URLs
 * 
 * This script deploys your apps and displays the URLs clearly.
 * 
 * Usage: node tools/deployment/deploy-and-show-urls.js <app-name>
 * Example: node tools/deployment/deploy-and-show-urls.js adminApp
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appName = process.argv[2];

if (!appName) {
    console.log('🚀 Deploy to Vercel and Get URLs\n');
    console.log('Usage: node tools/deployment/deploy-and-show-urls.js <app-name>\n');
    console.log('Available apps:');
    console.log('  - adminApp');
    console.log('  - zionix-main-host');
    console.log('  - authApp\n');
    console.log('Example:');
    console.log('  node tools/deployment/deploy-and-show-urls.js adminApp');
    process.exit(1);
}

// App configurations
const appConfigs = {
    'adminApp': {
        distPath: 'dist/domains/operations/apps/admin-app',
        displayName: 'Admin App'
    },
    'zionix-main-host': {
        distPath: 'dist/platform/shell/main-shell/zionix-main-host',
        displayName: 'Main Host'
    },
    'authApp': {
        distPath: 'dist/platform/core/authentication',
        displayName: 'Auth App'
    }
};

const config = appConfigs[appName];

if (!config) {
    console.error(`❌ Unknown app: ${appName}`);
    console.log('Available apps: adminApp, zionix-main-host, authApp');
    process.exit(1);
}

console.log(`\n${'='.repeat(60)}`);
console.log(`🚀 Deploying ${config.displayName} to Vercel`);
console.log(`${'='.repeat(60)}\n`);

try {
    // Step 1: Build
    console.log('📦 Step 1: Building application...\n');
    execSync(`npx nx build ${appName} --configuration=production`, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '../..')
    });

    const distPath = path.join(__dirname, '../..', config.distPath);

    if (!fs.existsSync(distPath)) {
        throw new Error(`Build output not found at ${distPath}`);
    }

    console.log(`\n✅ Build successful!`);
    console.log(`📁 Output: ${config.distPath}\n`);

    // Step 2: Deploy
    console.log('🚀 Step 2: Deploying to Vercel...\n');
    console.log('⏳ This may take a minute...\n');

    const output = execSync('vercel --prod --yes', {
        cwd: distPath,
        encoding: 'utf8'
    });

    // Extract URL from output
    const urlMatch = output.match(/https:\/\/[^\s]+/g);

    if (urlMatch && urlMatch.length > 0) {
        const productionUrl = urlMatch[urlMatch.length - 1]; // Last URL is usually production

        console.log(`\n${'='.repeat(60)}`);
        console.log(`✅ ${config.displayName} Deployed Successfully!`);
        console.log(`${'='.repeat(60)}\n`);

        console.log(`🔗 Production URL:\n`);
        console.log(`   ${productionUrl}\n`);

        // Save URL to file
        const urlsFile = path.join(__dirname, '../..', 'vercel-urls.json');
        let urls = {};

        if (fs.existsSync(urlsFile)) {
            urls = JSON.parse(fs.readFileSync(urlsFile, 'utf8'));
        }

        urls[appName] = {
            url: productionUrl,
            deployedAt: new Date().toISOString(),
            displayName: config.displayName
        };

        fs.writeFileSync(urlsFile, JSON.stringify(urls, null, 2));

        console.log(`💾 URL saved to: vercel-urls.json\n`);

        // Show next steps
        if (appName === 'adminApp' || appName === 'authApp') {
            console.log(`📝 Next Steps:\n`);
            console.log(`1. Copy this URL: ${productionUrl}`);
            console.log(`2. Update Module Federation manifest:`);
            console.log(`   File: platform/shell/main-shell/zionix-main-host/src/assets/module-federation.manifest.json`);
            console.log(`   Add: "${appName}": "${productionUrl}/remoteEntry.js"`);
            console.log(`3. Deploy host: node tools/deployment/deploy-and-show-urls.js zionix-main-host\n`);
        } else if (appName === 'zionix-main-host') {
            console.log(`🎉 Your app is live!\n`);
            console.log(`📱 Test it:\n`);
            console.log(`   1. Visit: ${productionUrl}`);
            console.log(`   2. Wait 3 seconds for PWA install prompt`);
            console.log(`   3. Check if remote modules load\n`);
        }

        // Show all deployed URLs
        console.log(`📊 All Deployed Apps:\n`);
        Object.entries(urls).forEach(([name, data]) => {
            console.log(`   ${data.displayName}: ${data.url}`);
        });
        console.log('');

    } else {
        console.log('\n⚠️  Deployment completed but could not extract URL');
        console.log('Check your Vercel dashboard: https://vercel.com/dashboard\n');
    }

} catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}\n`);

    if (error.message.includes('not found')) {
        console.log('💡 Troubleshooting:');
        console.log('   1. Make sure Vercel CLI is installed: npm install -g vercel');
        console.log('   2. Login to Vercel: vercel login');
        console.log('   3. Try building locally first: npx nx build ' + appName + ' --configuration=production\n');
    }

    process.exit(1);
}
