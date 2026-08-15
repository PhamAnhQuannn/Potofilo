# 0010 — Lời chào "HELLO → I'm Quan" trong intro

- Ngày: 2026-08-15
- Trạng thái: xong (chờ Quân duyệt tận mắt)

## Đã làm gì
Thêm một lời chào chạy chữ ngay dưới quả cầu trong màn mở đầu.

Diễn biến (tính từ lúc intro bắt đầu):
- Giây 0.30: chữ "HELLO" hiện ra từng ký tự một, mỗi ký tự mờ dần vào và nhích lên chút.
- Giây 0.90–1.30: "HELLO" đứng yên.
- Giây 1.30: "HELLO" mờ đi, đổi tại chỗ thành "I'M QUAN".
- Giây 1.45–2.40: "I'M QUAN" đứng yên.
- Giây 2.40–2.90: từng ký tự lần lượt (từ hai đầu vào giữa) bị hút vào tâm quả cầu — vừa bay vào, vừa nhỏ lại, mờ đi và nhòe dần, như bị trọng lực kéo.
- Sau đó chỉ còn quả cầu nén lại rồi loé sáng và nổ (như cũ).

Đã bỏ dòng tên mờ "Phạm Anh Quân" cũ nằm dưới quả cầu — lời chào thay chỗ nó.

## Vì sao làm
Làm màn mở đầu có "chào hỏi" rõ ràng, giới thiệu tên chủ nhân trước khi trang chính hiện ra — ấn tượng hơn một dòng tên mờ tĩnh.

## Kết quả
- Mở `http://localhost:4001/` (reload là intro chạy lại) sẽ thấy lời chào.
- Bấm Bỏ qua / cuộn / Escape giữa chừng: chữ biến mất ngay, không chạy nốt.
- Máy bật chế độ "giảm chuyển động" (prefers-reduced-motion): không hiện lời chào, vào thẳng trang.
- Chữ luôn biến mất TRƯỚC lúc loé sáng; sau khi nổ không hiện lại.

## Đã đụng file nào
- `app/index.html` — thay ô tên mờ cũ bằng ô chứa lời chào `#cosmic-greet`.
- `app/styles/main.css` — bỏ kiểu chữ tên mờ cũ, thêm kiểu cho lời chào + từng ký tự.
- `app/hero-sphere.js` — thêm bộ điều khiển lời chào chạy theo "đồng hồ" của quả cầu (không dùng hẹn giờ rời, để lúc tab bị làm chậm chữ và quả cầu không lệch nhịp).

## Còn lo / cần duyệt
- CHƯA xem tận mắt (môi trường này không mở đồ hoạ) — cần Quân mở duyệt cảm quan.
- Trên điện thoại màn intro ngắn hơn (khoảng 2.3 giây tới lúc nổ), trong khi lời chào tính theo mốc giây cố định (thiết kế cho bản desktop ~7.5 giây). Nên trên điện thoại đoạn hút vào lõi có thể bị cắt ngang lúc nổ. Cần Quân duyệt trên điện thoại rồi quyết có cần co giãn thời lượng theo máy không.

## Từ ngữ
- prefers-reduced-motion = tuỳ chọn trong hệ điều hành cho người dễ chóng mặt: yêu cầu web bớt hiệu ứng động.
- easing (bezier 0.55,0,1,0.45) = kiểu tăng tốc: chữ bắt đầu chậm rồi lao nhanh vào cuối, giống rơi vào lực hút.
