# API Specification Document
# TodoList 應用程式 API 規格文件

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件標題 | TodoList 應用程式 API 規格文件 (API Specification) |
| 版本號 | 1.1.0 |
| 撰寫日期 | 2025-10-17 |
| 最後更新 | 2025-10-24 |
| 撰寫人 | Backend Development Team |
| 審核人 | Technical Lead |
| 相關文件 | SDD.md, Database-Design.md, PRD.md |

## 變更歷史記錄

| 版本 | 日期 | 變更內容 | 變更人 |
|------|------|---------|--------|
| 1.1.0 | 2025-10-24 | 新增 priority 查詢參數、更新排序邏輯為三層排序、統一錯誤回應格式、新增優先級驗證規則 | Backend Team |
| 1.0.0 | 2025-10-17 | 初始版本建立 | Backend Team |

---

## 目錄

1. [API 概述](#1-api-概述)
2. [通用規範](#2-通用規範)
3. [認證機制](#3-認證機制)
4. [API 端點詳細規格](#4-api-端點詳細規格)
5. [資料模型](#5-資料模型)
6. [錯誤處理](#6-錯誤處理)
7. [API 使用範例](#7-api-使用範例)
8. [API 版本管理](#8-api-版本管理)
9. [速率限制](#9-速率限制)
10. [附錄](#10-附錄)

---

## 1. API 概述

### 1.1 基本資訊

| 項目 | 內容 |
|------|------|
| **Base URL (開發)** | `http://localhost:3000/api` |
| **Base URL (生產)** | `https://api.yourdomain.com/api` |
| **API 版本** | v1 (目前未在 URL 中體現，未來可能為 `/api/v1/`) |
| **協議** | HTTP/1.1, HTTPS (生產環境) |
| **資料格式** | JSON |
| **字元編碼** | UTF-8 |
| **認證方式** | 無 (MVP 階段) / JWT (未來) |

### 1.2 API 設計原則

- **RESTful 設計**: 遵循 REST 架構風格
- **資源導向**: 以資源為中心的 URL 設計
- **HTTP 動詞**: 正確使用 GET, POST, PUT, DELETE
- **統一回應格式**: 成功與錯誤皆有標準格式
- **冪等性**: PUT 和 DELETE 操作保證冪等
- **無狀態**: 每個請求包含所有必要資訊

### 1.3 API 功能概覽

| 功能 | 端點 | 方法 | 描述 |
|------|------|------|------|
| 新增待辦事項 | `/todos` | POST | 建立新的待辦事項 |
| 獲取所有待辦 | `/todos` | GET | 取得待辦事項列表（支援篩選、分頁） |
| 獲取單一待辦 | `/todos/:id` | GET | 取得指定 ID 的待辦事項 |
| 更新待辦事項 | `/todos/:id` | PUT | 更新指定 ID 的待辦事項 |
| 刪除待辦事項 | `/todos/:id` | DELETE | 刪除指定 ID 的待辦事項 |

### 1.4 互動式 API 文件

在開發環境中，可以訪問互動式 Swagger 文件:
```
http://localhost:3000/api-docs
```

---

## 2. 通用規範

### 2.1 請求格式

#### 2.1.1 HTTP Headers

所有請求應包含以下 Headers:

```http
Content-Type: application/json
Accept: application/json
```

未來可能需要的 Headers (Phase 2+):
```http
Authorization: Bearer {token}
X-API-Key: {api_key}
```

#### 2.1.2 請求主體格式

```json
{
  "field1": "value1",
  "field2": "value2"
}
```

### 2.2 回應格式

#### 2.2.1 成功回應

**格式**:
```json
{
  "success": true,
  "data": {
    // 回應資料
  },
  "message": "操作成功" // 選用
}
```

**範例**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "完成專案報告",
    "description": null,
    "isCompleted": false,
    "createdAt": "2025-10-17T10:00:00.000Z",
    "updatedAt": "2025-10-17T10:00:00.000Z",
    "completedAt": null
  }
}
```

#### 2.2.2 錯誤回應

**格式**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤訊息描述",
    "details": {} // 選用，詳細錯誤資訊
  }
}
```

**範例**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required and cannot be empty",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

### 2.3 HTTP 狀態碼

| 狀態碼 | 狀態文字 | 使用場景 |
|--------|---------|---------|
| **200** | OK | GET, PUT 成功 |
| **201** | Created | POST 成功建立資源 |
| **204** | No Content | DELETE 成功 (無回應內容) |
| **400** | Bad Request | 請求參數錯誤、驗證失敗 |
| **401** | Unauthorized | 未認證 (未來功能) |
| **403** | Forbidden | 無權限訪問 (未來功能) |
| **404** | Not Found | 資源不存在 |
| **422** | Unprocessable Entity | 語意錯誤、無法處理 |
| **429** | Too Many Requests | 超過速率限制 (未來功能) |
| **500** | Internal Server Error | 伺服器內部錯誤 |
| **503** | Service Unavailable | 服務暫時不可用 |

### 2.4 日期時間格式

所有日期時間使用 **ISO 8601** 格式:
```
YYYY-MM-DDTHH:mm:ss.sssZ
```

範例:
```
2025-10-17T10:30:45.123Z
```

---

## 3. 認證機制

### 3.1 當前狀態 (MVP)

MVP 階段**不需要認證**，所有 API 端點公開訪問。

### 3.2 未來規劃 (Phase 2+)

#### 3.2.1 JWT Bearer Token 認證

**請求 Header**:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token 取得流程**:
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

#### 3.2.2 未認證錯誤回應

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

---

## 4. API 端點詳細規格

### 4.1 新增待辦事項

#### 基本資訊

| 項目 | 內容 |
|------|------|
| **端點** | `/api/todos` |
| **方法** | POST |
| **描述** | 建立一個新的待辦事項 |
| **認證** | 不需要 (MVP) |
| **速率限制** | 100 次/小時 (未來) |

#### 請求參數

**Headers**:
```http
Content-Type: application/json
```

**Body (JSON)**:

| 欄位 | 型別 | 必填 | 描述 | 限制 |
|------|------|------|------|------|
| `title` | string | ✅ 是 | 待辦事項標題 | 1-255 字元，不可為空白 |
| `description` | string | ❌ 否 | 詳細描述 | 最多 1000 字元 |
| `priority` | string | ❌ 否 | 優先級 | 'CRITICAL', 'HIGH', 'NORMAL', 'LOW' (預設: 'LOW') |
| `dueDate` | string | ❌ 否 | 截止日期 | ISO 8601 格式 (未來功能) |

**請求範例**:
```json
{
  "title": "完成專案報告",
  "description": "需要包含需求分析和系統設計兩個部分"
}
```

#### 成功回應

**狀態碼**: `201 Created`

**回應 Body**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "完成專案報告",
    "description": "需要包含需求分析和系統設計兩個部分",
    "isCompleted": false,
    "createdAt": "2025-10-17T10:00:00.000Z",
    "updatedAt": "2025-10-17T10:00:00.000Z",
    "completedAt": null
  }
}
```

#### 錯誤回應

**1. 驗證錯誤 - 標題為空**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required and cannot be empty",
    "details": {
      "field": "title"
    }
  }
}
```

**2. 驗證錯誤 - 標題過長**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title must be less than 255 characters",
    "details": {
      "field": "title",
      "maxLength": 255
    }
  }
}
```

**3. JSON 格式錯誤**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "INVALID_JSON",
    "message": "Invalid JSON format in request body"
  }
}
```

#### cURL 範例

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "完成專案報告",
    "description": "需要包含需求分析和系統設計兩個部分"
  }'
```

---

### 4.2 獲取所有待辦事項

#### 基本資訊

| 項目 | 內容 |
|------|------|
| **端點** | `/api/todos` |
| **方法** | GET |
| **描述** | 取得待辦事項列表，支援篩選、分頁、排序 |
| **認證** | 不需要 (MVP) |
| **速率限制** | 1000 次/小時 (未來) |

#### 請求參數

**Query Parameters**:

| 參數 | 型別 | 必填 | 預設值 | 描述 |
|------|------|------|--------|------|
| `page` | integer | ❌ 否 | 1 | 頁碼 (從 1 開始) |
| `limit` | integer | ❌ 否 | 20 | 每頁筆數 (1-100) |
| `isCompleted` | boolean | ❌ 否 | - | 篩選完成狀態 (true/false) |
| `priority` | string | ❌ 否 | - | 篩選優先級 (CRITICAL/HIGH/NORMAL/LOW) |
| `sortBy` | string | ❌ 否 | 三層排序 | 排序欄位 (createdAt, updatedAt, title) |
| `order` | string | ❌ 否 | desc | 排序方向 (asc, desc) |

**注意**: 預設使用三層排序邏輯:
1. **完成狀態**: 未完成 > 已完成
2. **優先級**: CRITICAL > HIGH > NORMAL > LOW
3. **建立時間**: 新的 > 舊的 (DESC)

**請求範例**:
```http
GET /api/todos?page=1&limit=10&isCompleted=false&sortBy=createdAt&order=desc
```

#### 成功回應

**狀態碼**: `200 OK`

**回應 Body**:
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "完成專案報告",
      "description": "需要包含需求分析和系統設計兩個部分",
      "isCompleted": false,
      "createdAt": "2025-10-17T10:00:00.000Z",
      "updatedAt": "2025-10-17T10:00:00.000Z",
      "completedAt": null
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "回覆客戶郵件",
      "description": null,
      "isCompleted": false,
      "createdAt": "2025-10-17T09:30:00.000Z",
      "updatedAt": "2025-10-17T09:30:00.000Z",
      "completedAt": null
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

**空結果回應**:
```json
{
  "success": true,
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

#### 錯誤回應

**1. 無效的查詢參數**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid query parameter: limit must be between 1 and 100",
    "details": {
      "field": "limit",
      "value": 150
    }
  }
}
```

#### cURL 範例

```bash
# 獲取所有待辦事項
curl http://localhost:3000/api/todos

# 只獲取未完成的待辦事項
curl "http://localhost:3000/api/todos?isCompleted=false"

# 分頁查詢
curl "http://localhost:3000/api/todos?page=2&limit=20"
```

---

### 4.3 獲取單一待辦事項

#### 基本資訊

| 項目 | 內容 |
|------|------|
| **端點** | `/api/todos/:id` |
| **方法** | GET |
| **描述** | 取得指定 ID 的待辦事項詳細資訊 |
| **認證** | 不需要 (MVP) |

#### 請求參數

**URL Parameters**:

| 參數 | 型別 | 必填 | 描述 |
|------|------|------|------|
| `id` | string (UUID) | ✅ 是 | 待辦事項的唯一識別碼 |

**請求範例**:
```http
GET /api/todos/550e8400-e29b-41d4-a716-446655440000
```

#### 成功回應

**狀態碼**: `200 OK`

**回應 Body**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "完成專案報告",
    "description": "需要包含需求分析和系統設計兩個部分",
    "isCompleted": false,
    "createdAt": "2025-10-17T10:00:00.000Z",
    "updatedAt": "2025-10-17T10:00:00.000Z",
    "completedAt": null
  }
}
```

#### 錯誤回應

**1. 待辦事項不存在**

狀態碼: `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo with id '550e8400-e29b-41d4-a716-446655440000' not found"
  }
}
```

**2. 無效的 UUID 格式**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid UUID format",
    "details": {
      "field": "id",
      "value": "invalid-id"
    }
  }
}
```

#### cURL 範例

```bash
curl http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

