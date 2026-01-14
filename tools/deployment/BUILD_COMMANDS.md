# Quick Build Commands Reference

## 🏠 Build Host App (Shell)

The host app is `zionix-main-host` - it loads all the remote apps.

```bash
# Build host with dev API
npm run build-zionix-main dev zionix-main-host

# Build host with qa API
npm run build-zionix-main qa zionix-main-host

# Build host with production API
npm run build-zionix-main production zionix-main-host
```

**Output:** `dist/platform/shell/main-shell/zionix-main-host/`

---

## 📱 Build Remote Apps (Micro-frontends)

```bash
# Build adminApp
npm run build-zionix-main dev adminApp

# Build authentication
npm run build-zionix-main dev authentication

# Build any remote app
npm run build-zionix-main dev <app-name>
```

**Output:** `dist/domains/{domain}/apps/{app-name}/`

---

## 🚀 Build All (Host + All Remotes)

```bash
# Build everything
npm run build-zionix-main dev

# Build everything with qa API
npm run build-zionix-main qa

# Build everything with production API
npm run build-zionix-main production
```

---

## 📋 Typical Deployment Workflow

### Option 1: Quick Deploy (Automated Build + Deploy)

```bash
# Deploy remote apps to preview
npm run deploy-admin

# Deploy remote apps to production
npm run deploy-admin:prod

# Deploy host app to preview (includes authApp bundled)
npm run deploy-zionix-main

# Deploy host app to production (includes authApp bundled)
npm run deploy-zionix-main:prod
```

### Option 2: Manual Deploy (Build First, Then Deploy)

### 1. Build Remote Apps First
```bash
npm run build-zionix-main production adminApp
```

### 2. Deploy Remote Apps to Vercel
```bash
npm run deploy:admin
```

### 3. Update vercel-urls.json
Add the deployed URLs to `tools/deployment/vercel-urls.json`

### 4. Build Host App
```bash
npm run build-zionix-main production zionix-main-host
```

### 5. Deploy Host App
```bash
npm run deploy:main
```

---

## 🚀 Deployment Commands

### Quick Deploy Commands (Build + Deploy in One Step)

```bash
# Deploy to preview (dev environment)
npm run deploy-zionix-main          # Host app (includes authApp bundled)
npm run deploy-admin                # Admin app

# Deploy to production
npm run deploy-zionix-main:prod     # Host app (includes authApp bundled)
npm run deploy-admin:prod           # Admin app
```

### Custom Deploy (Any Module, Any Environment)

```bash
# Deploy to preview
node tools/deployment/deploy-to-vercel.js <environment> <module>

# Deploy to production
node tools/deployment/deploy-to-vercel.js <environment> <module> --prod

# Examples:
node tools/deployment/deploy-to-vercel.js dev adminApp
node tools/deployment/deploy-to-vercel.js production zionix-main-host --prod
node tools/deployment/deploy-to-vercel.js qa authentication
```

---

## 🎯 Command Structure

```bash
npm run build-zionix-main <environment> <module>
                          ↑            ↑
                          |            └─ Optional: specific module
                          |               - zionix-main-host (host app)
                          |               - adminApp (remote app)
                          |               - authentication (remote app)
                          |               - or omit to build all
                          |
                          └─ Environment from .env-cmdrc
                             - dev
                             - qa
                             - production
```

---

## 💡 Key Points

- **Host App Name:** `zionix-main-host`
- **Host Location:** `platform/shell/main-shell/zionix-main-host/`
- **Remote Apps:** Automatically discovered from `domains/` folder
- **Vercel URLs:** Configured in `tools/deployment/vercel-urls.json`
- **API Endpoints:** Configured in `.env-cmdrc`
