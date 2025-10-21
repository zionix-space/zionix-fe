# Universal Dockerfile for all Zionix applications (host and remotes)
# Works for any number of apps - no need for multiple Dockerfiles!
# Optimized for Vercel deployment and AWS compatibility

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build argument to specify which app to build
# Examples: zionix-main-host, adminApp, or any future app
ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Build the specified application
RUN npx nx build ${APP_NAME} --prod

# Production stage - simple static file serving
FROM node:20-alpine AS production

WORKDIR /app

# Install serve for static file serving (lightweight alternative to nginx)
RUN npm install -g serve

# Copy built application from builder stage
ARG APP_NAME

# Create dist directory
RUN mkdir -p ./dist

# Copy built application - handle different directory structures
# For zionix-main-host, copy from platform/shell/main-shell/zionix-main-host
# For adminApp, copy from domains/operations/apps/admin-app
COPY --from=builder /app/dist/ ./temp-dist/
RUN if [ "$APP_NAME" = "zionix-main-host" ]; then \
      if [ -d "./temp-dist/platform/shell/main-shell/zionix-main-host" ]; then \
        cp -r ./temp-dist/platform/shell/main-shell/zionix-main-host/* ./dist/; \
      elif [ -d "./temp-dist/zionix-main-host" ]; then \
        cp -r ./temp-dist/zionix-main-host/* ./dist/; \
      else \
        echo "Build output not found for $APP_NAME" && exit 1; \
      fi; \
    elif [ "$APP_NAME" = "adminApp" ]; then \
      if [ -d "./temp-dist/domains/operations/apps/admin-app" ]; then \
        cp -r ./temp-dist/domains/operations/apps/admin-app/* ./dist/; \
      elif [ -d "./temp-dist/adminApp" ]; then \
        cp -r ./temp-dist/adminApp/* ./dist/; \
      else \
        echo "Build output not found for $APP_NAME" && exit 1; \
      fi; \
    else \
      if [ -d "./temp-dist/$APP_NAME" ]; then \
        cp -r ./temp-dist/$APP_NAME/* ./dist/; \
      else \
        echo "Build output not found for $APP_NAME" && exit 1; \
      fi; \
    fi && rm -rf ./temp-dist

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application with CORS headers for Module Federation
CMD ["serve", "-s", "dist", "-l", "3000", "--cors"]