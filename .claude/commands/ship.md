---
description: Chuẩn bị + đưa thay đổi lên production. Chạy checklist deploy.
---

# /ship

1. Chạy playbook `brain/playbooks/deploy.md` (build, lint, typecheck, perf, SEO).
2. Nếu pass → hỏi Quân xác nhận trước khi deploy/commit.
3. Deploy theo quy trình đã chốt.
4. Smoke test trang live.
5. Cập nhật `brain/history/CHANGELOG.md` + `tracking/STATE.md`.

> Không tự commit/deploy khi chưa được Quân xác nhận.
