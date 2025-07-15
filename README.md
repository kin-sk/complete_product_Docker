# ToDo Application (Next.js & Spring Boot)

このプロジェクトは、Next.js(Frontend)とSpring Boot(Backend)をDockerでコンテナ化して開発するToDoアプリケーションです。
VSCodeのDev Containers機能を利用し、誰でもすぐに統一された開発環境を構築できます。

## 概要

-   **Frontend**: Next.js, React, TypeScript
-   **Backend**: Spring Boot, Java
-   **Database**: PostgreSQL
-   **DB Management**: pgAdmin
-   **Environment**: Docker, Docker Compose, VSCode Dev Containers

## 必須ツール (Prerequisites)

開発を始める前に、お使いのPCに以下のソフトウェアをインストールしてください。

-   [Docker Desktop](https://www.docker.com/products/docker-desktop/)
-   [Visual Studio Code (VSCode)](https://code.visualstudio.com/)
-   VSCode拡張機能: [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## 環境構築ガイド (Setup Guide)

以下の手順に従って、開発環境をセットアップしてください。

### 1. リポジトリのクローン

まず、このリポジトリをご自身のPCにクローンします。

```bash
git clone https://github.com/[あなたのユーザー名]/[リポジトリ名].git
cd [リポジトリ名]
```

**取り込み方は各々お任せします。**


### 2. VSCodeで開発コンテナを起動

このプロジェクトでは、フロントエンドとバックエンドをそれぞれ別の開発コンテナで開きます。

#### フロントエンド用コンテナの起動

1.  VSCodeで、クローンしたプロジェクトフォルダを開きます。
2.  コマンドパレットを開きます (`Ctrl+Shift+P` または `Cmd+Shift+P`)。
3.  `Dev Containers: Reopen in Container` と入力し、実行します。
5.  VSCodeがプロジェクト内の設定を読み込み、以下の選択肢を表示します。
    - `... in ToDo App (Frontend)`
    - `... in ToDo App (Backend)`
6.  **`ToDo App (Frontend)`** を選択します。
7.  初回はDockerイメージのビルドに時間がかかります。完了すると、新しいVSCodeウィンドウが開き、フロントエンドのコンテナに接続された状態になります。

#### バックエンド用コンテナの起動

1.  **新しいVSCodeウィンドウをもう一つ開きます** (`Ctrl+Shift+N` または `Cmd+Shift+N`)。
2.  新しいウィンドウで、再度同じプロジェクトフォルダを開きます。
3.  上記と同様に、コマンドパレットから `Dev Containers: Reopen in Container` を実行します。
4.  今度は **`ToDo App (Backend)`** を選択します。
5.  完了すると、もう一つのVSCodeウィンドウがバックエンドのコンテナに接続されます。

これで、**VSCodeが2つ開き、それぞれがフロントエンドとバックエンドのコンテナに接続された状態**になります。

### 3. フロントエンドの依存関係をインストール

フロントエンドのコンテナを初めて起動した際、一度だけ手動で依存関係をインストールする必要があります。

1.  フロントエンドコンテナに接続しているVSCodeのウィンドウで、ターミナルを開きます (`Ctrl+Shift+@`)。
2.  以下のコマンドを実行します。

    ```bash
    npm install
    ```

これで、開発の準備は完了です！

## アプリケーションの起動 (Running the Application)

### フロントエンド (Next.js)

1.  フロントエンドコンテナのターミナルで、以下のコマンドを実行します。

    ```bash
    npm run dev
    ```
2.  Webブラウザで **`http://localhost:3000`** を開くと、ToDoアプリの画面が表示されます。

### バックエンド (Spring Boot)

1.  バックエンドコンテナのターミナルで、以下のコマンドを実行します。

    ```bash
    ./mvnw spring-boot:run
    ```
    またはVSCodeのデバックツールを使用して`実行`をクリック

    
2.  Spring Bootアプリケーションが起動し、`localhost:8080` でAPIリクエストを受け付けられる状態になります。

### データベース管理 (pgAdmin)

1.  Webブラウザで **`http://localhost:5050`** を開きます。
2.  `docker-compose.yml` に設定された以下の情報でログインします。
    - **Email:** `admin@example.com`
    - **Password:** `admin`
3.  ログイン後、データベースサーバーに接続します。
    - 左のツリーから `Servers` を右クリック > `Create` > `Server...`
    - **General タブ**:
        - `Name`: `todo-db-local` (任意)
    - **Connection タブ**:
        - `Host name/address`: `db`
        - `Port`: `5432`
        - `Maintenance database`: `todo_db`
        - `Username`: `user`
        - `Password`: `password`
    - `Save` をクリックして接続します。

## 開発ワークフロー (Development Workflow)

### Gitの利用

Gitの操作 (commit, push, pullなど) は、**すべてコンテナに接続されたVSCode内で行ってください。**
ローカルPCのターミナルでGitコマンドを実行する必要はありません。

#### 初回のみの設定
各コンテナで初めてGitを使う際に、以下のコマンドであなたの情報を設定してください。

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### コードフォーマット

このプロジェクトでは、ファイルを保存した際に自動でコードが整形されるように設定されています。

-   **Frontend (TypeScript/React)**: Prettier
-   **Backend (Java)**: Language Support for Java by Red Hat

手動でフォーマットを気にする必要はありません。

## ディレクトリ構成

```
.
├── .devcontainer/    # VSCode Dev Containersの設定ファイル
│   ├── backend/
│   └── frontend/
├── .vscode/          # VSCodeのワークスペース設定（フォーマッターなど）
├── backend/          # Spring Bootのソースコード
├── frontend/         # Next.jsのソースコード
├── docker-compose.yml  # Dockerコンテナ群の定義ファイル
└── README.md         # このファイル
```

## トラブルシューティング

-   **コンテナがうまく起動しない、または変更が反映されない場合:**
    - コマンドパレットから `Dev Containers: Rebuild and Reopen in Container` を実行してみてください。これにより、コンテナがクリーンな状態で再構築されます。

-   **`npm install` でエラーが出る場合:**
    - まず、ローカルPCの `frontend` ディレクトリにある `node_modules` フォルダと `package-lock.json` を削除してから、コンテナをリビルドし、再度コンテナ内で `npm install` を試してください。

---
