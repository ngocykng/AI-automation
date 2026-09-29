# ai_automation

Tài liệu ngắn gọn cho dự án `ai_automation` (backend + frontend).

## Tổng quan

- Repo bao gồm backend bằng TypeScript/Node và frontend bằng React (Vite), dùng để tạo và chạy các workflow hỗ trợ AI.
- Thành phần chính:
  - `backend/` — API Express + TypeScript, tích hợp AI, dùng PostgreSQL.
  - `frontend/` — Giao diện React + Vite, các component trình chỉnh sửa luồng (flow editor).

## Bắt đầu nhanh

Yêu cầu trước:

- Node.js (khuyến nghị 16+)
- npm hoặc yarn
- PostgreSQL (nếu muốn lưu trữ dữ liệu)

Chạy backend:

```bash
cd ai_automation/backend
npm install
# khởi động dev server (dùng tsx)
npm run dev
```

Chạy frontend:

```bash
cd ai_automation/frontend
npm install
npm run dev
```

Nếu có xung đột cổng (port), chỉnh lại cấu hình hoặc biến môi trường tương ứng.

## Các tập tin quan trọng

- Entry của backend: `ai_automation/backend/src/main.ts`
- Entry của frontend: `ai_automation/frontend/src/main.jsx`
- Component sidebar node: `ai_automation/frontend/src/components/workflow/NodeSidebar.jsx`

## Biến môi trường và API bên ngoài

Backend sử dụng vài API và khóa bí mật. Đặt chúng trong file `.env` hoặc biến môi trường:

- `GEMINI_API_KEY` — khoá Google Gemini / Google GenAI (dùng trong `runAIagent.ts`).
- `GROQ_API_KEY` — khoá API cho Groq provider (dùng làm fallback).
- `YOUTUBE_API_KEY` — (tuỳ chọn) dùng cho helper tìm kiếm YouTube.
- `JWT_SECRET` — secret để ký JWT (nếu không đặt sẽ mặc định `secret` trong mã).

Lưu ý: kết nối cơ sở dữ liệu hiện đang được cấu hình cứng trong `ai_automation/backend/src/database/connection.ts`. Nếu bạn chạy PostgreSQL ở cấu hình khác, cập nhật file này hoặc chuyển sang dùng biến môi trường.

## Cơ sở dữ liệu

Cấu hình mặc định (xem `database/connection.ts`):

- user: postgres
- host: localhost
- database: AI_AUTOMATION
- password: 1234
- port: 5000

Tạo database và chạy các script schema/seed nếu cần (xem folder `ai_automation/database/` nếu có).

## Hành vi đáng chú ý

- Backend dùng `tsx watch` cho phát triển (`npm run dev`).
- Frontend dùng Vite (`npm run dev`).
- Component `NodeSidebar.jsx` có cơ chế autosave (debounce) gửi `PUT /nodes/:id` khi người dùng thay đổi trường.

## Gợi ý cải thiện

- Di chuyển thông tin kết nối DB sang biến môi trường.
- Thêm file `README.md` gốc cho repository (nếu cần).
- Thêm file `.env.example` để liệt kê các biến môi trường cần thiết cho developer mới.

## Nơi tìm mã nguồn

- Controllers backend: `ai_automation/backend/src/controllers/`
- Services backend: `ai_automation/backend/src/services/`
- Components frontend: `ai_automation/frontend/src/components/`

---
Tôi đã chuyển README sang tiếng Việt. Nếu bạn muốn tôi mở rộng phần API (liệt kê endpoint và ví dụ request/response), tạo `.env.example`, hoặc chuyển cấu hình DB sang dùng biến môi trường, hãy chọn một tác vụ tiếp theo.
