# Frontend Dockerfile
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies first (including dev dependencies)
COPY package*.json ./

# Install dependencies with specific npm config
RUN npm config set loglevel error && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-factor 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --network-timeout=100000

# Copy source files
COPY . .

# Set environment variables
ENV VITE_API_URL=http://localhost:5000
ENV NODE_ENV=production

# Update the import in main.jsx to use the correct path
RUN sed -i 's/\.\/App.jsx/\.\/App/g' src/main.jsx

# Build the application
RUN npm run build

# Nginx stage
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Containers run nginx with global directives and daemon off
CMD ["nginx", "-g", "daemon off;"]
