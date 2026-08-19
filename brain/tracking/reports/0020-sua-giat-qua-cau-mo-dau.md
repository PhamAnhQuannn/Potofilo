# 0020 — Sửa giật quả cầu lúc mở màn intro

- Ngày: 2026-08-18
- Trạng thái: xong (chờ Quân duyệt mắt)

## Đã làm gì
Quân thấy: ngay khi vừa vào trang, TRƯỚC khi chữ "HELLO" hiện (khoảng 0,3 giây đầu),
quả cầu hạt bị giật một nhịp rồi mới mượt.

Cách tìm lỗi: nhờ 3 trợ lý phụ điều tra + đo đạc từ 3 góc khác nhau, rồi 2 trợ lý nữa
tranh luận dựng kế hoạch, cuối cùng tôi đọc lại code thật để chốt. Tìm ra 3 nguyên nhân
và sửa cả 3:

1. **Việc "vẽ sẵn ảnh nền" bị dồn vào đúng lúc mở.** Trang vẽ trước một loạt ảnh (mây,
   hành tinh, tinh vân) để lát dùng cho màn nền. Trước đây tất cả bị xếp chạy ngay giây
   đầu — trong đó có tấm nặng nhất (2 triệu điểm ảnh) — làm nghẽn, rớt khung hình → giật.
   Sửa: lúc đầu CHỈ vẽ 3 tấm mây (thứ duy nhất cần thấy ngay); các ảnh nặng còn lại dời
   sang lúc "nạp năng lượng / nổ" (muộn hơn ~1,5s, lúc cảnh đang động nên không ai để ý),
   vẫn xong trước khi vào màn nền nên không bị "hiện ra trễ".
2. **Bộ vẽ đồ hoạ biên dịch trễ.** Lần vẽ đầu tiên, thư viện đồ hoạ phải "biên dịch" —
   gây khựng. Sửa: cho vẽ trước một khung ngay lúc dựng (lúc trang đang tải, người dùng
   chưa nhìn) để phần biên dịch xong sớm.
3. **Bước nhảy ở khung hình đầu.** Cách tính thời gian khung đầu khiến quả cầu xoay
   nhích một bước hơi to. Sửa: khung đầu tính bước bằng 0 (không nhích), từ khung sau
   mới chạy bình thường.

Giữ nguyên "bản an toàn" (khi tắt hiệu ứng mới bằng `?b4=off`) — không đụng gì.

## Vì sao làm
Ấn tượng đầu tiên phải mượt. Một cú giật ngay khi mở làm cảm giác kém mượt dù phần
sau chạy tốt.

## Kết quả
- File sửa: `app/dust-layer.js` (tách việc vẽ mây khỏi việc vẽ ảnh nặng; bỏ bước nhảy
  khung đầu của vòng lặp nền), `app/hero-sphere.js` (vẽ nóng trước 1 khung lúc dựng;
  bỏ bước nhảy khung đầu của vòng lặp quả cầu).
- Đã kiểm cú pháp cả 2 file (`node --check`) — không lỗi.
- Ghi 2 việc liên quan để theo dõi (chưa làm, xem `brain/tracking/issues/0001`, `0002`):
  giật còn sót trên trình duyệt Safari; và việc tạo 14.000 hạt cùng lúc.
- CHƯA xem tận mắt (máy chạy không mở được đồ hoạ) → cần Quân mở trình duyệt duyệt:
  vào `http://localhost:4001/?intro`, xem quả cầu lúc mở KHÔNG còn giật; mây vẫn hiện
  sớm; và `?b4=off` vẫn chạy đủ.

## Từ ngữ
- "vẽ sẵn ảnh nền" (texture) = tạo trước các bức ảnh bằng code để lát dùng ngay.
- "biên dịch bộ vẽ" (shader compile) = bước chuẩn bị của card đồ hoạ trước khi vẽ được.
- "khung hình" (frame) = mỗi ảnh tĩnh trong chuỗi tạo nên chuyển động.
