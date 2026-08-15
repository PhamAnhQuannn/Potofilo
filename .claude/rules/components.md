---
paths: ['app/**', 'components/**']
---

# Rule — UI / Components

- TypeScript, không dùng `any`.
- Named export (không default export) — trừ khi framework bắt buộc (vd Next page/layout).
- Component thuần trình bày, KHÔNG chứa dữ liệu dự án cứng (lấy từ `content/`).
- Có fallback khi WebGL/3D không chạy + tôn trọng `prefers-reduced-motion`.
- Accessible: semantic HTML, alt text, focus state, contrast WCAG AA.
- Responsive mobile → desktop.
