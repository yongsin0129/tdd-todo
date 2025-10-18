# 使用 zeabur 部署

目前本地無法直接 zeabur yaml 部署，只能將每一個服務獨立部署 (zbpack.jso 指令 app 位置)。


注意 :
1. 使用 zeabur 部署，請先寫 zbpack.json : https://zeabur.com/docs/zh-TW/guides/nodejs
2. 部屬後再到 dashboard 貼上 .env 內容


## 後端
cd backend
zeabur deploy

```.env
# Database (Zeabur will inject this)
DATABASE_URL=${POSTGRES_CONNECTION_STRING}

# CORS Configuration
CORS_ORIGIN=https://your-frontend.zeabur.app

# Server Configuration
PORT=3000
NODE_ENV=development
```




## 前端 
cd frontend
zeabur deploy

```.env
# API Configuration
# For production (direct backend URL)
# VITE_API_URL=https://your-backend.zeabur.app/api
```

# 步驟

STEP 1: 創建一個新的 Zeabur 專案，先從模版建立 PSQL 資料庫

STEP 2: 部署後端 輸入 .env 內容 ( 確認 PSQL 資料庫連線字串對應正確 )

STEP 3: 部署前端 輸入 .env 內容 ( 如果時常更改，用 VERCEL 體驗更好，zeabur 每次更改都要重新部署前端 )

STEP 4: 設定 CORS 允許前端訪問後端 

STEP 5: 考慮後端跟 github 連結，讓每次 push 都會自動部署