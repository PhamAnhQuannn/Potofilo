# 0008 — Vụ nổ tự động, hành tinh điều hướng, bụi tàn dư (Giai đoạn 3)

- Ngày: 2026-08-15
- Trạng thái: xong (phần dựng); chờ xem + tinh chỉnh trên trình duyệt

## Đã làm gì
Ghép "màn trình diễn" vào trang: vào lần đầu, quả cầu hạt ở hero **tự nổ và lắp ráp trang** trong khoảng 9,5 giây (điện thoại ~6,5 giây), không cần bấm gì.

Diễn biến:
1. Quả cầu đập nhanh dần, co lại, sáng trắng.
2. **Nổ** thành siêu tân tinh, lan ra toàn màn hình (có chớp sáng, hai vòng sóng, tia phun).
3. Vật chất **tụ thành 5 hành tinh** — mỗi hành tinh là một mục menu (Projects, Education, Experience, Skills, Contact), có nhãn chữ.
4. 5 hành tinh **bay về thanh điều hướng** ở góc, để lại **5 chấm màu** nằm đó vĩnh viễn (như "ký ức" của vụ nổ). Cùng lúc các phần của trang trượt vào chỗ.
5. Xong: trang hoạt động bình thường, cuộn dọc như web thường.

Thêm:
- **Bụi vũ trụ** trôi khắp trang (15% hạt không tụ lại chuyển thành bụi, nối tiếp liền mạch). Bụi dày ở đầu trang, thưa dần ở cuối, trôi ngược nhẹ khi cuộn, nhấp nháy khẽ.
- **Tiêu đề mỗi phần** khi lướt tới lần đầu: vài hạt bụi bay tụ về rồi tiêu đề lóe nhẹ (chỉ 1 lần mỗi phiên).
- **Rê chuột** lên thẻ dự án/nút: bụi quanh đó bị hút cong nhẹ.

Mọi lối thoát:
- Nút "Bỏ qua" (góc phải) + phím Escape + **chỉ cần cuộn trang** → intro dừng ngay, vào thẳng trang hoàn chỉnh (quy tắc vàng: không bao giờ khóa cuộn).
- Vào lại trong cùng phiên → bỏ qua intro, hiện trang đầy đủ + 5 chấm + bụi.
- Bật "giảm chuyển động" → hoàn toàn tĩnh, đủ nội dung, có 5 chấm.
- Máy không chạy đồ họa / tắt JS → vẫn nguyên trang tĩnh (Giai đoạn 1), không mất gì.

## Vì sao làm
Đây là điểm nhấn nghệ thuật của portfolio: "từ vụ nổ ánh sáng, những thế giới mới (các mục) ra đời". Nhưng ràng buộc số một là **không cản người dùng** — nên có đủ lối thoát và luôn nhẹ.

## Kết quả
- Mở rộng `app/hero-sphere.js` (thêm 5 giai đoạn nổ/tụ/bay-về-navbar, chớp sáng, sóng, chiếu nhãn 3D→2D, chấm navbar, trượt section, mọi lối thoát, thời lượng riêng cho mobile).
- Thêm `app/dust-layer.js` (bụi Canvas 2D + ngưng tụ tiêu đề + hover hút; tự giảm hạt khi tụt khung hình).
- Thêm CSS (canvas full-screen, chớp sáng, nhãn, chấm navbar, trượt section) + nạp script vào `index.html`.
- Kiểm tra tự động: cú pháp 3 file đạt; địa chỉ tải được; wiring + CSS đủ móc.
- CHƯA xem tận mắt (môi trường này không mở đồ họa) — cần Quân mở `http://localhost:4001/` duyệt + tinh chỉnh cảm quan (thời lượng, cỡ hạt, vị trí hành tinh).

## Còn để tinh chỉnh (cần mắt người)
Vị trí/cỡ hành tinh, đường bay về navbar, mật độ bụi, độ mượt từng máy — chỉnh nhanh trong file, không đổi kiến trúc.

## Từ ngữ
- Siêu tân tinh = vụ nổ lớn của sao.
- Chiếu 3D→2D = quy đổi vị trí trong không gian 3 chiều ra tọa độ trên màn hình phẳng (để đặt nhãn chữ).
- Quy tắc vàng = luôn cho người dùng cuộn; hễ cuộn là bỏ intro.