---

### 4.4 更新待辦事項

#### 基本資訊

| 項目 | 內容 |
|------|------|
| **端點** | `/api/todos/:id` |
| **方法** | PUT |
| **描述** | 更新指定 ID 的待辦事項 (支援部分更新) |
| **認證** | 不需要 (MVP) |
| **冪等性** | 是 |

#### 請求參數

**URL Parameters**:

| 參數 | 型別 | 必填 | 描述 |
|------|------|------|------|
| `id` | string (UUID) | ✅ 是 | 待辦事項的唯一識別碼 |

**Body (JSON)**:

| 欄位 | 型別 | 必填 | 描述 | 限制 |
|------|------|------|------|------|
| `title` | string | ❌ 否 | 待辦事項標題 | 1-255 字元 |
| `description` | string | ❌ 否 | 詳細描述 | 最多 1000 字元 |
| `isCompleted` | boolean | ❌ 否 | 完成狀態 | true/false |
| `priority` | string | ❌ 否 | 優先級 | 'CRITICAL', 'HIGH', 'NORMAL', 'LOW' |
| `dueDate` | string | ❌ 否 | 截止日期 | ISO 8601 格式 (未來) |

**注意**:
- 只需提供要更新的欄位
- `id`, `createdAt`, `updatedAt`, `completedAt` 為唯讀欄位，無法更新
- `updatedAt` 會自動更新為當前時間
- 當 `isCompleted` 設為 `true` 時，`completedAt` 自動設定為當前時間
- 當 `isCompleted` 設為 `false` 時，`completedAt` 自動清除為 `null`

