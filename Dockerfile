FROM node:22-bookworm-slim AS base

# Install FFmpeg + Python + latest yt-dlp
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates \
    ffmpeg \
    python3 \
    python3-pip \
  && python3 -m pip install --break-system-packages --no-cache-dir yt-dlp \
  && rm -rf /var/lib/apt/lists/*

# Create temp directory for processing
RUN mkdir -p /tmp/ai-clipper

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

COPY . .

ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run", "dev"]
