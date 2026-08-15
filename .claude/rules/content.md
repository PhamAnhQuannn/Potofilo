---
paths: ['content/**']
---

# Rule — Nội dung dự án (projects)

> Định dạng chốt ở `brain/decisions/0002-noi-dung-mdx-hay-cms.md`.

- Mỗi dự án 1 file/entry, có metadata bắt buộc: `title`, `slug`, `summary`, `tech[]`, `cover`, `date`, `links` (repo/demo).
- Ảnh đặt trong `public/`, tham chiếu bằng đường dẫn tương đối.
- `draft: true` → không render public.
- Không sửa `slug` sau khi publish (giữ URL ổn định).
