# 0022 — Chia lát việc vẽ ảnh nền để hết giật ở "I'M QUAN"

- Ngày: 2026-08-19
- Trạng thái: xong (chờ Quân duyệt mắt máy thật)

## Đã làm gì
Sau khi hết giật lúc mở (report 0021), Quân duyệt tiếp và thấy **giật một nhịp đúng lúc
chữ "I'M QUAN" hiện** (khoảng giây 1,6 — đầu đoạn "nạp năng lượng"). Đo bằng phim 50
khung/giây + bấm giờ: có một **cú đơ ~250 phần nghìn giây** ngay đó.

Tìm nguyên nhân bằng nhiều trợ lý (3 phụ tá tính toán + soi + tranh luận → 1 tổng hợp):
trang "vẽ sẵn" một loạt ảnh nền (tinh vân, hành tinh, dải sọc hành tinh) dồn vào đoạn
này. Tấm nặng nhất là **dải sọc hành tinh 2048×1024** (~2 triệu điểm ảnh) — vẽ trọn một
lần mất ~230 phần nghìn giây, làm nghẽn đúng một nhịp = cú giật. Đây là tính toán bằng
CPU nên **máy nào cũng dính** (không phải do máy đo yếu). Report 0020 từng dời các ảnh
này ra khỏi lúc mở, nhưng chỉ "dời chỗ giật" sang đoạn này chứ chưa diệt.

### Sửa
Dùng lại đúng kỹ thuật "vẽ theo lát" đã làm cho mây (report 0021), tổng quát hoá thành
một khuôn chung `makeRowBaker` rồi áp cho mọi ảnh nặng:
- **Vẽ theo từng nhóm hàng nhỏ**, mỗi lúc trình duyệt rảnh vẽ vài hàng (~4 phần nghìn
  giây/lát) rồi nhường lại — không còn cú nặng nào.
- **Gán ảnh một lần khi vẽ xong** (không hiện ảnh dở) — nên không nhấp nháy.
- Hành tinh có nhiều bước (sọc + bóng + viền sáng): chia nhỏ bước vẽ sọc, xong mới chạy
  các bước bóng/viền rồi mới gán. Ảnh cuối giống hệt.
- Hai ảnh nhẹ (lõi thiên hà, lớp bóng) giữ vẽ một lần (đã đủ nhanh).
- Trình duyệt Safari (không có tính năng "lúc rảnh" thật) được giới hạn số hàng mỗi lần.

Ảnh cuối giống hệt bản cũ (chỉ đổi cách vẽ, không đổi phép tính) → không đổi hình.

## Vì sao làm
Cú giật đúng lúc giới thiệu tên ("I'M QUAN") làm hỏng khoảnh khắc ấn tượng nhất của màn mở.

## Kết quả
- File sửa: `app/dust-layer.js` (thêm khuôn `makeRowBaker`; đổi `makeNebulaTexture`/
  `makeBandsTex`/`makePlanetTexture` thành bộ vẽ-theo-lát; viết lại `scheduleTextures`
  để lái mọi ảnh qua một vòng tôn trọng thời gian rảnh).
- Đo lại (phim 50fps + bấm giờ, 3 lần): **không còn cú nặng nào >20 phần nghìn giây trong
  cả màn mở** (trước là 240–283). Cú đơ ở "I'M QUAN" biến mất.
- Kiểm mắt bằng frame: chữ I'M QUAN mượt; 7 hành tinh + nhãn hiện đủ; màn nền (tinh vân,
  hành tinh nền) vẽ đúng như cũ. Không lỗi trong bảng điều khiển. Cú pháp `node --check` OK.
- **Đóng issue 0001** (Safari chia nhỏ ảnh nặng) — nay đã chia nhỏ tất cả ảnh nặng + có
  giới hạn cho Safari, giải quyết luôn.
- Số đo trước/sau ở khu tạm (`planets-out.json` = trước, `planets-iter1.json` = sau).
- **CHƯA xem tận mắt máy thật** — cần Quân mở `http://localhost:4001/?intro` xác nhận
  đoạn "I'M QUAN" đã mượt.

## Từ ngữ
- "vẽ theo lát" = chia việc vẽ ảnh thành nhiều mẩu nhỏ, mỗi lúc rảnh làm một mẩu.
- "điểm ảnh" (pixel) = chấm màu nhỏ nhất tạo nên ảnh.
- "gán một lần khi xong" (atomic) = chỉ dùng ảnh khi đã vẽ trọn, không bao giờ hiện ảnh dở.
