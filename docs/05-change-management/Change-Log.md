# 變更日誌 (Change Log)
# TodoList 應用程式專案變更記錄

## 概述

本文件記錄專案所有重要變更，包括功能新增、文件更新、架構變更等。

遵循變更管理原則：
- 所有變更都需記錄在此
- 記錄影響範圍與版本變更
- 追蹤後續行動項目
- 通知相關團隊

---

## 變更記錄

### 2025-10-19 - Vercel + Zeabur 混合架構部署完成

#### 基本資訊
- **變更類別**: 基礎架構部署
- **變更人**: DevOps Team
- **優先級**: High
- **狀態**: ✅ 已完成（生產環境已上線）
- **相關 CR**: [CR-001](./CR-001-部署架構優化-20251019.md)

#### 變更摘要

**Vercel (前端) + Zeabur (後端/資料庫)** 混合架構已成功部署至生產環境，應用程式正式上線。

#### 部署成果

**已完成項目**:
- ✅ Vercel 前端部署（React + Vite）
- ✅ Zeabur 後端部署（Node.js + Express + TypeScript）
- ✅ Zeabur PostgreSQL 資料庫部署
- ✅ 環境變數配置完成
- ✅ CORS 跨域配置完成
- ✅ 資料庫 Migration 執行成功
- ✅ 前後端整合測試通過
- ✅ E2E 測試驗證通過

**部署架構**:
```
Vercel (全球 CDN)
  └── Frontend (React + Vite)
       ↓ HTTPS API 呼叫
Zeabur Platform
  ├── Backend (Node.js + Express)
  └── Database (PostgreSQL)
```

#### 實際效益

**效能提升**:
- ⚡ 前端透過 Vercel 全球 CDN 分發
- 📦 靜態資源自動優化與壓縮
- 🌍 全球邊緣節點加速

**成本優化**:
- 💰 年度成本：$12（僅域名費用）
- 🆓 Vercel 免費方案：100GB 頻寬/月
- 🆓 Zeabur 免費方案：後端 + 資料庫

**開發體驗**:
- 🔄 GitHub Push 自動部署
- 📊 Vercel Analytics 內建分析
- 🔍 即時錯誤監控

#### 部署時程

| 日期 | 階段 | 狀態 |
|------|------|------|
| 2025-10-19 | 技術準備（CORS、環境變數） | ✅ 完成 |
| 2025-10-19 | Vercel 前端部署 | ✅ 完成 |
| 2025-10-19 | Zeabur 後端 + DB 部署 | ✅ 完成 |
| 2025-10-19 | 整合測試與驗證 | ✅ 完成 |
| 2025-10-19 | 正式上線 | ✅ 完成 |

#### 技術配置

**Frontend (Vercel)**:
- 自動檢測 Vite 專案並建置
- 環境變數：`VITE_API_URL` (指向 Zeabur 後端)
- 手動部署完成（CI/CD 待配置）

**Backend (Zeabur)**:
- zbpack.json: `npx prisma migrate deploy && npm start`
- 環境變數：`DATABASE_URL=${POSTGRES_DATABASE_URL}`
- CORS 配置：允許 Vercel 域名 (`*.vercel.app`)
- 手動部署完成（CI/CD 待配置）

#### 相關文件更新

| 文件 | 更新內容 | 狀態 |
|------|---------|------|
| `CR-001-部署架構優化-20251019.md` | 更新部署狀態為已完成 | ✅ |
| `Change-Log.md` | 新增部署完成記錄 | ✅ |
| `README.md` | 更新 Phase 6 狀態 | ✅ |
| `Backend-Team-Todolist.md` | 更新 Phase 5 任務狀態 | ✅ |
| `Project-Roadmap.md` | 更新 Phase 5 進度 | ✅ |

#### 後續監控

- 🔄 持續監控效能數據
- 📊 收集用戶體驗反饋
- 🔍 監控錯誤日誌與警報
- 💰 追蹤實際成本支出

#### CI/CD 策略

**部署策略**:
- ✅ Vercel 和 Zeabur 已啟用 Git 自動部署（平台原生功能）
- ⏳ **待實施**: GitHub Actions CI 測試流程
  - 自動執行測試（單元、整合、E2E）
  - 產生測試報告和覆蓋率
  - 不涉及部署，僅質量保證

詳見: `docs/04-execution/devops/CI-CD-Strategy.md`

---

### 2025-10-19 - 部署架構優化為 Vercel + Zeabur 混合架構

#### 基本資訊
- **變更類別**: 基礎架構優化
- **變更人**: DevOps Team
- **優先級**: Medium
- **狀態**: ✅ 已完成（部署已上線）
- **相關 CR**: [CR-001](./CR-001-部署架構優化-20251019.md)

#### 變更摘要

將部署架構從單一 Zeabur 平台調整為 **Vercel (前端) + Zeabur (後端/資料庫)** 混合架構，以提升前端效能並降低成本。

#### 變更原因

