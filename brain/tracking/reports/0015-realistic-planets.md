# 0015 — Realistic Planets (hành tinh + trăng theo quang học)

- Ngày: 2026-08-17
- Trạng thái: xong (chờ Quân duyệt tận mắt)

## Đã làm gì
Nền trước đó có màu + có hình (tinh vân) nhưng mọi thứ vẫn "phẳng" vì thiếu NGUỒN
SÁNG rõ ràng. Lần này thêm 2 thiên thể được vẽ đúng cách ánh sáng chiếu:
- **1 hành tinh khí khổng lồ** ở góc trái-dưới (to, cắt khỏi màn hình ~40% — vật
  khổng lồ không lọt khung). Có: sọc khí xoáy loạn, khối cầu (rìa tối dần —
  "limb darkening"), ranh giới ngày–đêm (lưỡi liềm sáng ~37%), viền khí quyển
  phát sáng ở rìa hướng nguồn sáng, một đốm phản chiếu nhỏ.
- **1 mặt trăng đá** nhỏ ở góc phải-trên, cùng hướng sáng, lưỡi liềm mỏng (~20%).
- Cả hai được chiếu sáng từ **một hướng duy nhất** = phía lõi thiên hà (góc
  phải-trên). Ghi thành hằng `LIGHT_DIR` dùng chung → mọi thứ kể cùng một câu
  chuyện ánh sáng.
- Chỉnh tinh vân trái: phần lõi ấm nghiêng nhẹ về phía nguồn sáng (khí gần "mặt
  trời" thì sáng hơn).

Ảnh hành tinh + trăng được vẽ **một lần** lúc rảnh, xếp hàng SAU tinh vân (không
làm cùng lúc). Sau đó mỗi khung chỉ thêm 2 lệnh vẽ ảnh. Hành tinh trôi ngang 3px
mỗi 90 giây — "sống" mà gần như không thấy nhúc nhích.

## Vì sao làm
Theo hiến pháp (Trụ 2 — một nguồn sáng) + prompt realistic-planets: gradient đối
xứng tâm không có thật trong tự nhiên → nhìn "cartoon". Vẽ đúng quang học (một
phía sáng, một phía tối) làm nền thành "cảnh có chiều sâu và ánh sáng".

## Kết quả
- Che nửa màn hình vẫn biết ánh sáng đến từ đâu — hành tinh, trăng, tinh vân
  cùng một hướng sáng.
- Hành tinh đọc ra khối cầu + lưỡi liềm + viền khí quyển rực, không phải hình
  tròn phẳng có sọc.

## Đã đụng file nào
- `app/dust-layer.js` — `LIGHT_DIR`, `makePlanetTexture` (5 lớp vẽ), thêm hành
  tinh + trăng vào hàng chờ sinh ảnh, vẽ lên cùng canvas nền; tinh vân trái nghiêng sáng.

## Điểm cần Quân quyết / lưu ý
- **Thứ tự lớp (mâu thuẫn spec ↔ hiến pháp):** prompt nói hành tinh vẽ TRÊN sao;
  hiến pháp (Trụ 4) xếp thiên thể là lớp xa hơn sao → mình vẽ hành tinh/trăng
  DƯỚI sao (sao lấp lánh nổi phía trước hành tinh). Theo hiến pháp vì luật cứng #0.
  Nếu Quân muốn ngược lại, đổi 1 dòng thứ tự vẽ.
- **Ánh sáng gần lưới:** hành tinh ở trái-dưới, phần rìa sáng hướng lên phải-trên
  (về phía lưới). Về lý là mặt tối nằm trong lưới, rìa sáng chỉ là vệt mỏng ở mép
  đĩa. Cần Quân xác nhận không có vệt sáng lọt sau chữ; nếu có → đẩy hành tinh ra
  xa mép hơn hoặc giảm phần sáng.
- **Viền khí quyển** làm màu solid `#CDE3FF` (spec gợi pha `#E84A8A` hai đầu) —
  đơn giản hóa; chỉnh sau nếu cần.

## Còn nợ (BƯỚC 2 audit)
- reduced-motion: hành tinh/tinh vân CHƯA hiển thị (canvas tắt hẳn ở chế độ đó) —
  hiến pháp yêu cầu giữ màu+hình. Sửa ở BƯỚC 2 (vẽ 1 khung tĩnh).
- Đo perf `?debug`: sinh hành tinh 1024² + trăng — kiểm không frame > 50ms.

## Từ ngữ
- limb darkening = rìa quả cầu tối hơn tâm (dấu hiệu "đây là khối cầu").
- terminator = ranh giới ngày–đêm trên bề mặt thiên thể.
- LIGHT_DIR = hướng nguồn sáng, một hằng dùng chung để mọi vật sáng cùng phía.
