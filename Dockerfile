FROM oven/bun:latest AS build

WORKDIR /app

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

ARG VITE_ENV=production
ENV VITE_ENV=${VITE_ENV}

# Build project
RUN bun run build

# Production stage
FROM nginx:alpine

# Copy build artifacts
COPY --from=build /app/dist /usr/share/nginx/html
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80