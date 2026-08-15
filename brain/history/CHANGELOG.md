# CHANGELOG

Append-only. Mới nhất trên cùng.

## 2026-08-15
- Redesign (decision 0004): layout → bento 1 viewport (7 ô, desktop 4×3 / mobile 1 cột); intro → vụ nổ KHAI SINH (void→charge→explode→crystallize→alive, hạt kết tinh thành ô theo getBoundingClientRect, hạt tan → ô hiện so le); bỏ hành-tinh-về-navbar + navbar desktop + nav dots. Rewrite index.html/main.css/hero-sphere.js, thêm `bento.js` (expand FLIP), dust hover→.tile. Nút Bỏ qua biến mất sau intro. Report 0009.
- Giai đoạn 3: intro auto-play + hành tinh điều hướng + bụi. hero-sphere.js mở rộng state machine (charge/explode/gather/to-navbar/done, canvas full-screen, flash/2 sóng/shake, 5 hành tinh + nhãn 3D→2D, bay về navbar + 5 chấm màu, trượt section, skip/Escape/scroll=skip, sessionStorage lần 2, reduced/no-WebGL fallback + chấm, thời lượng mobile ~6.5s). Thêm `app/dust-layer.js` (Canvas 2D: bụi handover 15%, mật độ theo scroll, parallax 0.25, twinkle, ngưng tụ tiêu đề 1 lần/phiên, hover hút, auto-reduce). CSS + wiring. Report 0008.
- Giai đoạn 2: quả cầu hạt IDLE trong hero. Thêm `app/hero-sphere.js` (class `CosmicSphere`: init/setPhase/update/onResize/dispose/start/stop, giữ buffer baseDir/baseR/seed/baseColor cho GĐ3). Nạp Three r128 + script vào index. main.css: token màu cầu (:root) + `#cosmic-canvas-mount` host canvas (blur→::before, canvas pointer-events:none). Parallax chuột, sao nền, IO/visibility pause, reduced-motion tĩnh, no-WebGL giữ placeholder. Report 0007.
- Website tĩnh Giai đoạn 1: `app/index.html` (7 section, semantic, JS-off safe), `app/styles/main.css` (token palette + responsive), `app/site.js` (nav tăng cường), `app/assets/README`, `app/README`. Đủ điểm cắm GĐ2/3 (#cosmic-canvas-mount, #dust-layer, data-cosmic-section×7, data-condense-target×7, #skip-intro, navbar). Chốt decision 0001 (vanilla + CSS thuần + Unbounded/Be Vietnam Pro). Report 0006. Đóng issue 0001 (đã có trang chính).
- Cho chạy như webapp: thêm `app/index.html` (cửa vào intro → trang chính placeholder), tách intro thành `cosmic-intro.css` + `cosmic-intro.js` (module dùng chung), `CosmicIntro.html` thành demo standalone. Server docroot = `app/` trên 4001 → `/` là website. Report 0005.
- Làm Cosmic Intro ở `app/intro/` (CosmicIntro.html + config.js + README) — vanilla 1-file, Three r128, state machine 5 giai đoạn, fallback no-WebGL/reduced-motion, chạy 1 lần/phiên, nút bỏ qua. Decision 0003. Report 0004. Issue 0001 mở (onComplete chưa có trang chính).
- Mở rộng `docs/kien-truc-he-thong.md` thành bản đầy đủ: cây thư mục có chú thích + chi tiết từng luật (workflow/writing/components/content/assets) + skills/agents/commands + não bộ + vòng làm việc + vòng đời issue.

## 2026-08-14
- Viết `docs/kien-truc-he-thong.md` (giải thích toàn hệ thống, dễ hiểu cho non-tech). Report 0003.
- Thêm rule `workflow.md` (đánh giá tác động trước + giữ đúng phạm vi). Lập `tracking/issues/` (track việc liên quan phát sinh, xong → chuyển thành report + xóa file issue). Cập nhật INDEX, update-brain skill, add-feature playbook.
- Thêm rule cách viết (`.claude/rules/writing.md`): report + file giải thích viết dễ hiểu cho non-tech. Lập `brain/tracking/reports/` (1 file = 1 việc hoàn chỉnh); thêm report 0001 (dọn thư mục), 0002 (dựng khung). Cập nhật INDEX + STATE.
- Khởi tạo skeleton: `CLAUDE.md`, `.claude/` (rules, skills, agents, commands, hooks, settings), `brain/` (context, decisions, tracking, history, memory, playbooks), folder `app/ content/ public/ scripts/ docs/`.
