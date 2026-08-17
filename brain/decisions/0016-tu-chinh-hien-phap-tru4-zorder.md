# 0016 — Tu chính hiến pháp Trụ 4 (z-order sao/thiên thể) + ràng buộc rìa sáng

- Ngày: 2026-08-17
- Trạng thái: chốt

## Bối cảnh
Bản 1.2 (realistic-planets) vẽ sao ĐÈ lên đĩa hành tinh → "sao xuyên qua hành tinh".
Đây là cờ đỏ cartoon rõ nhất, đi ngược mục tiêu 1.2. Nguyên nhân: bảng Trụ 4 gộp
ẩu "sao & bụi" chung một lớp, trong khi vật lý chúng ở hai đầu vũ trụ.

Nguyên tắc rút ra: **hiến pháp không phải kinh thánh** — khi mâu thuẫn vật lý,
TU CHÍNH qua `brain/decisions/` chứ không lách. Claude Code theo luật cứng #0
(không tự vi phạm hiến pháp) là đúng; chỗ sai là ở bảng, nên sửa bảng.

## Quyết định
1. **Tu chính Trụ 4 (v1.1):** tách "sao & bụi":
   - **Lớp 1b Sao xa** (sao 3 cấp) — vẽ SAU thiên thể (bị hành tinh che), parallax 0.02.
   - **Lớp 3 Bụi gần** (bụi/than hồng/sao băng) — trước thiên thể, parallax 0.06–0.12.
   - Z-order vẽ: tinh vân < sao xa < thiên thể < bụi/embers < tile < overlay.
   - Đồng biến vẫn giữ (xa = parallax nhỏ). Cập nhật `brain/context/design-constitution.md`.
   - Code: `dust-layer.js` đổi thứ tự vẽ nebulaBg → stars → celestials → dust/embers.

2. **Ràng buộc rìa sáng hành tinh:** rìa hành tinh cách bounding-box grid ≥ 40px
   mọi viewport; viewport hẹp (≤1440) cắt sâu hơn. Hướng sáng KHÔNG đổi (Trụ 2) →
   xử ở VỊ TRÍ/crop. Code: planet đặt trái grid ≥40px (`gridLeft-40-R`), moon phải
   grid ≥40px (`gridRight+40+R`). Viewport 1440×900 là rủi ro nhất — duyệt tay.

3. **Viền khí quyển solid `#CDE3FF`:** chấp nhận (nuance đánh bóng, không phải cấu
   trúc). Ghi backlog polish "pha #E84A8A hai đầu lưỡi liềm" — không chặn tiến độ.

## Hệ quả
- BƯỚC 2 (audit z-order) phải theo hiến pháp v1.1 — nên tu chính TRƯỚC audit,
  tránh audit tự mâu thuẫn.
- `docs/design-constitution.md` (bản đính kèm gốc) nay lệch bản brain — brain là nguồn thật.
