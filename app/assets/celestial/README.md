# Ảnh thiên thể (celestial)

Thả ảnh vào đây → `dust-layer.js` tự dùng thay bản procedural. Thiếu file nào →
procedural fallback file đó, KHÔNG lỗi (loader bắt `onerror`).

## File mong đợi (định dạng .webp)
| File | Nội dung | Kích thước tối thiểu |
|---|---|---|
| `anchor.webp` | Hành tinh khí khổng lồ có vành (anchor) | ≥ 1600px, nền trong suốt |
| `ice.webp` | Hành tinh băng (xanh-tím) | ≥ 800px, nền trong suốt |
| `rocky.webp` | Hành tinh đá (gỉ ấm) | ≥ 600px, nền trong suốt |
| `moon.webp` | Mặt trăng | ≥ 400px, nền trong suốt |
| `cloud-back.webp` | Mây thể tích lớp SAU (teal-xanh, 21:9) | rộng ~1600px |
| `cloud-mid.webp` | Mây lớp GIỮA | rộng ~1600px |
| `cloud-front.webp` | Mây lớp TRƯỚC — chỉ VỆT MỎNG, nền trong suốt | rộng ~1400px |

## Quy tắc bắt buộc
- **TẤT CẢ sáng từ PHẢI-TRÊN** (đồng bộ `LIGHT_DIR` = lõi thiên hà). Mặt trái-dưới tối.
- Nền trong suốt (PNG alpha → xuất webp giữ alpha).
- Hành tinh: rim gắt phải-trên, terminator mềm (khí) / gắt (đá), mặt tối 5–8% sáng
  (không đen tuyệt đối), vành 3 trạng thái (xem `brain/context/design-constitution.md`
  phụ lục Giải phẫu thiên thể).

## Nén (tổng ≤ 1.4MB)
- Xuất webp chất lượng ~80, giữ alpha.
- `cwebp -q 80 anchor.png -o anchor.webp` (hoặc squoosh.app).
- Ưu tiên anchor nét nhất; ice/rocky/moon nhỏ hơn nén mạnh hơn.
- Kiểm tổng dung lượng thư mục ≤ 1.4MB trước khi commit.