**請求範例**:

**1. 更新標題**:
```json
{
  "title": "完成專案報告 (已更新)"
}
```

**2. 標記為完成**:
```json
{
  "isCompleted": true
}
```

**3. 同時更新多個欄位**:
```json
{
  "title": "完成專案報告 (最終版)",
  "description": "已包含所有章節",
  "isCompleted": true
}
```

#### 成功回應

**狀態碼**: `200 OK`

**回應 Body**:
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "完成專案報告 (最終版)",
    "description": "已包含所有章節",
    "isCompleted": true,
    "createdAt": "2025-10-17T10:00:00.000Z",
    "updatedAt": "2025-10-17T11:30:00.000Z",
    "completedAt": "2025-10-17T11:30:00.000Z"
  }
}
```

#### 錯誤回應

**1. 待辦事項不存在**

狀態碼: `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo with id '550e8400-e29b-41d4-a716-446655440000' not found"
  }
}
```

**2. 驗證錯誤**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title cannot be empty",
    "details": {
      "field": "title"
    }
  }
}
```

**3. 嘗試更新唯讀欄位**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Cannot update read-only fields: id, createdAt",
    "details": {
      "readOnlyFields": ["id", "createdAt"]
    }
  }
}
```

#### cURL 範例

```bash
# 更新標題
curl -X PUT http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"title": "完成專案報告 (已更新)"}'

