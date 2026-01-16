# 超軽量版 Dockerfile for Spring Boot（開発専用）

FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# 必要なパッケージをインストール
RUN apk add --no-cache \
    git \
    curl \
    bash

# Mavenラッパーをインストール
RUN curl -o maven-wrapper.jar https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar

# アプリケーションのポート
EXPOSE 8080

# コンテナを起動し続ける（VS Codeから接続するため）
CMD ["sleep", "infinity"]
