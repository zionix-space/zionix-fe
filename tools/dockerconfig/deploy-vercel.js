#!/usr/bin/env node

/**
 * Universal Vercel Deployment Script
 * Deploys any app in the workspace to Vercel
 * Usage: node deploy-vercel.js <app-name>
 * Example: node deploy-vercel.js zionix-main-host
 * Example: node deploy-vercel.js adminApp
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get app name from command line arguments
const appName = process.argv[2];

if (!appName) {
  console.error('❌ Please provide an app name');
  console.log('Usage: node deploy-vercel.js <app-name>');
  console.log('Example: node deploy-vercel.js zionix-main-host');
  console.log('Example: node deploy-vercel.js adminApp');
  process.exit(1);
}

console.log(`🚀 Deploying ${appName} to Vercel...`);

try {
  // Build the application
  console.log('📦 Building application...');
  execSync(`npx nx build ${appName} --prod`, { stdio: 'inherit' });

  // Check if dist folder exists
  const distPath = path.join(process.cwd(), '..', '..', 'dist', appName);
  if (!fs.existsSync(distPath)) {
    throw new Error(`Build output not found at ${distPath}`);
  }

  // Create vercel.json for this deployment
  const vercelConfig = {
    version: 2,