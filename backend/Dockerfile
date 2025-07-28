# Dockerfile for Spring Boot backend

# ベースとなるJava環境を指定
FROM openjdk:17-jdk-slim

# 作業ディレクトリを作成
WORKDIR /app

# Mavenのラッパーファイルを先にコピーして、依存関係をキャッシュしやすくする
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Mavenで依存ライブラリをダウンロード
RUN ./mvnw dependency:go-offline

# 他の開発者のmvnwの実行権限をコンテナに付与
RUN chmod +x mvnw

# アプリケーションのソースコードをコピー
COPY src ./src

# アプリケーションをビルド（コンパイル）
RUN ./mvnw package -DskipTests

# Gitをインストール
RUN apk add --no-cache git

# # 実行
# ENTRYPOINT ["java", "-jar", "target/todo-backend-0.0.1-SNAPSHOT.jar"]

# コンテナを起動し続けるためのコマンド
CMD ["sleep", "infinity"]