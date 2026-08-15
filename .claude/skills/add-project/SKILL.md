---
name: add-project
description: Thêm một dự án mới vào portfolio (metadata + nội dung + asset). Trigger khi Quân nói "thêm dự án", "add project", "/new-project".
---

# Skill — Thêm dự án

## Bước
1. Đọc `.claude/rules/content.md` + `brain/decisions/0002-*` để biết định dạng.
2. Hỏi/xác nhận metadata: title, slug, summary, tech[], cover, date, links.
3. Tạo entry trong `content/projects/`.
4. Thêm ảnh vào `public/` (theo rule assets).
5. Nếu là case study → viết body (vấn đề → giải pháp → kết quả).
6. Kiểm tra hiển thị trên browser.
7. Cập nhật `brain/history/CHANGELOG.md`.