**技術優化**:
- Vercel 提供全球 CDN 邊緣網絡，前端載入速度更快
- 專為 React/Vite 應用優化
- 更好的 CI/CD 體驗（PR 預覽環境）

**成本優化**:
- 兩個平台均使用免費方案
- 年度成本從 $72 降至 $12（僅域名費用）

**各取所長**:
- Vercel 專注前端靜態資源服務
- Zeabur 統一管理後端與資料庫

#### 影響範圍

**更新的文件**:

| 文件名稱 | 原版本 | 新版本 | 主要變更內容 |
|---------|--------|--------|-------------|
| `SDD.md` | v1.3.0 | v1.4.0 | • Section 1.2: 部署架構圖更新<br>• ADR-008: 更新為混合架構決策<br>• Section 10.2-10.3: 整合服務更新<br>• 移除已刪除的部署文檔連結 |
| `Project-Roadmap.md` | v1.5.0 | v1.6.0 | • Section 7.2: 部署架構圖<br>• Section 7.3: CI/CD Pipeline<br>• Section 7.6: 回滾計畫<br>• 決策點 4: 部署平台選擇<br>• 預算分配 ($72→$12) |
| `README.md` | - | - | • Section 8: 部署文件說明<br>• DevOps 閱讀指南<br>• 最新變更記錄<br>• 最後更新日期 |
| `Backend-Team-Todolist.md` | - | - | • Task 5.5: Railway → Zeabur<br>• CI/CD 部署目標更新 |
| `Change-Log.md` | - | - | • 新增本次變更記錄 |

**技術架構變更**:
- ✅ 前端部署：Zeabur → **Vercel**
- ✅ 後端部署：維持 **Zeabur**
- ✅ 資料庫：維持 **Zeabur PostgreSQL**

#### 相關團隊行動項目

**DevOps 團隊** (Phase 5 部署時執行):
- [x] 在 Vercel 建立前端專案並連接 GitHub
- [x] 配置 Vercel 環境變數（API URL）
- [x] 在 Zeabur 建立後端專案
- [x] 配置 Zeabur 環境變數（`DATABASE_URL=${POSTGRES_DATABASE_URL}`）
- [x] 部署 PostgreSQL 服務至 Zeabur
- [x] 測試前後端通訊連接

**Backend 團隊** (Phase 5 部署前):
- [x] 更新 CORS 配置，允許 Vercel 域名（`*.vercel.app`）
- [x] 檢查 API 回應格式與錯誤處理
- [x] 準備環境變數文檔

**Frontend 團隊**:
- [x] 確認前端環境變數配置（`VITE_API_URL`）
- [x] 測試 API 串接功能

**QA 團隊** (Phase 5 部署後):
- [x] 執行 E2E 測試驗證部署
- [x] 檢查前後端整合功能
- [x] 驗證 CORS 配置正確性

#### 時程影響

**無時程延遲** - 此為架構優化決策，不影響專案時程：
- 原定完成日期: 2025-11-06
- 調整後完成日期: 2025-11-06（不變）

#### 預期效益

**效能提升**:
- 前端全球 CDN 加速，載入速度提升 30-50%
- 靜態資源邊緣網絡分發

**成本降低**:
- 年度成本從 $72 降至 $12（83% 成本節省）

**開發體驗改善**:
- PR 自動預覽環境
- 更快的部署速度

#### 風險與應對

**潛在風險**:
- ⚠️ CORS 配置不當可能導致前後端無法通訊
- ⚠️ 需管理兩個平台（複雜度略增）

**應對措施**:
- ✅ 文檔詳細記錄 CORS 配置步驟
- ✅ 建立部署檢查清單
- ✅ Phase 5 部署前充分測試

#### 參考文件

- `docs/02-design/SDD.md` - Section 1.2 部署架構圖
- `docs/02-design/SDD.md` - ADR-008 技術決策記錄
- `docs/04-execution/devops/Zeabur CLI.md` - Zeabur 命令行工具使用指南
- `docs/02-design/Database-Migration-Guide.md` - 資料庫遷移說明

---

### 2025-10-18 - Zeabur 部署平台整合與文件結構重組

#### 類別: 基礎架構 + 文件管理

#### 變更內容

**1. 新增 Zeabur 部署平台支援**
- 新增完整部署文件 (4 份，共 2,213 行)
  - `Zeabur-Deployment-Guide.md` (951 行) - 完整部署指南
  - `Zeabur-Deployment-Summary.md` (418 行) - 快速概覽
  - `Zeabur-Deployment-Checklist.md` (345 行) - 部署檢查清單
  - `Database-Migration-Guide.md` (499 行) - 資料庫遷移指南
  - `Zeabur-Deployment-README.md` - 導航索引

- 新增配置檔案 (4 個)
  - `backend/zbpack.json` - 後端建置配置
  - `frontend/zbpack.json` - 前端建置配置
  - `backend/.env.example` - 後端環境變數範本
  - `frontend/.env.example` - 前端環境變數範本

**2. 文件更新**

