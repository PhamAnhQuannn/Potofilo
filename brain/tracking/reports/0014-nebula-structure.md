# 0014 — Nebula Structure (tinh vân có hình)

- Ngày: 2026-08-17
- Trạng thái: xong (chờ Quân duyệt tận mắt)

## Đã làm gì
Trước đây tinh vân chỉ là những đám màu mờ tròn (gradient + blur) — nhìn như
"sương màu", không ra hình. Lần này thêm lớp tinh vân CÓ VÂN thật:
- Dùng "noise" (nhiễu ngẫu nhiên có cấu trúc) sinh ra 3 tấm ảnh tinh vân: có sợi,
  có đám đặc, rìa loang không đều — như tinh vân thật trong ảnh thiên văn.
- Thêm **lõi thiên hà** ở cánh phải-trên: một điểm sáng ấm nhiều lớp — đây là
  điểm sáng nhất của nền (đóng vai "mặt trời" của cảnh cho bước sau).
- Gom sao thành **cụm** ở 3 chỗ (trong tinh vân trái, trên dải chéo, cạnh lõi
  thiên hà) thay vì rải đều — trời sao trông có tụ điểm, tự nhiên hơn.
- Các đám mây mờ cũ (CSS) giảm còn 40% độ đậm → lùi ra sau làm lớp "sương" mềm,
  để lớp tinh vân có vân nổi lên phía trước (tương phản mềm–nét = chiều sâu).

Ảnh tinh vân + lõi được sinh **một lần** lúc rảnh (sau khi vào trạng thái ALIVE),
xếp hàng tuần tự để không làm giật khung hình. Sau khi sinh xong, mỗi khung chỉ
tốn vài lệnh vẽ ảnh — gần như không thêm chi phí.

## Vì sao làm
Theo hiến pháp thiết kế (Trụ chiều sâu = tương phản nét–mờ) và prompt
nebula-structure: màu đã đậm nhưng thiếu HÌNH. Cần vật thể có hình để đọc ra
"thiên thể", không chỉ "mảng màu".

## Kết quả
- Zoom vào tinh vân thấy vân/sợi/đám, không còn là vệt tròn mờ đều.
- Nhìn 1 giây gọi được tên vài "vật thể": tinh vân trái, lõi thiên hà, cụm sao.
- Lõi thiên hà là điểm sáng nhất nền; nút CTA vàng trong ô vẫn là điểm sáng nhất
  vùng nội dung (hai thứ không tranh nhau).

## Đã đụng file nào
- `app/dust-layer.js` — bộ sinh noise, sinh 3 texture tinh vân + lõi thiên hà,
  vẽ lên cùng canvas nền, gom sao thành cụm.
- `app/styles/main.css` — giảm đám mây gradient cũ còn 40%.

## Còn lo / cần duyệt
- CHƯA xem tận mắt (môi trường không mở đồ hoạ). Cần Quân xem vân có đẹp,
  bố cục hai cánh cân, lõi thiên hà đúng chỗ; chỉnh seed/vị trí nếu cần.
- **Reduced-motion (giảm chuyển động):** hiện bản này texture/lõi/cụm sao CHƯA
  hiển thị khi bật giảm-chuyển-động (lớp canvas đang tắt hẳn ở chế độ đó, chỉ còn
  đám mây CSS mờ). Hiến pháp yêu cầu "giữ MÀU + HÌNH, chỉ tắt chuyển động" → sẽ
  sửa ở bước AUDIT (BƯỚC 2): cho canvas vẽ 1 khung tĩnh trong reduced-motion.
- Cần đo bằng `?debug`: sinh 3 texture < 120ms, không khung nào > 50ms.

## Từ ngữ
- noise / fBm = nhiễu ngẫu nhiên nhiều tầng, dùng để tạo vân mây/khói tự nhiên.
- texture = tấm ảnh hoa văn dùng làm bề mặt.