# 標記為完成
curl -X PUT http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"isCompleted": true}'
```

---

### 4.5 刪除待辦事項

#### 基本資訊

| 項目 | 內容 |
|------|------|
| **端點** | `/api/todos/:id` |
| **方法** | DELETE |
| **描述** | 刪除指定 ID 的待辦事項 (硬刪除) |
| **認證** | 不需要 (MVP) |
| **冪等性** | 是 |

#### 請求參數

**URL Parameters**:

| 參數 | 型別 | 必填 | 描述 |
|------|------|------|------|
| `id` | string (UUID) | ✅ 是 | 待辦事項的唯一識別碼 |

**請求範例**:
```http
DELETE /api/todos/550e8400-e29b-41d4-a716-446655440000
```

#### 成功回應

**狀態碼**: `200 OK`

**回應 Body**:
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**或** (替代方案):

**狀態碼**: `204 No Content`

**回應 Body**: 無

#### 錯誤回應

**1. 待辦事項不存在**

狀態碼: `404 Not Found`
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo with id '550e8400-e29b-41d4-a716-446655440000' not found"
  }
}
```

**2. 無效的 UUID 格式**

狀態碼: `400 Bad Request`
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid UUID format",
    "details": {
      "field": "id"
    }
  }
}
```

#### 冪等性說明

多次刪除同一個資源應該返回相同結果:
- 第一次刪除: 返回 `200 OK` 或 `204 No Content`
- 後續刪除: 返回 `404 Not Found`

#### cURL 範例

```bash
curl -X DELETE http://localhost:3000/api/todos/550e8400-e29b-41d4-a716-446655440000
```

---

## 5. 資料模型

### 5.1 Todo 資料模型

#### TypeScript 介面定義

```typescript
interface Todo {
  id: string;           // UUID v4 格式
  title: string;        // 1-255 字元，必填
  description?: string; // 最多 1000 字元，選填
  isCompleted: boolean; // 預設 false
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW'; // 預設 'LOW'
  createdAt: Date;      // ISO 8601 格式
  updatedAt: Date;      // ISO 8601 格式
  completedAt?: Date;   // ISO 8601 格式，選填
}
```

#### 欄位詳細說明

| 欄位 | 型別 | 必填 | 預設值 | 描述 | 限制 |
|------|------|------|--------|------|------|
| `id` | string (UUID) | ✅ | 自動生成 | 唯一識別碼 | UUID v4 格式 |
| `title` | string | ✅ | - | 待辦事項標題 | 1-255 字元，不可為空白 |
| `description` | string | ❌ | null | 詳細描述 | 最多 1000 字元 |
| `isCompleted` | boolean | ✅ | false | 完成狀態 | true/false |
| `priority` | string | ✅ | "LOW" | 優先級 | 'CRITICAL', 'HIGH', 'NORMAL', 'LOW' |
| `createdAt` | Date | ✅ | 當前時間 | 建立時間 | ISO 8601 格式 |
| `updatedAt` | Date | ✅ | 當前時間 | 最後更新時間 | ISO 8601 格式，自動更新 |
| `completedAt` | Date | ❌ | null | 完成時間 | ISO 8601 格式，完成時自動設定 |

#### 未來擴展欄位 (Phase 2+)

```typescript
interface TodoExtended extends Todo {
  priority: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';  // 優先級 (已實作 - CR-002)
  dueDate?: Date;                                     // 截止日期 (未來)
  tags?: string[];                                     // 標籤 (未來)
  userId?: string;                                     // 所屬使用者 (需要認證)
}
```

### 5.2 資料驗證規則

#### 5.2.1 Title 欄位驗證

```typescript
// 驗證規則
const titleValidation = {
  required: true,
  minLength: 1,
  maxLength: 255,
  trim: true,  // 自動去除前後空白
  pattern: /^.+$/  // 不可為純空白
}

