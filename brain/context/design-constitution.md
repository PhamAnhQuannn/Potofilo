# DESIGN CONSTITUTION — Potofilo
# Đặt tại: brain/context/design-constitution.md
# Mọi thay đổi thị giác PHẢI đối chiếu file này trước khi code.
# Nếu một đề xuất vi phạm bất kỳ trụ nào → từ chối hoặc hỏi lại người dùng.

## Trụ 1 — Một câu chuyện: mọi thứ là vật chất từ vụ nổ
Mọi phần tử thị giác phải trả lời được "nó từ đâu ra?" bằng câu chuyện big bang:
- Tile = vật chất kết tinh · Bụi = 15% hạt thoát ly · Tinh vân = khí đã nguội
- Sao = bầu trời seed từ intro · Hành tinh nền = vật chất ngưng tụ ở xa
- Nhãn tile = tiếng vọng của nhãn hành tinh đã vỡ
KIỂM TRA: phần tử mới không kể được nguồn gốc từ vụ nổ → không thêm.

## Trụ 2 — Một nguồn sáng
- Lõi thiên hà (góc phải-trên) là mặt trời của cảnh. Hằng LIGHT_DIR dùng chung.
- Mọi thiên thể: mặt hướng sáng ấm + viền khí quyển; mặt khuất tối, lạnh.
- Cấm shading gradient đối xứng tâm cho vật thể (trừ điểm sáng tự phát: sao, glow).

## Trụ 3 — Màu = nhiệt độ = thời gian
- NÓNG (#FFFFFF → #FFF4D6 → #FFC864 → #FF8C42): năng lượng cao, "đang sống"
  → vụ nổ, CTA, tên, số liệu nổi bật, viền khí quyển, hover state
- CHUYỂN (#FF5E3A → #C2273D → #E84A8A → #7B2FBF): plasma, tia, dải ngân hà
- LẠNH (#4ECDC4 → #3A7BD5 → #2E1A6E): đã nguội, "bối cảnh"
  → tinh vân, thân hành tinh, viền tile, tag, nhãn phụ
- NỀN (#07071A → #0D0B21): không bao giờ đen thuần
- Tỷ lệ 70-20-10: tối chủ đạo / màu lạnh-chuyển / điểm nóng
KIỂM TRA màu mới: "phần tử này đang sống hay đã nguội?" → chọn vùng tương ứng.
CTA vàng luôn là điểm sáng nhất VÙNG NỘI DUNG; lõi thiên hà sáng nhất VÙNG NỀN.

## Trụ 4 — Chiều sâu (đồng biến: gần hơn = nét + nhanh + ấm + phản ứng hơn)
Tu chính v1.1 (decision 0016): tách "sao & bụi" — sao ở XA hàng năm ánh sáng (sau
thiên thể, bị hành tinh che), bụi/than hồng là hạt GẦN camera (trước thiên thể).
| Lớp | Gồm | Chất liệu | Chuyển động | Parallax |
|---|---|---|---|---|
| 1 Khí quyển | tinh vân sương, dải ngân hà | mềm, blur | thở 18–30s | 0.02 |
| 1b Sao xa | sao 3 cấp (faint/mid/hero) | sắc, nhỏ | twinkle, trôi 0 | 0.02 |
| 2 Thiên thể | hành tinh, trăng, lõi thiên hà | có hình + ánh sáng | trôi ~90s | 0.04 |
| 3 Bụi gần | bụi, than hồng, sao băng | sắc | trôi 2–6px/s | 0.06–0.12 |
| 4 Nội dung | tile bento | nét nhất, tối trên nền rực | float ±3px lệch pha | ngược 3px |
| 5 Tương tác | CTA, hover, expand | ấm nhất | tức thì | theo chuột |
- **Z-order vẽ:** tinh vân < sao xa < thiên thể < bụi/embers < tile < overlay.
  Hành tinh PHẢI che sao nằm sau lưng (sao xuyên qua hành tinh = cờ đỏ cartoon).
- Đồng biến: xa hơn = parallax nhỏ hơn (sao xa 0.02 < thiên thể 0.04 < bụi 0.06–0.12).
- Vi phạm đồng biến (lớp xa nhanh hơn lớp gần) = phá chiều sâu.

## Trụ 5 — Phân cấp năng lượng theo thời gian
- Big bang = 100, MỘT lần duy nhất (flash + shake chỉ ở đây)
- Cascade vỡ hành tinh = 55 (sóng mini, không flash toàn màn, không shake)
- Tương tác (expand, ngưng tụ tiêu đề) = 30
- Nền ALIVE = 5 (biên độ nhỏ, chu kỳ dài, lệch pha)
- Không hiệu ứng nào vượt bậc; không thêm vụ nổ thứ hai ở bất kỳ đâu.

## Công thức "floating" (áp cho mọi phần tử nội dung nổi)
1. Tách nền: tối hơn nền rực xung quanh
2. Bóng đổ sâu phía dưới
3. Rim light 1px cạnh trên (ánh sao)
4. Vi chuyển động lệch pha (không hai phần tử nào đồng nhịp)
5. Parallax tách lớp (nền ngược hướng nội dung)
Thiếu 1 trong 5 → không đạt "floating".

## Bất biến (không bao giờ vi phạm)
- Scroll/skip/Escape thoát intro mọi thời điểm; không bao giờ khóa người dùng
- Reduced-motion: giữ MÀU và HÌNH, tắt CHUYỂN ĐỘNG
- No-JS/no-WebGL: nội dung đầy đủ luôn hiển thị
- sessionStorage gate + ?intro cho dev
- Chữ: contrast không bị hạt/hiệu ứng làm giảm; không hạt đè chữ op > 0.4
- MỘT canvas 2D cho toàn bộ nền ALIVE; texture sinh 1 lần trong idle
- Chuyển động đồng bộ sim-time, không setTimeout cho sequence
- Palette đọc từ CSS variables — một nguồn duy nhất

## Quy trình khi thêm/đổi hiệu ứng
1. Kể được nguồn gốc từ vụ nổ? (Trụ 1)
2. Tuân nguồn sáng? (Trụ 2)
3. Sống hay nguội → màu đúng vùng? (Trụ 3)
4. Thuộc lớp nào → chất liệu/tốc độ/parallax đúng lớp? (Trụ 4)
5. Bậc năng lượng nào → không vượt trần? (Trụ 5)
6. Không phạm bất biến?
→ Qua cả 6 thì code; kẹt ở đâu hỏi lại người dùng ở đó.
