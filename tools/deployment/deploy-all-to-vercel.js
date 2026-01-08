#!/usr/bin/env node

/**
 * Deploy All Micro Frontends to Vercel
 * 
 * This script deploys all micro frontends in the correct order:
 * 1. Remote apps first (authApp, adminApp)
 * 2. Host app last (zionix-main-host)
 * 
 * Usage: node tools/deployment/deploy-all-to-vercel.js [--production]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = process.argv.includes('--production') || process.argv.includes('--prod');
const deployFlag = isProduction ? '--prod' : '';

console.log('🚀 Deploying All Micro Frontends to Vercel');
console.log(`📦 Mode: ${isProduction ? 'PRODUCTION' : 'PREVIEW'}\n`);

// Apps to deploy in order (remotes first, host last)
const apps = [
    {
        name: 'authApp',
        displayName: 'Authentication App',
        distPath: 'dist/platform/core/authentication',
        skip: false // Set to true if build is broken
    },
    {
        name: 'adminApp',
        displayName: 'Admin App',
        distPath: 'dist/domains/operations/apps/admin-app',
        skip: false
    },
    {
        name: 'zionix-main-host',
        displayName: 'Main Host',
        distPath: 'dist/platform/shell/main-shell/zionix-main-host',
        skip: false
    }
];

const deployedUrls = {};
let failedApps = [];

for (const app of apps) {
    if (app.skip) {
        console.log(`⏭️  Skipping ${app.displayName} (marked as skip)\n`);
        continue;
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 Deploying: ${app.displayName}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
        // Build the app
        console.log(`🔨 Building ${app.name}...`);
        execSync(`npx nx build ${app.name} --configuration=production`, {
            stdio: 'inherit',
            cwd: path.join(__dirname, '../..')
        });

        // Check if dist exists
        const distPath = path.join(__dirname, '../..', app.distPath);
        if (!fs.existsSync(distPath)) {
            throw new Error(`Build output not found at ${distPath}`);
        }

        console.log(`\n✅ Build successful for ${app.name}`);
        console.log(`📁 Output: ${app.distPath}`);

        // Deploy to Vercel
        console.log(`\n🚀 Deploying to Vercel...`);
        const deployCommand = `vercel ${deployFlag} --yes`;

        const output = execSync(deployCommand, {
            cwd: distPath,
            encoding: 'utf8'
        });

        // Extract URL from output
        const urlMatch = output.match(/https:\/\/[^\s]+/);
        if (urlMatch) {
            deployedUrls[app.name] = urlMatch[0];
            console.log(`\n✅ ${app.displayName} deployed successfully!`);
            console.log(`🔗 URL: ${deployedUrls[app.name]}`);
        }

    } catch (error) {
        console.error(`\n❌ Failed to deploy ${app.displayName}`);
        console.error(`Error: ${error.message}`);
        failedApps.push(app.name);
    }
}

// Summary
console.log(`\n\n${'='.repeat(60)}`);
console.log('📊 DEPLOYMENT SUMMARY');
console.log(`${'='.repeat(60)}\n`);

if (Object.keys(deployedUrls).length > 0) {
    console.log('✅ Successfully Deployed:\n');
    Object.entries(deployedUrls).forEach(([name, url]) => {
        console.log(`   ${name}: ${url}`);
    });
}

if (failedApps.length > 0) {
    console.log(`\n❌ Failed Deployments: ${failedApps.join(', ')}`);
}

console.log(`\n📝 Next Steps:`);
console.log(`   1. Update Module Federation manifest with deployed URLs`);
console.log(`   2. Test the host app with remote URLs`);
console.log(`   3. Verify PWA functionality`);

process.exit(failedApps.length > 0 ? 1 : 0);
