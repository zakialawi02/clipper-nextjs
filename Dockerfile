FROM node:20-alpine AS base

# Install FFmpeg & yt-dlp
RUN apk add --no-cache ffmpeg python3 yt-dlp

WORKDIR /app

# Salin node_modules dari host (sudah ada) untuk menghindari network issue
COPY node_modules ./node_modules
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]
