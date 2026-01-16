# 📝 超軽量版 ToDo App (Vite + React + Spring Boot)

**メモリ 8GB 環境でも快適に動作**する、Docker + Dev Containers 構成の ToDo アプリケーションです。

## 🎯 プロジェクトの特徴

- **超軽量設計**: Alpine Linux ベースで最小メモリ使用量
- **初学者フレンドリー**: 詳しい解説とコメント付き
- **チーム開発向け**: フロント・バック完全分離
- **本番環境対応**: Nginx リバースプロキシ付き

## 📊 技術スタック

| レイヤー  | 技術                      |
| --------- | ------------------------- |
| Frontend  | Vite + React + TypeScript |
| Backend   | Spring Boot 3.2 + Java 17 |
| Database  | PostgreSQL 16             |
| Proxy     | Nginx (Alpine)            |
| Container | Docker + Docker Compose   |

## 💾 メモリ使用量

### 開発時（pgAdmin なし）

```
Frontend (Node.js Alpine):  約 150MB
Backend (Java 17 Alpine):   約 350MB (JVM制限: 256MB)
PostgreSQL (Alpine):        約 100MB
───────────────────────────────────
合計:                      約 600MB
```

### 本番確認時（Nginx 起動）

```
上記 + Nginx (Alpine):     約 650MB
```

**従来構成（2GB 超）から約 70%削減！**

## 🚀 クイックスタート

### 前提条件

- Docker Desktop インストール済み
- VS Code インストール済み
- VS Code 拡張機能「Dev Containers」インストール済み

### 1. リポジトリのクローン

```bash
git clone [リポジトリURL]
cd lightweight-todo-app
```

### 2. フロントエンド開発の開始

1. VS Code でプロジェクトフォルダを開く
2. `Ctrl+Shift+P` (Mac: `Cmd+Shift+P`) でコマンドパレット
3. `Dev Containers: Reopen in Container` を選択
4. `ToDo App (Frontend - Vite + React)` を選択
5. 初回は Docker イメージビルドで 2-3 分待つ

```bash
# コンテナ内で自動的に npm install が実行される
# 完了したら開発サーバー起動
npm run dev
```

→ http://localhost:5173 でアクセス可能

### 3. バックエンド開発の開始

1. **新しい VS Code ウィンドウ**を開く (`Ctrl+Shift+N`)
2. 同じプロジェクトフォルダを開く
3. `Dev Containers: Reopen in Container`
4. `ToDo App (Backend - Spring Boot)` を選択

```bash
# コンテナ内で
./mvnw spring-boot:run
```

→ http://localhost:8080/api で API アクセス可能

### 4. データベース接続確認

**方法 1: VS Code 拡張機能（おすすめ）**

- 「PostgreSQL」拡張機能をインストール
- ホスト: `localhost`, ポート: `5432`
- データベース: `todo_db`, ユーザー: `user`, パスワード: `password`

**方法 2: psql コマンド**

```bash
docker exec -it todo-db psql -U user -d todo_db
```

## 🔧 Nginx リバースプロキシの使い方

### リバースプロキシとは？

**問題**: フロント(5173)とバック(8080)が別ポート

```
ブラウザ → http://localhost:5173 (フロント)
        ↓
        × CORS エラー！
        ↓
        → http://localhost:8080/api (バック)
```

**解決**: Nginx で 1 つのポート(80)に統合

```
ブラウザ → http://localhost (Nginx)
        ↓
        ├→ / → フロント (5173)
        └→ /api → バック (8080)
```

### なぜ必要？

#### 1. **CORS 問題の解決**

- 異なるポート = 異なるオリジン → ブラウザがブロック
- Nginx 経由 = 同じオリジン → 問題なし

#### 2. **本番環境と同じ構成**

- 開発: Nginx 使用 = 本番と同じ動作確認
- デプロイ時のトラブルを事前に発見

#### 3. **URL の統一**

