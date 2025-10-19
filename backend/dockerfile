FROM node:22
LABEL "language"="nodejs"
LABEL "framework"="express"

WORKDIR /src
COPY . .

# 詳細除錯 - 檢查專案根目錄結構
RUN echo "=== 專案根目錄結構 ===" && \
    ls -la && \
    echo "=== 尋找所有 prisma 相關檔案 ===" && \
    find . -name "*prisma*" -type f && \
    echo "=== 尋找所有 .prisma 檔案 ===" && \
    find . -name "*.prisma" && \
    echo "=== 尋找 scripts 目錄 ===" && \
    find . -name "scripts" -type d && \
    echo "=== 尋找 build.sh 檔案 ===" && \
    find . -name "build.sh"

# 檢查 backend 目錄
RUN echo "=== backend 目錄結構 ===" && \
    if [ -d backend ]; then \
        ls -la backend/; \
    else \
        echo "backend 目錄不存在"; \
    fi

# 檢查 prisma 目錄
RUN echo "=== prisma 目錄結構 ===" && \
    if [ -d prisma ]; then \
        echo "prisma 目錄在根目錄:" && \
        ls -la prisma/; \
    fi && \
    if [ -d backend/prisma ]; then \
        echo "prisma 目錄在 backend 目錄:" && \
        ls -la backend/prisma/; \
    fi

# 安裝依賴
RUN echo "=== 安裝依賴 ===" && \
    cd backend && npm ci --ignore-scripts

# 建置應用程式 - 帶詳細日誌
RUN echo "=== 開始建置流程 ===" && \
    cd backend && \
    echo "目前工作目錄: $(pwd)" && \
    echo "檢查 schema.production.prisma 檔案:" && \
    if [ -f prisma/schema.production.prisma ]; then \
        echo "找到 prisma/schema.production.prisma" && \
        ls -la prisma/schema.production.prisma && \
        echo "複製 schema.production.prisma 到 schema.prisma" && \
        cp prisma/schema.production.prisma prisma/schema.prisma && \
        echo "複製完成，檢查結果:" && \
        ls -la prisma/schema.prisma; \
    else \
        echo "未找到 prisma/schema.production.prisma，檢查其他可能位置:" && \
        find . -name "schema.production.prisma" 2>/dev/null || echo "完全找不到 schema.production.prisma"; \
    fi && \
    echo "=== 執行 prisma generate ===" && \
    if [ -f prisma/schema.prisma ]; then \
        npx prisma generate; \
    else \
        echo "找不到 schema.prisma，跳過 prisma generate"; \
    fi && \
    echo "=== 執行 npm run build ===" && \
    npm run build && \
    echo "=== 執行 build.sh 腳本 ===" && \
    if [ -f scripts/build.sh ]; then \
        echo "找到 scripts/build.sh，執行中..." && \
        bash scripts/build.sh; \
    else \
        echo "未找到 scripts/build.sh，檢查其他可能位置:" && \
        find . -name "build.sh" 2>/dev/null || echo "完全找不到 build.sh"; \
    fi

WORKDIR /src/backend
EXPOSE 8080


# 啟動應用程式
CMD ["sh", "-c", "echo '=== 啟動應用程式 ===' && if [ -f /src/backend/prisma/schema.prisma ]; then echo '執行 prisma db push' && cd /src/backend && npx prisma db push; else echo '跳過 prisma db push'; fi && echo '啟動 npm start' && npm start"]