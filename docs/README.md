# 📚 TodoList 專案文件導覽

> 本目錄包含 TodoList 應用程式的完整專案文件，遵循標準軟體開發文件架構

## 📖 文件架構總覽

本專案文件遵循以下結構：

```
PRD (產品需求) → SDD (系統設計) → 實作計畫 (路線圖 + 團隊任務)
                        ↓
                   技術附件 (API 規格 + 資料庫設計 + 部署指南)
```

## 🗂️ 目錄結構

```
docs/
├── 01-requirements/          # 📋 需求文件
│   └── PRD.md               # 產品需求文件
├── 02-design/                # 🎨 設計文件
│   ├── SDD.md               # 系統設計文件
│   ├── API-Specification.md # API 規格文件
│   ├── Database-Design.md   # 資料庫設計文件
│   ├── Database-Migration-Guide.md  # 資料庫遷移指南
│   └── Tailwind-CSS-Version-Comparison.md  # Tailwind CSS 版本比較
├── 03-planning/              # 📅 規劃文件
│   └── Project-Roadmap.md   # 專案路線圖
├── 04-execution/             # 🚀 執行文件
│   ├── frontend/            # 前端團隊
│   │   └── Frontend-Team-Todolist.md
│   ├── backend/             # 後端團隊
│   │   └── Backend-Team-Todolist.md
│   └── devops/              # DevOps 部署
│       ├── Zeabur-Deployment-README.md      # 部署導航
│       ├── Zeabur-Deployment-Guide.md       # 完整部署指南
│       ├── Zeabur-Deployment-Summary.md     # 部署概覽
│       └── Zeabur-Deployment-Checklist.md   # 部署檢查清單
└── 05-change-management/     # 📝 變更管理
    └── Change-Log.md         # 變更日誌
```

---

## 📄 核心文件

### 1. [PRD.md](./01-requirements/PRD.md) - 產品需求文件
**閱讀對象**: 產品經理、專案負責人、所有團隊成員

**內容概要**:
- 📋 產品目標與願景
- 👥 目標用戶與人物誌
- 🎯 使用場景與用戶故事
- ⚡ 核心功能需求 (5 大功能)
- 📊 成功指標 (KPI)
- 🏆 競品分析與市場定位
- 🎨 UI/UX 設計原則

**何時閱讀**: 開始專案前、需要了解「為什麼做」和「做什麼」時

---

### 2. [SDD.md](./02-design/SDD.md) - 系統設計文件
**閱讀對象**: 技術團隊、架構師、開發人員

**內容概要**:
- 🏗️ 技術架構圖 (三層架構)
- 🔧 技術選型與理由 (React, Node.js, Prisma, Zustand, Tailwind)
- 📊 系統流程圖 (新增、更新、刪除流程)
- 📦 模組劃分 (前端/後端結構)
- 🔌 介面設計 (API 通訊、模組間互動)
- 🗄️ 資料模型概要
- 🔒 安全性考量 (驗證、防護措施)
- ⚡ 效能考量 (優化策略、目標指標)
- ❌ 錯誤處理機制
- 🔗 第三方整合服務

**何時閱讀**: 開始技術實作前、需要了解「怎麼做」時

---

## 📑 技術附件

### 3. [API-Specification.md](./02-design/API-Specification.md) - API 規格文件
**閱讀對象**: 前端開發者、後端開發者、測試人員

**內容概要**:
- 🌐 完整 API 端點列表 (5 個 CRUD 端點)
- 📨 請求/回應格式與範例
- 🔑 HTTP 狀態碼說明
- ❌ 錯誤訊息格式
- 🔐 認證方式 (未來)
- 💻 使用範例 (cURL, React, Axios)

**何時閱讀**:
- 前端開發串接 API 時
- 後端開發實作 API 時
- 撰寫 API 測試時

---

### 4. [Database-Design.md](./02-design/Database-Design.md) - 資料庫設計文件
**閱讀對象**: 後端開發者、DBA、資料工程師

**內容概要**:
- 🗃️ 完整資料表結構 (Prisma Schema)
- 🔑 主鍵、外鍵、索引設計
- 📈 ER Diagram (實體關係圖)
- 🔄 資料庫遷移策略
- 📊 效能優化 (索引、查詢)
- 💾 備份策略
- 🔒 安全性考量

**何時閱讀**:
- 建立資料庫 Schema 時
- 執行資料庫遷移時
- 優化查詢效能時

---

## 🗺️ 專案規劃

### 5. [Project-Roadmap.md](./03-planning/Project-Roadmap.md) - 專案總體路線圖
**閱讀對象**: 專案經理、團隊負責人、所有成員

