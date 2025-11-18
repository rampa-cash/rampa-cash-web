FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies for better performance and native module compilation
RUN apk add --no-cache \
    libc6-compat \
    curl \
    python3 \
    make \
    g++

# Copy package files and npm config
COPY package*.json ./
COPY .npmrc ./

# Install dependencies
# Using --legacy-peer-deps to resolve peer dependency conflicts with @getpara packages
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"] 