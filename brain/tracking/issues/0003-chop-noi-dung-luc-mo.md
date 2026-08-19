# 0003 — Chớp nội dung một nhịp lúc mở trang

- Ngày phát hiện: 2026-08-19
- Lộ ra từ việc: đo thật để hoàn thiện chống giật intro (report 0021)
- Trạng thái: mở

## Vấn đề là gì
Ngay lúc vừa vào trang, khung nội dung đầy đủ (các ô bento) hiện ra một nhịp rất ngắn
(~35 phần nghìn giây khi mạng đã có sẵn), rồi mới bị màn intro che lại. Cái chớp ngắn
này gây cảm giác giật hình lúc mở — khác với việc hoạt ảnh hạt khựng (đã xử ở report 0021).

## Vì sao liên quan
Khi đo để sửa giật (report 0021) mới thấy: thêm `defer` cho thư viện đồ hoạ KHÔNG diệt
được cái chớp này, vì thứ quyết định lúc trang hiện ra thật sự là phông chữ + CSS ở đầu
trang, không phải thư viện đồ hoạ. Nên cần một cách khác.

## Nếu không xử lý thì sao
Người dùng vẫn thấy một cái chớp nội dung rất ngắn khi mở (chỉ vài khung hình). Nhẹ,
nhưng lộ, làm ấn tượng đầu kém mượt.

## Hướng xử lý dự kiến
Ẩn các ô nội dung NGAY từ đầu bằng một câu lệnh nhỏ đặt ở đầu trang (chạy trước khi vẽ),
gắn cờ để: có JavaScript thì ẩn tới khi intro sẵn sàng, KHÔNG có JavaScript thì hiện đủ
(giữ bất biến "tắt JS vẫn xem được nội dung" trong hiến pháp). Đây là thay đổi động tới
cách trang hiện ra → phải chạy 6/7 câu hỏi hiến pháp và cần Quân duyệt trước khi làm.

## Từ ngữ
- "chớp nội dung" (FOUC) = nội dung loé lên một nhịp rồi bị che, gây giật cảm giác.
- "bất biến" = điều luôn phải đúng, không được phá.
