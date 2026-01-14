/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// Load Vercel URLs from external JSON file
function loadVercelUrls() {
    const vercelUrlsPath = path.resolve(__dirname, "vercel-urls.json");

    if (!fs.existsSync(vercelUrlsPath)) {
        console.error(`❌ vercel-urls.json not found at ${vercelUrlsPath}`);
        console.error("Please create vercel-urls.json with your Vercel deployment URLs");
        process.exit(1);
    }

    try {
        const vercelUrls = JSON.parse(fs.readFileSync(vercelUrlsPath, "utf-8"));
        console.log(`✅ Loaded Vercel URLs from vercel-urls.json`);
        return vercelUrls;
    } catch (error) {
        console.error(`❌ Error reading vercel-urls.json:`, error.message);
        process.exit(1);
    }
}

// Load shared dependencies from external JSON file
function loadSharedDependencies() {
    const packageJsonPath = path.resolve(__dirname, "../../package.json");

    if (!fs.existsSync(packageJsonPath)) {
        console.error(`❌ package.json not found`);
        return null;
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

        // Check if moduleFederation.shared exists
        if (!packageJson.moduleFederation || !packageJson.moduleFederation.shared) {
            console.warn(`⚠️  No moduleFederation.shared config found in package.json`);
            return null;
        }

        // Build shared dependencies with versions from package.json
        const sharedDeps = {};
        const sharedPackages = packageJson.moduleFederation.shared;

        // Handle both array of strings and array of objects
        sharedPackages.forEach(pkg => {
            const packageName = typeof pkg === 'string' ? pkg : pkg.name;
            const version = packageJson.dependencies[packageName] || packageJson.devDependencies[packageName];

            if (version) {
                sharedDeps[packageName] = {
                    singleton: true,  // Default: singleton for all shared packages
                    eager: true,      // Default: eager loading
                    requiredVersion: version
                };
            } else {
                console.warn(`⚠️  Package ${packageName} not found in dependencies, skipping`);
            }
        });

        console.log(`✅ Loaded ${Object.keys(sharedDeps).length} shared packages from package.json`);
        return sharedDeps;
    } catch (error) {
        console.error(`❌ Error reading package.json:`, error.message);
        return null;
    }
}

// Generate shared dependencies function code
function generateSharedFunction(sharedDeps) {
    if (!sharedDeps) {
        return `return undefined;`;
    }

    const conditions = Object.entries(sharedDeps).map(([packageName, config]) => {
        return `    if (name === '${packageName}') {
      return ${JSON.stringify(config, null, 6)};
    }`;
    }).join('\n');

    return `${conditions}
    return undefined;`;
}

// Function to get modules from all domains dynamically
function getRelevantModules() {
    const domainsPath = path.resolve("domains");

    if (!fs.existsSync(domainsPath)) {
        console.error(`❌ Domains directory not found: ${domainsPath}`);
        process.exit(1);
    }

    const allModules = [];
    const domains = fs.readdirSync(domainsPath);
    const foundApps = [];

    // Scan each domain for apps
    domains.forEach((domain) => {
        const domainPath = path.join(domainsPath, domain);

        // Skip if not a directory
        if (!fs.statSync(domainPath).isDirectory()) {
            return;
        }

        const appsPath = path.join(domainPath, "apps");

        // Check if domain has an apps folder
        if (fs.existsSync(appsPath) && fs.statSync(appsPath).isDirectory()) {
            const apps = fs.readdirSync(appsPath);

            apps.forEach((app) => {
                const appPath = path.join(appsPath, app);

                // Skip if not a directory or if it's an e2e test or host app
                if (
                    !fs.statSync(appPath).isDirectory() ||
                    app.endsWith("-e2e") ||
                    app === "zionix"
                ) {
                    return;
                }

                // Read actual project name from project.json
                const projectJsonPath = path.join(appPath, "project.json");

                if (fs.existsSync(projectJsonPath)) {
                    try {
                        const projectJson = JSON.parse(
                            fs.readFileSync(projectJsonPath, "utf-8")
                        );
                        const projectName = projectJson.name || app;
                        allModules.push({
                            name: projectName,
                            domain: domain,
                            app: app,
                            path: appPath,
                        });
                        foundApps.push(`${projectName} (${domain})`);
                    } catch (error) {
                        console.warn(
                            `⚠️  Warning: Could not read project.json for ${app}, using folder name`
                        );
                        allModules.push({
                            name: app,
                            domain: domain,
                            app: app,
                            path: appPath,
                        });
                        foundApps.push(`${app} (${domain})`);
                    }
                } else {
                    console.warn(
                        `⚠️  Warning: project.json not found for ${app}, using folder name`
                    );
                    allModules.push({
                        name: app,
                        domain: domain,
                        app: app,
                        path: appPath,
                    });
                    foundApps.push(`${app} (${domain})`);
                }
            });
        }
    });

    console.log(`🔍 Scanned ${domains.length} domains`);
    if (foundApps.length > 0) {
        console.log(`📱 Found apps: ${foundApps.join(", ")}`);
    }
    console.log(`🎯 Total modules: ${allModules.length}`);

    return allModules.map((module) => module.name);
}