- フロント: `http://localhost/`
- API: `http://localhost/api/todos`
- シンプルで分かりやすい

### Nginx 起動方法

```bash
# 本番環境確認時のみ起動
docker compose --profile production up -d nginx

# 確認
http://localhost        # フロントエンド
http://localhost/api    # バックエンド

# 停止
docker compose --profile production down nginx
```

### 設定ファイルの解説

`nginx/nginx.conf` の重要部分：

```nginx
# バックエンドAPIへの転送
location /api/ {
    proxy_pass http://backend:8080;  # backendコンテナの8080番へ
    proxy_set_header Host $host;     # ホスト名を保持
}

# フロントエンドへの転送
location / {
    proxy_pass http://frontend:5173;  # frontendコンテナの5173番へ

    # WebSocket対応（Viteのホットリロード用）
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
}
```

**ポイント**:

- `location /api/` → `/api`で始まる URL はバックエンドへ
- `location /` → それ以外はフロントエンドへ
- WebSocket ヘッダー → Vite のホットリロードが動く

## ☁️ AWS 本番環境デプロイ

### 推奨構成: EC2 + RDS

```
┌───────────────────────────────────┐
│ EC2 (t2.micro - 無料枠)           │
│  ├─ Docker Compose                │
│  ├─ Frontend (ビルド済み)         │
│  ├─ Backend (Spring Boot)         │
│  └─ Nginx                          │
└───────────────────────────────────┘
          ↓ 接続
┌───────────────────────────────────┐
│ RDS PostgreSQL (db.t3.micro)      │
│ (無料枠)                          │
└───────────────────────────────────┘
```

### AWS 無料枠の内容

| サービス       | 無料枠内容                | 制限        |
| -------------- | ------------------------- | ----------- |
| **EC2**        | t2.micro (1vCPU, 1GB RAM) | 月 750 時間 |
| **RDS**        | db.t3.micro (PostgreSQL)  | 月 750 時間 |
| **ストレージ** | 汎用 SSD 30GB             | -           |
| **データ転送** | 月 15GB                   | -           |

**注意**: 12 ヶ月間のみ無料。制限超過で課金。

### メリット・デメリット比較

#### パターン A: EC2 + RDS (おすすめ)

**メリット:**

- データベースが自動バックアップ
- スケールアップが簡単
- DB の可用性が高い
- 本番運用に適している

**デメリット:**

- 設定項目が多い
- 無料枠が 12 ヶ月のみ
- 2 つのサービスを管理

**コスト（無料枠終了後）:**

- EC2: 約$8/月
- RDS: 約$15/月
- 合計: 約$23/月

#### パターン B: EC2 のみ（DB もコンテナ）

**メリット:**

- 設定がシンプル
- Docker Compose そのまま使える
- コストが安い（EC2 のみ）

**デメリット:**

- DB のバックアップが手動
- EC2 停止で DB も停止
- メモリ 1GB で全部動かすのは厳しい

**コスト（無料枠終了後）:**

- EC2: 約$8/月のみ

#### パターン C: Lightsail（初心者向け）

**メリット:**

- 料金が固定で分かりやすい
- 最初の 3 ヶ月無料
- セットアップが簡単

**デメリット:**

- スケール性が低い
- AWS の他サービスと連携しにくい

**コスト:**

- $5/月プラン（1GB RAM）
- $10/月プラン（2GB RAM）おすすめ

### 初学者へのおすすめ

**1 位: EC2 + RDS (無料枠 12 ヶ月)**

- 理由: 本番環境に近い、学習になる
- 手順: AWS チュートリアル豊富

**2 位: Lightsail ($10/月プラン)**

- 理由: シンプル、すぐ始められる
- 手順: ワンクリックで Docker 環境構築

**3 位: EC2 のみ（DB 込み）**

- 理由: 無料で長く使える（自己責任）
- 手順: docker-compose をそのまま使用

## 📂 プロジェクト構造

