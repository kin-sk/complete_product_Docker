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

# アプリケーションのソースコードをコピー
COPY src ./src

# アプリケーションをビルド（コンパイル）
RUN ./mvnw package -DskipTests

# Gitをインストール
RUN apt-get update && apt-get install -y git

# # 実行
# ENTRYPOINT ["java", "-jar", "target/todo-backend-0.0.1-SNAPSHOT.jar"]

# コンテナを起動し続けるためのコマンド
CMD ["sleep", "infinity"]