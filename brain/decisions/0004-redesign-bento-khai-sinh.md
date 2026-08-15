# 0004 — Redesign: bento 1 viewport + vụ nổ "khai sinh" trang

- **Trạng thái:** ĐÃ CHỐT
- **Ngày:** 2026-08-15

## Bối cảnh
Bản cũ (scroll dọc 7 section + intro chạy bên cạnh) có 3 vấn đề: nội dung có mặt từ giây 0 nên vụ nổ chỉ là pháo hoa (mất vai trò nhân quả); màn hành-tinh-bay-về-navbar thừa; layout scroll dọc không cho thấy toàn cục.

## Quyết định
Thiết kế lại có chủ đích, đổi 3 thứ:
1. **Layout:** scroll dọc → **bento grid 1 viewport** (desktop 4×3; mobile sập 1 cột).
2. **Intro:** vụ nổ trở thành **sự kiện TẠO RA trang** — VOID → CHARGE → EXPLODE → CRYSTALLIZE (hạt kết tinh thành các ô) → ALIVE. Trước ALIVE không có ô nào tồn tại.
3. **Bỏ** hoàn toàn màn hành-tinh-bay-về-navbar + navbar desktop + 5 chấm navbar.

## Giữ nguyên
Palette (token), particle engine `CosmicSphere`, dust layer, session logic (sessionStorage), mọi lối thoát (skip/scroll/Escape/reduced-motion/no-WebGL/no-JS).

## Hệ quả
- `index.html` chuyển sang bento + expand overlay + `#cosmic-stage` (canvas full-screen intro). Bỏ navbar.
- `hero-sphere.js` đổi state machine sang 5 phase mới; CRYSTALLIZE nhắm tọa độ thật của các ô (getBoundingClientRect trên grid render ẩn). Bỏ planets/labels/nav-dots.
- Thêm `bento.js`: click ô → expand FLIP; Escape/nền/X đóng.
- `dust-layer.js`: hover hút đổi target sang `.tile`.
- Report 0008 (bản cũ GĐ3) vẫn giữ trong lịch sử; đây là thay thế có chủ đích.
