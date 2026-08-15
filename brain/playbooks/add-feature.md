# Playbook — Thêm feature

1. Đọc `brain/INDEX.md` → định tuyến.
2. Đánh giá tác động (theo `.claude/rules/workflow.md`): files, business/user stories, quyết định + kế hoạch cũ bị ảnh hưởng.
3. Kiểm tra `context/constraints.md` — feature không vi phạm luật.
4. Việc liên quan phát sinh (không thuộc scope hiện tại) → ghi issue ở `tracking/issues/`, không tự xử.
5. Nếu là quyết định kiến trúc → tạo `decisions/NNNN-*.md` (append-only).
6. Cập nhật `tracking/STATE.md` (đang làm gì).
7. Code — chỉ đúng scope yêu cầu, không đụng phần xung quanh.
8. Test (build, typecheck, thử trên browser).
9. Viết report `tracking/reports/NNNN-*.md` (dễ hiểu cho non-tech, theo `.claude/rules/writing.md`) + thêm dòng vào `reports/README.md`. Nếu việc này là 1 issue → XÓA file issue tương ứng.
10. Cập nhật `history/CHANGELOG.md` + STATE.md next step.
11. Chỉ commit khi Quân yêu cầu.
