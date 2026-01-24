FROM node:18-bullseye
WORKDIR /app
COPY package*.json ./
RUN apt-get update && apt-get install -y ffmpeg
RUN npm install
COPY . .
CMD ["node", "main.mjs"]
