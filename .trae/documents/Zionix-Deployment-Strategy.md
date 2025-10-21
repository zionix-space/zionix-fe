# Zionix Micro-Frontend Deployment Strategy

## 1. Overview

This document outlines the comprehensive deployment strategy for the Zionix micro-frontend application, built with NX workspace, Module Federation, and React 18.3.1. The architecture supports multiple domains (operations, finance, healthcare, HR, sales) with independent deployment capabilities.

### Current Architecture
- **Host Application**: `zionix-main-host` (Port 4200)
- **Remote Applications**: Dynamic domain-based apps (e.g., `adminApp` on Port 4201)
- **Build Tool**: Rspack with Module Federation
- **Workspace**: NX monorepo with domain-driven structure

## 2. Production Build Process

### 2.1 Build Configuration

**Host Application Build:**
```bash
# Build production host
nx build zionix-main-host --configuration=production

# Output: dist/platform/shell/main-shell/zionix-main-host/
```

**Remote Applications Build:**
```bash
# Build all remotes
nx run-many --target=build --configuration=production --projects=adminApp

# Build specific domain apps
nx build adminApp --configuration=production

# Output: dist/domains/operations/apps/admin-app/
```

### 2.2 Build Optimization Settings

Production builds include:
- **Optimization**: Enabled
- **Source Maps**: Disabled for security
- **Mode**: Production
- **Bundle Splitting**: Automatic via Module Federation
- **Tree Shaking**: Enabled via Rspack

### 2.3 Automated Build Script

```bash
#!/bin/bash
# tools/deployment/build-production.sh

echo "🚀 Starting Zionix Production Build"

# Build host application
echo "📦 Building host application..."
nx build zionix-main-host --configuration=production

# Discover and build all remote applications
echo "🔍 Discovering remote applications..."
node tools/deployment/zionix-main.script.config.js build

# Build all discovered remotes
for app in $(cat tools/deployment/zionix-main.modules.json | jq -r '.[]'); do
  echo "📦 Building remote: $app"
  nx build $app --configuration=production
done

echo "✅ Production build completed"
```

## 3. Container Deployment with Docker

### 3.1 Multi-Stage Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build:production

# Production stage
FROM nginx:alpine AS production

# Copy built applications
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY tools/deployment/nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 3.2 Nginx Configuration

```nginx
# tools/deployment/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Host application
        location / {
            try_files $uri $uri/ /platform/shell/main-shell/zionix-main-host/index.html;
            
            # Cache static assets
            location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
                expires 1y;
                add_header Cache-Control "public, immutable";
            }
        }

        # Remote applications
        location /remotes/ {
            alias /usr/share/nginx/html/domains/;
            
            # CORS for Module Federation
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
            add_header Access-Control-Allow-Headers "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range";
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### 3.3 Docker Compose for Local Testing

```yaml
# docker-compose.yml
version: '3.8'

services:
  zionix-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: unless-stopped

  # Optional: Redis for caching
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    restart: unless-stopped
```

## 4. AWS Deployment Options

### 4.1 Option A: S3 + CloudFront (Recommended)

**Benefits:**
- Cost-effective for static assets
- Global CDN distribution
- Automatic scaling
- Easy rollback capabilities

**Deployment Script:**
```bash
#!/bin/bash
# tools/deployment/deploy-aws-s3.sh

ENVIRONMENT=$1
BUCKET_NAME="zionix-frontend-${ENVIRONMENT}"
DISTRIBUTION_ID="E1234567890ABC"

# Build for production
npm run build:production

# Sync to S3
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "*.html" \
  --exclude "remoteEntry.js"

# Upload HTML files with shorter cache
aws s3 sync dist/ s3://${BUCKET_NAME}/ \
  --cache-control "public, max-age=300" \
  --include "*.html" \
  --include "remoteEntry.js"

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"

