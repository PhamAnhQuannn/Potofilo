---
paths: ['public/**']
---

# Rule — Assets (ảnh, media, model 3D, font)

- Ảnh: nén trước khi thêm; ưu tiên WebP/AVIF. Không commit ảnh > 1MB khi chưa tối ưu.
- Model 3D: nén (Draco/meshopt) nếu dùng.
- Font: self-host, subset khi có thể.
- Đặt tên file kebab-case, không dấu, không khoảng trắng.