// Generate remote configuration with production URLs from vercel-urls.json
function generateRemoteConfig(environment, targetModule = null) {
    const relevantModules = getRelevantModules();
    const outputPath = path.resolve(__dirname, "zionix-main.modules.json");
    fs.writeFileSync(outputPath, JSON.stringify(relevantModules, null, 2));

    if (relevantModules.length === 0) {
        console.error("❌ No relevant modules found.");
        process.exit(1);
    }

    // Load Vercel URLs from external file
    const vercelUrls = loadVercelUrls();

    // Load shared dependencies from external file
    const sharedDeps = loadSharedDependencies();

    // Build remotes array with production URLs from vercel-urls.json
    // Note: authApp is excluded as it's bundled with the host shell
    const remotes = relevantModules
        .filter(module => module !== 'authApp') // Exclude authApp - it's bundled with host
        .map((module) => {
            const moduleUrl = vercelUrls[module];

            if (!moduleUrl) {
                console.warn(`⚠️  Warning: No Vercel URL found for ${module} in vercel-urls.json`);
                console.warn(`⚠️  Using fallback URL: https://${module}.vercel.app`);
                return [module, `https://${module}.vercel.app/remoteEntry.js`];
            }

            return [module, `${moduleUrl}/remoteEntry.js`];
        });

    const remotesConfigPath = path.resolve(
        "platform/shell/main-shell/zionix-main-host/module-federation.config.js"
    );

    // Generate shared function code
    const sharedFunctionBody = generateSharedFunction(sharedDeps);

    // Create module federation config with shared dependencies
    const remotesConfigContent = `module.exports = {
  name: 'zionix-main-host',
  remotes: ${JSON.stringify(remotes, null, 4)},
};
`;

    fs.writeFileSync(remotesConfigPath, remotesConfigContent, "utf-8");
    console.log(`✅ Module federation config updated`);
    console.log(`📝 Remotes configured: ${remotes.map(r => r[0]).join(", ")}`);
    if (relevantModules.includes('authApp')) {
        console.log(`ℹ️  Note: authApp is bundled with host shell (not a remote)`);
    }
}

