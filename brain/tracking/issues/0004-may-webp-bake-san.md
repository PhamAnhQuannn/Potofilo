# 0004 — Làm sẵn ảnh mây (webp) để khỏi vẽ lúc chạy

- Ngày phát hiện: 2026-08-19
- Lộ ra từ việc: đo thật để hoàn thiện chống giật intro (report 0021)
- Trạng thái: mở

## Vấn đề là gì
Trang đang vẽ 3 tấm mây nền bằng code mỗi lần mở (vì chưa có ảnh mây làm sẵn). Report
0021 đã chia việc vẽ thành nhiều lát nhỏ để không giật — nhưng vẫn tốn CPU mỗi lần mở
(~170 phần nghìn giây, chia mỏng ra). Nếu có sẵn 3 file ảnh mây thì chi phí lúc chạy
về 0: code đã có sẵn chỗ nạp ảnh (`dust-layer.js`), có ảnh là tự dùng, khỏi vẽ.

## Vì sao liên quan
Đây là cách xử tận gốc lỗi giật do vẽ mây (report 0021) — thay vì vẽ mỏng đi thì khỏi
vẽ luôn. Bổ sung cho report 0021, không thay thế.

## Nếu không xử lý thì sao
Không sao về mặt giật (report 0021 đã hết giật). Chỉ là vẫn tốn chút CPU mỗi lần mở,
đáng ra tránh được.

## Hướng xử lý dự kiến
Làm 3 file `cloud-back.webp` / `cloud-mid.webp` / `cloud-front.webp` đặt ở
`app/assets/celestial/`. Cần Quân quyết đường làm ảnh:
- (a) Cài thêm thư viện dựng ảnh (node-canvas/sharp) — **VƯỚNG luật cứng #5** "stack chưa
  chốt, không cài dep". Cần Quân cho phép.
- (b) Tái dùng trình duyệt tự động (Playwright) đã có để render chính hàm vẽ mây rồi
  xuất webp — không cài gì mới.
Cả hai đều cần Quân duyệt mắt: màu ảnh phải khớp bảng màu LẠNH (teal-xanh) của mây hiện
tại và không tạo hướng sáng lệch (Trụ 2, Trụ 3 hiến pháp).

## Từ ngữ
- "webp" = một định dạng ảnh nén tốt cho web.
- "bake sẵn" = tạo trước ảnh một lần, lưu ra file, khỏi tính lại lúc chạy.
