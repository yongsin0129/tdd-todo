# 變更日誌 (Change Log)
# TodoList 應用程式專案變更記錄

## 概述

本文件記錄專案所有重要變更，包括功能新增、文件更新、架構變更等。

---

## 變更記錄

### 2025-10-18: Zeabur 部署平台整合與文件結構重組

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

**最後更新**: 2025-10-18
**下一次審查**: 2025-11-01

---

**變更日誌結束**
