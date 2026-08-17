# 0017 — Năng lượng do người dùng (trần 30) + parallax v1.2

- Ngày: 2026-08-17
- Trạng thái: chốt

## Bối cảnh
Nền ALIVE trần năng lượng 5 (rất khẽ) là đúng cho chuyển động TỰ PHÁT. Nhưng khi
người dùng chủ động (lia chuột, hover), phản hồi mạnh hơn một chút KHÔNG phá sự
tĩnh lặng — vì nó do người dùng điều khiển, dừng tay là dừng. Cần phân biệt hai
loại năng lượng trong hiến pháp.

## Quyết định
1. **Tu chính Trụ 5:** thêm nguyên tắc — chuyển động DO NGƯỜI DÙNG gây ra (parallax
   chuột, đèn con trỏ, tile tilt 3D, hút bụi hover) miễn trần nền, có **trần riêng
   = 30**. Chuyển động TỰ PHÁT của nền giữ **trần 5**, ưu tiên tiến hóa chậm + sự
   kiện hiếm thay vì lặp đều.
2. **Tu chính Trụ 4 — parallax v1.2:** dãn phổ hệ số parallax chuột:
   khí quyển 0.03 · sao xa 0.05 · thiên thể 0.08 · bụi 0.15 · than hồng 0.22 ·
   grid tile ngược ≤6px + tilt 3D ±5°. Thêm lớp "đèn con trỏ" vào z-order (trên
   sao, dưới bụi). Lerp chuột 0.05/frame.

## Hệ quả
- Cho phép KHỐI A (Living Galaxy) + KHỐI B (nhịp sống tự thân: hành tinh quay 140s,
  xung lõi, cửa sổ sáng dải, sao băng) — tự phát vẫn ≤ trần 5.
- `design-constitution.md` cập nhật Trụ 4 (bảng parallax) + Trụ 5 (nguyên tắc).
- Nguyên tắc chung: hiến pháp tiến hóa qua decisions khi thực tế đòi (0016, 0017).