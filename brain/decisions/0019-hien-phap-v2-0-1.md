# 0019 — Hiến pháp v2.0.1 (4 tu chính khi phê chuẩn v2.0)

- Ngày: 2026-08-17
- Trạng thái: chốt

## Bối cảnh
Quân phê chuẩn hiến pháp v2.0 (decision 0018) kèm 4 tu chính bắt buộc, commit riêng
trước BLOCK 2 Kepler.

## Quyết định (cập nhật design-constitution.md)
1. **Dải hoàng đạo về MỘT lớp duy nhất (lớp 1)** — xóa entry lớp 5 trong bảng Trụ 4.
   Lõi thiên hà **parallax 0.03 → 0.04** (theo tinh thần decision 0017; lõi là tiêu
   điểm ở xa nên trôi chậm). → Code B2 đặt lõi parallax 0.04.
2. **Moon z LUÂN PHIÊN theo pha quỹ đạo:** cung XA → moon SAU anchor (bị che);
   cung GẦN → moon TRƯỚC anchor (transit). Yêu cầu thi công B2 (implement từ đầu).
3. **Trụ 1 dòng bụi:** "15% thoát ly" → "10% thoát ly + 5% ngưng tụ hệ nền".
4. **Floating mục 3:** "rim light 1px cạnh trên" → "rim gradient góc TRÊN-PHẢI theo
   LIGHT_DIR" (đồng bộ Trụ 2 tile shade). Bóng mục 2: lệch dưới-trái theo LIGHT_DIR.

## Hệ quả
- Constitution → v2.0.1. B2 Kepler ĐÈN XANH: implement moon z alternation + lõi
  parallax 0.04 ngay từ đầu.
- Bụi thoát ly giảm 15%→10% + 5% ngưng tụ hệ → thi công ở B4 (intro sinh hệ nền).
