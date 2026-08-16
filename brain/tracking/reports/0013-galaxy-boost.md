# 0013 — Galaxy Boost (nâng độ hiện diện thị giác ALIVE)

- Ngày: 2026-08-15
- Trạng thái: xong (chờ Quân duyệt tận mắt)

## Đã làm gì
Nền sau intro trước đây quá mờ — nhìn không ra "dải ngân hà". Lần này tăng **màu
sắc tĩnh** cho đậm hẳn lên, nhưng **giữ y nguyên mọi chuyển động** (không đổi tốc
độ hay nhịp gì cả). Chuyển động khẽ là đúng; chỉ có màu bị nhạt là sai.

Cụ thể:
- **Nền tối hơn + ám tím nhẹ**, thêm lớp tối 4 góc (vignette) → vùng giữa trông
  sáng và sâu hơn.
- **Dải ngân hà chéo**: một dải màu tím–hồng–lam vắt chéo qua màn hình — đây là
  thứ làm mắt nhận ra ngay "à, galaxy".
- **Tinh vân đậm hơn nhiều**: gộp thành 3 cụm mây nhiều lớp ở hai bên cánh (trái
  và phải), màu rõ hơn ~3 lần so với trước. Không đặt ở giữa để không che nội dung.
- **Sao chia 3 hạng**: sao mờ li ti (đa số), sao vừa sáng hơn, và vài "sao anh
  hùng" to sáng có quầng + tia chữ thập lấp lánh (chỉ đặt ở hai cánh). 40% sao mờ
  rải dọc theo dải ngân hà cho dày lên đúng chỗ.
- **Than hồng** nhiều và rõ hơn một chút.
- **Ô nội dung tách hẳn khỏi nền**: ô tối hơn nền xung quanh, có viền màu riêng,
  bóng đổ sâu và quầng sáng nhẹ màu riêng → ô như nổi lên phía trước.

## Vì sao làm
Trạng thái sau intro là nơi người xem ở lại lâu đọc nội dung. Nó cần "ra chất vũ
trụ" rõ ràng nhưng vẫn dễ đọc — trước đây quá nhạt nên nhìn như trang tối trơn.

## Kết quả
- Nhìn phát ra ngay: dải chéo + hai cụm tinh vân màu + vài sao sáng.
- Ô nội dung nổi khỏi nền, chữ vẫn dễ đọc (nền ô TỐI hơn trước, không sáng lên).
- Nhịp chuyển động không đổi so với bản trước.
- Máy chậm / bật "giảm chuyển động": tinh vân và dải đứng yên nhưng VẪN CÓ MÀU
  (galaxy tĩnh vẫn là galaxy).

## Đã đụng file nào
- `app/styles/main.css` — nền, vignette, dải ngân hà, tinh vân 3 cụm, kiểu ô.
- `app/dust-layer.js` — sao 3 hạng + rải sao theo dải + tăng than hồng.
- `app/index.html` — thêm div vignette, dải ngân hà, 8 lớp tinh vân.

## Ghi chú kỹ thuật (1 chỗ làm khác spec)
- Spec yêu cầu quầng sáng ô bằng `.tile::before`. Nhưng ô có `overflow:hidden`
  (để bo góc nội dung) sẽ **cắt mất** phần quầng nằm ngoài ô. Nên mình làm quầng
  bằng `box-shadow` (không bị cắt) — đúng ý "ô có quầng accent", và khớp câu spec
  cho phép "đơn giản: hover tăng viền lên 40% accent".

## Còn lo / cần duyệt
- CHƯA xem tận mắt (môi trường không mở đồ hoạ). Cần Quân đối chiếu screenshot
  trước/sau và xác nhận: hai cánh có màu rõ, dải chéo nhận ra, ô nổi khỏi nền,
  chữ không giảm tương phản, nhịp chuyển động y như cũ.
- Đo `?debug` xem thời gian vẽ vẫn dưới 2.5ms (sao tăng lên ~260 nhưng phần lớn
  đứng yên, chỉ nhấp nháy độ mờ).

## Từ ngữ
- vignette = làm tối dần ở rìa/góc khung hình để hút mắt vào giữa.
- glint = tia sáng chữ thập ở ngôi sao rất sáng.
