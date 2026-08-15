# STATE — Hiện tại

- **Cập nhật:** 2026-08-15

## Đang làm
Xong REDESIGN (decision 0004): bento 1 viewport + vụ nổ khai sinh trang. Thay thế bản GĐ3 cũ (hành tinh→navbar).

## Dừng ở đâu
Webapp tại `http://localhost:4001/` (server nền ID bprrwo509). Files: `index.html` (bento 7 ô), `styles/main.css` (grid + overlay), `hero-sphere.js` (5 phase khai sinh), `dust-layer.js`, `bento.js` (mới). Cú pháp 4 JS OK, route 200, wiring + CSS đủ. CHƯA xem tận mắt/tinh chỉnh. Nội dung ô còn placeholder `[...]`. `app/intro/` (prototype cũ) không dùng — để tham khảo. `site.js` (nav cũ) còn include nhưng no-op — có thể bỏ sau.
- **Intro replay:** bỏ gate `sessionStorage cosmic-intro-seen` trong `hero-sphere.js` → mỗi lần reload trang chạy lại toàn bộ hiệu ứng từ đầu (không nhớ phiên). Thêm: tắt `history.scrollRestoration` + `scrollTo(0,0)` khi boot — trước đó reload trình duyệt khôi phục vị trí cuộn → phát `scroll` event → bị coi là skip nên intro không chạy lại.
- **Lời chào intro** (report 0010): thêm "HELLO → I'M QUAN" dưới quả cầu, phase VOID+CHARGE. DOM `#cosmic-greet` (index.html), style `.cg-char` (main.css), controller `makeGreeting()` sim-time trong `hero-sphere.js`. Thay dòng tên mờ `#cosmic-void-name` cũ (đã xóa). Timeline: gõ HELLO 0.3s→ swap 1.3s→ hút vào lõi 2.4–2.9s (bezier 0.55,0,1,0.45) → biến mất trước flash. Skip/reduced-motion → không hiện. **Lưu ý mobile:** timeline giây cố định (thiết kế cho ~7.5s desktop); mobile intro ngắn hơn (void+charge=2.3s) nên greeting bị `destroy()` ở explode, hút có thể cụt — cần Quân duyệt mobile.

## Next step
1. Quân mở `http://localhost:4001/` (chỉ cần reload — intro luôn chạy lại) duyệt 9 tiêu chí redesign: VOID chỉ có cầu+tên, nổ full-screen hạt bay có chủ đích, kết tinh so le, 7 ô vừa 1 viewport (1920×1080 & 1440×900) không scroll, click ô expand+Escape, nút Bỏ qua biến mất sau intro, scroll=skip, mobile 1 cột 5.5s, không console error.
2. Tinh chỉnh cảm quan (vừa khít viewport, độ mượt kết tinh, thời lượng, mật độ bụi).
3. Điền nội dung thật (placeholder trong các ô) + ảnh.

## Blocker
- Chờ Quân duyệt trên trình duyệt + tinh chỉnh + điền nội dung.
