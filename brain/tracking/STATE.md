# STATE — Hiện tại

- **Cập nhật:** 2026-08-15

## Đang làm
Xong REDESIGN (decision 0004): bento 1 viewport + vụ nổ khai sinh trang. Thay thế bản GĐ3 cũ (hành tinh→navbar).

## Dừng ở đâu
Webapp tại `http://localhost:4001/` (server nền ID bprrwo509). Files: `index.html` (bento 7 ô), `styles/main.css` (grid + overlay), `hero-sphere.js` (5 phase khai sinh), `dust-layer.js`, `bento.js` (mới). Cú pháp 4 JS OK, route 200, wiring + CSS đủ. CHƯA xem tận mắt/tinh chỉnh. Nội dung ô còn placeholder `[...]`. `app/intro/` (prototype cũ) không dùng — để tham khảo. `site.js` (nav cũ) còn include nhưng no-op — có thể bỏ sau.
- **Intro gate:** `sessionStorage cosmic-intro-seen` — intro chạy 1 lần/phiên; thêm `?intro` ép chạy lại để test (report 0011). Giữ `history.scrollRestoration='manual'` + `scrollTo(0,0)` khi boot (tránh scroll-restore bị coi là skip).
- **Lời chào intro** (report 0010, sửa ở 0011): "HELLO → I'M QUAN" DƯỚI RÌA quả cầu (+40px), fix bug `place()` NaN (thêm `camera.updateMatrixWorld` + isFinite guard). Timeline TỶ LỆ void+charge (9%/39%/73%/88%). Hút vào TÂM cầu (bezier 0.55,0,1,0.45), hết trước flash.
- **State machine mới** (report 0011): `void→charge→explode→planets→cascade→crystallize→alive`. Desktop dur (mobile ×0.72): 1.5/1.8/1.4/1.6/1.5/1.3 ≈ 9.1s. `planets` = 7 hành tinh SỐNG (tự quay quanh trục nghiêng + trôi elip + thở + glow accent). `cascade` = nổ dây chuyền 7 cú (breakAt=k×0.18, sóng mini + glow lóe, KHÔNG shake, drag 0.90). `crystallize` = bay quãng ngắn từ hành tinh vào ô, daisy stagger, dust handover ở 70%. Code trong `hero-sphere.js` (methods `_enterPlanets/_planets/_enterCascade/_cascade/_breakPlanet/_buildPlanetFX`). **CHƯA xem tận mắt** (env không mở WebGL) — cần Quân duyệt cảm quan + tinh chỉnh.
- **Galaxy Boost** (report 0013): nâng độ hiện diện MÀU TĨNH của ALIVE ~2.5–3× (GIỮ mọi timing/biên độ). `main.css`: `--bg`→#07071A, `.vignette` (4 góc tối), `.galaxy-band` dải chéo -24° (galaxy-breathe 30s ±25%), tinh vân 3 cụm đa lớp (8 div, opacity 0.14–0.26, tâm ở hai cánh), `.tile` nền gradient tối + border color-mix accent 28% + box-shadow rim/bóng sâu/glow accent (glow qua box-shadow vì `.tile` overflow:hidden clip `::before`). `dust-layer.js`: sao 3 cấp (faint 200/mid 50/hero 9, hero chỉ hai cánh + halo 2 lớp + glint), 40% faint dọc dải, embers 10→14 op 0.14–0.24. reduced-motion: tinh vân+dải tĩnh GIỮ MÀU. **CHƯA xem tận mắt.**
- **Nhãn hành tinh + Vũ trụ nền ALIVE** (report 0012): (A) 7 nhãn `.planet-label` text từ `.tile__label`, màu accent, bám tâm hành tinh, "thổi bay" khi vỡ (`makePlanetLabels` trong hero-sphere.js). (B) ALIVE hết tĩnh: 4 tinh vân CSS thở (gate `body.cosmic-alive`), `dust-layer.js` refactor 4 nhóm 1 canvas (dust/stars/embers/meteor) + parallax chuột (px/py lerp 0.04) + bento parallax ±3px + sao băng ~25–40s + seedStars nối bầu trời từ sao WebGL. Ô bento lơ lửng lệch pha (`tile-float` + `--float-dur/delay`). Kích hoạt ở `finishIntro`/nhánh seen/reduced. `?debug` log frame-time. reduced-motion → tĩnh sạch. **CHƯA xem tận mắt.**

## Next step
1. Quân mở `http://localhost:4001/?intro` (ép chạy lại intro) duyệt 7 nghiệm thu report 0011: lời chào dưới rìa cầu + hút vào tâm hết trước flash; sau big bang thấy 7 hành tinh SỐNG ~1.6s; dây chuyền vỡ đúng thứ tự có sóng mini màu riêng, không flash trắng/không shake; hạt mỗi hành tinh kết tinh vào đúng ô; tổng ≤9.5s; scroll-skip mọi phase; không console error.
2. Tinh chỉnh cảm quan (vừa khít viewport, độ mượt kết tinh, thời lượng, mật độ bụi).
3. Điền nội dung thật (placeholder trong các ô) + ảnh.

## Blocker
- Chờ Quân duyệt trên trình duyệt + tinh chỉnh + điền nội dung.
