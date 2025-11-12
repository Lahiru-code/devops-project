# Backend Dockerfile
FROM node:20-alpine

# Install system dependencies
RUN apk add --no-cache bash curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with specific npm config
RUN npm config set loglevel error && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-factor 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm ci --only=production --network-timeout=100000

# Copy source
COPY . .

# Set environment variables
ENV NODE_ENV=production \
    PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:5000/api/books || exit 1

# Expose API port
EXPOSE 5000

# Start the app with proper error handling
CMD ["node", "index.js"]
