# 使用 zeabur 部署

目前本地無法直接 zeabur yaml 部署，只能將每一個服務獨立部署

cd backend
zeabur deploy

cd frontend
zeabur deploy

P.S. 部屬後再到 dashboard 匯入 .env 檔案

# 前端 .env
```
# API Configuration
# For production (direct backend URL)
# VITE_API_URL=https://your-backend.zeabur.app/api
```

# 後端 .env
```
# Database (Zeabur will inject this)
DATABASE_URL="${POSTGRES_CONNECTION_STRING}"

# CORS Configuration
CORS_ORIGIN=https://your-frontend.zeabur.app

# Server Configuration
PORT=3000
NODE_ENV=development


```
