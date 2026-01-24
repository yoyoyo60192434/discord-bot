FROM node:18-bullseye

WORKDIR /app

# package.json と package-lock.json を先にコピー
COPY app/package*.json ./app/

# FFmpeg インストールと npm install
RUN apt-get update && apt-get install -y ffmpeg
RUN npm install

# 残りのアプリをコピー
COPY app/ ./

CMD ["node", "main.mjs"]