echo "✅ Deployment to S3 completed"
```

**CloudFront Configuration:**
```json
{
  "Origins": [
    {
      "Id": "S3-zionix-frontend",
      "DomainName": "zionix-frontend-prod.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": "origin-access-identity/cloudfront/E1234567890ABC"
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-zionix-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
    "Compress": true
  },
  "CacheBehaviors": [
    {
      "PathPattern": "*/remoteEntry.js",
      "TargetOriginId": "S3-zionix-frontend",
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
      "TTL": 300
    }
  ]
}
```

### 4.2 Option B: ECS with Fargate

**Benefits:**
- Container orchestration
- Auto-scaling capabilities
- Better for dynamic content
- Integrated with AWS services

**ECS Task Definition:**
```json
{
  "family": "zionix-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "zionix-frontend",
      "image": "your-account.dkr.ecr.region.amazonaws.com/zionix-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/zionix-frontend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

## 5. CI/CD Pipeline Setup

### 5.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Zionix Frontend

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'
  AWS_REGION: 'us-east-1'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Build applications
        run: npm run build:production

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to staging
        run: |
          chmod +x tools/deployment/deploy-aws-s3.sh
          ./tools/deployment/deploy-aws-s3.sh staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to production
        run: |
          chmod +x tools/deployment/deploy-aws-s3.sh
          ./tools/deployment/deploy-aws-s3.sh production
```

### 5.2 Domain-Specific Deployment

```yaml
# .github/workflows/domain-deployment.yml
name: Domain-Specific Deployment

on:
  push:
    paths:
      - 'domains/**'

jobs:
  detect-changes:
    runs-on: ubuntu-latest
    outputs:
      changed-domains: ${{ steps.changes.outputs.domains }}
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      
      - name: Detect changed domains
        id: changes
        run: |
          CHANGED_DOMAINS=$(git diff --name-only HEAD~1 HEAD | grep '^domains/' | cut -d'/' -f2 | sort -u | jq -R -s -c 'split("\n")[:-1]')
          echo "domains=$CHANGED_DOMAINS" >> $GITHUB_OUTPUT

  deploy-domain:
    needs: detect-changes
    runs-on: ubuntu-latest
    if: needs.detect-changes.outputs.changed-domains != '[]'
    strategy:
      matrix:
        domain: ${{ fromJson(needs.detect-changes.outputs.changed-domains) }}
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy domain ${{ matrix.domain }}
        run: |
          echo "Deploying domain: ${{ matrix.domain }}"
          # Add domain-specific deployment logic
```

## 6. Environment Configuration Management

### 6.1 Environment Variables

```javascript
// tools/deployment/env-config.js
const environments = {
  development: {
    NX_PUBLIC_API_BASE: 'https://api-dev.zionix.com',
    NX_PUBLIC_CDN_BASE: 'http://localhost:4200',
    NX_PUBLIC_ENVIRONMENT: 'development',
    NX_PUBLIC_LOG_LEVEL: 'debug'
  },
  staging: {
    NX_PUBLIC_API_BASE: 'https://api-staging.zionix.com',
    NX_PUBLIC_CDN_BASE: 'https://staging-cdn.zionix.com',
    NX_PUBLIC_ENVIRONMENT: 'staging',
    NX_PUBLIC_LOG_LEVEL: 'info'
  },
  production: {
    NX_PUBLIC_API_BASE: 'https://api.zionix.com',
    NX_PUBLIC_CDN_BASE: 'https://cdn.zionix.com',
    NX_PUBLIC_ENVIRONMENT: 'production',
    NX_PUBLIC_LOG_LEVEL: 'error'
  }
};

module.exports = environments;
```

### 6.2 Dynamic Configuration Loading

```javascript
// platform/core/shared-utilities/src/config/runtime-config.js
export class RuntimeConfig {
  static async loadConfig() {
    const environment = process.env.NX_PUBLIC_ENVIRONMENT || 'development';
    
    try {
      const response = await fetch(`/config/${environment}.json`);
      const config = await response.json();
      
      // Merge with build-time environment variables
      return {
        ...config,
        apiBase: process.env.NX_PUBLIC_API_BASE,
        cdnBase: process.env.NX_PUBLIC_CDN_BASE,
        environment: process.env.NX_PUBLIC_ENVIRONMENT
      };
    } catch (error) {
      console.error('Failed to load runtime configuration:', error);
      return this.getDefaultConfig();
    }
  }
  
  static getDefaultConfig() {
    return {
      apiBase: 'https://api.zionix.com',
      cdnBase: 'https://cdn.zionix.com',
      environment: 'production'
    };
  }
}
```

## 7. Module Federation Production Considerations

### 7.1 Remote Entry Caching Strategy

```javascript
// platform/core/shared-utilities/src/module-federation/remote-loader.js
export class RemoteLoader {
  static cache = new Map();
  
  static async loadRemote(remoteName, exposedModule) {
    const cacheKey = `${remoteName}:${exposedModule}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const remoteUrl = await this.getRemoteUrl(remoteName);
      const container = await this.loadContainer(remoteUrl);
      const factory = await container.get(exposedModule);
      const module = factory();
      
      this.cache.set(cacheKey, module);
      return module;
    } catch (error) {
      console.error(`Failed to load remote ${remoteName}:`, error);
      return this.loadFallback(remoteName, exposedModule);
    }
  }
  
  static async getRemoteUrl(remoteName) {
    const config = await RuntimeConfig.loadConfig();
    return `${config.cdnBase}/remotes/${remoteName}/remoteEntry.js`;
  }
}
```

### 7.2 Shared Dependencies Optimization

```javascript
// rspack.config.prod.js
const ModuleFederationPlugin = require('@module-federation/enhanced/rspack');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'zionixMainHost',
      remotes: {
        // Dynamic remotes loaded at runtime
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.3.1',
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.3.1',
          eager: true
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.11.2'
        }
      }
    })
  ]
};
```

## 8. Monitoring and Logging Setup

### 8.1 Application Performance Monitoring

```javascript
// platform/core/monitoring/src/performance-monitor.js
export class PerformanceMonitor {
  static init() {
    // Core Web Vitals monitoring
    this.observeWebVitals();
    
    // Module Federation loading times
    this.observeModuleLoading();
    
    // Error tracking
    this.setupErrorTracking();
  }
  
  static observeWebVitals() {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.sendMetric);
      getFID(this.sendMetric);
      getFCP(this.sendMetric);
      getLCP(this.sendMetric);
      getTTFB(this.sendMetric);
    });
  }
  
  static observeModuleLoading() {
    const originalImport = window.__webpack_require__.e;
    window.__webpack_require__.e = function(chunkId) {
      const start = performance.now();
      
      return originalImport.call(this, chunkId).then(result => {
        const duration = performance.now() - start;
        PerformanceMonitor.sendMetric({
          name: 'module_load_time',
          value: duration,
          labels: { chunkId }
        });
        return result;
      });
    };
  }
  
  static sendMetric(metric) {
    // Send to your monitoring service (DataDog, New Relic, etc.)
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metric)
    });
  }
}
```

### 8.2 Centralized Logging

```javascript
// platform/core/monitoring/src/logger.js
export class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3
  };
  
  static currentLevel = this.levels[process.env.NX_PUBLIC_LOG_LEVEL?.toUpperCase()] || this.levels.INFO;
  
  static log(level, message, context = {}) {
    if (this.levels[level] > this.currentLevel) return;
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId()
      }
    };
    
    // Console logging for development
    if (process.env.NX_PUBLIC_ENVIRONMENT === 'development') {
      console[level.toLowerCase()](message, context);
    }
    
    // Send to logging service
    this.sendLog(logEntry);
  }
  
  static error(message, context) { this.log('ERROR', message, context); }
  static warn(message, context) { this.log('WARN', message, context); }
  static info(message, context) { this.log('INFO', message, context); }
  static debug(message, context) { this.log('DEBUG', message, context); }
}
```

## 9. Security Considerations

### 9.1 Content Security Policy

```html
<!-- Add to index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.zionix.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.zionix.com wss://api.zionix.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### 9.2 Module Federation Security

```javascript
// platform/core/shared-utilities/src/security/module-validator.js
export class ModuleValidator {
  static trustedDomains = [
    'cdn.zionix.com',
    'staging-cdn.zionix.com'
  ];
  
  static validateRemoteUrl(url) {
    try {
      const urlObj = new URL(url);
      return this.trustedDomains.includes(urlObj.hostname);
    } catch {
      return false;
    }
  }
  
  static async loadSecureRemote(remoteName, exposedModule) {
    const remoteUrl = await RemoteLoader.getRemoteUrl(remoteName);
    
    if (!this.validateRemoteUrl(remoteUrl)) {
      throw new Error(`Untrusted remote URL: ${remoteUrl}`);
    }
    
    return RemoteLoader.loadRemote(remoteName, exposedModule);
  }
}
```

## 10. Rollback Strategies

### 10.1 Blue-Green Deployment

```bash
#!/bin/bash
# tools/deployment/blue-green-deploy.sh

ENVIRONMENT=$1
VERSION=$2
CURRENT_SLOT=$(aws s3api get-bucket-website --bucket zionix-frontend-${ENVIRONMENT} --query 'RedirectAllRequestsTo.HostName' --output text)

if [[ $CURRENT_SLOT == *"blue"* ]]; then
  NEW_SLOT="green"
  OLD_SLOT="blue"
else
  NEW_SLOT="blue"
  OLD_SLOT="green"
fi

echo "Deploying to $NEW_SLOT slot..."

# Deploy to new slot
aws s3 sync dist/ s3://zionix-frontend-${ENVIRONMENT}-${NEW_SLOT}/

# Update CloudFront to point to new slot
aws cloudfront update-distribution \
  --id $DISTRIBUTION_ID \
  --distribution-config file://cloudfront-config-${NEW_SLOT}.json

echo "Deployment completed. Traffic switched to $NEW_SLOT"
echo "Previous version available in $OLD_SLOT for rollback"
```

### 10.2 Automated Rollback

```javascript
// tools/deployment/rollback-monitor.js
class RollbackMonitor {
  static async monitorDeployment(version, timeout = 300000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const healthCheck = await this.performHealthCheck();
      
      if (!healthCheck.healthy) {
        console.error('Health check failed, initiating rollback...');
        await this.rollback();
        return false;
      }
      
      await new Promise(resolve => setTimeout(resolve, 30000));
    }
    
    return true;
  }
  
  static async performHealthCheck() {
    try {
      const response = await fetch('/health');
      const errorRate = await this.getErrorRate();
      
      return {
        healthy: response.ok && errorRate < 0.05,
        errorRate
      };
    } catch (error) {
      return { healthy: false, error: error.message };
    }
  }
  
  static async rollback() {
    // Implement rollback logic
    console.log('Rolling back to previous version...');
  }
}
```

## 11. Performance Optimization

### 11.1 Bundle Analysis and Optimization

```bash
#!/bin/bash
# tools/deployment/analyze-bundles.sh

echo "📊 Analyzing bundle sizes..."

# Build with bundle analyzer
ANALYZE=true nx build zionix-main-host --configuration=production
ANALYZE=true nx build adminApp --configuration=production

# Generate bundle report
npx webpack-bundle-analyzer dist/platform/shell/main-shell/zionix-main-host/stats.json

echo "Bundle analysis completed. Check the generated reports."
```

### 11.2 Preloading Strategy

```javascript
// platform/core/shared-utilities/src/preloader.js
export class ModulePreloader {
  static criticalModules = ['adminApp'];
  static prefetchModules = ['schedulingApp', 'patientApp'];
  
  static async preloadCriticalModules() {
    const promises = this.criticalModules.map(module => 
      this.preloadModule(module)
    );
    
    await Promise.all(promises);
  }
  
  static prefetchModules() {
    // Prefetch during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        this.prefetchModules.forEach(module => 
          this.preloadModule(module)
        );
      });
    }
  }
  
  static async preloadModule(moduleName) {
    try {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = await RemoteLoader.getRemoteUrl(moduleName);
      document.head.appendChild(link);
    } catch (error) {
      console.warn(`Failed to preload module ${moduleName}:`, error);
    }
  }
}
```

## 12. Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Linting checks passed
- [ ] Bundle size analysis completed
- [ ] Security scan completed
- [ ] Environment variables configured
- [ ] Database migrations (if applicable)
- [ ] CDN cache invalidation planned

### Deployment
- [ ] Blue-green deployment initiated
- [ ] Health checks configured
- [ ] Monitoring alerts active
- [ ] Rollback plan ready
- [ ] Team notified of deployment

### Post-Deployment
- [ ] Health checks passing
- [ ] Performance metrics within acceptable range
- [ ] Error rates below threshold
- [ ] User acceptance testing completed
- [ ] Documentation updated
- [ ] Deployment retrospective scheduled

## 13. Troubleshooting Guide

### Common Issues

**Module Federation Loading Failures:**
```javascript
// Debug module loading issues
window.__MF_DEBUG__ = true;

// Check remote availability
async function debugRemote(remoteName) {
  try {
    const remoteUrl = await RemoteLoader.getRemoteUrl(remoteName);
    const response = await fetch(remoteUrl);
    console.log(`Remote ${remoteName} status:`, response.status);
  } catch (error) {
    console.error(`Remote ${remoteName} failed:`, error);
  }
}
```

**Performance Issues:**
- Check bundle sizes with analyzer
- Verify CDN cache hit rates
- Monitor Core Web Vitals
- Review network waterfall

**Security Issues:**
- Validate CSP headers
- Check for mixed content warnings
- Verify CORS configuration
- Review access logs

This comprehensive deployment strategy ensures reliable, secure, and performant deployment of your Zionix micro-frontend application across multiple environments while maintaining the flexibility of the domain-driven architecture.