// 有效範例
"完成專案報告" ✅
"Buy milk" ✅
"Call mom 📞" ✅

// 無效範例
"" ❌ (空字串)
"   " ❌ (純空白)
"超過255字元的超長標題..." ❌ (過長)
```

#### 5.2.2 Description 欄位驗證

```typescript
// 驗證規則
const descriptionValidation = {
  required: false,
  maxLength: 1000,
  nullable: true
}

// 有效範例
null ✅
"需要包含需求分析和系統設計" ✅
"" ✅ (空字串會轉為 null)

// 無效範例
"超過1000字元的超長描述..." ❌
```

#### 5.2.3 ID 欄位驗證

```typescript
// UUID v4 格式驗證
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

// 有效範例
"550e8400-e29b-41d4-a716-446655440000" ✅
"6ba7b810-9dad-11d1-80b4-00c04fd430c8" ✅

// 無效範例
"123" ❌
"not-a-uuid" ❌
"550e8400-XXXX-41d4-a716-446655440000" ❌
```

### 5.3 資料模型範例

#### 完整 Todo 物件範例

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "完成專案報告",
  "description": "需要包含以下章節:\n1. 需求分析\n2. 系統設計\n3. 測試計畫",
  "isCompleted": false,
  "createdAt": "2025-10-17T10:00:00.000Z",
  "updatedAt": "2025-10-17T10:00:00.000Z",
  "completedAt": null
}
```

