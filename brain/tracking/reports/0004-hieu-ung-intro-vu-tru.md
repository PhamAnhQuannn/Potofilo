# 0004 — Làm hiệu ứng intro vũ trụ (Cosmic Intro)

- Ngày: 2026-08-15
- Trạng thái: xong (phần dựng); còn chờ xem thực tế trên trình duyệt

## Đã làm gì
Làm màn mở đầu cho website — một đoạn hiệu ứng ngắn chạy trước khi vào nội dung chính.

Câu chuyện trên màn hình: một ngôi sao tạo bằng hàng chục nghìn hạt sáng, đang "sống" (xoay, đập nhịp như trái tim). Nó dồn năng lượng, co lại, rồi **nổ tung** thành siêu tân tinh. Vật chất bắn ra, nguội dần, rồi tụ lại thành 4 hành tinh quay quanh tâm. Khi hành tinh ổn định, nội dung website hiện ra.

Toàn bộ chia làm 5 giai đoạn nối tiếp: đứng yên → dồn năng lượng → nổ → tụ hành tinh → xong.

Có sẵn các lối thoát: nút "Bỏ qua" ở góc; nếu máy không chạy được đồ họa thì bỏ qua luôn vào thẳng nội dung; nếu người dùng bật chế độ "giảm chuyển động" thì hiện ngay trạng thái cuối, không chạy hiệu ứng. Hiệu ứng chỉ chạy **một lần mỗi lần mở web** (mở lại trong cùng phiên sẽ vào thẳng).

Mọi thứ chỉnh được (màu, thời lượng, số hạt, hành tinh, chữ hiển thị) gom vào một file cài đặt riêng, không cần đụng phần lõi.

## Vì sao làm
Đây là ấn tượng đầu tiên với người xem. Một màn mở đẹp, mượt thể hiện năng lực và tạo cảm xúc "từ vụ nổ ánh sáng, những thế giới mới ra đời" — hợp mục tiêu của portfolio.

## Kết quả
Có một cục hiệu ứng độc lập ở `app/intro/` gồm: file chạy chính, file cài đặt, và hướng dẫn dùng. Kiểm tra cú pháp code đạt; phục vụ file qua web chạy tốt. Chưa xem tận mắt hiệu ứng trên trình duyệt (môi trường hiện tại không mở được đồ họa) — cần Quân mở thử để duyệt cảm quan.

## Còn chờ / liên quan
- Chữ hiển thị (tên web, mô tả) đang là chỗ trống, cập nhật sau.
- Chưa có "trang chính" để đi vào sau intro → đã ghi lại ở issue 0001 để theo dõi.

## Từ ngữ
- Hạt (particle) = một chấm sáng nhỏ; ghép hàng chục nghìn chấm tạo thành ngôi sao/hành tinh.
- Siêu tân tinh = vụ nổ cực lớn của một ngôi sao.
- File cài đặt (config) = nơi để chỉnh thông số mà không cần sửa phần lõi.
