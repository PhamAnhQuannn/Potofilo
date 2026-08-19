# 0019 — Phóng to lời chào intro "HELLO / I'M QUAN"

- Ngày: 2026-08-18
- Trạng thái: xong (chờ Quân duyệt mắt)

## Đã làm gì
Quân thấy lời chào "HELLO → I'M QUAN" (hiện lúc đầu, gần quả cầu hạt) quá nhỏ,
khó nhìn. Muốn to hơn, rõ hơn, dễ nhìn hơn.

Cách làm: nhờ 2 trợ lý phụ đo đạc + đánh giá chi tiết (một cái đo con số kỹ thuật,
một cái xét thẩm mỹ theo hiến pháp thiết kế), rồi tổng hợp thành 1 phương án. Quân
chọn gói "A+B" (vừa phóng to vừa thêm quầng tối sau chữ). Một trợ lý nữa vạch kế
hoạch thực hiện an toàn để không gây lỗi hình (chữ đè, che, lẫn màu).

Kết quả đã sửa:
- Chữ to hơn hẳn: từ 16px (bằng cỡ chữ thường) lên co giãn theo màn hình
  22px–38px, đậm hơn (mảnh → đậm vừa).
- Màu trắng tinh thay vàng nhạt → nổi rõ trên nền hạt.
- Thêm quầng sáng ấm quanh chữ + một lớp bóng tối mờ phía sau (như "hào quang tối")
  để tách chữ khỏi đám hạt sáng — nhìn không bị chìm/lẫn.
- Sửa vài chi tiết kỹ thuật để không sinh lỗi: chữ hiện đủ sáng (không mờ sẵn),
  không giật độ mờ lúc chữ bắt đầu bị hút vào tâm, và quầng tối biến mất đúng lúc
  chữ hút xong (không để lại vệt tối lởn vởn), kể cả khi bấm "Bỏ qua".

## Vì sao làm
Lời chào là câu đầu tiên khách thấy — cần đủ lớn và rõ để tạo ấn tượng, thay vì
một dòng chữ nhỏ dễ bỏ lỡ.

## Kết quả
- File sửa: `app/styles/main.css` (khối `#cosmic-greet` + dòng `.cg-char.cg-in`),
  `app/hero-sphere.js` (hàm `makeGreeting`: chỗ hút vào tâm + chỗ dọn dẹp).
- Đã kiểm cú pháp JS (`node --check`) — không lỗi.
- Tuân hiến pháp: chữ dùng màu NÓNG (trắng) đúng nhóm "tên/điểm nhấn"; quầng tối là
  nền của chính khung chữ (nằm dưới chữ), không phải hạt đè lên chữ.
- CHƯA xem tận mắt (máy chạy không mở được đồ họa) → cần Quân mở trình duyệt duyệt.

## Từ ngữ
- clamp(22px, 3.2vw, 38px) = cỡ chữ tự co giãn theo bề ngang màn hình, nhỏ nhất
  22px, lớn nhất 38px.
- halo / hào quang tối = lớp nền mờ tối phía sau chữ, tan dần ra ngoài, giúp chữ
  tách khỏi nền sáng.
- suck (hút vào tâm) = đoạn cuối, các chữ bị hút gọn về giữa quả cầu rồi biến mất.