// Update appRouter.jsx with dynamic module loading
function updateAppJs() {
    const appJsPath = path.resolve(
        "platform/shell/main-shell/zionix-main-host/src/app/appRouter.jsx"
    );

    if (!fs.existsSync(appJsPath)) {
        console.warn(`⚠️  Warning: appRouter.jsx not found at ${appJsPath}`);
        return;
    }

    let appJsContent = fs.readFileSync(appJsPath, "utf-8");
    const relevantModules = require("./zionix-main.modules.json");

    // Define new cases to add
    const newCases = relevantModules
        .map((moduleName) => {
            return `      case '${moduleName}':\n        ModuleComponent = React.lazy(() => import('${moduleName}/Module'));\n        break;`;
        })
        .join("\n");

    // Regex to find the switch statement and its cases
    const switchRegex =
        /switch\s*\(\s*moduleName\s*\)\s*{([\s\S]*?)(\s*default:)/;

    if (switchRegex.test(appJsContent)) {
        appJsContent = appJsContent.replace(
            switchRegex,
            `switch (moduleName) {\n${newCases}\n$2`
        );
    } else {
        console.warn(`⚠️  Warning: Could not find switch statement in appRouter.jsx`);
    }

    fs.writeFileSync(appJsPath, appJsContent, "utf-8");
    console.log(`✅ appRouter.jsx updated with module cases`);
}

// Build function
function buildApp(env, targetModule = null) {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║  🏗️  Zionix Build System                                   ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${env.toUpperCase().padEnd(44)}║
║  Target: ${(targetModule || "ALL MODULES").padEnd(49)}║
╚════════════════════════════════════════════════════════════╝
  `);

    // Load Vercel URLs for displaying deployment links
    const vercelUrls = loadVercelUrls();

    // Step 1: Generate remote configuration
    console.log("📋 Step 1: Generating module federation configuration...");
    generateRemoteConfig(env, targetModule);

    // Step 2: Update appRouter.jsx
    console.log("📋 Step 2: Updating appRouter.jsx...");
    updateAppJs();

    // Step 3: Build the application
    console.log("📋 Step 3: Building application...");

    let buildCommand = "";
    const envPrefix = `env-cmd -f .env-cmdrc -e ${env}`;

    // Nx optimization flags for production builds
    const nxFlags = [
        '--skip-nx-cache',           // Skip Nx cache for fresh production build
        '--verbose',                 // Show detailed build output
        '--parallel=3',              // Run 3 builds in parallel
        '--maxParallel=3',           // Maximum parallel processes
        '--output-style=stream'      // Stream output for better visibility
    ].join(' ');

    if (targetModule) {
        // Build specific module
        buildCommand = `${envPrefix} nx run ${targetModule}:build --configuration=production ${nxFlags}`;
        console.log(`🎯 Building ${targetModule}...`);
    } else {
        // Build all modules
        buildCommand = `${envPrefix} nx run-many --target=build --configuration=production --all ${nxFlags}`;
        console.log(`🎯 Building all modules...`);
    }

    try {
        console.log(`🔧 Executing: ${buildCommand}\n`);
        execSync(buildCommand, { stdio: "inherit" });

        // Get deployment URL for the target module
        let deploymentInfo = "";
        if (targetModule && vercelUrls[targetModule]) {
            deploymentInfo = `║  Deployment URL: ${vercelUrls[targetModule].padEnd(38)}║`;
        } else if (targetModule) {
            deploymentInfo = `║  Deployment URL: Not configured in vercel-urls.json       ║`;
        } else {
            deploymentInfo = `║  Deployment URLs: Check vercel-urls.json                  ║`;
        }

        console.log(`
╔════════════════════════════════════════════════════════════╗
║  ✅ Build Completed Successfully!                          ║
╠════════════════════════════════════════════════════════════╣
║  Environment: ${env.toUpperCase().padEnd(44)}║
║  Target: ${(targetModule || "ALL MODULES").padEnd(49)}║
║  Output: dist/                                             ║
${deploymentInfo}
╚════════════════════════════════════════════════════════════╝
    `);
    } catch (error) {
        console.error(`
╔════════════════════════════════════════════════════════════╗
║  ❌ Build Failed!                                          ║
╚════════════════════════════════════════════════════════════╝
    `);
        console.error("Error:", error.message);
        process.exit(1);
    }
}

// Main script execution
if (require.main === module) {
    const env = process.argv[2] || "dev"; // Default to 'dev'
    const targetModule = process.argv[3] || null; // Optional: specific module to build

    // Validate environment
    const validEnvs = ["dev", "qa", "production"];
    if (!validEnvs.includes(env)) {
        console.error(`❌ Invalid environment: ${env}`);
        console.error(`Valid environments: ${validEnvs.join(", ")}`);
        process.exit(1);
    }

    buildApp(env, targetModule);
}

module.exports = { buildApp, generateRemoteConfig, updateAppJs };
