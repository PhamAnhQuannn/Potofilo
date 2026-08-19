# 0021 — Đo thật rồi hoàn thiện việc chống giật lúc mở intro

- Ngày: 2026-08-19
- Trạng thái: xong (chờ Quân duyệt mắt trên máy thật)

## Đã làm gì

Report 0020 đã sửa giật lúc mở nhưng CHƯA ai xem tận mắt. Lần này Quân quay lại phim
màn hình (50 khung/giây) và vẫn thấy hoạt ảnh khựng lúc vừa vào, trước chữ "HELLO".
Nên lần này thay vì đoán, tôi **đo bằng số thật**: mở trang bằng trình duyệt tự động,
bấm giờ từng việc nặng chạy trong giây đầu.

Nhờ nhiều trợ lý phụ (đo đạc + soi lại + tranh luận) rồi một trợ lý tổng hợp, chốt ra
**hai lỗi thật, tách biệt**, và một điểm cần đo lại. Kết quả đo:

- **Vẽ 3 tấm mây nền tốn ~170 phần nghìn giây**, chia làm 3 cú nặng (mỗi cú ~35–68
  phần nghìn giây). Mỗi cú dài hơn một khung hình (16 phần nghìn giây) → rớt khung →
  đúng cái giật Quân thấy. Đây là việc tính toán bằng CPU thuần nên **máy nào cũng dính**,
  không phải do máy đo yếu.
- **Chớp nội dung lúc mở:** trang hiện đầy đủ khung nội dung (bento) một nhịp rất ngắn
  rồi mới bị màn intro che → giật hình. Cửa sổ chớp đo được ~28–57 phần nghìn giây.
- Việc "tạo 14.000 hạt" (nghi can cũ, issue 0002) đo ra **chỉ ~2 phần nghìn giây** —
  quá nhỏ, không đáng đụng vào.

### Sửa gì

**Việc 1 — Bảo trình duyệt tải thư viện đồ hoạ "thong thả" (`defer`).**
Trước đây thư viện đồ hoạ (three.js, tải từ mạng) chặn trình duyệt vẽ trang. Thêm chữ
`defer` để nó không chặn nữa. Đo lại: cửa sổ chớp lúc mạng đã có sẵn (~35 phần nghìn
giây) KHÔNG giảm mấy — vì thứ chặn vẽ trang thật ra là phông chữ + CSS ở đầu trang, chứ
không phải thư viện đồ hoạ. NHƯNG khi mạng chậm / lần đầu (chưa lưu cache), trước đây
trang chớp nội dung suốt mấy giây chờ tải; giờ hết hẳn. Nên vẫn giữ thay đổi này (chỉ
lợi, không hại). Việc diệt nốt cửa sổ chớp ~35 phần nghìn giây ghi thành việc riêng
(issue 0003).

**Việc 2 — Vẽ mây theo lát, không vẽ một mạch.**
Trước đây mỗi tấm mây vẽ trọn một lần → một cú nặng làm nghẽn. Giờ chia vẽ theo từng
nhóm hàng nhỏ, mỗi lúc trình duyệt rảnh vẽ vài hàng rồi nhường lại. Chỉ khi vẽ xong
hàng cuối mới "dán" tấm mây vào — nên mây không bao giờ hiện dở dang (không nhấp nháy).
Ảnh mây cuối cùng giống hệt trước, chỉ khác cách vẽ. Đo lại: **không còn cú nặng nào
của việc vẽ mây trong giây đầu**; các khung hình lúc mở trở lại đều đặn. Trình duyệt
Safari (không có tính năng "lúc rảnh" thật) được giới hạn cứng số hàng mỗi lần để cũng
không bị dồn cục.

**Việc 3 — Đóng nghi can cũ (issue 0002) bằng số đo.**
Đo cho thấy tạo 14.000 hạt chỉ tốn ~2 phần nghìn giây, chia nhỏ nó vừa vô ích vừa dễ
làm quả cầu hiện dở dang. Quyết định: KHÔNG làm. Đóng issue 0002.

## Vì sao làm
Ấn tượng đầu tiên phải mượt. Report 0020 sửa đúng hướng nhưng còn sót phần vẽ mây nằm
lại trong lúc mở, và chưa từng đụng tới lỗi chớp nội dung. Lần này đo bằng số nên biết
chắc sửa đúng chỗ.

## Kết quả
- File sửa: `app/index.html` (thêm `defer` cho three.js — 1 dòng); `app/dust-layer.js`
  (đổi `makeCloudTex` thành bộ vẽ-theo-lát `makeCloudTexBaker` + viết lại `scheduleClouds`
  để tôn trọng thời gian rảnh, gán tấm mây một lần khi xong).
- Đã kiểm cú pháp (`node --check` `dust-layer.js` OK) + chạy thử: không lỗi trong bảng
  điều khiển; màn nền ALIVE vẫn hiện đủ mây/tinh vân/hành tinh (đã chụp ảnh kiểm).
- Đo trước/sau lưu ở khu tạm (`measure-out.json` = trước, `measure-fix2.json` = sau).
- Dụng cụ đo tự viết: quay phim 50 khung/giây + bấm giờ việc nặng (dùng Playwright).
- Việc còn lại (ghi thành issue để theo dõi, CHƯA làm): 0003 diệt nốt chớp nội dung;
  0004 làm sẵn ảnh mây (webp) để khỏi vẽ lúc chạy; 0005 làm nóng trước bộ vẽ "vòng"
  (chỉ khi Quân xác nhận có giật lúc nổ). Issue 0001 (Safari, ảnh nặng ở đoạn nổ) vẫn
  mở — nhưng nay đã có sẵn kỹ thuật "vẽ theo lát" trong `dust-layer.js` để tái dùng.
- **CHƯA xem tận mắt trên máy thật.** Cần Quân mở `http://localhost:4001/?intro`, xem
  lúc mở KHÔNG còn khựng; so `?intro&b4=off` (tắt hệ nền) để tách bạch; và mở
  DevTools → Performance soi 2 giây đầu nếu muốn chắc.

## Từ ngữ
- "phần nghìn giây" (mili-giây, ms) = 1/1000 giây. Một khung hình mượt ≈ 16 phần nghìn giây.
- "vẽ sẵn ảnh nền" (texture) = tạo trước ảnh bằng code để lát dùng ngay.
- "defer" = bảo trình duyệt "cứ vẽ trang trước, tải cái này sau, đừng chờ nhau".
- "cache" = bộ nhớ đệm; lần sau vào trang lấy lại nhanh khỏi tải lại từ mạng.
- "cửa sổ chớp" = khoảng thời gian rất ngắn nội dung hiện ra rồi bị che, gây cảm giác giật.
