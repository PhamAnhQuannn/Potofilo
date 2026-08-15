# assets/ — ảnh & media

Thư mục ảnh cho site. Hiện để trống — chuẩn bị các file dưới đây.

| File | Dùng ở | Kích thước đề xuất | Ghi chú |
|------|--------|--------------------|---------|
| `avatar.jpg` | Hero | 144×144 (hiển thị 72px @2x) | Ảnh chân dung/avatar, vuông |
| `featured.jpg` hoặc `featured.mp4` | Featured project | 1600×800 (16:8) | Screenshot/video ngắn sản phẩm live |
| `project-1.jpg` … `project-4.jpg` | Projects grid | 800×450 (16:9) | Ảnh mỗi dự án |
| `cv.pdf` | Nút "Tải CV" | — | File CV (có thể để `assets/` hoặc link ngoài) |

## Quy tắc (theo `.claude/rules/assets.md`)
- Nén trước khi thêm; ưu tiên WebP/AVIF cho ảnh.
- Không thêm ảnh > 1MB khi chưa tối ưu.
- Tên file kebab-case, không dấu, không khoảng trắng.
- Mọi ảnh phải có `alt` mô tả trong HTML.
