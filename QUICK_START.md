# 🚀 クイックスタートガイド

## ⚡ 3ステップで起動

### 1. フロントエンド起動

```bash
# VS Codeでプロジェクトを開く
# Ctrl+Shift+P → "Dev Containers: Reopen in Container"
# "ToDo App (Frontend - Vite + React)" を選択

# コンテナ内で
npm install
npm run dev
```

→ http://localhost:5173

### 2. バックエンド起動

```bash
# 新しいVS Codeウィンドウを開く (Ctrl+Shift+N)
# 同じプロジェクトフォルダを開く
# Ctrl+Shift+P → "Dev Containers: Reopen in Container"
# "ToDo App (Backend - Spring Boot)" を選択

# コンテナ内で（初回のみ）
chmod +x mvnw
./mvnw clean install

# アプリ起動
./mvnw spring-boot:run
```

→ http://localhost:8080/api/todos

### 3. 動作確認

1. ブラウザで http://localhost:5173 を開く
2. ToDoを追加してみる
3. 完了チェック・削除を試す

---

## 🐛 エラーが出たら

### "mvnw: not found" エラー
```bash
chmod +x mvnw
```

### "Could not find or load main class" エラー
```bash
./mvnw clean install
./mvnw spring-boot:run
```

### フロントからバックエンドに接続できない
```bash
# backendコンテナが起動しているか確認
docker ps | grep todo-backend

# 起動していなければ
docker compose up -d backend
```

### "npm install" が遅い
- 初回は5-10分かかる場合があります
- node_modulesをキャッシュするので2回目以降は速いです

---

## 📊 メモリ使用量チェック

```bash
# Dockerコンテナのメモリ使用量確認
docker stats --no-stream

# 目安:
# frontend: 150-200MB
# backend: 350-400MB
# db: 100-120MB
# 合計: 600-700MB
```

---

## 🛑 コンテナ停止

```bash
# すべて停止
docker compose down

# データベースも削除する場合
docker compose down -v
```

---

## 🔄 次回起動時

```bash
# コンテナを起動
docker compose up -d

# VS Codeで各コンテナに接続
# フロントエンド: npm run dev
# バックエンド: ./mvnw spring-boot:run
```

---

## 📚 詳しい情報

- リバースプロキシについて → README.md の「Nginxリバースプロキシの使い方」
- メモリ最適化について → MEMORY_OPTIMIZATION.md
- AWS構成について → README.md の「AWS本番環境デプロイ」
