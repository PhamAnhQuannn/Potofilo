# PROMPT: Nebula Structure — từ "sương màu" thành "thiên thể có hình"

> Chạy trên codebase hiện tại (sau Galaxy Boost).
> VẤN ĐỀ: màu đã đậm nhưng mọi thứ đều là gradient+blur → một loại chất liệu
> "sương", không có khối nào rõ hình. Không đọc ra thiên thể.
> NGUYÊN LÝ: chiều sâu = tương phản NÉT–MỜ. Giữ lớp sương hiện có làm khí quyển,
> THÊM lớp vật thể có hình: tinh vân noise, lõi thiên hà, cụm sao.
> Không đổi chuyển động, timing, hay bố cục tile.

## File được sửa
`app/dust-layer.js` (chính — thêm module sinh texture + cụm sao),
`app/styles/main.css` (giảm vai trò lớp gradient cũ), `app/index.html` (nếu cần
element ảnh nền). KHÔNG sửa hero-sphere, bento, timing.

## 1. Texture tinh vân bằng fractal noise (sinh MỘT LẦN)

### 1.1 Bộ sinh noise (thêm vào dust-layer.js hoặc file util nhỏ)
- Value noise: lưới random 2D, nội suy bilinear + smoothstep
- fBm: cộng 4 octave (tần số 4, 8, 16, 32 trên texture 512), biên độ giảm 0.5/octave,
  chuẩn hóa về [0,1]
- Hàm tạo texture: `makeNebulaTexture(size=512, palette, seed)`:
```
for mỗi pixel:
  n  = fbm(x, y)                        // noise cơ bản
  n2 = fbm(x*2.7 + 31.4, y*2.7 + 47.2)  // noise chi tiết (sợi)
  v  = n * 0.72 + n2 * 0.28
  falloff = 1 - smoothstep(0.55, 1.0, khoảng_cách_tâm_chuẩn_hóa)
  alpha = pow(smoothstep(0.38, 0.78, v), 1.7) * falloff      // NGƯỠNG tạo rìa +
                                                              // vùng đặc/loãng
  màu = lerp(palette.outer, palette.core, smoothstep(0.45, 0.9, v))
  // vùng noise đặc = màu lõi ấm, vùng loãng = màu rìa lạnh
```
- Xuất: canvas offscreen → dùng trực tiếp làm image vẽ lên nền, hoặc
  `toDataURL` gán background-image cho div
- Sinh trong `requestIdleCallback` sau khi vào ALIVE (fallback setTimeout 1ms);
  trước khi sẵn sàng, lớp gradient cũ vẫn hiển thị → không có khoảng trống

### 1.2 Ba texture, thay vai trò các cụm gradient hiện có
| Cụm | palette.outer | palette.core | Vị trí/kích thước | Ghi chú |
|---|---|---|---|---|
| Trái | #7B2FBF | #FF8C42 | cánh trái giữa, ~52vw | seed A |
| Phải-dưới | #2E1A6E | #4ECDC4 | cánh phải dưới, ~44vw | seed B |
| Dải (kéo giãn) | #3A7BD5 | #E84A8A | dọc dải chéo, scaleX×3 scaleY×0.6 rotate -24° | noise kéo giãn thành vệt khí dọc ngân hà |
- Vẽ với `globalCompositeOperation: 'screen'` (hoặc CSS mix-blend-mode: screen),
  opacity tổng 0.5–0.65
- Blur: 0 hoặc tối đa 8px CSS trên element (KHÔNG blur 60px nữa)
- CÁC DIV GRADIENT CŨ: giữ lại nhưng giảm opacity còn 40% giá trị hiện tại —
  chúng trở thành lớp khí quyển mềm SAU lớp texture (tương phản mềm–nét)
- "Thở": animation opacity trên ELEMENT chứa texture (giữ chu kỳ nebula-breathe
  cũ) — không sinh lại texture

