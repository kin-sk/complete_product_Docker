# 超軽量版 Dockerfile for Vite + React + TypeScript

# Node.js Alpine版（約40MBのベースイメージ）
FROM node:22-alpine

# 作業ディレクトリ
WORKDIR /app

# Gitのインストール（alpine版はapkを使用）
RUN apk add --no-cache git

# package.jsonとpackage-lock.jsonを先にコピー
# （依存関係のキャッシュ効率化）
COPY package*.json ./

# 依存関係をインストール
RUN npm install --prefer-offline --no-audit

# ソースコードをコピー
COPY . .

# Vite開発サーバーのポート
EXPOSE 5173

# 開発サーバー起動（ホスト0.0.0.0で外部アクセス可能に）
CMD ["npm", "run", "dev"]
