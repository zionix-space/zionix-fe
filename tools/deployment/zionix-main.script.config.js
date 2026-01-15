const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");

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

  // Show concise summary
  console.log(`🔍 Scanned ${domains.length} domains`);
  if (foundApps.length > 0) {
    console.log(`📱 Found apps: ${foundApps.join(", ")}`);
  }
  console.log(`🎯 Total modules: ${allModules.length}`);

  // Return just the module names for backward compatibility
  return allModules.map((module) => module.name);
}

// Function to rename authModule to mainAuthApp
function renameModule(module) {
  return module === "authModule" ? "mainAuthApp" : module;
}

// Function to check if a remote is ready
function checkRemoteReady(remoteName, port = 4201, maxRetries = 30) {
  return new Promise((resolve, reject) => {
    let retries = 0;

    const checkHealth = () => {
      const req = http.get(`http://localhost:${port}/remoteEntry.js`, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ Remote ${remoteName} is ready on port ${port}`);
          resolve(true);
        } else {
          retryCheck();
        }
      });

      req.on("error", () => {
        retryCheck();
      });

      req.setTimeout(2000, () => {
        req.destroy();
        retryCheck();
      });
    };

    const retryCheck = () => {
      retries++;
      if (retries >= maxRetries) {
        reject(
          new Error(
            `Remote ${remoteName} failed to start after ${maxRetries} attempts`
          )
        );
        return;
      }

      console.log(
        `⏳ Waiting for remote ${remoteName}... (attempt ${retries}/${maxRetries})`
      );
      setTimeout(checkHealth, 2000);
    };

    checkHealth();
  });
}

// Function to find project.json file for a given remote name
function findProjectJsonForRemote(remoteName) {
  const domainsPath = path.resolve("domains");

  if (!fs.existsSync(domainsPath)) {
    return null;
  }

  const domains = fs.readdirSync(domainsPath);

  for (const domain of domains) {
    const domainPath = path.join(domainsPath, domain);

    if (!fs.statSync(domainPath).isDirectory()) {
      continue;
    }

    const appsPath = path.join(domainPath, "apps");

    if (fs.existsSync(appsPath) && fs.statSync(appsPath).isDirectory()) {
      const apps = fs.readdirSync(appsPath);

      for (const app of apps) {
        const appPath = path.join(appsPath, app);

        if (!fs.statSync(appPath).isDirectory()) {
          continue;
        }

        const projectJsonPath = path.join(appPath, "project.json");

        if (fs.existsSync(projectJsonPath)) {
          try {
            const projectJson = JSON.parse(
              fs.readFileSync(projectJsonPath, "utf-8")
            );
            const projectName = projectJson.name || app;

            if (projectName === remoteName) {
              return { projectJson, projectJsonPath };
            }
          } catch (error) {
            // Continue searching if this project.json is invalid
            continue;
          }
        }
      }
    }
  }

  return null;
}

// Function to get port for a remote (dynamically read from project.json)
function getRemotePort(remoteName) {
  const projectInfo = findProjectJsonForRemote(remoteName);

  if (projectInfo && projectInfo.projectJson) {
    const { projectJson } = projectInfo;

    // Try to read port from project.json -> targets -> serve -> options -> port
    if (
      projectJson.targets &&
      projectJson.targets.serve &&
      projectJson.targets.serve.options &&
      projectJson.targets.serve.options.port
    ) {
      const port = projectJson.targets.serve.options.port;
      console.log(`📡 Found port ${port} for ${remoteName} in project.json`);
      return port;
    }
  }

  // Fallback: generate a port based on hash of the name
  console.log(
    `⚠️  No port found in project.json for ${remoteName}, using generated port`
  );
  const hash = remoteName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  return 4250 + (Math.abs(hash) % 50);
}

// Load shared dependencies from package.json
function loadSharedDependencies() {
  const packageJsonPath = path.resolve(__dirname, "../../package.json");

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`❌ package.json not found`);
    return null;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

    if (!packageJson.moduleFederation || !packageJson.moduleFederation.shared) {
      console.warn(`⚠️  No moduleFederation.shared config found in package.json`);
      return null;
    }

    const sharedDeps = {};
    const sharedPackages = packageJson.moduleFederation.shared;

    sharedPackages.forEach(pkg => {
      const packageName = typeof pkg === 'string' ? pkg : pkg.name;
      const version = packageJson.dependencies[packageName] || packageJson.devDependencies[packageName];

      if (version) {
        sharedDeps[packageName] = {
          singleton: true,
          eager: false,  // Use false for dev mode to allow lazy loading
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

// Generate remote configuration
function generateRemoteConfig(environment) {
  const relevantModules = getRelevantModules().map(renameModule);
  const outputPath = path.resolve(__dirname, "zionix-main.modules.json");
  fs.writeFileSync(outputPath, JSON.stringify(relevantModules, null, 2));

  if (relevantModules.length === 0) {
    console.error("No relevant modules found in apps/hp_main.");
    process.exit(1);
  }

  const remotes = relevantModules.map((module) => module);
  const remotesConfigPath = path.resolve(
    "platform/shell/main-shell/zionix-main-host/module-federation.config.js"
  );

  // Load shared dependencies
  const sharedDeps = loadSharedDependencies();
  const sharedFunctionBody = generateSharedFunction(sharedDeps);

  // Create or update the configuration file with the current remotes and shared config
  const remotesConfigContent = `module.exports = {
  name: 'zionix-main-host',
  remotes: ${JSON.stringify(remotes)},
  shared: (name) => {
${sharedFunctionBody}
  },
};`;

  fs.writeFileSync(remotesConfigPath, remotesConfigContent, "utf-8");
  console.log(`✅ Module federation config updated with ${remotes.length} remotes`);
}

function updateAppJs() {
  const appJsPath = path.resolve(
    "platform/shell/main-shell/zionix-main-host/src/app/appRouter.jsx"
  );
  let appJsContent = fs.readFileSync(appJsPath, "utf-8");
  const relevantModules = require("./zionix-main.modules.json");

  // Define new cases to add
  const newCases = relevantModules
    .map((moduleName) => {
      return `      case '${moduleName}':\n        ModuleComponent = React.lazy(() => import('${moduleName}/Module'));\n        break;`;
    })
    .join("\n");

  // Regex to find the switch statement and its cases, without affecting the default case
  const switchRegex =
    /switch\s*\(\s*moduleName\s*\)\s*{([\s\S]*?)(\s*default:)/;
  if (switchRegex.test(appJsContent)) {
    // Remove existing cases and keep the default case intact
    appJsContent = appJsContent.replace(
      switchRegex,
      `switch (moduleName) {\n${newCases}\n$2`
    );
  } else {
    // If no switch statement exists, create a new one
    appJsContent += `
function getModuleComponent(moduleName) {
  let ModuleComponent;

  switch (moduleName) {
${newCases}
    default:
      ModuleComponent = () => <div>Module not found</div>;
  }

  return ModuleComponent;
}
`;
  }

  // Write the updated content back to App.js
  fs.writeFileSync(appJsPath, appJsContent, "utf-8");
}

// Start server or build based on environment
async function startEnvServer(env) {
  generateRemoteConfig(env);
  updateAppJs(); // Update App.js with new cases

  const relevantModules = getRelevantModules().map(renameModule);
  const devRemotes = relevantModules.join(",");
  console.log(
    `
    🚀 Starting Zionix Main Host Application
    Host: zionix-main-host
    Environment: ${env.charAt(0).toUpperCase() + env.slice(1)}
    Remote Apps: ${devRemotes}
    `
  );

  let command = "";
  let envPrefix = "";

  switch (env) {
    case "dev":
      envPrefix = "env-cmd -f .env-cmdrc -e dev";
      command = `nx run zionix-main-host:serve --devRemotes=${devRemotes} --hmr=true`;
      break;
    case "qa":
      envPrefix = "env-cmd -f .env-cmdrc -e qa";
      command = `nx run zionix-main-host:serve --hmr=true --devRemotes=${devRemotes} --liveReload=true`;
      break;
    default:
      console.error(
        'Invalid environment. Please specify "dev", "qa", "demo", or "setup".'
      );
      process.exit(1);
  }

  // Start the application with proper environment and Module Federation handling
  try {
    console.log(`🔧 Executing: ${envPrefix} ${command}`);

    // Use spawn instead of execSync for better process handling
    const fullCommand = `${envPrefix} ${command}`;
    const child = spawn("cmd", ["/c", fullCommand], {
      stdio: "inherit",
      shell: true,
      cwd: process.cwd(),
    });

    // Handle process termination
    process.on("SIGINT", () => {
      console.log("\n🛑 Shutting down...");
      child.kill("SIGINT");
      process.exit(0);
    });

    process.on("SIGTERM", () => {
      console.log("\n🛑 Shutting down...");
      child.kill("SIGTERM");
      process.exit(0);
    });

    child.on("error", (error) => {
      console.error("❌ Error starting application:", error.message);
      process.exit(1);
    });

    child.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Application exited with code ${code}`);
        process.exit(code);
      }
    });
  } catch (error) {
    console.error("❌ Error executing command:", error.message);
    process.exit(1);
  }
}

// Main script execution
if (require.main === module) {
  const env = process.argv[2] || "dev"; // Default to 'dev' if no argument provided

  // Handle async execution
  (async () => {
    try {
      await startEnvServer(env);
    } catch (error) {
      console.error("❌ Failed to start server:", error.message);
      process.exit(1);
    }
  })();
}
