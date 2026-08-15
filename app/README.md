# Potofilo — Website (app/)

Portfolio cá nhân Phạm Anh Quân. Kiến trúc 3 giai đoạn:

- **Giai đoạn 1 (hiện tại):** website tĩnh hoàn chỉnh, 7 section, responsive, chạy khi TẮT JS.
- **Giai đoạn 2 (sau):** hero gắn quả cầu hạt Three.js vào `#cosmic-canvas-mount`.
- **Giai đoạn 3 (sau):** intro tự động (đã có sẵn ở `app/intro/`) — quả cầu nổ, hạt tụ thành section, ~15% hạt dư thành bụi vũ trụ trôi ở `#dust-layer`.

## Chạy
```bash
cd app
python -m http.server 4001
# http://localhost:4001/
```
Không cần build. Mở bằng HTTP server (không dùng `file://`).

## Cấu trúc
```
app/
  ├── index.html         — site tĩnh 7 section (giai đoạn 1)
  ├── site.js            — tăng cường (nav mobile, active link); no-JS vẫn chạy đủ
  ├── styles/main.css    — design token (:root) + layout + responsive
  ├── assets/            — ảnh (xem assets/README.md để biết kích thước cần)
  └── intro/             — module Cosmic Intro (giai đoạn 3)
```

## Stack
Vanilla HTML/CSS/JS + CSS thuần (biến CSS). Font: Unbounded (display) + Be Vietnam Pro (body, hỗ trợ tiếng Việt). Xem `brain/decisions/0001-chon-stack.md`.

## Điểm cắm cho giai đoạn 2 & 3 (BẮT BUỘC giữ)
| Điểm cắm | Ở đâu | Dùng cho |
|----------|-------|----------|
| `#cosmic-canvas-mount` | trong `#hero`, cột phải | GĐ2: gắn canvas quả cầu hạt |
| `<canvas id="dust-layer">` | đầu `<body>`, fixed, z-index dưới nội dung, pointer-events none | GĐ3: render bụi tàn dư |
| `id` mỗi section: `#hero #featured #projects #education #experience #skills #contact` | các `<section>` | GĐ3: tính vị trí đích cho hạt bay về |
| `data-cosmic-section` | mỗi `<section>` | GĐ3: đánh dấu section nhận hạt |
| `<span data-condense-target>` | bọc tiêu đề mỗi section | GĐ3: hiệu ứng "ngưng tụ từ hạt" |
| `#skip-intro` (button, `hidden`) | trong navbar | GĐ3: nút bỏ qua intro (đang ẩn) |
| `.navbar` | nổi trên cùng | GĐ3: 5 hành tinh thu nhỏ thành navbar này |

## Nội dung cần điền (placeholder `[...]` trong index.html)
- Hero: `[ngành]`, `[trường]`, `[tên công ty du lịch]`, `[tagline]`, `assets/avatar.jpg`
- Featured: `[Tên trang du lịch]`, `[URL trang live]`, 3 số liệu `[số]`, 4 tech tag, media
- Projects: 3–4 dự án (tên, mô tả, stack, GitHub, demo, ảnh)
- Education: `[Trường]`, `[Ngành]`, học bổng, môn học (GPA 3.75 / tốt nghiệp 2026 đã điền)
- Experience: `[Tên công ty du lịch]`, `[Thời gian]`, kinh nghiệm khác
- Skills: điền tag từng nhóm (KHÔNG dùng thanh %)
- Contact: `[GitHub URL]`, `[LinkedIn/Facebook URL]`, `[CV PDF URL]`, `[github-username]` (email đã điền)

## Chất lượng
- Chạy đủ khi tắt JS. Semantic HTML, heading đúng cấp, alt cho ảnh, focus rõ.
- Không đen thuần; palette theo token; accent điểm xuyết ~10%.
- Responsive 360px → 1440px+.
