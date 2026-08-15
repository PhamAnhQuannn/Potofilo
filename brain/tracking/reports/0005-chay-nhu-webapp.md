# 0005 — Cho web chạy như một webapp (mở localhost là ra trang)

- Ngày: 2026-08-15
- Trạng thái: xong

## Đã làm gì
Trước đó, mở `localhost:4001` chỉ thấy một danh sách file trơ trọi (như mở thư mục), chưa giống một website thật.

Giờ đã sửa để mở `localhost:4001` là **ra ngay website**: màn intro vũ trụ chạy trước, xong thì hiện trang chính.

Cụ thể:
- Thêm một trang "cửa vào" (`app/index.html`) — mở web lên là vào đây. Nó chạy intro, xong tự hiện trang chính.
- Tách hiệu ứng intro thành các mảnh dùng chung (một file kiểu dáng, một file xử lý) để cả trang demo lẫn cửa vào webapp cùng dùng, không phải chép đôi.
- Trang chính hiện tại là **bản tạm** ("Nội dung sắp có") — chỗ để đi vào sau intro; nội dung thật làm sau.
- Máy chủ chạy thử giờ lấy thư mục `app/` làm gốc, nên địa chỉ gốc `/` chính là website.

## Vì sao làm
Quân muốn xem sản phẩm chạy tại máy giống như bản đã đưa lên mạng (deploy) — mở một địa chỉ là thấy web, không phải bấm vào từng file.

## Kết quả
- `http://localhost:4001/` → vào thẳng website (intro rồi trang chính).
- `http://localhost:4001/intro/CosmicIntro.html` → bản xem riêng mỗi intro.
- Đã kiểm tra: các địa chỉ đều tải được, cú pháp code đạt. Chưa xem tận mắt hiệu ứng (môi trường này không mở đồ họa) — cần Quân mở trình duyệt duyệt.

## Liên quan
- Trang chính mới là bản tạm → vẫn giữ issue 0001 (chưa có trang chính thật cho `onComplete`).

## Từ ngữ
- Webapp = ứng dụng web; mở một địa chỉ là chạy, không cần cài.
- Deploy = đưa web lên mạng cho người khác truy cập.
- Cửa vào (entry) = trang đầu tiên tải khi mở web.
