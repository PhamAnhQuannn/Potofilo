# 0001 — Chọn stack

- **Trạng thái:** ĐÃ CHỐT (2026-08-15)
- **Ngày:** 2026-08-14

## Bối cảnh
Portfolio cá nhân, ưu tiên visual WebGL/3D tham vọng, cần SEO + deploy dễ.

## Lựa chọn
| Option | Ưu | Nhược |
|--------|-----|-------|
| Next.js App Router + R3F | SSR/SEO tốt, deploy Vercel mượt, ecosystem lớn | Nặng hơn, SSR + WebGL cần cấu hình |
| Vite + React + Three.js | Nhẹ, build nhanh, kiểm soát cao | SEO phải tự lo, không SSR sẵn |
| Vanilla + Three.js | Overhead tối thiểu | Tự làm nhiều, khó mở rộng |

## Quyết định
**Vanilla HTML/CSS/JS + CSS thuần** (biến CSS ở `:root`). Three.js r128 (CDN) chỉ cho phần hiệu ứng (giai đoạn 2/3). Font: display "Unbounded" + body "Be Vietnam Pro" (Google Fonts, hỗ trợ tiếng Việt), fallback về Be Vietnam Pro để mọi dấu tiếng Việt render đúng.

Quân giao chọn trong spec Giai đoạn 1 ("Chọn: ... ghi rõ").

## Lý do
- Kiến trúc 3 giai đoạn yêu cầu site tĩnh phải hoàn chỉnh khi TẮT JS (SEO + reduced-motion + no-JS). Vanilla + CSS thuần đạt điều này tự nhiên, không cần build/hydrate.
- Đồng bộ với intro (đã làm) cũng vanilla → một stack, không lệ thuộc framework.
- Không build step: deploy = phục vụ file tĩnh.
- CSS thuần + biến CSS khớp yêu cầu "design token cố định cho cả 3 giai đoạn".

## Hệ quả
- Site sống ở `app/` (docroot khi chạy local). `app/index.html` = site tĩnh; `app/styles/main.css` = token + layout; `app/site.js` = tăng cường (nav), no-JS safe.
- Intro (`app/intro/`) sẽ được phủ lên ở giai đoạn 3, KHÔNG chặn nội dung ở giai đoạn 1.
- Cập nhật `context/architecture.md` (đã phản ánh).
