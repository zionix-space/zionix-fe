# Package Update Implementation Guide - Zionix Workspace

## Quick Reference Commands

### Phase 1: Foundation Updates (TypeScript, RSPack, Minor Dependencies)

```bash
# Create backup and update branch
git checkout -b backup/pre-package-updates
git push origin backup/pre-package-updates
git checkout main
git checkout -b feature/package-updates-phase-1

# Update TypeScript
npm install --save-dev typescript@5.7.3

# Update RSPack ecosystem
npm install --save-dev @rspack/cli@1.5.8 @rspack/core@1.5.8 @rspack/dev-server@1.5.8 @rspack/plugin-minify@1.0.0 @rspack/plugin-react-refresh@1.0.0

# Update minor dependencies
npm install --save react-router-dom@6.28.0 tslib@2.8.1

# Test Phase 1
npm run build
npm run start-zionix-main
```

### Phase 2: NX Workspace Migration (Major Update)

```bash
# Create Phase 2 branch
git checkout main
git checkout -b feature/package-updates-phase-2

# Run NX migration (this will update package.json)
npx nx migrate @nx/workspace@21.5.2

# Install updated packages
npm install

# Run migration scripts (if any are generated)
npx nx migrate --run-migrations

# Clean up migration files
rm migrations.json

# Test NX functionality
npx nx build
npx nx test
npx nx lint
```

### Phase 3: Module Federation Enhanced Update

```bash
# Create Phase 3 branch  
git checkout main
git checkout -b feature/package-updates-phase-3

# Update Module Federation Enhanced
npm install --save-dev @module-federation/enhanced@0.20.0

# Test builds with new Module Federation
npm run start-zionix-main
```

### Phase 4: Tooling and Final Updates

```bash
# Create Phase 4 branch
git checkout main  
git checkout -b feature/package-updates-phase-4

# Update ESLint ecosystem
npm install --save-dev @typescript-eslint/eslint-plugin@8.18.2 @typescript-eslint/parser@8.18.2 eslint@9.17.0

# Update Prettier
npm install --save-dev prettier@3.4.2

# Update other development tools
npm install --save-dev @swc/core@1.10.1 @swc/cli@0.5.0 @swc/helpers@0.5.15 @swc/jest@0.2.37

# Update testing libraries
npm install --save-dev @testing-library/react@16.1.0

# Update Node.js types
npm install --save-dev @types/node@22.10.2 @types/react@18.3.17 @types/react-dom@18.3.5

# Final validation
npm run lint:fix
npm run build
npm test
```

## Configuration File Updates

### 1. Update nx.json for NX 21.5.2

```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "master",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.js",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/test-setup.[jt]s"
    ],
    "sharedGlobals": []
  },
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "@nx/eslint:lint": {
      "cache": true,
      "inputs": [
        "default",
        "{workspaceRoot}/.eslintrc.json",
        "{workspaceRoot}/.eslintignore",
        "{workspaceRoot}/eslint.config.js"
      ]
    },
    "@nx/jest:jest": {
      "cache": true,
      "inputs": ["default", "^production", "{workspaceRoot}/jest.preset.js"],
      "options": {
        "passWithNoTests": true
      },
      "configurations": {
        "ci": {
          "ci": true,
          "codeCoverage": true
        }
      }
    },
    "@nx/rspack:rspack": {
      "inputs": [
        "production",
        "^production",
        {
          "env": "NX_MF_DEV_REMOTES"
        }
      ],
      "dependsOn": ["^build"],
      "cache": true
    }
  },
  "generators": {
    "@nx/react": {
      "application": {
        "babel": true,
        "style": "scss",
        "linter": "eslint",
        "bundler": "rspack"
      },
      "component": {
        "style": "scss"
      },
      "library": {
        "style": "scss",
        "linter": "eslint"
      }
    }
  }
}
```

### 2. Update Module Federation Configuration

For each micro-frontend app, update the `module-federation.config.js`:

```javascript
// domains/operations/teams/admin-team/admin-app/module-federation.config.js
const { ModuleFederationConfig } = require('@module-federation/enhanced');

/**
 * @type {import('@module-federation/enhanced').ModuleFederationConfig}
 */
module.exports = {
  name: 'adminApp',
  exposes: {
    './Module': './src/remote-entry.js' // Changed from .ts to .js
  },
  dts: false, // Disabled for JavaScript projects
  manifest: true, // Enable new manifest protocol
  runtimePlugins: [], // Add runtime plugins if needed
  shared: {
    react: {
      singleton: true,
      requiredVersion: '^18.3.1'
    },
    'react-dom': {
      singleton: true,
      requiredVersion: '^18.3.1'
    },
    'react-router-dom': {
      singleton: true,
      requiredVersion: '^6.28.0'
    }
  }
};
```

### 3. Update TypeScript Configuration

Add new TypeScript 5.7 features to `tsconfig.base.json`:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "rewriteRelativeImportExtensions": true,
    "allowImportingTsExtensions": true,
    "paths": {
      // existing paths...
    }
  },
  "exclude": ["node_modules", "tmp"]
}
```

### 4. Update ESLint Configuration

Update `.eslintrc.json` for ESLint 9.x:

```json
{
  "root": true,
  "ignorePatterns": ["**/*"],
  "plugins": ["@nx"],
  "overrides": [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      }
    },
    {
      "files": ["*.ts", "*.tsx"],
      "extends": ["@nx/typescript"],
      "rules": {}
    },
    {
      "files": ["*.js", "*.jsx"],
      "extends": ["@nx/javascript"],
      "rules": {}
    }
  ]
}
```

### 5. Update Prettier Configuration

Update `.prettierrc` for Prettier 3.x:

```json
{
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5",
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

## Validation Scripts

### Build Validation Script

Create `scripts/validate-build.js`:

```javascript
const { execSync } = require('child_process');

const commands = [
  'npm run lint',
  'npm run build',
  'npm test',
  'npx nx build',
  'npx nx test',
  'npx nx lint'
];

console.log('🚀 Starting build validation...\n');

for (const command of commands) {
  try {
    console.log(`⏳ Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Success: ${command}\n`);
  } catch (error) {
    console.error(`❌ Failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

console.log('🎉 All validations passed!');
```

### Module Federation Test Script

Create `scripts/test-module-federation.js`:

```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test that all module federation configs are valid
const findModuleFederationConfigs = (dir) => {
  const configs = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      configs.push(...findModuleFederationConfigs(fullPath));
    } else if (file === 'module-federation.config.js') {
      configs.push(fullPath);
    }
  }
  
  return configs;
};

