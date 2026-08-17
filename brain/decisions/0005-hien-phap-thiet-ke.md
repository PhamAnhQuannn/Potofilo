# 0005 — Hiến pháp thiết kế v1

- Ngày: 2026-08-17
- Trạng thái: chốt

## Quyết định
Chốt **Hiến pháp thiết kế v1** làm hệ quy chiếu thị giác cho Potofilo. Đặt tại
`brain/context/design-constitution.md`. Mọi thay đổi thị giác phải đối chiếu 5 trụ
+ công thức floating + bất biến trước khi code (quy trình 6 câu hỏi).

5 trụ:
1. Một câu chuyện — mọi phần tử là vật chất từ vụ nổ (kể được nguồn gốc).
2. Một nguồn sáng — lõi thiên hà (phải-trên) = mặt trời; hằng `LIGHT_DIR` dùng chung.
3. Màu = nhiệt độ = thời gian — nóng (đang sống) / chuyển / lạnh (đã nguội) / nền.
4. Chiều sâu 5 lớp — đồng biến gần hơn = nét + nhanh + ấm + phản ứng hơn.
5. Phân cấp năng lượng — big bang 100 (1 lần) > cascade 55 > tương tác 30 > ALIVE 5.

Công thức floating (5 thành phần) + danh sách bất biến (scroll/skip mọi phase,
reduced-motion giữ màu+hình, no-JS đủ nội dung, 1 canvas 2D nền, sim-time không
setTimeout cho sequence, palette từ CSS var).

## Vì sao
Sau nhiều vòng lặp thị giác (intro khai sinh → hành tinh dây chuyền → ALIVE →
Galaxy Boost), cần một hệ quy chiếu cố định để: (1) tránh trôi phong cách qua mỗi
vòng, (2) kiểm nhanh đề xuất mới có phá tổng thể không, (3) làm căn cứ audit.

## Hệ quả
- Thêm luật cứng #0 vào `CLAUDE.md` (đọc hiến pháp + 6 câu hỏi trước thay đổi thị giác).
- Các prompt thị giác kế tiếp (nebula-structure, realistic-planets) build theo hiến pháp.
- Là chuẩn đối chiếu cho đợt audit toàn codebase (`docs/audit-report.md`).
