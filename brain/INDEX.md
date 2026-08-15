# brain/INDEX.md — Bảng định tuyến

Đọc file này TRƯỚC. Tìm việc cần làm ở cột trái → đọc file ở cột phải.

## Định tuyến

| Cần làm / cần biết | Đọc file |
|--------------------|----------|
| Portfolio là gì, cho ai, tone giọng | `context/product.md` |
| Stack, luồng dữ liệu, ranh giới module | `context/architecture.md` |
| Thuật ngữ nội bộ (project / case-study / draft...) | `context/glossary.md` |
| Luật không được vi phạm | `context/constraints.md` |
| Vì sao chọn công nghệ / cách tiếp cận | `decisions/` (đọc theo số thứ tự) |
| Đang làm gì, dừng ở đâu, next step | `tracking/STATE.md` |
| Báo cáo từng việc đã làm (dễ hiểu, 1 file/việc) | `tracking/reports/` |
| Việc liên quan phát sinh, đang mở (tạm, xong thì xóa) | `tracking/issues/` |
| Việc chờ làm | `tracking/backlog.md` |
| Kế hoạch dài hạn | `tracking/roadmap.md` |
| Lịch sử thay đổi | `history/CHANGELOG.md` |
| Nhật ký phiên làm việc | `history/sessions/` |
| Lỗi đã gặp + cách tránh | `memory/gotchas.md` |
| Sở thích của Quân (tooling, code style) | `memory/preferences.md` |
| Quy trình deploy / thêm feature | `playbooks/` |

## Luật brain

- `context/` — sự thật ổn định, hiếm đổi. Sửa khi sự thật đổi.
- `decisions/` — APPEND-ONLY. Quyết định mới = file mới, số tăng dần.
- `tracking/` — mutable, phản ánh HIỆN TẠI. `tracking/reports/` = báo cáo từng việc đã làm, viết dễ hiểu cho người non-tech (1 file = 1 việc hoàn chỉnh, không sửa sau khi xong). `tracking/issues/` = việc liên quan phát sinh, tạm thời — xong thì chuyển thành report và XÓA file issue.
- `history/` — APPEND-ONLY, phản ánh ĐÃ XẢY RA.
- `memory/` — bài học rút ra, cập nhật khi học được điều mới.
- `playbooks/` — quy trình lặp lại.

## Cập nhật não bộ

Sau mỗi phiên làm việc có ý nghĩa: chạy skill `.claude/skills/update-brain/SKILL.md`.