**內容概要**:
- 📅 專案時間軸 (6 週計畫)
- 🎯 Phases (6 個階段) 與 Milestones (里程碑)
- 📋 Tasks (任務列表) 與相依性
- ⏱️ 時程規劃與預估
- 👥 資源需求與分配
- ⚠️ 風險項目與應對方案

**何時閱讀**:
- 了解專案整體進度時
- 規劃 Sprint 時
- 評估專案風險時

---

## 👨‍💻 團隊任務清單

### 6. [Backend-Team-Todolist.md](./04-execution/backend/Backend-Team-Todolist.md) - 後端團隊待辦清單
**閱讀對象**: 後端開發者、後端團隊負責人

**內容概要**:
- ✅ 已完成任務 (17/28 tasks - 61%)
- 🔄 進行中任務
- ⏳ 待辦任務
- 📊 測試覆蓋率統計 (327 tests, ~92% coverage)
- ⏱️ 時間估算與優先級
- 🔗 任務相依性
- 👤 負責人分配

**當前狀態**:
- ✅ Phase 1-3 完成 (專案設置、CRUD API、Swagger 文件)
- ⏳ Phase 4-5 待辦 (整合測試、部署)

**何時閱讀**:
- 每日站立會議前
- 選擇下一個任務時
- 追蹤後端進度時

---

### 7. [Frontend-Team-Todolist.md](./04-execution/frontend/Frontend-Team-Todolist.md) - 前端團隊待辦清單
**閱讀對象**: 前端開發者、前端團隊負責人

**內容概要**:
- 📋 所有前端任務 (27 tasks)
- 🎨 組件開發順序
- ♿ 無障礙設計要求
- ⚡ 效能優化目標
- 🧪 測試策略 (Vitest, RTL, E2E)
- 📱 響應式設計要求
- 🎯 完成標準

**當前狀態**:
- ⏳ 0% 完成 - 待開始
- 目標: 10 天內完成核心功能

**何時閱讀**:
- 開始前端開發前
- 選擇下一個組件實作時
- 追蹤前端進度時

---

### 8. [部署文件](./04-execution/devops/) - 部署導航索引
**閱讀對象**: DevOps 團隊、後端開發者、專案負責人

**內容概要**:
- 🚀 完整部署指南（Vercel 前端 + Zeabur 後端）
- 📋 部署架構與流程圖
- ⚙️ 環境配置與變數設定
- 🗄️ 資料庫遷移 (SQLite → PostgreSQL)
- 🔄 CI/CD 策略（平台自動部署 + GitHub Actions 測試）
- ✅ 部署檢查清單
- 🐛 常見問題排除

**快速連結**:
- [CI/CD 策略文檔](./04-execution/devops/CI-CD-Strategy.md) - GitHub Actions 測試流程 + 平台自動部署
- [Zeabur CLI 文檔](./04-execution/devops/Zeabur%20CLI.md) - Zeabur 命令行工具使用指南
- [資料庫遷移指南](./02-design/Database-Migration-Guide.md) (499 行) - SQLite→PostgreSQL

**何時閱讀**:
- 準備部署至生產環境時
- 設定 CI/CD pipeline 時
- 資料庫遷移時
- 排除部署問題時

---

## 📝 變更管理

### 9. [Change-Log.md](./05-change-management/Change-Log.md) - 變更日誌
**閱讀對象**: 所有團隊成員、專案經理

**內容概要**:
- 📅 專案所有重要變更記錄
- 🔄 文件版本更新歷史
- 🏗️ 架構變更記錄
- 📊 變更統計與審核狀態
- 📌 後續行動項目

**最新變更**:
- 2025-10-19: **Vercel + Zeabur 混合架構部署完成**（前端 Vercel + 後端/資料庫 Zeabur）
- 2025-10-19: 部署架構更新為 Vercel (前端) + Zeabur (後端/資料庫) 混合架構
- 2025-10-18: Zeabur 部署平台整合
- 2025-10-18: 文件結構重組 (.doc/ → docs/)
- 2025-10-18: SDD.md v1.3.0 (新增 ADR-008)
- 2025-10-18: Database-Design.md v1.1.0 (新增 Zeabur 環境)

**何時閱讀**:
- 了解專案變更歷史時
- 追蹤文件更新時
- 審核變更請求 (CR) 時

---

## 🔄 文件關聯圖

