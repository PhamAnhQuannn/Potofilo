# 0018 — Hiến pháp v2.0 "MỘT hệ" (Kepler + nội dung là thiên thể)

- Ngày: 2026-08-17
- Trạng thái: chốt

## Bối cảnh
Sau nhiều vòng (galaxy boost → nebula → planets → living galaxy), nền và trang vẫn
là "hai lớp". Chốt triết lý mới: **không còn "nền" và "trang" — MỘT hệ duy nhất.**
Vụ nổ sinh ra tất cả · một nguồn sáng chiếu tất cả · một bộ luật Kepler vận hành
tất cả · 7 ô nội dung là những thiên thể gần người xem nhất.

## Quyết định (tu chính hiến pháp lên v2.0)
- **Trụ 1:** vụ nổ sinh TOÀN BỘ hệ (light echo mây + 5% hạt ngưng tụ thành hệ nền).
  Thiên thể được là artwork (ảnh) miễn tuân palette + LIGHT_DIR.
- **Trụ 2:** tile shade theo LIGHT_DIR; khí hậu màu = ánh thứ cấp (chỉ nhuộm).
- **Trụ 3:** tiểu khí hậu địa phương (planetshine); ẤM độc quyền lõi+CTA + ngoại lệ
  rocky (gỉ ấm, phản chiếu, mờ).
- **Trụ 4:** bảng lớp mới (mây back/mid → sao xa → distant/rocky → ice → dải+lõi →
  anchor+moon → mây front → bụi/embers → GRID). **Xóa quy tắc "cách grid 40px"** →
  chỉ mặt tối anchor (≤8% sáng) được sau grid.
- **Trụ 5:** thêm bậc "sự kiện lan sang nội dung = 8" (xung lõi quét tile).
- **Trụ 6 (mới) — Định luật vận hành:** Kepler tham số (tiêu điểm lõi, giãn 1.7×,
  v∝1/√r, trăng phân cấp transit 150s); cấm n-body + tương tác hành tinh–hành tinh.
- **Phụ lục Giải phẫu thiên thể:** 8 quyết định (anchor/moon/ice/rocky/distant + vỏ
  khí quyển + ambient + phối cảnh bậc xa).

## Quyết định thi công (thảo luận với Quân)
- **TUNE panel** (chưa có) → dựng trước, ?tune, nhóm Quỹ đạo/Khí hậu/Ánh sáng tile.
- **Ảnh** đặt dưới `app/assets/celestial/` (server serve docroot app/), thiếu file →
  procedural fallback. Loader grade thêm bằng canvas lúc load.
- **Thứ tự:** BLOCK 7 (hiến pháp) → TUNE → BLOCK 2 (Kepler) → 3 → 5 → 6 → 4 → 1.
- Mỗi block 1 commit; dừng hỏi nếu mâu thuẫn hiến pháp.

## Hệ quả
- `design-constitution.md` → v2.0 (đã cập nhật). Các block sau build theo v2.0.
- Kepler THAY vị trí cố định + trôi vi sai hiện tại của thiên thể (BLOCK 2 rewrite).
- `docs/` bản gốc đính kèm nay lệch — brain là nguồn thật.
