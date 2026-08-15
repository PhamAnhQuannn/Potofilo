# 0007 — Quả cầu hạt "sống" trong hero (Giai đoạn 2)

- Ngày: 2026-08-15
- Trạng thái: xong (phần dựng); chờ xem trên trình duyệt

## Đã làm gì
Gắn vào cột phải của phần giới thiệu (hero) một **quả cầu ánh sáng bằng hàng nghìn hạt** đang "sống": xoay chậm, đập nhẹ theo nhịp như tim, lõi sáng trắng-vàng, vỏ ngả tím. Đây là trạng thái đứng yên vĩnh viễn — **chưa có vụ nổ** (vụ nổ để giai đoạn sau).

Thêm vài điểm tinh tế:
- Nhịp đập mỗi hạt lệch nhau một chút → bề mặt gợn sóng tự nhiên, không cứng.
- Quả cầu nghiêng nhẹ theo con trỏ chuột (tối đa ~5 độ).
- Vài trăm ngôi sao mờ phía sau, chỉ trong khung quả cầu (không phủ toàn trang).

Quan trọng cho vận hành:
- Quả cầu **không chặn** bấm/cuộn trang (lớp vẽ để "xuyên thấu").
- Rời khỏi phần hero hoặc chuyển tab → **tự dừng vẽ** để đỡ tốn pin.
- Người bật "giảm chuyển động" → hiện một khung tĩnh đẹp, không animation.
- Máy không chạy được đồ họa → giữ nguyên hình tròn gradient mờ có sẵn, không báo lỗi.

Về mã: viết dạng "khối lắp ghép" (class `CosmicSphere`) có sẵn công tắc trạng thái. Giai đoạn 3 chỉ việc thêm bước "nổ" vào, không phải đập đi làm lại. Các dữ liệu gốc của hạt (hướng, bán kính, màu) được giữ riêng để giai đoạn sau tính vụ nổ.

## Vì sao làm
Hero "sống" tạo ấn tượng mạnh ngay khi mở trang, nhưng vẫn nhẹ và không cản người đọc.

## Kết quả
- Thêm `app/hero-sphere.js`; nạp Three.js + script vào `app/index.html`; thêm màu quả cầu vào bảng token và chỉnh khung chứa canvas trong CSS.
- Kiểm tra tự động: cú pháp đạt; địa chỉ tải được; lớp canvas "xuyên thấu" đúng; không đụng phần nào khác của trang.
- CHƯA xem tận mắt (môi trường này không mở đồ họa) — cần Quân mở `http://localhost:4001/` duyệt cảm quan.

## KHÔNG làm (giữ phạm vi)
Không nổ, không hành tinh, không bụi toàn trang, không tự chạy chuỗi, không đụng section khác.

## Từ ngữ
- Hạt = chấm sáng nhỏ; ghép nhiều chấm thành quả cầu.
- Xuyên thấu (pointer-events none) = bấm/cuộn đi xuyên qua lớp vẽ như không có.
- Class = khối mã gói gọn để tái dùng và mở rộng.
