# 專案介紹

練習使用 sdd + tdd 進行專案開發
一律使用 tdd 開發流程，先寫測試，再寫程式碼

USER STORY
PRD
SDD + attachment
ROADMAP
TEAM-TODO LIST

後端 > 前端 > E2E 測試 > 部署

## 總統計

| 測試類型 | 檔案數 | 細項數 | 後端 | 前端 |
|---------|--------|--------|------|------|
| **單元測試** | 8 個 | 242 個 | 111 個 (2 檔案) | 131 個 (6 檔案) |
| **整合測試** | 5 個 | 266 個 | 266 個 (5 檔案) | 0 個 |
| **E2E 測試** | 1 個 | 10 個 | 0 個 | 10 個 (1 檔案) |
| **總計** | **14 個** | **518 個** | **377 個** | **141 個** |


# 使用 zeabur 部署後端 + vercel 部署前端 +  zeabur DB

先使用 zeabur template 建立 PSQL 資料庫

## 後端
注意 :
1. 使用 zeabur 部署，請先寫 zbpack.json : https://zeabur.com/docs/zh-TW/guides/nodejs
2. 部屬後再到 dashboard 貼上 .env 內容 

cd backend
zeabur deploy

```.env
# Database (Zeabur will inject this)
DATABASE_URL=${POSTGRES_CONNECTION_STRING}

# CORS Configuration
CORS_ORIGIN=https://your-frontend.app

# Server Configuration
PORT=3000
NODE_ENV=development
```

# 步驟

STEP 1: 創建一個新的 Zeabur 專案，先從模版建立 PSQL 資料庫

STEP 2: 部署後端 輸入 .env 內容 ( 確認 PSQL 資料庫連線字串對應正確 )

STEP 3: 部署前端 輸入 .env 內容 ( 如果時常更改，用 VERCEL 體驗更好，zeabur 每次更改都要重新部署前端 )

STEP 4: 設定 CORS 允許前端訪問後端 

STEP 5: 考慮後端跟 github 連結，讓每次 push 都會自動部署

# 與 github 連結

最優先級:查看 dashboard settings 裡的專案目錄設定，有 dockerfile 就會忽略 zbpack.json 跟 package.json 的內容。

第二優先會看專案目錄或是根目錄的 zbpack.json
第三優先會看專案目錄 dockerfile
第四才會根據專案目錄 package.json 自動偵測

一開始先用 zeabur deploy 部署，使用 zbpack.json 部署成功。
接著再連結 github 專案，指定根目錄，然後確認 dockerfile 沒有讓 zeabur 自動產生而覆蓋 zbpack.json。

## 注意重點

1. 確認 github 分支對應正確，預設是 main 分支。
2. 確認 dockerfile 沒有讓 zeabur 自動產生而覆蓋 zbpack.json
3. 要注意 zeabur 參考的根目錄設定
4. 設定監控的目錄 : "/"是根目錄 ，"/backend"是後端目錄


## 前端 
1. 專案 PUSH 到 github 後
2. vercel dashboard 指定 github 專案
3. 指定根目錄
4. 指定分支
5. 指定環境變數
