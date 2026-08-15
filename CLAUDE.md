# Potofilo — Portfolio cá nhân Phạm Anh Quân

Website portfolio cá nhân. Trưng bày dự án, kỹ năng, liên hệ. Ưu tiên visual tham vọng (WebGL/3D) nhưng vẫn nhanh + accessible.

## Luật cứng (hard rules)

1. **Chỉ làm đúng thứ được yêu cầu.** Không tự thêm feature, refactor, file, hay "nice-to-have".
   - Trước mỗi việc mới: đánh giá tác động + giữ đúng phạm vi theo `.claude/rules/workflow.md`. Kẹt/khó → giải thích + để Quân quyết, không tự mở rộng.
2. **Não bộ là nguồn sự thật.** Trước khi làm, đọc `brain/INDEX.md` để định tuyến. Sau khi làm, cập nhật `brain/tracking/STATE.md`.
3. **`brain/decisions/` và `brain/history/` là append-only.** Không sửa file cũ.
4. **Không commit khi chưa được yêu cầu.** Không `--no-verify`, không skip hook.
5. **Stack chưa chốt** → xem `brain/decisions/0001-chon-stack.md`. Không cài dep / scaffold app khi chưa có quyết định.

## Bản đồ brain/

| Cần gì | Đọc |
|--------|-----|
| Định tuyến tổng | `brain/INDEX.md` |
| Sự thật ổn định (là gì, stack, thuật ngữ, ràng buộc) | `brain/context/` |
| Vì sao chọn X | `brain/decisions/` |
| Đang làm gì, next step | `brain/tracking/STATE.md` |
| Đã làm gì | `brain/history/CHANGELOG.md` |
| Bài học / sở thích | `brain/memory/` |
| Quy trình lặp lại | `brain/playbooks/` |

## Cấu trúc

- `.claude/` — rules (theo scope), skills, agents, commands, hooks, settings
- `brain/` — não bộ (context / decisions / tracking / history / memory / playbooks)
- `app/` — sản phẩm thật
- `content/` — dữ liệu dự án (projects)
- `public/` — ảnh, media, assets
- `scripts/` — script phụ trợ
- `docs/` — tài liệu cho người ngoài (khác brain/)
