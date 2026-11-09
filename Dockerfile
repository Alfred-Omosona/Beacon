
# syntax=docker/dockerfile:1

# ==========================================
# Stage 1: Install dependencies and run tests
# ==========================================
FROM --platform=linux/amd64 node:22-alpine AS test

WORKDIR /app

# Install all dependencies for testing
COPY package.json package-lock.json ./

RUN npm ci

# Copy application and test files
COPY src/ ./src/
COPY public/ ./public/
COPY test/ ./test/

# Run required tests
RUN npm test


# ==========================================
# Stage 2: Install production dependencies
# ==========================================
FROM --platform=linux/amd64 node:22-alpine AS production-deps

WORKDIR /app

COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev \
    && npm cache clean --force


# ==========================================
# Stage 3: Production runtime
# ==========================================
FROM --platform=linux/amd64 node:22-alpine AS production

# Application environment
ENV NODE_ENV=production \
    APP_ENV=production \
    PORT=3000

WORKDIR /app

# Copy production dependencies
COPY --from=production-deps \
    --chown=node:node \
    /app/node_modules ./node_modules

# Copy required application files
COPY --chown=node:node package.json ./
COPY --chown=node:node src/ ./src/
COPY --chown=node:node public/ ./public/

# Run application as non-root
USER node

# Application listening port
EXPOSE 3000

# Graceful shutdown signal
STOPSIGNAL SIGTERM

# Container health check
HEALTHCHECK --interval=30s \
    --timeout=5s \
    --start-period=10s \
    --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => { let body=''; r.on('data', c => body += c); r.on('end', () => { try { const data = JSON.parse(body); process.exit(r.statusCode === 200 && data.status === 'ok' ? 0 : 1); } catch { process.exit(1); } }); }).on('error', () => process.exit(1))"

# Required application start command
CMD ["npm", "start"]

