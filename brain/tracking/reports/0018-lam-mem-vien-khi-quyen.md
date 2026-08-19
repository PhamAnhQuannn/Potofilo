# 0018 — Làm mềm viền khí quyển hành tinh

- Ngày: 2026-08-18
- Trạng thái: xong (chờ Quân duyệt mắt)

## Đã làm gì
Quân thấy MỌI hành tinh có một "viền trắng" gắt ở cạnh phải, trông xấu.

Kiểm tra: đó không phải lỗi ngẫu nhiên, mà là **viền khí quyển** — vành sáng
mỏng ở phía hành tinh hướng về nguồn sáng (lõi thiên hà nằm góc trên-phải, nên
vành nằm cạnh phải/trên). Vành này là quy định BẮT BUỘC trong hiến pháp thiết kế
(mọi thiên thể phải có mặt sáng ấm + viền khí quyển) → không được bỏ hẳn.

Đã hỏi Quân và Quân chọn: **làm mềm + đổi màu ấm**. Nên đã sửa cho ĐÚNG hiến pháp:
- Đổi màu vành từ xanh-lạnh (`#CDE3FF`) sang vàng-ấm (`#FFF4D6`). Trước đây màu
  lạnh này thực ra đã sai — hiến pháp xếp viền khí quyển vào nhóm màu NÓNG.
- Bỏ đường kẻ mảnh, đậm nhất ôm sát rìa (chính nó tạo cảm giác "đường viền").
- Giữ lại 2 lớp quầng rộng, mờ hơn → thành quầng sáng mềm thay vì gạch trắng.
- Mặt trăng: hạ độ đậm vành nhưng vẫn đủ sáng để mặt khuất không thành chấm đen.
- Chấm hành tinh xa: đổi màu ấm + hạ độ đậm, giữ nét mảnh 1px như cũ.

Không đụng hình dạng, hướng, vùng tối/sáng, đốm phản chiếu — chỉ đổi màu và độ đậm.

## Vì sao làm
Vành cũ màu lạnh + quá gắt khiến hành tinh trông như bị viền chì trắng, kém tự
nhiên. Sửa vừa chiều ý Quân (hết viền trắng gắt), vừa kéo phần này về đúng hiến
pháp (màu ấm) — không phải tu chính, chỉ là sửa cho khớp luật sẵn có.

## Kết quả
Cạnh sáng của hành tinh giờ là quầng khí quyển vàng-ấm mềm, không còn đường trắng
gắt. Vành vẫn còn ở mọi thiên thể nên không vi phạm hiến pháp.

- File sửa: `app/dust-layer.js` (3 chỗ vẽ vành: hành tinh, hành tinh lớn có vành,
  chấm xa). Đã chạy kiểm tra cú pháp (`node --check`) — không lỗi.
- CHƯA xem tận mắt (máy chạy không mở được đồ họa) → cần Quân mở trình duyệt duyệt.

## Từ ngữ
- viền/vành khí quyển = vành sáng mỏng ở rìa hành tinh phía có nắng, giả lập ánh
  sáng xuyên qua lớp không khí quanh hành tinh.
- LIGHT_DIR = hướng nguồn sáng chung của cả cảnh (lõi thiên hà).
