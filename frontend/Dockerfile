 # build stage
FROM node:20-alpine AS build
WORKDIR /app

# (optional but helpful for some deps)
RUN apk add --no-cache libc6-compat

COPY package*.json ./

# make npm more tolerant to slow networks
RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm config set fetch-timeout 300000

RUN npm ci

COPY . .

ARG VITE_API_KEY
ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_API_URL

# Vite reads env at build time
ENV VITE_API_KEY=${VITE_API_KEY} \
    VITE_AUTH_DOMAIN=${VITE_AUTH_DOMAIN} \
    VITE_PROJECT_ID=${VITE_PROJECT_ID} \
    VITE_API_URL=${VITE_API_URL}

RUN npm run build

# serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
