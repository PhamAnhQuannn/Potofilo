# 0009 — Redesign: bento 1 màn hình + vụ nổ "khai sinh" trang

- Ngày: 2026-08-15
- Trạng thái: xong (phần dựng); chờ xem + tinh chỉnh trên trình duyệt

## Đã làm gì
Thiết kế lại trang theo 3 thay đổi có chủ đích:

1. **Bố cục:** bỏ kiểu cuộn dọc dài, chuyển sang **"bento" — 7 ô gọn trong đúng một màn hình** (như khay cơm hộp nhiều ngăn). Máy tính thấy toàn bộ cùng lúc, không phải cuộn. Điện thoại thì các ô xếp dọc.
2. **Mở đầu (intro) trở thành "sự kiện tạo ra trang":** lúc đầu màn hình **trống trơn**, chỉ có quả cầu hạt + tên mờ. Quả cầu **nổ**, rồi các hạt **bay về đúng vị trí từng ô và kết tinh thành các ô** đó. Trang web theo nghĩa đen được "sinh ra" từ vụ nổ. (Trước đây nội dung có sẵn nên vụ nổ chỉ là pháo hoa thừa.)
3. **Bỏ** hẳn màn "hành tinh bay về thanh menu" (thừa) và bỏ luôn thanh menu ở bản máy tính (mọi thứ đã trong tầm mắt).

Chi tiết:
- 5 giai đoạn: trống → dồn năng lượng (sao bị hút về tâm) → nổ (hạt bay có chủ đích về phía các ô tương lai) → kết tinh (viền ô hiện trước, hạt lấp đầy rồi tan, ô thật hiện ra, so le từng ô) → sống (trang hoàn chỉnh).
- **Click vào ô** → ô phóng to mượt thành ô lớn hiện đầy đủ chi tiết; bấm X / Escape / nền ngoài để thu lại.
- Bụi vũ trụ vẫn trôi giữa các ô; rê chuột lên ô → viền sáng màu riêng + hút vài hạt bụi.
- **Nút "Bỏ qua" biến mất sau intro** (sửa lỗi bản cũ).

Mọi lối thoát giữ nguyên: Bỏ qua / Escape / **chỉ cần cuộn** là bỏ intro; vào lại cùng phiên bỏ intro; giảm chuyển động hoặc tắt JS/không có đồ họa → trang bento tĩnh hiện ngay đủ nội dung.

## Vì sao làm
Để vụ nổ có **ý nghĩa nhân quả** ("trang được sinh ra từ ánh sáng"), và để người xem thấy toàn cảnh portfolio trong một màn hình.

## Kết quả
- Viết lại `index.html` (7 ô + ô chi tiết + sân khấu intro), `styles/main.css` (lưới bento + ô + overlay phóng to), `hero-sphere.js` (5 giai đoạn mới, hạt nhắm tọa độ thật của ô). Thêm `bento.js` (phóng to ô). Chỉnh `dust-layer.js` (hover theo ô).
- Ghi quyết định `decisions/0004`.
- Kiểm tra tự động: cú pháp 4 file đạt; địa chỉ tải được; 7 ô + sân khấu + overlay + script đủ; không màu đen thuần; đã bỏ thanh menu.
- CHƯA xem tận mắt — cần Quân mở `http://localhost:4001/` (tab mới / xóa sessionStorage để chạy lại intro) duyệt + tinh chỉnh.

## Còn tinh chỉnh (cần mắt người)
Vừa khít 1 màn hình ở 1920×1080 và 1440×900, độ mượt kết tinh, thời lượng, mật độ bụi — chỉnh trong file, không đổi kiến trúc.

## Từ ngữ
- Bento = kiểu bố cục nhiều ô như khay cơm hộp nhiều ngăn, gọn trong một khung.
- Kết tinh = hạt tụ lại thành hình khối rõ ràng (ở đây là thành các ô).
- FLIP = kỹ thuật làm ô phóng to trông mượt.
