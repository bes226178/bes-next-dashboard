# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

中華工程（BES）內部企業儀表板，使用 Next.js 15 App Router 架構。主要功能包含工令週報、政府採購標案、員工離職分析、員工持股信託、保證金管理等模組。語言為 JavaScript（非 TypeScript），UI 文字以繁體中文為主。

## Commands

```bash
npm run dev      # 開發伺服器（Turbopack，port 6230，綁定 0.0.0.0）
npm run build    # 生產環境建置
npm run start    # 啟動生產伺服器
npm run lint     # ESLint 檢查
```

## Architecture

### 路由結構（App Router）

- `/weekly-report` — 工令週報系統（核心功能，資料最複雜）
- `/gcc-tender` & `/gcc-tender/[id]` — 政府採購標案列表與詳情
- `/ensure` — 保證金管理
- `/employee-resigned-analysis` — 員工離職分析
- `/employee-stock-trust` — 員工持股信託
- `/admin` — 管理頁面
- `/lunch` — 午餐選擇器

每個路由資料夾內有自己的 `components/` 子目錄放置頁面專用元件。

### API Routes

- `/api/db` — 主要資料庫查詢端點（週報資料）
- `/api/tender/[id]` — 標案資料 API
- `/api/employee/resigned-analysis` — 員工資料 API
- `/api/token-validation` — Token 驗證端點

### 資料庫

**MSSQL**（主要）：透過 `src/lib/db.js` 的 `Database` 類別連接 DW 資料庫，`src/lib/tables.js` 的 `StageDatabase` 連接 STAGE 資料庫。伺服器位於 `10.21.1.125:1434`，使用連線池管理。

**Supabase**（次要）：透過 `src/lib/supabase.js` 連接，用於標案相關資料表（`gcc_tender_*`）。

### MCP 資料庫對應規則

當需要直接查詢資料庫時，依據關鍵字選擇 MCP 伺服器：
- `STAGE` → `mssqlSTAGE`
- `DW` → `mssqlDW`
- `finedb` → `mssqlfinedb`
- `gcmis` / `GOINFO` → `mssqlGOINFO`

### 認證機制

Token-based 驗證。URL query parameter 帶入 token，透過 `/api/token-validation` 驗證，對應 MSSQL 的 `SYS_ACCESS_TOKEN` 資料表。Client 端使用 `useTokenValidation` hook。

### 關鍵 Hooks

- `useDB(ordNo, selectedDate)` — 週報資料取得與日期篩選
- `useTokenValidation(token)` — Token 驗證狀態管理
- `useWeeklyReportDate` — 週報日期選擇
- `useGetOrdNo` — 從 URL 取得工令號

## Tech Stack & Styling

- **UI 框架**：MUI v7 + shadcn/ui（new-york style）並存
- **樣式**：Tailwind CSS v3 + Emotion (MUI) + CSS Variables（shadcn 色彩系統）
- **圖表**：ECharts + Recharts
- **表單**：React Hook Form + Zod 驗證
- **動畫**：Framer Motion
- **文件生成**：docx / docxtemplater / jsPDF

## Import Path Aliases

`@/*` 對應 `./src/*`（定義於 jsconfig.json）

## Import 排序規則（ESLint perfectionist）

Import 順序有嚴格分組：style → type → builtin/external → `@/components/**`（shadcn）→ `@mui/**` → routes → hooks → utils → internal → components → sections → auth → types → relative paths。

## Conventions

- 使用 `'use client'` 標記客戶端元件，預設為 Server Component
- 全域設定集中在 `src/config-global.js`（CONFIG, COLOR, SIZE 等常數）
- shadcn/ui 元件位於 `src/components/ui/`，額外動畫元件在 `aceternity-ui/` 和 `magic-ui/`
- 資料庫查詢使用參數化查詢（`request.input(key, value)`）防止 SQL Injection
- ESLint 使用 flat config 格式，未使用的 import 為 warning（`unused-imports` 插件）
