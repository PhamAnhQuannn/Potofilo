# Cosmic Intro — module intro vũ trụ

Màn mở đầu toàn màn hình: ngôi sao hạt đập nhịp → nổ siêu tân tinh → vật chất tụ thành 4 hành tinh → UI hiện ra. Tự viết particle system bằng Three.js (r128), không dùng lib effect có sẵn. Module tách rời, gắn được vào bất kỳ trang nào.

## File
```
app/
  ├── index.html             — cửa vào webapp: intro → trang chính (placeholder)
  └── intro/
      ├── cosmic-intro.css   — style module (dùng chung)
      ├── cosmic-intro.js    — core module (state machine)
      ├── config.js          — CHỈNH Ở ĐÂY, không cần sửa core
      ├── CosmicIntro.html   — bản demo standalone chỉ intro
      └── README.md
```

## Cách chạy (như webapp)
Chạy qua HTTP server, lấy `app/` làm gốc web:
```bash
cd app
python -m http.server 4001
# webapp:   http://localhost:4001/
# chỉ intro: http://localhost:4001/intro/CosmicIntro.html
```
Không mở bằng `file://` (các file load qua đường dẫn tương đối).

## Nhúng vào trang có sẵn
Xem `app/index.html` làm mẫu: nạp `cosmic-intro.css`, `three r128`, `config.js`, ghi đè `onComplete`, rồi nạp `cosmic-intro.js`. Cùng khối markup `#cosmic-intro`.

## Cách nhúng
Cách đơn giản nhất: đặt intro thành trang phủ toàn màn hình, khi xong thì `onComplete()` chuyển sang nội dung chính.

1. Sửa `config.js` → `onComplete` để điều hướng (vd `window.location.href = '/home'` hoặc ẩn overlay).
2. Nhúng `CosmicIntro.html` (iframe overlay) hoặc bê phần `<style>` + `<div id="cosmic-intro">` + `<script>` vào trang.

Khi tích hợp vào framework (React/Next) sau này: port phần script sang component, giữ nguyên logic; nhớ `dispose` geometry/material/texture khi unmount.

## Tham số (config.js)

| Nhóm | Khóa | Ý nghĩa |
|------|------|---------|
| Hạt | `particleCount.desktop / .mobile` | Số hạt (tự giảm trên mobile) |
| Hạt | `sphereRadius`, `particleSize` | Bán kính quả cầu, cỡ hạt |
| Thời lượng | `durations.idleAuto` | Giây chờ ở IDLE trước khi tự nổ |
| Thời lượng | `durations.charge / explode / gather` | Thời lượng từng giai đoạn (giây) |
| Thời lượng | `durations.uiFadeIn` | Thời gian UI hiện ra |
| Màu | `palette.bg / hot / plasma / nebula` | 4 lớp màu theo nhiệt độ |
| Màu | `palette.stars / coreGlow / shockwave / flash` | Sao nền, hào quang, sóng, flash |
| Hành tinh | `planets[]` | `{ color, radius, orbit, speed }` mỗi hành tinh |
| Phụ trợ | `starField`, `nebulaClouds` | Sao nền + tinh vân |
| Cờ | `flags.cameraShake` | Bật/tắt rung camera lúc nổ |
| Cờ | `flags.oncePerSession` | Chỉ chạy 1 lần/phiên (sessionStorage) |
| Cờ | `flags.respectReducedMotion` | Tôn trọng prefers-reduced-motion |
| Cờ | `flags.showSkipButton` | Hiện nút "Bỏ qua" |
| UI | `ui.eyebrow / title / tagline / cta / hint / skip` | Text hiển thị (đang là placeholder) |
| Callback | `onComplete()` | Gọi khi bấm CTA / bỏ qua / bỏ intro |

## Hành vi tự động
- **Chỉ chạy 1 lần mỗi phiên:** dùng `sessionStorage`. Vào lại cùng tab → bỏ intro, gọi thẳng `onComplete`.
- **Không có WebGL:** bỏ intro, gọi `onComplete`.
- **prefers-reduced-motion:** render thẳng trạng thái DONE tĩnh (không animation), hiện UI luôn.
- **Nút "Bỏ qua"** ở góc + IDLE tự chuyển sau `idleAuto` giây (hoặc chạm/gõ phím để kích hoạt sớm).

## 5 giai đoạn (state machine)
1. **IDLE** — cầu xoay, "thở", chờ tương tác / hết giờ.
2. **CHARGE** — đập nhanh dần, co lại, sáng trắng.
3. **EXPLODE** — flash + 2 sóng xung kích + tia phun, màu nguội dần (redshift).
4. **GATHER** — hạt tụ về 4 hành tinh, màu nguội về màu hành tinh.
5. **DONE** — hành tinh quay vô hạn, UI hiện ra, CTA → `onComplete`.

## Ghi chú kỹ thuật
- `AdditiveBlending` + `depthWrite:false`: vùng hạt dày tự cộng sáng thành trắng như ánh sáng thật.
- Phân bố hạt trong cầu: `pow(random(), 0.42) * R` — lệch vỏ ngoài nhưng vẫn có lõi đặc.
- Mỗi hạt có seed pha riêng → nhịp đập không đồng loạt.
- pixelRatio cap ở 2; cập nhật buffer chỉ khi cần.
