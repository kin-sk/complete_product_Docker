# Dockerfile for Next.js frontend (Development)

# ベースとなるNode.js環境を指定
FROM node:18-alpine

# 作業ディレクトリを作成
WORKDIR /app

# 依存ライブラリの情報を先にコピー
COPY package.json ./

# 依存ライブラリをインストール
# Next.jsはネイティブモジュールに依存すことことがあるため、必要なビルドツールをインストール
RUN apk add --no-cache gcompat

# アプリケーションのソースコードをコピー
COPY . .

# Next.jsが使用するポートを公開
EXPOSE 3000

# 開発サーバーを起動
CMD ["npm", "run", "dev"]

