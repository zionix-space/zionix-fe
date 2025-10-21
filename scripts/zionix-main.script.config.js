const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to get modules from the apps/hp_main directory
function getRelevantModules() {
  const zionixMainPath = path.resolve('apps/remoteApps/zionix-main-remotes');
  console.log(`Scanning directory: ${zionixMainPath}`);

  if (!fs.existsSync(zionixMainPath)) {
    console.error(`Directory not found: ${zionixMainPath}`);
    process.exit(1);
  }

  const allProjects = fs.readdirSync(zionixMainPath);

  // Filter to include only main modules (excluding e2e and hpshell)
  return allProjects.filter((project) => {
    const projectPath = path.join(zionixMainPath, project);
    return (
      fs.statSync(projectPath).isDirectory() &&
      !project.endsWith('-e2e') && // Exclude E2E files
      project !== 'hpshell'
    ); // Exclude the host file
  });
}

// Function to rename authModule to mainAuthApp
function renameModule(module) {
  return module === 'authModule' ? 'mainAuthApp' : module;
}

// Generate remote configuration
function generateRemoteConfig(environment) {
  const relevantModules = getRelevantModules().map(renameModule);
  const outputPath = path.resolve(__dirname, 'zionix-main.modules.json');
  fs.writeFileSync(outputPath, JSON.stringify(relevantModules, null, 2));

  if (relevantModules.length === 0) {
    console.error('No relevant modules found in apps/hp_main.');
    process.exit(1);
  }

  const remotes = relevantModules.map((module) => module);
  const remotesConfigPath = path.resolve(
    'apps/hostApps/zionix-main-host/module-federation.config.js'
  );

  // Create or update the configuration file with the current remotes
  const remotesConfigContent = `module.exports = {
    name: 'zionix-main-host',
    remotes: ${JSON.stringify(remotes)}
  };`;

  fs.writeFileSync(remotesConfigPath, remotesConfigContent, 'utf-8');
}

function updateAppJs() {
  const appJsPath = path.resolve(
    'apps/hostApps/zionix-main-host/src/app/app.jsx'
  );
  let appJsContent = fs.readFileSync(appJsPath, 'utf-8');
  const relevantModules = require('./zionix-main.modules.json');

  // Define new cases to add
  const newCases = relevantModules
    .map((moduleName) => {
      return `      case '${moduleName}':\n        ModuleComponent = React.lazy(() => import('${moduleName}/Module'));\n        break;`;
    })
    .join('\n');

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
  fs.writeFileSync(appJsPath, appJsContent, 'utf-8');
}

// Start server or build based on environment
function startEnvServer(env) {
  generateRemoteConfig(env);
  updateAppJs(); // Update App.js with new cases

  const relevantModules = getRelevantModules().map(renameModule);
  const devRemotes = relevantModules.join(',');
  console.log(
    `
    host : zionix-main-host \n
    ${env.charAt(0).toUpperCase() + env.slice(1)} RemoteApps:`,
    devRemotes
  );

  let command = '';

  switch (env) {
    case 'dev':
      command = `env-cmd -f .env-cmdrc -e dev nx run zionix-main-host:serve --devRemotes=${devRemotes} --hmr=true `;
      break;
    case 'qa':
      command = `env-cmd -f .env-cmdrc -e qa nx run zionix-main-host:serve --hmr=true --devRemotes=${devRemotes} --liveReload=true`;
      break;
    default:
      console.error(
        'Invalid environment. Please specify "dev", "qa", "demo", or "setup".'
      );
      process.exit(1);
  }

  // Execute the Nx command with the relevant modules
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error('Error executing Nx command:', error.message);
    process.exit(1);
  }
}

// Main script execution
if (require.main === module) {
  const env = process.argv[2] || 'dev'; // Default to 'dev' if no argument provided
  startEnvServer(env);
}
