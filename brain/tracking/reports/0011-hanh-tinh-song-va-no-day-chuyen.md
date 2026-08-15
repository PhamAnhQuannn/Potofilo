# 0011 — Hành tinh sống + nổ dây chuyền + sửa vị trí lời chào

- Ngày: 2026-08-15
- Trạng thái: xong (chờ Quân duyệt tận mắt + tinh chỉnh)

## Đã làm gì
Làm màn mở đầu dài và giàu hơn. Thêm 2 chặng mới vào giữa.

Trình tự mới của màn mở đầu:
1. **void** — quả cầu hạt xoay (như cũ), giờ có lời chào ở dưới.
2. **charge** — quả cầu nén, sáng dần (như cũ).
3. **explode** — big bang (như cũ, rút ngắn chút).
4. **planets (MỚI)** — hạt gom lại thành **7 hành tinh sống**: mỗi hành tinh
   tự quay quanh một trục nghiêng riêng, trôi nhẹ theo quỹ đạo, "thở" phình xẹp,
   có quầng sáng màu riêng. Không đứng im — thực sự sống.
5. **cascade (MỚI)** — **nổ dây chuyền**: 7 hành tinh lần lượt vỡ theo thứ tự,
   mỗi cú cách nhau chút, kèm một vòng sóng nhỏ màu riêng và quầng sáng loé lên.
   Cú vỡ nhỏ hơn big bang rõ rệt, KHÔNG rung màn hình, KHÔNG loé trắng.
6. **crystallize** — hạt từ mỗi hành tinh bay quãng ngắn vào đúng ô của nó,
   lần lượt theo dây chuyền; ô hiện ra dần.
7. **alive** — trang chính hiện đủ.

Cũng sửa 2 việc:
- **Lời chào bị lệch vào giữa cầu** do một lỗi tính toạ độ (chiếu điểm ra màn hình
  trước khi khung hình đầu tiên vẽ → ra số vô nghĩa → CSS đẩy về giữa). Đã sửa để
  chữ nằm ĐÚNG dưới rìa quả cầu 40px. Đoạn chữ bị "hút vào tâm" cầu vẫn giữ nguyên.
- **Cho chạy lại intro để test:** thêm `?intro` vào URL là intro chạy lại
  (bình thường intro chỉ chạy một lần mỗi phiên).

## Vì sao làm
Theo spec chỉnh sửa của Quân: muốn màn mở đầu có tầng "hành tinh sống" giữa vụ nổ
và lúc trang hiện ra, cộng chuỗi nổ dây chuyền — cho sinh động, có hồn hơn.
Chấp nhận màn mở đầu dài thêm ~1.6 giây (tổng ~9.1 giây trên máy tính).

## Kết quả
- Mở `http://localhost:4001/?intro` để xem lại từ đầu.
- Màn mở đầu giờ có 7 hành tinh sống rồi nổ dây chuyền trước khi thành trang.
- Lời chào nằm đúng chỗ (dưới rìa cầu), không còn lệch giữa.

## Đã đụng file nào
- `app/hero-sphere.js` — thêm 2 chặng hành tinh + nổ dây chuyền, sửa lời chào,
  khôi phục "chạy 1 lần/phiên" + `?intro`.
- (index.html, main.css: không đổi thêm ở việc này.)

## Điểm chốt với Quân trước khi làm (spec có mâu thuẫn)
Spec tự mâu thuẫn ở 2 chỗ, đã hỏi và Quân chốt:
- Vị trí lời chào: **dưới rìa cầu +40px** (không phải giữa tâm).
- Intro: **khôi phục chạy 1 lần/phiên + thêm `?intro`** (đảo lại việc "reload luôn
  chạy lại" ở report 0010).
Ngoài ra spec nhắc "các fix P1/P2 từ code-review" nhưng trong dự án chưa có bản
code-review đó; các phần P1.3 (timeline theo tỷ lệ) và P1.2 (bàn giao bụi lúc 70%)
đã làm luôn theo số cụ thể trong spec.

## Còn lo / cần duyệt
- CHƯA xem tận mắt (môi trường này không mở đồ hoạ). Đã nhờ soi lại logic, không thấy
  lỗi chặn, nhưng cảm quan (tốc độ, cỡ hành tinh, độ mạnh cú vỡ) cần Quân xem trực tiếp.
- Đây là hiệu ứng nặng (7 hành tinh × hàng nghìn hạt quay mỗi khung hình) — cần Quân
  kiểm tra độ mượt trên máy thật, nhất là máy yếu / điện thoại.

## Từ ngữ
- state machine = "máy trạng thái": màn mở đầu đi lần lượt qua các chặng (void → charge → …).
- daisy stagger = lệch pha kiểu dây chuyền: các ô/hành tinh làm lần lượt, không cùng lúc.