```
                    ┌─────────────┐
                    │   PRD.md    │
                    │ (產品需求)   │
                    └──────┬──────┘
                           │
                           ↓
                    ┌─────────────┐
                    │   SDD.md    │
                    │ (系統設計)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              ↓            ↓            ↓
     ┌────────────┐ ┌────────────┐ ┌────────────┐
     │API-Spec.md │ │Database    │ │Project     │
     │(API 規格)  │ │-Design.md  │ │-Roadmap.md │
     │            │ │(資料庫)    │ │(路線圖)    │
     └────────────┘ └────────────┘ └──────┬─────┘
                                          │
                           ┌──────────────┴──────────────┐
                           ↓                             ↓
                    ┌────────────┐              ┌────────────┐
                    │Backend     │              │Frontend    │
                    │-Team       │              │-Team       │
                    │-Todolist.md│              │-Todolist.md│
                    └────────────┘              └────────────┘
```

---

## 📚 快速開始指南

### 我是產品經理
**建議閱讀順序**:
1. [PRD.md](./01-requirements/PRD.md) - 了解產品需求
2. [Project-Roadmap.md](./03-planning/Project-Roadmap.md) - 追蹤專案進度
3. [Backend](./04-execution/backend/Backend-Team-Todolist.md)/[Frontend-Team-Todolist.md](./04-execution/frontend/Frontend-Team-Todolist.md) - 檢視團隊進度
4. [Change-Log.md](./05-change-management/Change-Log.md) - 了解變更歷史

### 我是後端開發者
**建議閱讀順序**:
1. [PRD.md](./01-requirements/PRD.md) (快速瀏覽) - 了解背景
2. [SDD.md](./02-design/SDD.md) - 了解技術架構
3. [API-Specification.md](./02-design/API-Specification.md) - 實作 API 規格
4. [Database-Design.md](./02-design/Database-Design.md) - 設計資料表
5. [Backend-Team-Todolist.md](./04-execution/backend/Backend-Team-Todolist.md) - 開始開發任務
6. 部署準備：查看 `docs/04-execution/devops/` 目錄下的部署文件

### 我是前端開發者
**建議閱讀順序**:
1. [PRD.md](./01-requirements/PRD.md) (快速瀏覽) - 了解功能需求
2. [SDD.md](./02-design/SDD.md) - 了解前端技術選型
3. [API-Specification.md](./02-design/API-Specification.md) - 了解如何串接 API
4. [Frontend-Team-Todolist.md](./04-execution/frontend/Frontend-Team-Todolist.md) - 開始開發任務

### 我是 DevOps / 部署工程師
**建議閱讀順序**:
1. [SDD.md](./02-design/SDD.md) - 了解系統架構
2. [部署文件目錄](./04-execution/devops/) - 查看所有部署相關文件
3. [Zeabur CLI 文檔](./04-execution/devops/Zeabur%20CLI.md) - Zeabur 命令行工具
4. [Database-Migration-Guide.md](./02-design/Database-Migration-Guide.md) - 資料庫遷移

### 我是測試人員
**建議閱讀順序**:
1. [PRD.md](./01-requirements/PRD.md) - 了解驗收標準
2. [API-Specification.md](./02-design/API-Specification.md) - 撰寫 API 測試
3. [Backend](./04-execution/backend/Backend-Team-Todolist.md)/[Frontend-Team-Todolist.md](./04-execution/frontend/Frontend-Team-Todolist.md) - 了解測試要求

---

## 📊 專案當前狀態

| 階段 | 狀態 | 完成度 |
|------|------|--------|
| **Phase 1: 專案設置與基礎架構** | ✅ 完成 | 100% |
| **Phase 2: 後端 API 開發** | ✅ 完成 | 100% |
| **Phase 3: 前端開發** | ✅ 完成 | 100% |
| **Phase 4: 整合測試與 QA** | ✅ 完成 | 100% |
| **Phase 5: 部署與上線** | ✅ 完成 | 100% (Vercel + Zeabur 已上線) |
| **Phase 6: 功能擴展** | ⏳ 規劃中 | 0% (待啟動) |

**整體進度**: 100% (MVP 已完成並成功部署上線)

**目標 MVP 上線日期**: 2025-11-06 (已提前完成於 2025-10-19)

---

## 🔧 文件維護

### 更新規則
- **PRD.md**: 功能需求變更時更新
- **SDD.md**: 技術架構或選型變更時更新
- **API-Specification.md**: API 介面變更時更新
- **Database-Design.md**: Schema 變更時更新
- **Project-Roadmap.md**: 時程或里程碑調整時更新
- **Team-Todolist.md**: 每日或每週更新進度

### 版本控制
所有文件使用 Git 追蹤變更，重大更新需更新文件內的「變更歷史記錄」表格。

---

## 📞 聯絡資訊

**文件維護負責人**: Technical Team
**最後更新日期**: 2025-10-19 (Vercel + Zeabur 部署完成)
**下次審查日期**: 2025-11-01

---

**祝開發順利！** 🚀
