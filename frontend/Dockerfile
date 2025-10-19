# Frontend Dockerfile
FROM node:22-alpine AS builder

# 接收 build 參數
ARG VITE_API_URL=http://localhost:3000

WORKDIR /app

# 複製 package files
COPY package*.json ./

# 安裝依賴
RUN npm ci

# 複製源代碼
COPY . .

# 設置環境變數用於 build
ENV VITE_API_URL=${VITE_API_URL}

# 建置應用程式
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# 複製建置好的文件到 nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# 複製 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]
