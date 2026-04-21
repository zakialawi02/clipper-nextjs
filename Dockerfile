FROM node:20-alpine AS base

# 1. Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# 2. Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# 3. Runner (Bisa untuk App atau Worker)
FROM base AS runner
WORKDIR /app

# Install FFmpeg & yt-dlp
RUN apk add --no-cache ffmpeg python3 yt-dlp

ENV NODE_ENV=development

# Salin node_modules dari deps agar 'tsx' dsb tersedia
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