const configs = findModuleFederationConfigs('./domains');

console.log('🔍 Found Module Federation configs:');
configs.forEach(config => console.log(`  - ${config}`));

console.log('\n🧪 Testing Module Federation configurations...');

for (const config of configs) {
  try {
    const configModule = require(path.resolve(config));
    console.log(`✅ Valid config: ${config}`);
    
    // Basic validation
    if (!configModule.name) {
      throw new Error('Missing name property');
    }
    
    if (configModule.dts === true) {
      console.warn(`⚠️  Warning: ${config} has dts: true, consider disabling for JS projects`);
    }
    
  } catch (error) {
    console.error(`❌ Invalid config: ${config}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

console.log('\n🎉 All Module Federation configs are valid!');
```

## Troubleshooting Common Issues

### Issue 1: NX Migration Conflicts

```bash
# If migration fails due to conflicts
npm install --legacy-peer-deps

# Or force resolution
npm install --force

# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Module Federation Type Errors

```bash
# Disable TypeScript declarations for JavaScript projects
# In module-federation.config.js:
module.exports = {
  // ...
  dts: false
};
```

### Issue 3: ESLint Configuration Errors

```bash
# Update ESLint config for new version
npx eslint --init

# Or use NX ESLint preset
npm install --save-dev @nx/eslint-plugin
```

### Issue 4: Build Performance Issues

```bash
# Enable RSPack optimizations
# In rspack.config.js:
module.exports = {
  optimization: {
    usedExports: true,
    sideEffects: false,
    concatenateModules: true
  }
};
```

## Final Package.json Reference

After all updates, your `package.json` should look like this:

```json
{
  "name": "@zionix-web/source",
  "version": "0.0.0",
  "license": "MIT",
  "scripts": {
    "start": "env-cmd -f .env-cmdrc -e dev nx run zionix-main-host:serve",
    "start-zionix-main": "node tools/deployment/zionix-main.script.config.js",
    "start-hp-portal": "node tools/deployment/hpPortal.script.config.js",
    "lint": "nx run-many --target=lint",
    "lint:fix": "nx run-many --target=lint --fix",
    "eslint": "eslint --ext .js,.ts,.jsx,.tsx apps/",
    "prepare": "husky",
    "validate": "node scripts/validate-build.js",
    "test-mf": "node scripts/test-module-federation.js"
  },
  "private": true,
  "dependencies": {
    "env-cmd": "^10.1.0",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.28.0",
    "tslib": "^2.8.1"
  },
  "devDependencies": {
    "@module-federation/enhanced": "0.20.0",
    "@nx/eslint": "21.5.2",
    "@nx/eslint-plugin": "21.5.2",
    "@nx/jest": "21.5.2",
    "@nx/js": "21.5.2",
    "@nx/react": "21.5.2",
    "@nx/rspack": "21.5.2",
    "@nx/workspace": "21.5.2",
    "@rspack/cli": "1.5.8",
    "@rspack/core": "1.5.8",
    "@rspack/dev-server": "1.5.8",
    "@rspack/plugin-minify": "1.0.0",
    "@rspack/plugin-react-refresh": "1.0.0",
    "@swc-node/register": "~1.10.9",
    "@swc/cli": "~0.5.0",
    "@swc/core": "~1.10.1",
    "@swc/helpers": "~0.5.15",
    "@swc/jest": "~0.2.37",
    "@testing-library/react": "16.1.0",
    "@types/node": "22.10.2",
    "@types/react": "18.3.17",
    "@types/react-dom": "18.3.5",
    "@typescript-eslint/eslint-plugin": "8.18.2",
    "@typescript-eslint/parser": "8.18.2",
    "css-loader": "^7.1.2",
    "eslint": "9.17.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "2.31.0",
    "eslint-plugin-jsx-a11y": "6.10.2",
    "eslint-plugin-react": "7.37.2",
    "eslint-plugin-react-hooks": "5.0.0",
    "file-loader": "^6.2.0",
    "husky": "^9.1.6",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "nx": "21.5.2",
    "prettier": "3.4.2",
    "react-refresh": "~0.14.2",
    "sass-loader": "^16.0.3",
    "style-loader": "^4.0.0",
    "ts-jest": "^29.2.5",
    "typescript": "5.7.3"
  }
}
```

## Execution Checklist

- [ ] Phase 1: Foundation updates completed
- [ ] Phase 2: NX workspace migration completed  
- [ ] Phase 3: Module Federation update completed
- [ ] Phase 4: Tooling updates completed
- [ ] All builds pass
- [ ] All tests pass
- [ ] Module Federation communication works
- [ ] Development server starts successfully
- [ ] Production builds are optimized
- [ ] Documentation updated
- [ ] Team notified of changes

This implementation guide provides the exact commands and configurations needed to successfully update the Zionix workspace to the latest stable package versions.