#### 最小化 Todo 物件範例

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "Buy milk",
  "description": null,
  "isCompleted": false,
  "createdAt": "2025-10-17T10:05:00.000Z",
  "updatedAt": "2025-10-17T10:05:00.000Z",
  "completedAt": null
}
```

#### 已完成 Todo 物件範例

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "title": "回覆客戶郵件",
  "description": null,
  "isCompleted": true,
  "createdAt": "2025-10-17T09:00:00.000Z",
  "updatedAt": "2025-10-17T11:30:00.000Z",
  "completedAt": "2025-10-17T11:30:00.000Z"
}
```

---

## 6. 錯誤處理

### 6.1 錯誤碼定義

| 錯誤碼 | HTTP 狀態碼 | 描述 | 常見原因 |
|--------|-----------|------|---------|
| `VALIDATION_ERROR` | 400 | 輸入驗證失敗 | 必填欄位缺失、格式錯誤、長度超限 |
| `INVALID_JSON` | 400 | JSON 格式錯誤 | 請求 body 不是有效的 JSON |
| `INVALID_UUID` | 400 | UUID 格式錯誤 | ID 參數不符合 UUID 格式 |
| `NOT_FOUND` | 404 | 資源不存在 | 指定 ID 的 Todo 不存在 |
| `INTERNAL_SERVER_ERROR` | 500 | 伺服器內部錯誤 | 未預期的伺服器錯誤 |
| `DATABASE_ERROR` | 500 | 資料庫錯誤 | 資料庫操作失敗 |

### 6.2 錯誤回應範例

#### 6.2.1 驗證錯誤

**場景**: 標題欄位為空

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required and cannot be empty",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**場景**: 標題過長

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title must be less than 255 characters",
    "details": {
      "field": "title",
      "maxLength": 255,
      "actualLength": 300
    }
  }
}
```

**場景**: 多個欄位驗證失敗

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Multiple validation errors",
    "details": {
      "errors": [
        {
          "field": "title",
          "message": "Title is required"
        },
        {
          "field": "isCompleted",
          "message": "isCompleted must be a boolean"
        }
      ]
    }
  }
}
```

#### 6.2.2 資源不存在錯誤

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Todo with id '550e8400-e29b-41d4-a716-446655440000' not found"
  }
}
```

#### 6.2.3 JSON 格式錯誤

```json
{
  "success": false,
  "error": {
    "code": "INVALID_JSON",
    "message": "Invalid JSON format in request body",
    "details": {
      "position": 15,
      "expected": "}"
    }
  }
}
```

#### 6.2.4 伺服器內部錯誤

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred. Please try again later."
  }
}
```

**注意**: 伺服器內部錯誤不應暴露敏感資訊（如資料庫錯誤細節）給客戶端

### 6.3 錯誤處理最佳實踐

#### 客戶端處理建議

```typescript
async function createTodo(title: string) {
  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });

    const data = await response.json();

    if (!response.ok) {
      // 處理錯誤
      switch (data.error.code) {
        case 'VALIDATION_ERROR':
          console.error('驗證失敗:', data.error.message);
          break;
        case 'NOT_FOUND':
          console.error('資源不存在');
          break;
        default:
          console.error('未知錯誤:', data.error.message);
      }
      throw new Error(data.error.message);
    }

    return data.data;
  } catch (error) {
    console.error('請求失敗:', error);
    throw error;
  }
}
```