```
lightweight-todo-app/
├── .devcontainer/              # Dev Containers設定
│   ├── frontend/
│   │   └── devcontainer.json  # フロントエンド用設定
│   └── backend/
│       └── devcontainer.json  # バックエンド用設定
│
├── frontend/                   # Vite + React + TypeScript
│   ├── src/
│   │   ├── App.tsx            # メインコンポーネント
│   │   ├── App.css
│   │   ├── main.tsx           # エントリーポイント
│   │   └── index.css
│   ├── Dockerfile             # 軽量版Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── index.html
│
├── backend/                    # Spring Boot + Java
│   ├── src/
│   │   └── main/
│   │       └── java/
│   │           └── com/example/todo/
│   ├── Dockerfile             # 軽量版Dockerfile
│   ├── pom.xml                # Maven設定
│   └── mvnw                   # Mavenラッパー
│
├── nginx/                      # Nginxリバースプロキシ
│   └── nginx.conf             # 詳細コメント付き設定
│
├── docker-compose.yml          # 全コンテナ管理
└── README.md                   # このファイル
```

## 🛠️ よくあるコマンド

### Docker 操作

```bash
# コンテナ起動
docker compose up -d

# コンテナ停止
docker compose down

# ログ確認
docker compose logs -f backend

# コンテナに入る
docker exec -it todo-backend sh

# ディスク使用量確認
docker system df

# 不要イメージ削除
docker system prune -a
```

### フロントエンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# ビルド確認
npm run preview

# 型チェック
tsc --noEmit
```

### バックエンド

```bash
# アプリ起動
./mvnw spring-boot:run

# ビルド
./mvnw clean package

# テスト実行
./mvnw test

# 依存関係更新
./mvnw dependency:resolve
```

## 🐛 トラブルシューティング

### メモリ不足でコンテナが起動しない

**Docker Desktop のメモリ制限を確認:**

1. Docker Desktop → Settings → Resources
2. Memory: 最低 2GB、推奨 4GB
3. Apply & Restart

### フロントからバックエンドに接続できない

**ネットワーク確認:**

```bash
# backendコンテナに入る
docker exec -it todo-backend sh

# フロントエンドコンテナへ疎通確認
ping frontend

# postgresに接続できるか確認
ping db
```

### ホットリロードが効かない

**Vite の設定確認:**
`vite.config.ts`に以下があるか確認

```typescript
server: {
  watch: {
    usePolling: true,  // これがないとDocker環境でホットリロードしない
  },
}
```

### Git のエラー

**コンテナ内で初回設定:**

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## 📚 学習リソース

### フロントエンド

- [React 公式チュートリアル](https://ja.react.dev/learn)
- [Vite 公式ドキュメント](https://ja.vitejs.dev/)
- [TypeScript 公式](https://www.typescriptlang.org/ja/)

### バックエンド

- [Spring Boot 公式ガイド](https://spring.io/guides)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)

### インフラ

- [Docker 公式ドキュメント](https://docs.docker.com/get-started/)
- [Nginx 設定リファレンス](http://nginx.org/en/docs/)
- [AWS 無料枠](https://aws.amazon.com/jp/free/)

## 🤝 チーム開発のベストプラクティス

### Git 運用

```bash
# 機能ブランチ作成
git checkout -b feature/add-todo-filter

# コミット
git add .
git commit -m "feat: ToDoフィルター機能追加"

# プッシュ
git push origin feature/add-todo-filter
```

### コミットメッセージ規約

```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加
chore: ビルド設定など
```

## 📝 今後の拡張案

- [ ] 認証機能（JWT）
- [ ] ToDo カテゴリ分け
- [ ] 期限設定・通知
- [ ] ダークモード
- [ ] Docker 本番用マルチステージビルド
- [ ] CI/CD（GitHub Actions）
- [ ] テスト自動化

## 📄 ライセンス

MIT License

---

**作成者**: [チーム名]  
**作成日**: 2025 年 1 月  
**バージョン**: 1.0.0
