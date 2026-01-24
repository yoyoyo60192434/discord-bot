FROM node:18-bullseye

WORKDIR /app

COPY package*.json ./

# 必要なライブラリと Python をインストール
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# npm install で依存関係をインストール
RUN npm install

# ソースコードをコピー
COPY . .

CMD ["node", "main.mjs"]
