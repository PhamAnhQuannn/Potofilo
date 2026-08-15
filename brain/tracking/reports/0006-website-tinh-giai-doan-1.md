# 0006 — Website tĩnh hoàn chỉnh (Giai đoạn 1)

- Ngày: 2026-08-15
- Trạng thái: xong (phần dựng); còn chờ điền nội dung thật + xem trên trình duyệt

## Đã làm gì
Dựng trang portfolio đầy đủ, chạy được ngay cả khi **tắt JavaScript** — người tắt JS, người bật chế độ giảm chuyển động, và Google đều thấy trang đầy đủ.

Trang gồm 7 phần đúng thứ tự: giới thiệu (hero) → dự án nổi bật → các dự án khác → học vấn → kinh nghiệm → kỹ năng → về tôi & liên hệ. Dự án nổi bật (nền tảng du lịch AI) được làm to và nổi bật hơn hẳn các dự án thường.

Màu sắc theo đúng bảng màu đã định (nền tối chủ đạo, màu nóng/lạnh chỉ điểm xuyết), không dùng đen thuần ở đâu cả. Chữ dùng cặp phông hỗ trợ tiếng Việt.

Quan trọng: đã **cài sẵn các "điểm cắm"** để hai giai đoạn sau lắp hiệu ứng vào mà không phải đập đi xây lại — chỗ gắn quả cầu hạt ở hero, lớp nền cho bụi vũ trụ, nhãn trên mỗi phần để hạt biết bay về đâu, và thanh điều hướng (sau này biến thành các hành tinh).

## Vì sao làm
Đây là nền móng của cả website. Yêu cầu số một: dùng được ngay khi chưa có bất kỳ hiệu ứng nào. Có nền vững thì hai giai đoạn hiệu ứng sau chỉ việc lắp thêm.

## Kết quả
- Mở `http://localhost:4001/` là ra trang đầy đủ 7 phần.
- Kiểm tra tự động: mọi địa chỉ tải được; đủ 7 nhãn phần + các điểm cắm; không có màu đen thuần.
- Còn để **chỗ trống có nhãn** (trong ngoặc vuông) cho thông tin Quân cần điền: ngành, trường, tên công ty, link trang live, số liệu, các dự án khác, kỹ năng, link mạng xã hội, CV, ảnh.
- Chưa xem tận mắt trên trình duyệt (môi trường này không mở giao diện) — cần Quân mở duyệt + kiểm dấu tiếng Việt.

## Liên quan
- Việc này chính là lời giải cho issue 0001 (trước đây intro chưa có "trang chính" để vào). Giờ đã có trang chính đầy đủ. Intro (giai đoạn 3) sẽ phủ lên sau, không chặn nội dung. → Đóng issue 0001.

## Từ ngữ
- Tắt JS vẫn chạy = trang không phụ thuộc mã chạy trong trình duyệt để hiện nội dung.
- Điểm cắm = chỗ chừa sẵn trong mã để sau này lắp thêm tính năng.
- Phông (font) hỗ trợ tiếng Việt = kiểu chữ hiển thị đúng mọi dấu tiếng Việt.
