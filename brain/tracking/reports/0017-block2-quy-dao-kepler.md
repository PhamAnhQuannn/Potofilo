# 0017 — BLOCK 2: Quỹ đạo Kepler (hệ nền vận hành theo định luật)

- Ngày: 2026-08-17
- Trạng thái: xong (chờ Quân tinh chỉnh qua ?tune + duyệt)

## Đã làm gì
Trước đây các thiên thể (hành tinh, trăng) nằm vị trí CỐ ĐỊNH, chỉ trôi lắc nhẹ.
Giờ cả hệ chạy theo **định luật Kepler** như một hệ mặt trời thật:
- Mọi quỹ đạo là hình elip, tâm hút chung = **lõi thiên hà** (đóng vai mặt trời).
- 4 thiên thể ở 4 khoảng cách khác nhau (gần→xa: distant, rocky, ice, anchor),
  giãn cách theo cấp số nhân ~1.7 lần (như khoảng cách các hành tinh thật).
- Càng gần lõi đi càng nhanh, càng xa đi càng chậm (đúng định luật Kepler): cái
  nhỏ xa (distant) chạy 1 vòng ~4 phút, hành tinh lớn (anchor) ~20 phút — chậm rãi,
  uy nghi, bố cục không bao giờ vỡ.
- **Trăng quay quanh hành tinh lớn** (không quanh lõi), mỗi 150 giây một vòng →
  mỗi vòng nó **đi qua trước mặt** hành tinh một lần (transit) rồi **ra sau lưng**
  một lần — hiện tượng transit giờ là HỆ QUẢ tự nhiên của quỹ đạo, không phải hẹn giờ.
- Bụi bay gần hành tinh lớn bị **bẻ cong vòng quanh** nó (như tàu vũ trụ lượn qua
  hành tinh) rồi bay tiếp — thấy được lực hấp dẫn.

Vị trí tính bằng CÔNG THỨC theo thời gian (không cộng dồn) → tua tới/lui hay tab bị
làm chậm đều không lệch.

## Vì sao làm
Hiến pháp v2.0 (Trụ 6 mới): hệ nền vận hành theo một bộ luật thống nhất — "MỘT hệ".
Thay chuyển động lắc lẻ tẻ bằng một hệ có trật tự vật lý.

## Đã đụng file nào
- `app/dust-layer.js` — thêm giải Kepler + 4 thiên thể + trăng quanh anchor + bụi
  bẻ cong; sinh thêm ảnh ice/rocky.
- Tham số quỹ đạo (nghiêng, độ dẹt, bán trục, chu kỳ...) đổ vào **TUNE nhóm "Quỹ đạo"**.

## Cần Quân làm (quan trọng)
- Mở `http://localhost:4001/?intro&tune` → vào ALIVE, panel TUNE có nhóm "Quỹ đạo".
  Kéo slider **Pha anchor / Nghiêng / Độ dẹt / Bán trục** để đặt hành tinh lớn đúng
  vào cánh trái-dưới (mình đặt số mặc định đoán mù vì không xem được). Chỉnh xong
  bấm **Copy** để mình chốt số vào code.
- Kiểm: distant chạy nhanh hơn anchor rõ; trăng cắt qua trước đĩa anchor mỗi ~150s;
  bụi cong quanh anchor.

## Còn lại (block sau)
- Anchor nằm SAU lưới (chỉ mặt tối) — BLOCK 5.
- Khí hậu màu quanh mỗi hành tinh — BLOCK 3.

## Từ ngữ
- Kepler = định luật chuyển động hành tinh (elip quanh mặt trời, gần thì nhanh).
- transit = thiên thể đi ngang qua trước một thiên thể khác.
- bán trục lớn = "bán kính" của quỹ đạo elip.
