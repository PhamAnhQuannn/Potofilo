# 0002 — Nguồn nội dung dự án: MDX hay CMS

- **Trạng thái:** ĐỀ XUẤT (chờ Quân chốt)
- **Ngày:** 2026-08-14

## Bối cảnh
Cần lưu dữ liệu các dự án (title, mô tả, ảnh, tech, link, case-study body).

## Lựa chọn
| Option | Ưu | Nhược |
|--------|-----|-------|
| MDX trong `content/projects/` | Git-versioned, không phụ thuộc dịch vụ, chèn component | Sửa phải qua code |
| JSON/YAML | Đơn giản, dễ parse | Không viết rich content dễ |
| Headless CMS (Sanity/Contentful) | Sửa không cần deploy | Thêm phụ thuộc, chi phí |

## Quyết định
TODO — Quân chốt.

## Hệ quả
TODO — định hình `content/` + rule `.claude/rules/content.md`.
