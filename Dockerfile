# 1. ベースイメージ
FROM node:18-bullseye

# 2. 作業ディレクトリを作成
WORKDIR /app

# 3. パッケージファイルを先にコピー（依存関係のキャッシュ活用）
COPY package*.json ./

# 4. FFmpeg と必要なライブラリをインストール
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# 5. npm install で依存関係をインストール
RUN npm install

# 6. 残りのソースコードをコピー
COPY . .

# 7. ボット起動
CMD ["node", "main.mjs"]
