# 0012 — Nhãn hành tinh + Vũ trụ nền sống (ALIVE)

- Ngày: 2026-08-15
- Trạng thái: xong (chờ Quân duyệt tận mắt + tinh chỉnh)

## Đã làm gì

Hai việc, làm theo đúng thứ tự spec.

### A. Nhãn hành tinh
Ở chặng "hành tinh sống", mỗi hành tinh giờ đeo một cái tên nổi bên dưới —
chính là tên section nó sắp biến thành (Xin chào, Nổi bật, Education, …).
Tên lấy thẳng từ nhãn ô trên trang (một nguồn duy nhất: đổi nhãn ô là tên hành
tinh tự đổi). Màu tên = màu riêng của hành tinh. Tên bám theo hành tinh khi nó
trôi, và bị "thổi bay" đúng lúc hành tinh vỡ. Bấm Bỏ qua → tên biến mất ngay.

### B. Vũ trụ nền sống (sau intro)
Trước đây sau intro trang khá tĩnh (chỉ còn ít bụi). Giờ nền là một không gian
nhiều lớp, tất cả ở mức rất nhẹ ("hơi thở", không giành sự chú ý với nội dung):
- **Tinh vân**: 4 đám mây màu mờ ở 4 góc, phình xẹp chậm, lệch pha nhau. Làm
  bằng CSS nên gần như không tốn máy.
- **Sao xa**: chấm nhỏ nhấp nháy nhẹ.
- **Bụi trôi**: như cũ.
- **Than hồng**: vài đốm to mờ ngoài tiêu cự.
- **Sao băng**: thỉnh thoảng (khoảng mỗi 25–40 giây) một vệt lướt qua, chỉ một
  vệt tại một thời điểm.
- **Chiều sâu theo chuột**: di chuột thì các lớp nền dịch nhẹ, còn khối ô dịch
  ngược lại một chút (±3px) → cảm giác ô đang nổi phía trước. Trên điện thoại
  không có hiệu ứng này.
- **Ô lơ lửng**: 7 ô bento nhấp nhô lên xuống rất nhẹ, mỗi ô một nhịp khác nhau
  (không ô nào trùng nhịp). Rê chuột vào ô thì ô dừng nhấp nhô và nâng nhẹ.
- **Bầu trời nối tiếp**: khi intro kết thúc, ~60 ngôi sao đầu nhận đúng vị trí
  các hạt sao cuối của intro → bầu trời "ở lại" thay vì bật lên một bộ mới.

Tất cả gộp vào MỘT lớp vẽ (một canvas) để nhẹ máy. Có ngưỡng tự giảm hạt khi máy
đuối. Thêm `?debug` trên URL để in thời gian vẽ mỗi khung ra console.

## Vì sao làm
Theo spec của Quân: trạng thái sau intro là nơi người xem ở lại 2–3 phút đọc nội
dung, cần "sống" hơn nhưng phải tinh tế — không được làm rối mắt khi đọc.

## Kết quả
- Chặng hành tinh có tên rõ ràng, biết hành tinh nào thành ô nào.
- Sau intro trang có chiều sâu, nhiều chuyển động nhỏ độc lập, nhưng vẫn dễ đọc.
- Máy chậm / bật "giảm chuyển động" → trang tĩnh sạch (chỉ tinh vân mờ đứng yên).

## Đã đụng file nào
- `app/hero-sphere.js` — nhãn hành tinh; nối bầu trời; bật vũ trụ nền khi vào ALIVE.
- `app/dust-layer.js` — viết lại thành 4 nhóm hạt + sao băng + parallax chuột.
- `app/styles/main.css` — kiểu nhãn, tinh vân, ô lơ lửng + bóng.
- `app/index.html` — thêm 4 ô tinh vân.

## Còn lo / cần duyệt
- CHƯA xem tận mắt (môi trường không mở đồ hoạ). Đã nhờ soi lại logic 2 lần,
  không thấy lỗi chặn — nhưng cảm quan (độ nhẹ, tốc độ, độ đậm) cần Quân xem thật.
- Ô đang mở (overlay expand) vẫn còn nhịp lơ lửng chạy nền vì không được phép sửa
  `bento.js`; overlay che ô nên gần như không thấy, nhưng nếu Quân muốn dừng hẳn
  nhịp lúc mở thì cần cho phép đụng `bento.js` (ghi lại để quyết sau).
- Cần đo thực tế bằng `?debug` xem thời gian vẽ có dưới 2.5ms/khung không.

## Từ ngữ
- parallax = hiệu ứng chiều sâu: lớp gần và lớp xa dịch khác nhau khi ta di chuyển.
- tinh vân (nebula) = đám mây khí bụi mờ trong vũ trụ.
