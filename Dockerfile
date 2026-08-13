FROM node:22.16.0-bookworm-slim
WORKDIR /app
COPY . /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8787
ENV COCHI_HTTPS=1
ENV COCHI_DATA_DIR=/data
VOLUME ["/data"]
EXPOSE 8787
CMD ["node","server.js"]