---

## 7. API 使用範例

### 7.1 完整使用流程範例

#### 場景: 使用者管理待辦事項的完整流程

```javascript
// 1. 建立新的待辦事項
const newTodo = await fetch('/api/todos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '完成專案報告',
    description: '需要包含需求分析和系統設計'
  })
}).then(res => res.json());

console.log('建立成功:', newTodo.data);
// { id: "550e8400...", title: "完成專案報告", ... }


// 2. 獲取所有未完成的待辦事項
const activeTodos = await fetch('/api/todos?isCompleted=false')
  .then(res => res.json());

console.log('未完成項目:', activeTodos.data);


// 3. 更新待辦事項標題
const updatedTodo = await fetch(`/api/todos/${newTodo.data.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '完成專案報告 (最終版)'
  })
}).then(res => res.json());

console.log('更新成功:', updatedTodo.data);


// 4. 標記為完成
const completedTodo = await fetch(`/api/todos/${newTodo.data.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    isCompleted: true
  })
}).then(res => res.json());

console.log('已完成:', completedTodo.data);
// { ..., isCompleted: true, completedAt: "2025-10-17T11:30:00.000Z" }


// 5. 刪除待辦事項
await fetch(`/api/todos/${newTodo.data.id}`, {
  method: 'DELETE'
});

console.log('刪除成功');
```

### 7.2 React Hook 範例

```typescript
// hooks/useTodos.ts
import { useState, useEffect } from 'react';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 獲取所有待辦事項
  const fetchTodos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      setTodos(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // 新增待辦事項
  const createTodo = async (title: string, description?: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      setTodos([data.data, ...todos]);
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // 更新待辦事項
  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      setTodos(todos.map(todo =>
        todo.id === id ? data.data : todo
      ));
      return data.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // 刪除待辦事項
  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error.message);
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  // 切換完成狀態
  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    await updateTodo(id, { isCompleted: !todo.isCompleted });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refetch: fetchTodos
  };
}
```

### 7.3 Axios 範例

```typescript
// api/todos.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 錯誤處理攔截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error.message);
    }
    throw error;
  }
);

export const todosApi = {
  // 獲取所有待辦事項
  getAll: async (params?: { isCompleted?: boolean; page?: number; limit?: number }) => {
    const response = await api.get('/todos', { params });
    return response.data.data;
  },

  // 獲取單一待辦事項
  getById: async (id: string) => {
    const response = await api.get(`/todos/${id}`);
    return response.data.data;
  },

  // 建立待辦事項
  create: async (data: { title: string; description?: string }) => {
    const response = await api.post('/todos', data);
    return response.data.data;
  },

  // 更新待辦事項
  update: async (id: string, data: Partial<Todo>) => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data.data;
  },

  // 刪除待辦事項
  delete: async (id: string) => {
    await api.delete(`/todos/${id}`);
  }
};
```

---

## 8. API 版本管理

### 8.1 當前版本策略

**MVP 階段**:
- 版本: v1 (隱含)
- URL: `/api/todos`
- 不在 URL 中明確標示版本號

### 8.2 未來版本規劃

**Phase 2+**:
- 版本號將加入 URL: `/api/v1/todos`
- 支援多版本並存
- 使用語意化版本 (Semantic Versioning)

#### 版本升級策略

```
/api/v1/todos  (目前版本)
/api/v2/todos  (未來版本 - 破壞性變更)
```

#### 版本變更通知

- **Header 提示**: 回應中加入 `X-API-Version: 1.0`
- **棄用警告**: 舊版本 API 將在 Header 中加入 `X-API-Deprecated: true`
- **過渡期**: 新版本發布後，舊版本至少維護 6 個月

### 8.3 破壞性變更範例

以下變更被視為破壞性變更，需要升級版本:
- 移除端點
- 重新命名欄位
- 改變資料型別
- 改變預設值
- 改變回應格式結構

以下變更視為非破壞性變更，不需升級版本:
- 新增端點
- 新增選填欄位
- 新增查詢參數
- 改善效能
- Bug 修復

---

## 9. 速率限制

### 9.1 當前狀態 (MVP)

MVP 階段**沒有速率限制**。

### 9.2 未來規劃 (Phase 2+)

#### 9.2.1 速率限制規則

| 端點類型 | 限制 | 時間窗口 |
|---------|------|---------|
| **讀取操作** (GET) | 1000 次 | 每小時 |
| **寫入操作** (POST, PUT, DELETE) | 100 次 | 每小時 |
| **全域限制** | 5000 次 | 每天 |

#### 9.2.2 速率限制 Headers

**回應 Headers**:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1634472000
```

#### 9.2.3 超過限制回應

**狀態碼**: `429 Too Many Requests`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please try again later.",
    "details": {
      "limit": 100,
      "retryAfter": 3600
    }
  }
}
```

**Headers**:
```http
Retry-After: 3600
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1634472000
```

---

## 10. 附錄

### 10.1 完整 API 端點清單

| 方法 | 端點 | 描述 | 認證 |
|------|------|------|------|
| POST | `/api/todos` | 建立待辦事項 | ❌ |
| GET | `/api/todos` | 獲取待辦事項列表 | ❌ |
| GET | `/api/todos/:id` | 獲取單一待辦事項 | ❌ |
| PUT | `/api/todos/:id` | 更新待辦事項 | ❌ |
| DELETE | `/api/todos/:id` | 刪除待辦事項 | ❌ |

### 10.2 狀態碼快速參考

| 狀態碼 | 含義 | 常見場景 |
|--------|------|---------|
| 200 | OK | GET, PUT 成功 |
| 201 | Created | POST 成功 |
| 204 | No Content | DELETE 成功 |
| 400 | Bad Request | 驗證失敗 |
| 404 | Not Found | 資源不存在 |
| 500 | Internal Server Error | 伺服器錯誤 |

### 10.3 常見使用案例

#### 案例 1: 獲取所有未完成的待辦事項

```bash
curl "http://localhost:3000/api/todos?isCompleted=false"
```

#### 案例 2: 分頁獲取待辦事項

```bash
curl "http://localhost:3000/api/todos?page=2&limit=20"
```

#### 案例 3: 批次更新多個待辦事項

```javascript
const todoIds = ['id1', 'id2', 'id3'];

await Promise.all(
  todoIds.map(id =>
    fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted: true })
    })
  )
);
```

### 10.4 Postman Collection

可以從以下位置下載 Postman Collection:
```
/docs/postman/TodoList-API.postman_collection.json
```

包含所有端點的預設請求範例。

### 10.5 OpenAPI/Swagger 規格

完整的 OpenAPI 3.0 規格文件可以在以下位置查看:
- **開發環境**: http://localhost:3000/api-docs
- **JSON 格式**: http://localhost:3000/api-docs.json

### 10.6 相關文件連結

- **系統設計文件**: [SDD.md](./SDD.md)
- **資料庫設計文件**: [Database-Design.md](./Database-Design.md)
- **產品需求文件**: [PRD.md](./PRD.md)
- **專案路線圖**: [Project-Roadmap.md](./Project-Roadmap.md)
- **後端開發計畫**: [implementation-plan-backend.md](./implementation-plan-backend.md)

### 10.7 支援與聯絡

- **問題回報**: GitHub Issues
- **API 狀態**: http://status.yourdomain.com (未來)
- **技術支援**: support@yourdomain.com (未來)

---

## 文件維護

**維護責任**: 後端開發團隊負責人
**更新頻率**: 每次 API 變更時更新
**版本控制**: 使用 Git 追蹤變更

**最後更新**: 2025-10-24
**下一次審查**: 2025-11-01

---

**文件結束**
