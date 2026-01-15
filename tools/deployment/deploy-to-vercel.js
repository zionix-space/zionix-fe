#!/usr/bin/env node

const { execSync } = require("child_process");
const path = require("path");

/**
 * Deploy to Vercel Script
 * 
 * This script builds and deploys apps to Vercel with the specified environment.
 * 
 * Usage:
 *   node deploy-to-vercel.js <environment> <module> [--prod]
 * 
 * Examples:
 *   node deploy-to-vercel.js dev adminApp
 *   node deploy-to-vercel.js production zionix-main-host --prod
 */

function deployToVercel(environment, module, isProduction = false) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🚀 Vercel Deployment Script                               ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${environment.toUpperCase().padEnd(44)}║
║  Module: ${module.padEnd(49)}║
║  Production: ${(isProduction ? "YES" : "NO").padEnd(45)}║
╚════════════════════════════════════════════════════════════╝
    `);

    try {
        // Step 1: Build the module
        console.log("📦 Step 1: Building module...\n");
        const buildCommand = `node tools/deployment/zionix-main.build.script.config.js ${environment} ${module}`;
        execSync(buildCommand, { stdio: "inherit" });

        // Step 2: Determine output directory
        console.log("\n📂 Step 2: Locating build output...");
        let outputDir;

        if (module === "zionix-main-host") {
            outputDir = "dist/platform/shell/main-shell/zionix-main-host";
        } else {
            // For remote apps, we need to find them in domains
            const fs = require("fs");
            const domainsPath = path.resolve("domains");
            const domains = fs.readdirSync(domainsPath);

            // Convert camelCase to kebab-case for directory lookup
            const moduleKebab = module.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

            for (const domain of domains) {
                // Try both original name and kebab-case version
                const possiblePaths = [
                    path.join("dist", "domains", domain, "apps", module),
                    path.join("dist", "domains", domain, "apps", moduleKebab)
                ];

                for (const possiblePath of possiblePaths) {
                    if (fs.existsSync(possiblePath)) {
                        outputDir = possiblePath;
                        break;
                    }
                }

                if (outputDir) break;
            }

            if (!outputDir) {
                throw new Error(`Could not find build output for ${module}. Tried: ${module}, ${moduleKebab}`);
            }
        }

        console.log(`✅ Found build output: ${outputDir}`);

        // Step 3: Load Vercel URLs configuration
        console.log("\n🔗 Step 3: Loading Vercel project configuration...");
        const fs = require("fs");
        const vercelUrlsPath = path.resolve("tools/deployment/vercel-urls.json");
        const vercelUrls = JSON.parse(fs.readFileSync(vercelUrlsPath, "utf8"));

        const config = vercelUrls[module];
        if (!config) {
            throw new Error(`No Vercel configuration found for ${module} in vercel-urls.json`);
        }

        // Support both old format (string) and new format (object)
        const targetUrl = typeof config === 'string' ? config : config.url;
        const projectName = typeof config === 'string'
            ? config.replace("https://", "").replace(".vercel.app", "")
            : config.projectName;

        if (!targetUrl || !projectName) {
            throw new Error(`Invalid Vercel configuration for ${module} in vercel-urls.json`);
        }

        console.log(`✅ Target project: ${projectName} (${targetUrl})`);

        // Step 4: Deploy to Vercel
        console.log("\n🚀 Step 4: Deploying to Vercel...\n");
        const prodFlag = isProduction ? "--prod" : "";
        const deployCommand = `vercel ${outputDir} --name ${projectName} ${prodFlag} --yes`;

        console.log(`🔧 Executing: ${deployCommand}\n`);
        execSync(deployCommand, { stdio: "inherit" });

        console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ Deployment Completed Successfully!                     ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${environment.toUpperCase().padEnd(44)}║
║  Module: ${module.padEnd(49)}║
║  Project: ${projectName.padEnd(48)}║
║  URL: ${targetUrl.padEnd(53)}║
╚════════════════════════════════════════════════════════════╝
        `);

        if (!isProduction) {
            console.log("\n💡 Tip: Use --prod flag to deploy to production");
        }

    } catch (error) {
        console.error(`
╔════════════════════════════════════════════════════════════╗
║  ❌ Deployment Failed!                                     ║
╚════════════════════════════════════════════════════════════╝
        `);
        console.error("Error:", error.message);
        process.exit(1);
    }
}

// Main script execution
if (require.main === module) {
    const environment = process.argv[2];
    const module = process.argv[3];
    const isProduction = process.argv.includes("--prod");

    // Validate arguments
    if (!environment || !module) {
        console.error(`
❌ Missing required arguments!

Usage:
  node deploy-to-vercel.js <environment> <module> [--prod]

Arguments:
  environment    Environment to build with (dev, qa, production)
  module         Module to deploy (zionix-main-host, adminApp, etc.)
  --prod         Optional: Deploy to production (default: preview)

Examples:
  node deploy-to-vercel.js dev adminApp
  node deploy-to-vercel.js production zionix-main-host --prod
        `);
        process.exit(1);
    }

    // Validate environment
    const validEnvs = ["dev", "qa", "production"];
    if (!validEnvs.includes(environment)) {
        console.error(`❌ Invalid environment: ${environment}`);
        console.error(`Valid environments: ${validEnvs.join(", ")}`);
        process.exit(1);
    }

    deployToVercel(environment, module, isProduction);
}

module.exports = { deployToVercel };
