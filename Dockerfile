# -----------------------------------------------------------------------------
# STAGE 1: Build
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files to leverage cache
COPY package*.json ./

# Install dependencies (use 'npm ci' for deterministic builds)
RUN npm ci

# Copy source code
COPY . .

# Pass build-time environment variables
# (Vite embeds these during the build process)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build the app (outputs to /app/dist)
RUN npm run build

# -----------------------------------------------------------------------------
# STAGE 2: Serve (Nginx)
# -----------------------------------------------------------------------------
FROM nginx:alpine AS production

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (crucial for SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]