## 2. Lõi thiên hà (vật thể tiêu điểm — MỚI)
- 1 element (hoặc vẽ vào canvas nền): đặt TRÊN dải chéo, cánh phải, ~28% từ mép
  phải, ~30% từ mép trên
- Cấu trúc 3 lớp radial đồng tâm, elip dẹt theo góc dải (rotate -24°):
  - Lõi: 5–6vw, #FFE9C4, opacity 0.5, falloff gắt (stop 0% → 60% về 0)
  - Vành trong: 10vw, #FFC864 → #E84A8A, opacity 0.28
  - Quầng: 18vw, #7B2FBF, opacity 0.16
- Đây là ĐIỂM SÁNG NHẤT của nền — mọi thứ khác xếp bậc dưới nó
- Twinkle rất chậm: opacity ±8%, chu kỳ 12s
- KHÔNG đặt gần vùng grid tile; không thêm lõi thứ hai

## 3. Cụm sao (sửa cách sinh vị trí trong nhóm stars)
- 3 tâm cụm: (a) trong tinh vân trái, (b) trên dải chéo giữa-phải,
  (c) gần lõi thiên hà
- Mỗi cụm 30–40 sao: vị trí = tâm + Gauss(σ ≈ 4vh); kích thước trộn cấp Mờ +
  Vừa; màu hơi ấm hơn nền chung (thiên #FFE9C4)
- Số sao cụm LẤY TỪ quota hiện có (không tăng tổng): rải đều còn lại ~60%
- Sao anh hùng: 2 trong 9 ngôi đặt ở rìa cụm (b) và (c) — neo thị giác

## 4. Cân bằng lại tổng thể sau khi thêm lớp nét
- Vignette giữ nguyên
- Nếu tổng thể quá "đầy": giảm opacity lớp gradient cũ tiếp (xuống 30%),
  KHÔNG giảm lớp texture — ưu tiên giữ thứ có hình
- Kiểm tra vùng grid: texture/lõi/cụm sao không có phần tử nào lấn vào sau chữ
  với alpha > 0.35

## 5. Hiệu năng
- Sinh 3 texture 512² + noise: chạy 1 lần trong idle, mục tiêu < 120ms tổng;
  nếu máy yếu (benchmark FPS < 40): giảm size 384², bỏ octave 4
- Sau khi sinh: texture là ảnh tĩnh — chi phí render mỗi frame ≈ 3 lệnh drawImage
  (hoặc 0 nếu dùng background-image div)
- Mobile: 2 texture (bỏ cụm Phải-dưới), size 384², lõi thiên hà giữ
- Reduced-motion: texture + lõi + cụm sao VẪN HIỂN THỊ (tĩnh có màu có hình),
  chỉ tắt thở/twinkle

## 6. Nghiệm thu
1. Zoom vào tinh vân: thấy VÂN — sợi, đám đặc, rìa loang không đều; không còn
   là vệt tròn mờ đồng nhất
2. Nhắm mắt mở ra nhìn 1 giây: gọi tên được ≥ 3 "vật thể" (tinh vân trái,
   lõi thiên hà, cụm sao/dải) — trước đây chỉ gọi được "màu tím"
3. Lõi thiên hà là điểm sáng nhất nền, nhìn thấy từ xa, không tranh chấp với
   nút CTA vàng trong tile (CTA vẫn là điểm sáng nhất VÙNG NỘI DUNG)
4. Tương phản chất liệu rõ: sương mềm phía sau — texture nét ở giữa — sao sắc
   phía trước
5. Sinh texture không gây khựng khi vào ALIVE (đo: không frame nào > 50ms)
6. Chuyển động: đúng nhịp cũ, không thứ gì mới nhúc nhích nhanh
7. So 3 screenshot: bản gốc mờ → bản Galaxy Boost đậm → bản này CÓ HÌNH —
   tiến hóa rõ từng bậc
