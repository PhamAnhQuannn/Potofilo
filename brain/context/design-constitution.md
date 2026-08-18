# DESIGN CONSTITUTION — Potofilo (v2.0)
# Đặt tại: brain/context/design-constitution.md
# Mọi thay đổi thị giác PHẢI đối chiếu file này trước khi code.
# Nếu một đề xuất vi phạm bất kỳ trụ nào → từ chối hoặc hỏi lại người dùng.
# TRIẾT LÝ v2.0 (decision 0018): không còn "nền" và "trang" — MỘT hệ duy nhất.
# Vụ nổ sinh ra tất cả · một nguồn sáng chiếu tất cả · một bộ luật Kepler vận hành
# tất cả · 7 ô nội dung là những thiên thể gần người xem nhất.

## Trụ 1 — Một câu chuyện: mọi thứ là vật chất từ vụ nổ
Mọi phần tử thị giác phải trả lời được "nó từ đâu ra?" bằng câu chuyện big bang:
- Tile = vật chất kết tinh · Bụi = 15% hạt thoát ly · Tinh vân = khí đã nguội
- Sao = bầu trời seed từ intro · Hành tinh nền = vật chất ngưng tụ ở xa
- Nhãn tile = tiếng vọng của nhãn hành tinh đã vỡ
- **v2.0:** vụ nổ sinh ra TOÀN BỘ hệ — mây bừng sáng theo sóng xung kích (light
  echo) + 5% hạt ngưng tụ thành hệ hành tinh nền. Thiên thể ĐƯỢC là artwork (ảnh)
  miễn tuân palette + LIGHT_DIR.
KIỂM TRA: phần tử mới không kể được nguồn gốc từ vụ nổ → không thêm.

## Trụ 2 — Một nguồn sáng
- Lõi thiên hà (góc phải-trên) là mặt trời của cảnh. Hằng LIGHT_DIR dùng chung.
- Mọi thiên thể: mặt hướng sáng ấm + viền khí quyển; mặt khuất tối, lạnh.
- Cấm shading gradient đối xứng tâm cho vật thể (trừ điểm sáng tự phát: sao, glow).
- **v2.0:** TILE cũng shade theo LIGHT_DIR (rim gradient góc trên-phải sáng, bóng
  đổ lệch dưới-trái) — 7 thẻ như 7 thiên thể cùng mặt trời. **Khí hậu màu** (Trụ 3)
  là ánh THỨ CẤP: CHỈ nhuộm màu, KHÔNG đổ bóng, KHÔNG tạo rim thứ hai, KHÔNG đổi
  hướng terminator (vi phạm = vỡ Trụ 2).

