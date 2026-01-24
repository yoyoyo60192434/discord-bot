# Node.js 18 Bullseye ベース
FROM node:18-bullseye

# 作業ディレクトリ
WORKDIR /app

# 依存関係のみ先にコピー
COPY package*.json ./

# 必要なライブラリと Python をインストール
RUN apt-get update && \
    apt-get install -y ffmpeg python3 python3-pip python-is-python3 && \
    rm -rf /var/lib/apt/lists/*

# npm install で依存関係をインストール
RUN npm install

# 残りのソースコードをコピー
COPY . .

# ボット起動
CMD ["node", "main.mjs"]
