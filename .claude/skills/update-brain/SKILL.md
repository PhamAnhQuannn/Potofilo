---
name: update-brain
description: Tự cập nhật não bộ sau phiên làm việc — STATE, CHANGELOG, session log, decisions/memory nếu có. Trigger "update brain", "/retro", cuối phiên có ý nghĩa.
---

# Skill — Cập nhật não bộ

## Bước
1. `brain/tracking/STATE.md` — cập nhật đang làm / dừng ở đâu / next step / blocker.
2. Nếu vừa hoàn thành 1 việc trọn vẹn → viết report `brain/tracking/reports/NNNN-*.md` theo `.claude/rules/writing.md` (dễ hiểu cho non-tech, 1 file = 1 việc). Thêm dòng vào `reports/README.md`.
   - Nếu việc đó là một issue trong `brain/tracking/issues/` → sau khi viết report, XÓA file issue + xóa dòng khỏi bảng "Đang mở" trong `issues/README.md`.
   - Nếu phát sinh việc liên quan mới chưa xử → tạo file issue mới ở `brain/tracking/issues/`.
3. `brain/history/CHANGELOG.md` — append mục mới (ngày + tóm tắt).
4. `brain/history/sessions/YYYY-MM-DD.md` — nhật ký phiên (làm gì, quyết định, next).
5. Nếu có quyết định kiến trúc mới → `brain/decisions/NNNN-*.md` (append-only, số tăng).
6. Nếu học được bài học/lỗi → `brain/memory/gotchas.md` hoặc `preferences.md`.
7. Nếu sự thật ổn định đổi → cập nhật `brain/context/*`.
8. Nếu backlog thay đổi → `brain/tracking/backlog.md`.

## Luật
- decisions/ + history/ = APPEND-ONLY. Không sửa mục cũ.