**SDD.md (v1.2.0 → v1.3.0)**
- 新增 Section 1.2: 部署架構圖 (Zeabur 平台)
- 新增 ADR-008: 選擇 Zeabur 作為部署平台
- 更新 Section 10.2: 第三方整合 (新增 Zeabur 為已完成項目)
- 更新 Section 10.3: 整合架構圖
- 更新 Section 11.1: 相關文件連結 (反映新目錄結構)
- 新增文件狀態欄位與 CR (Change Request) 追蹤欄位

**Database-Design.md (v1.0.0 → v1.1.0)**
- 更新 Section 1.2: 資料庫基本資訊 (新增 Zeabur 生產環境)
- 新增 Section 6.4.3: Zeabur 平台部署遷移步驟
- 新增自動備份、連線池、高可用性資訊
- 新增環境變數模板語法說明 (`${POSTGRES_DATABASE_URL}`)
- 新增 zbpack.json 配置範例
- 新增文件狀態欄位與 CR 追蹤欄位

**3. 文件結構重組**

實施語義化目錄結構，從 `.doc/` 遷移至 `docs/`：

```
docs/
├── 01-requirements/          # 需求文件
│   └── PRD.md
├── 02-design/                # 設計文件
│   ├── SDD.md
│   ├── API-Specification.md
│   ├── Database-Design.md
│   ├── Database-Migration-Guide.md
│   └── Tailwind-CSS-Version-Comparison.md
├── 03-planning/              # 規劃文件
│   └── Project-Roadmap.md
├── 04-execution/             # 執行文件
│   ├── frontend/
│   │   └── Frontend-Team-Todolist.md
│   ├── backend/
│   │   └── Backend-Team-Todolist.md
│   └── devops/
│       ├── Zeabur-Deployment-README.md
│       ├── Zeabur-Deployment-Guide.md
│       ├── Zeabur-Deployment-Summary.md
│       └── Zeabur-Deployment-Checklist.md
└── 05-change-management/     # 變更管理
    └── Change-Log.md (本文件)
```

**4. 版本控制標準化**
- 採用語義化版本控制 (Semantic Versioning): Major.Minor.Patch
- 所有文件新增「狀態」欄位 (草稿/審核中/已核准/已廢棄)
- 變更歷史新增「相關 CR」欄位用於追蹤變更請求

#### 變更理由

**技術決策 (ADR-008)**:
- **一站式部署**: Zeabur 提供前端、後端、資料庫統一管理
- **Monorepo 支援**: 原生支援 `/backend` 和 `/frontend` 結構
- **環境變數模板**: `${POSTGRES_DATABASE_URL}` 自動連接服務
- **零配置 HTTPS**: 自動生成 SSL 證書
- **快速部署**: GitHub 推送自動觸發部署 (~2-3 分鐘)

**文件結構重組**:
- 提升文件可維護性與可發現性
- 符合業界標準實踐 (docs/ 目錄結構)
- 便於團隊協作與新成員導覽
- 分離不同階段文件 (需求、設計、執行)

#### 影響範圍

**系統架構**:
- 開發環境: SQLite (本地) → 無變更
- 生產環境: 新增 PostgreSQL (Zeabur 管理)
- 部署方式: 手動 → 自動化 CI/CD (GitHub → Zeabur)

**團隊工作流程**:
- 新增部署流程文件
- 新增環境變數管理流程
- 新增資料庫遷移流程

**相關文件**:
- 所有文件路徑更新 (`.doc/` → `docs/`)
- 內部連結需更新以反映新結構

#### 相關 CR

- CR-2025-001: Zeabur 部署平台整合 (未來建立)

#### 變更人

DevOps Team, Technical Team

---

## 變更統計

### 2025-10-18

| 類別 | 新增 | 修改 | 刪除 |
|------|------|------|------|
| 文件 | 5 | 2 | 0 |
| 配置檔案 | 4 | 0 | 0 |
| 目錄結構 | 1 | 0 | 1 |

**總計**:
- 新增文件: 9 個 (2,213 行)
- 更新文件: 2 個 (SDD.md, Database-Design.md)
- 新增目錄: docs/ (5 個子目錄)

---

## 變更審核

| 項目 | 狀態 | 審核人 | 日期 |
|------|------|--------|------|
| Zeabur 部署文件 | ✅ 已核准 | DevOps Lead | 2025-10-18 |
| SDD.md 更新 | ✅ 已核准 | Technical Lead | 2025-10-18 |
| Database-Design.md 更新 | ✅ 已核准 | Backend Lead | 2025-10-18 |
| 文件結構重組 | ✅ 已核准 | Project Manager | 2025-10-18 |

---

## 後續行動

- [ ] 更新 CI/CD pipeline 配置
- [ ] 更新團隊 Wiki 連結
- [ ] 通知團隊文件結構變更
- [ ] 建立 Zeabur 部署培訓材料
- [ ] 設定生產環境監控

---

## 文件維護

**維護責任**: 專案經理、技術負責人
**更新頻率**: 每次重大變更時更新
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-19
**下一次審查**: 2025-11-01

---

**變更日誌結束**