## Trụ 3 — Màu = nhiệt độ = thời gian
- NÓNG (#FFFFFF → #FFF4D6 → #FFC864 → #FF8C42): năng lượng cao, "đang sống"
  → vụ nổ, CTA, tên, số liệu nổi bật, viền khí quyển, hover state
- CHUYỂN (#FF5E3A → #C2273D → #E84A8A → #7B2FBF): plasma, tia, dải ngân hà
- LẠNH (#4ECDC4 → #3A7BD5 → #2E1A6E): đã nguội, "bối cảnh"
  → tinh vân, thân hành tinh, viền tile, tag, nhãn phụ
- NỀN (#07071A → #0D0B21): không bao giờ đen thuần
- Tỷ lệ 70-20-10: tối chủ đạo / màu lạnh-chuyển / điểm nóng
- **v2.0 — tiểu khí hậu địa phương:** mỗi hành tinh nhuộm màu vùng quanh nó
  (planetshine, Trụ 6). Palette dồn LẠNH cho nền; ẤM độc quyền lõi + CTA + **ngoại
  lệ khí hậu rocky** (gỉ ấm trầm, phản chiếu, mờ — ngoại lệ ấm có kiểm soát duy
  nhất của nền).
KIỂM TRA màu mới: "phần tử này đang sống hay đã nguội?" → chọn vùng tương ứng.
CTA vàng luôn là điểm sáng nhất VÙNG NỘI DUNG; lõi thiên hà sáng nhất VÙNG NỀN.

## Trụ 4 — Chiều sâu (đồng biến: gần hơn = nét + nhanh + ấm + phản ứng hơn)
Tu chính v1.1 (decision 0016): tách "sao & bụi" — sao ở XA hàng năm ánh sáng (sau
thiên thể, bị hành tinh che), bụi/than hồng là hạt GẦN camera (trước thiên thể).
Parallax v1.2 (decision 0017): dãn phổ hệ số để lia chuột lộ chiều sâu rõ hơn.
Bảng lớp v2.0 (decision 0018) — thêm mây thể tích 3 tấm + hệ Kepler, **xóa quy tắc
"cách grid 40px"** (thay bằng: chỉ MẶT TỐI anchor ≤8% sáng được nằm sau grid).
| Z (xa→gần) | Lớp | Parallax chuột |
|---|---|---|
| 1 | mây back / mid (khí quyển) + tinh vân + dải hoàng đạo | 0.02 / 0.05 |
| 2 | sao xa 3 cấp | 0.05 |
| 3 | distant dot / rocky (Kepler xa) | 0.06 |
| 4 | ice (Kepler) | 0.07 |
| 5 | dải hoàng đạo (đoạn sau grid) + lõi thiên hà | 0.03 |
| 6 | anchor + moon (Kepler gần) — MẶT TỐI được sau grid | 0.08 |
| 7 | mây front (vệt mỏng vắt mép dưới anchor) | 0.11 |
| 8 | đèn con trỏ · bụi (0.15) · than hồng (0.22) · sao băng | 0.15–0.22 |
| 9 | GRID tile (nội dung) | ngược ≤6px + tilt 3D ±5° |
| 10 | Tương tác: CTA/hover/expand | theo chuột |
- Hành tinh PHẢI che sao sau lưng. Anchor: rim + vùng tán xạ sáng LUÔN ngoài grid;
  chỉ mặt tối (≤8% sáng) được chồng sau grid — kiểm contrast chữ không giảm.
- Đồng biến: xa hơn = parallax nhỏ hơn.

## Trụ 5 — Phân cấp năng lượng theo thời gian
- Big bang = 100, MỘT lần duy nhất (flash + shake chỉ ở đây)
- Cascade vỡ hành tinh = 55 (sóng mini, không flash toàn màn, không shake)
- Tương tác (expand, ngưng tụ tiêu đề) = 30
- Nền ALIVE = 5 (biên độ nhỏ, chu kỳ dài, lệch pha)
- Không hiệu ứng nào vượt bậc; không thêm vụ nổ thứ hai ở bất kỳ đâu.
- **Tu chính v1.2 (decision 0017):** Chuyển động DO NGƯỜI DÙNG gây ra (parallax,
  đèn con trỏ, tile tilt, hút bụi hover) được miễn trần nền — trần riêng = 30.
  Chuyển động TỰ PHÁT của nền giữ trần 5, ưu tiên TIẾN HÓA CHẬM (hành tinh quay
  140s, sọc trôi) + SỰ KIỆN HIẾM (xung lõi, sao băng, cửa sổ sáng) thay vì lặp đều.
- **v2.0 (decision 0018):** thêm bậc "SỰ KIỆN LAN SANG NỘI DUNG = 8" — xung lõi
  quét qua tile làm tile thở glow 1 nhịp (một gợn, không nảy layout). Vẫn ≤ trần
  tương tác 30, trên trần nền 5.

## Trụ 6 — Định luật vận hành (v2.0, decision 0018)
Hệ nền chạy theo ĐỊNH LUẬT tham số, KHÔNG tích phân n-body:
- Tiêu điểm mọi elip quỹ đạo = lõi thiên hà (0.72W, 0.30H). Mặt phẳng = dải chéo
  -24° (elip rất dẹt ~4.7:1).
- Giãn cách bán trục lớn cấp số nhân ~1.7×: distant : rocky : ice : anchor = 1 : 1.7 : 2.9 : 4.9.
- Kepler v ∝ 1/√r: chu kỳ cung khả kiến distant ~4′ · rocky ~7′ · ice ~9′ · anchor ~20′.
- Vị trí = HÀM GIẢI TÍCH của time (không cộng dồn) — an toàn throttle/tua.
- Trăng quay quanh anchor (hệ phân cấp), chu kỳ 150s → transit là HỆ QUẢ quỹ đạo.
- CẤM: n-body, tương tác hành tinh–hành tinh. Hấp dẫn nhìn thấy = bụi bẻ cong
  quanh anchor (slingshot, không rơi vào).

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
6. Nếu là thiên thể/hệ nền → tuân định luật Kepler tham số? (Trụ 6)
7. Không phạm bất biến?
→ Qua cả 7 thì code; kẹt ở đâu hỏi lại người dùng ở đó.

## Phụ lục — Giải phẫu thiên thể (8 quyết định, decision 0018)
1. **Anchor** (khí khổng lồ có vành): to nhất, chu kỳ 20′, cánh trái-dưới; rim gắt
   phải-trên, terminator mềm ~25% đĩa, mặt tối 5–8% sáng, vành 3 trạng thái.
2. **Moon**: quay quanh anchor 150s → transit trước đĩa anchor mỗi vòng.
3. **Ice** (băng, tím-xanh): chu kỳ 9′, 3 tầng chi tiết.
4. **Rocky** (đá gỉ ấm): chu kỳ 7′, terminator gắt, 2 tầng; khí hậu ẤM ngoại lệ.
5. **Distant dot**: chu kỳ 4′ (nhanh nhất, thấy rõ chuyển động), silhouette + rim 1px,
   cung đi qua khe giữa ô.
6. **Vỏ khí quyển trong suốt**: mask alpha rìa đĩa đặc đến 88% (rocky 97%) → 0 tại 100%.
7. **Ambient mặt tối**: nhuộm màu đám mây gần nhất 5–8% lên vùng tối.
8. **Phối cảnh khí quyển theo bậc xa**: contrast/sat −15%/bậc, trộn tím nền 15→25%, blur 0/0.5/1px.

## Lịch sử tu chính
- v1.1 (0016): tách sao xa khỏi bụi (z-order). · v1.2 (0017): parallax dãn phổ +
  năng lượng người-dùng trần 30. · v2.0 (0018): "MỘT hệ" — Kepler (Trụ 6), tile
  shade + khí hậu (Trụ 2/3), bảng lớp mây+hệ (Trụ 4), sự kiện-nội-dung 8 (Trụ 5),
  thiên thể là artwork (Trụ 1), phụ lục giải phẫu.
