# PROMPT: Realistic Planets — hành tinh render đúng quang học cho nền ALIVE

> Chạy trên codebase hiện tại (sau Nebula Structure).
> VẤN ĐỀ: nền hiện tại đọc thành "2D cartoon" vì mọi phần tử đều thiếu NGUỒN SÁNG
> — gradient đối xứng tâm không tồn tại trong tự nhiên.
> GIẢI PHÁP: thêm 1 hành tinh khí khổng lồ + 1 mặt trăng xa, render một lần bằng
> canvas 2D với quang học đúng. LÕI THIÊN HÀ (đã có) đóng vai MẶT TRỜI của cảnh —
> mọi thứ được chiếu sáng NHẤT QUÁN từ hướng đó.
> Không đổi chuyển động/timing/bố cục tile. Texture sinh một lần trong idle.

## Quy tắc quang học (áp cho MỌI phần tử, kể cả chỉnh lại cái cũ)
1. MỘT nguồn sáng duy nhất: vị trí lõi thiên hà (góc phải-trên). Ghi thành hằng
   `LIGHT_DIR` (vector 2D chuẩn hóa) dùng chung toàn file.
2. Mặt hướng sáng: sáng, ấm hơn. Mặt khuất: tối gần như nền, lạnh hơn.
3. Rìa được chiếu có viền khí quyển mỏng phát sáng; rìa khuất tan vào nền.
4. Không phần tử mới nào dùng gradient đối xứng tâm làm shading chính.

## File được sửa
`app/dust-layer.js` hoặc tách `app/celestials.js` mới (render + composite),
`app/index.html` (element chứa nếu dùng ảnh), `main.css` (vị trí/z-index).
KHÔNG sửa hero-sphere, bento, timing.

## 1. Hành tinh chính — khí khổng lồ (render 1 lần, canvas 1024²)

### 1.1 Vị trí & khung hình
- Đường kính ~48vw desktop, đặt góc TRÁI-DƯỚI, cắt khỏi màn hình ~40%
  (tâm nằm ngoài mép trái-dưới viewport) — vật thể khổng lồ không lọt khung
- Z-order: trên tinh vân + sao xa, DƯỚI dust/embers và dưới grid
- Không lấn vào sau vùng chữ tile với phần sáng (phần lưỡi liềm hướng lên
  phải-trên, phần trong grid là mặt tối ≈ nền)

### 1.2 Công thức render (thứ tự các pass trên canvas offscreen)
```
Pass 1 — Dải khí (bands):
  for mỗi y trong đĩa:
    band = sin(y_norm * 9π + fbm(y_norm*3) * 2.5)      // sọc + nhiễu loạn
    twist = fbm(x_norm*2, y_norm*6) * 0.35              // xoáy cục bộ
    v = band * 0.6 + twist
    màu = lerp qua palette hành tinh theo v
  Palette: #1B1440 (tối) → #3A2E6E → #7B2FBF → #9a5fd0 (sáng), điểm xuyết
  vệt mỏng #E84A8A (2–3 dải hẹp)
  Bóp cong sọc theo mặt cầu: x_scale = sqrt(1 − y_norm²) khi sample noise

Pass 2 — Limb darkening (tối rìa):
  multiply radial gradient tâm đĩa: 1.0 ở tâm → 0.55 ở rìa (rìa cầu luôn tối
  hơn tâm — tín hiệu "khối cầu" mạnh nhất)

Pass 3 — Terminator (ranh giới ngày–đêm):
  overlay gradient TUYẾN TÍNH theo −LIGHT_DIR: từ trong suốt (phía sáng) đến
  #05050F opacity 0.92 (phía khuất). Vị trí ranh giới lệch khỏi tâm về phía
  khuất 15% → thấy ~35–40% mặt sáng (dạng lưỡi liềm béo)

Pass 4 — Viền khí quyển (bán vào cảm giác "thật" nhiều nhất):
  - Arc mỏng dọc rìa PHÍA SÁNG: 3 nét chồng (dày 3px op 0.5 → 6px op 0.25 →
    12px op 0.12), màu #CDE3FF pha #E84A8A ở hai đầu lưỡi liềm
  - Halo ngoài: ring gradient rộng ~4% bán kính quanh rìa sáng, op 0.15

Pass 5 — Ánh phản chiếu nhẹ nơi gần nguồn sáng nhất trên rìa: đốm #FFF4D6
  op 0.25, nhỏ, mờ dần
```
- KHÔNG vành đai (ring) ở bản này — ring làm đúng rất khó, làm sai rất cartoon;
  để dành nâng cấp sau nếu muốn

