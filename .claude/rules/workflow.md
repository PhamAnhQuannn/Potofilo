---
paths: ['**']
---

# Rule — Đánh giá tác động trước + giữ đúng phạm vi

Áp cho MỌI việc mới: feature mới, issue mới, sửa lỗi mới.

## Bước 1 — Đánh giá tác động TRƯỚC khi động tay
Trước khi sửa bất cứ gì, liệt kê việc thay đổi sẽ ảnh hưởng tới:
- **Files** — file nào phải sửa, file nào bị ảnh hưởng gián tiếp.
- **Business case** — thay đổi này phục vụ mục tiêu gì.
- **Business stories / user stories** — ảnh hưởng luồng người dùng / giá trị nào.
- **Quyết định + kế hoạch cũ** — có va chạm `brain/decisions/*` hay `tracking/` không.

## Bước 2 — Cập nhật công việc dự tính + ghi issue liên quan
Dựa trên tác động + việc đã làm trước, cập nhật kế hoạch:
- Ghi việc dự tính vào `brain/tracking/STATE.md` (hoặc `backlog.md`) trước khi làm.
- Nếu đánh giá lộ ra **việc liên quan khác** → tạo file issue ở `brain/tracking/issues/` (viết dễ hiểu theo `.claude/rules/writing.md`, 1 file = 1 issue). KHÔNG tự xử ngoài phạm vi việc đang làm — cứ ghi lại để theo dõi.
- Chỉ làm đúng phần đã đánh giá.

Vòng đời issue: xử lý xong → viết report `tracking/reports/NNNN-*.md` → **XÓA file issue** (chi tiết ở `tracking/issues/README.md`).

## Bước 3 — Kỷ luật phạm vi (QUAN TRỌNG)
- Mỗi lần chỉ làm ĐÚNG phần việc đó. Không làm thừa.
- Ví dụ: sửa file CTA của một section → chỉ đụng section đó. KHÔNG sửa thiết kế các section xung quanh, KHÔNG đụng vào chúng.
- Cần thêm button mà section không đủ chỗ → KHÔNG tự ý đổi thiết kế section lân cận để nhét vào.

**Cốt lõi:** khi thay đổi một thứ mà phát hiện PHẢI sửa thứ khác (ngoài phạm vi việc đang làm) → **KHÔNG tự sửa thứ đó**. Thay vào đó ghi 1 issue liên quan ở `brain/tracking/issues/` để theo dõi, rồi để Quân quyết có làm tiếp không. Issue sinh ra chính vì lý do này.

## Bước 4 — Khi bị kẹt / khó giữ phạm vi
Nếu không làm được trong phạm vi (vd không đủ chỗ, va chạm thiết kế/quyết định):
- KHÔNG tự quyết mở rộng.
- Giải thích tình huống theo bộ luật đã setup (dễ hiểu, theo `.claude/rules/writing.md`) — nêu vấn đề + các phương án + trade-off.
- Đưa Quân quyết định, rồi mới làm tiếp.
