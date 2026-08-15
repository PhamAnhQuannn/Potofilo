# Architecture

> Stack CHƯA CHỐT. Xem `brain/decisions/0001-chon-stack.md`. Cập nhật file này khi có quyết định.

## Stack (dự kiến)
- Framework: TBD (Next.js App Router / Vite + React)
- Ngôn ngữ: TypeScript
- 3D/WebGL: TBD (Three.js / React Three Fiber)
- Styling: TBD (Tailwind / CSS Modules)
- Nội dung dự án: TBD (MDX / JSON / CMS)
- Deploy: TBD (Vercel)

## Luồng dữ liệu
- TODO: nguồn dữ liệu dự án → build → render

## Ranh giới module
- `app/` — UI + routing, KHÔNG chứa dữ liệu thô
- `content/projects/` — nguồn sự thật cho các dự án
- `public/` — asset tĩnh (ảnh, model 3D, font)
- `scripts/` — build/generate phụ trợ, KHÔNG chạy runtime

## Sơ đồ (điền sau)
```
TODO
```