### 1.3 Chuyển động
- Tự quay KHÔNG cần (texture tĩnh); duy nhất: trôi 3px theo phương ngang chu kỳ
  90s (gần như không nhận ra — hành tinh "sống" mà không nhúc nhích lộ liễu)

## 2. Mặt trăng xa (đối trọng bố cục)
- Đường kính ~7vw, đặt phần tư PHẢI-TRÊN, giữa dải chéo và lõi thiên hà,
  không chạm grid
- Render cùng công thức nhưng: đá (mottling = fbm thuần, palette xám lạnh
  #2A2A3E → #6E6E8A), lưỡi liềm MỎNG (thấy ~20% mặt sáng — nó gần "mặt trời"
  của cảnh hơn nên phần quan sát được chủ yếu là mặt khuất)
- Cùng LIGHT_DIR — hai thiên thể được chiếu cùng hướng là tín hiệu nhất quán
  người xem cảm được dù không gọi tên

## 3. Chỉnh phần tử cũ theo quy tắc nguồn sáng (nhẹ, nhưng quan trọng)
- Tinh vân trái: nghiêng lõi ấm của texture về PHÍA nguồn sáng (tham số offset
  khi sinh noise) — khí gần "mặt trời" sáng hơn
- Sao anh hùng + glint: giữ nguyên (điểm sáng tự phát, không cần shading)
- Vignette giữ nguyên

## 4. Hiệu năng
- Sinh: hành tinh 1024² + trăng 256², các pass đều thao tác ImageData một lượt
  → mục tiêu < 180ms tổng, chạy trong requestIdleCallback sau ALIVE (sau khi
  tinh vân sinh xong — xếp hàng idle, không chạy song song)
- Máy yếu (benchmark < 40fps): hành tinh 640², bỏ Pass 5
- Sau sinh: 2 lệnh drawImage/frame (hoặc element img tĩnh + CSS animation trôi)
- Mobile: hành tinh 36vw cắt 55%, trăng bỏ
- Reduced-motion: hiển thị tĩnh đầy đủ (đứng yên vốn là trạng thái gần tĩnh)

## 5. Nghiệm thu
1. Che nửa màn hình: vẫn biết ánh sáng đến từ hướng nào — mọi thiên thể
   (hành tinh, trăng, tinh vân) kể cùng một câu chuyện nguồn sáng
2. Hành tinh: thấy rõ khối cầu (limb darkening) + lưỡi liềm + viền khí quyển
   rực ở rìa sáng + sọc khí có nhiễu loạn — KHÔNG phải hình tròn phẳng có sọc
3. Checklist chống cartoon: không hình tròn nguyên vẹn lọt khung ở kích thước
   lớn / không màu bão hòa đồng nhất / không viền cứng / không shading đối
   xứng tâm — soát từng mục
4. Phần hành tinh nằm sau grid là mặt tối, không giảm contrast chữ
5. Sinh texture không khựng (không frame > 50ms); tổng 3 lần sinh (tinh vân +
   hành tinh + trăng) xếp hàng idle tuần tự
6. So screenshot trước/sau: nền chuyển từ "màu có hình" sang "CẢNH có chiều
   sâu và ánh sáng" — người xem chỉ được vào hành tinh như một VẬT, không phải
   một mảng màu
