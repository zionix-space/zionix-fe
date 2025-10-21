# Zionix Deployment Guide

## Overview
This simplified deployment setup supports:
- **Vercel** (Primary): Simple, fast deployment for frontend apps
- **AWS** (Future): Docker-based deployment using the universal Dockerfile
- **Local Development**: Simplified Docker Compose

## Key Features
✅ **Single Universal Dockerfile** - Works for all apps (host and remotes)  
✅ **No Nginx complexity** - Uses lightweight `serve` for static files  
✅ **Scalable** - Supports 1000+ apps without creating 1000 files  
✅ **Build Arguments** - Specify which app to build dynamically  
✅ **Vercel Optimized** - Simple deployment scripts  

## Vercel Deployment (Recommended)

### Quick Deploy Any App
```bash
# Deploy main host application
cd tools/dockerconfig
node deploy-vercel.js zionix-main-host

# Deploy admin app
node deploy-vercel.js adminApp

# Deploy any future app
node deploy-vercel.js <app-name>
```

### Manual Vercel Deployment
```bash
# 1. Build the app
npx nx build <app-name> --prod

# 2. Deploy to Vercel
npx vercel --prod
```

## Docker Deployment (Local Development)

### Start All Apps Locally
```bash
cd tools/dockerconfig
docker-compose up
```

### Build Specific App
```bash
# Build main host
docker build -f tools/dockerconfig/Dockerfile --build-arg APP_NAME=zionix-main-host -t zionix-main-host .

# Build admin app
docker build -f tools/dockerconfig/Dockerfile --build-arg APP_NAME=adminApp -t admin-app .

# Build any app
docker build -f tools/dockerconfig/Dockerfile --build-arg APP_NAME=<app-name> -t <app-name> .
```

## AWS Deployment (Future)

The universal Dockerfile is AWS-ready:
- Use with ECS, EKS, or EC2
- Build arguments work with any CI/CD pipeline
- No additional configuration needed

### Example AWS ECS Task Definition
```json
{
  "family": "zionix-app",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "your-registry/zionix:latest",
      "environment": [
        {"name": "APP_NAME", "value": "zionix-main-host"}
      ]
    }
  ]
}
```

## Adding New Apps

### For 1000+ Remote Apps
No additional Docker files needed! Just:

1. **Create your app** in the workspace
2. **Deploy to Vercel**:
   ```bash
   node deploy-vercel.js your-new-app
   ```
3. **Or build with Docker**:
   ```bash
   docker build --build-arg APP_NAME=your-new-app -t your-new-app .
   ```

## File Structure
```
tools/dockerconfig/
├── Dockerfile              # Universal Dockerfile for all apps
├── docker-compose.yml      # Local development
├── docker-compose.prod.yml # Production (AWS)
├── deploy-vercel.js        # Vercel deployment script
└── DEPLOYMENT.md          # This guide
```

## Benefits of This Approach

1. **Minimal Files**: No more 1000 Dockerfiles for 1000 apps
2. **Vercel Optimized**: Fast, simple deployments
3. **AWS Ready**: Same Dockerfile works everywhere
4. **Developer Friendly**: Simple commands, clear structure
5. **Scalable**: Add unlimited apps without complexity

## Troubleshooting

### Build Issues
- Ensure app name matches exactly: `npx nx show projects`
- Check if app builds locally: `npx nx build <app-name>`

### Vercel Issues
- Install Vercel CLI: `npm i -g vercel`
- Login to Vercel: `vercel login`
- Check build output in `dist/<app-name>/`

### Docker Issues
- Ensure Docker is running
- Check app name in build args
- Verify context path in docker