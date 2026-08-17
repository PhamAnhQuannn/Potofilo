# 0016 — Living Galaxy (tương tác chuột + nhịp sống tự thân)

- Ngày: 2026-08-17
- Trạng thái: xong (chờ Quân duyệt tận mắt)

## Đã làm gì
Ba khối, làm theo thứ tự.

### Khối 0 — Sửa hình hành tinh + trăng
- Sọc khí giờ CONG theo mặt cầu (tính theo vĩ độ), nén dần về hai cực — trước đây
  sọc thẳng song song trông giả.
- Rìa đĩa tối rõ hơn (khối cầu). Che nửa màn hình vẫn biết nguồn sáng hướng nào.
- Trăng không còn là "chấm đen": mặt khuất được nâng sáng nhẹ, vành lưỡi liềm rõ hơn.

### Khối A — Lớp phản ứng chuột (chỉ khi người dùng chủ động)
- **Chiều sâu theo chuột mạnh hơn:** 6 lớp trượt 6 tốc độ khác nhau khi lia chuột
  (tinh vân chậm nhất → than hồng nhanh nhất → khối ô dịch ngược lại).
- **Đèn con trỏ:** một quầng sáng ấm nhẹ đi theo con trỏ (có độ trễ mềm); sao gần
  con trỏ sáng lên, bụi bị hút nhẹ. Rời chuột thì đèn mờ dần.
- **Ô nghiêng 3D:** rê chuột trong ô, ô nghiêng nhẹ theo vị trí con trỏ (như cầm
  tấm thẻ), rời ra thì phẳng lại.
- Điện thoại: bỏ hết mấy thứ này (không có chuột).

### Khối B — Nhịp sống tự thân (rất khẽ, hiếm)
- **Hành tinh tự quay:** sọc khí trôi chậm quanh hành tinh (một vòng 140 giây),
  trong khi phần sáng–tối đứng yên theo nguồn sáng. Nhìn ~20 giây mới thấy dời.
- **Xung lõi thiên hà:** thỉnh thoảng (mỗi 25–45 giây) một vòng sáng lan ra từ lõi
  rồi tắt. Không trùng với sao băng.
- **Cửa sổ sáng chạy dọc dải ngân hà:** một vệt sáng mờ trôi hết chiều dài dải
  trong 28 giây rồi nghỉ, lặp lại.
- **Sao nhấp nháy theo không gian:** thêm một lớp sóng sáng rất nhẹ trải khắp trời sao.
- **Trăng trôi:** dịch rất chậm (~20px mỗi phút), nhìn lâu mới nhận ra.

## Vì sao làm
Nền đã có chiều sâu + ánh sáng nhưng còn "đứng hình". Cần: (1) thưởng cho người
dùng khi họ tương tác (chuột), (2) một nhịp sống tự thân đủ khẽ để không làm rối
mắt khi đọc. Kèm tu chính hiến pháp (decision 0017): chuyển động do người dùng gây
ra có trần năng lượng riêng (30), tách khỏi trần nền tự phát (5).

## Kết quả
- Lia chuột: cảm nhận chiều sâu rõ ngay.
- Đứng yên nhìn ~60 giây: thấy vài "sự kiện" nhỏ (xung lõi, sao băng, vệt sáng
  chạy dải) nhưng không cái nào ồn.
- Máy chậm / giảm-chuyển-động: nền vẫn ĐỦ MÀU ĐỦ HÌNH (tinh vân, hành tinh, sao)
  nhưng đứng yên hoàn toàn — trả xong nợ reduced-motion của BƯỚC 2.

## Đã đụng file nào
- `app/dust-layer.js` — phần lớn: tách bake hành tinh (sọc/ánh sáng) để quay, đèn
  con trỏ, xung lõi, cửa sổ sáng, twinkle không gian, trăng trôi, đường vẽ tĩnh
  cho reduced-motion.
- `app/styles/main.css` — perspective + nghiêng 3D cho ô.
- `app/hero-sphere.js` — nhánh reduced/no-WebGL gọi vẽ nền tĩnh/động.
- `brain/context/design-constitution.md` + `brain/decisions/0017` — tu chính hiến pháp.

## Còn lo / cần duyệt
- CHƯA xem tận mắt (môi trường không mở canvas). Đã nhờ soi logic — không bug chặn.
- Hành tinh quay dùng cách "trượt sọc phẳng" (chấp nhận theo spec) — sọc khi quay
  có thể phẳng hơn lúc đứng yên; cần Quân xem có chấp nhận được không.
- Đo `?debug`: tổng frame-time nền < 3.0ms; sinh texture (hành tinh 2048×1024) không
  frame nào > 50ms.

## Từ ngữ
- terminator = ranh giới ngày–đêm; limb darkening = rìa cầu tối hơn tâm.
- parallax = hiệu ứng chiều sâu khi các lớp dịch khác tốc độ.
