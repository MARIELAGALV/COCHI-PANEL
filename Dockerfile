FROM node:22.16.0-bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates fonts-liberation && rm -rf /var/lib/apt/lists/*
ENV CHROMIUM_PATH=/usr/bin/chromium
COPY package*.json /app/
RUN npm install --omit=dev
COPY . /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8787
ENV COCHI_HTTPS=1
ENV COCHI_DATA_DIR=/data
EXPOSE 8787
CMD ["node","server.js"]
