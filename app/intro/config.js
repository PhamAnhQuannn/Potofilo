/*
 * Cosmic Intro — config
 * Chỉnh mọi thứ ở đây, KHÔNG cần sửa core (CosmicIntro.html).
 * Tất cả màu tuân thủ hệ màu theo nhiệt độ: nóng = sáng/trắng, nguội = tối/đỏ-tím.
 */
window.CosmicIntroConfig = {
  // ---- Số hạt (tự giảm trên mobile) ----
  particleCount: { desktop: 18000, mobile: 7000 },

  // ---- Kích thước quả cầu + cỡ hạt ----
  sphereRadius: 4.0,
  particleSize: 0.09,

  // ---- Thời lượng từng giai đoạn (giây) ----
  durations: {
    idleAuto: 6.0, // IDLE tự chuyển sau ngần này giây nếu không tương tác
    charge: 2.6,
    explode: 2.2,
    gather: 3.2,
    uiFadeIn: 2.2, // DONE: thời gian UI hiện ra
  },

  // ---- Hệ màu (mục 4 spec) ----
  palette: {
    // Lớp 1 — nền vũ trụ (không bao giờ đen thuần)
    bg: ['#050510', '#0A0A1A', '#0D0B21', '#141031'],
    // Lớp 2 — lõi nóng (tâm cầu, flash)
    hot: ['#FFFFFF', '#FFF4D6', '#FFC864', '#FF8C42'],
    // Lớp 3 — plasma / tia phun
    plasma: ['#FF5E3A', '#C2273D', '#E84A8A', '#7B2FBF'],
    // Lớp 4 — tinh vân lạnh (haze nền)
    nebula: ['#4ECDC4', '#3A7BD5', '#2E1A6E', '#7B2FBF'],
    // Sao nền — 3 tông nhiệt độ
    stars: { hot: '#CDE3FF', neutral: '#FFFFFF', cool: '#FFE9C4' },
    coreGlow: '#FFC864', // hào quang lõi
    shockwave: { fast: '#FFF4D6', slow: '#E84A8A' }, // 2 vòng sóng xung kích
    flash: '#FFFFFF', // flash overlay vụ nổ
  },

  // ---- 4 hành tinh (mục 6, giai đoạn GATHER) ----
  planets: [
    { color: '#4ECDC4', radius: 0.65, orbit: 2.6, speed: 0.55 }, // teal
    { color: '#3A7BD5', radius: 0.85, orbit: 3.9, speed: 0.36 }, // xanh dương
    { color: '#E84A8A', radius: 0.5, orbit: 5.1, speed: 0.27 }, // magenta
    { color: '#FFC864', radius: 0.4, orbit: 1.6, speed: 0.8 }, // vàng
  ],

  // ---- Phụ trợ bối cảnh ----
  starField: { count: 900, near: 40, far: 100, minOpacity: 0.35, maxOpacity: 1.0 },
  nebulaClouds: { count: 4, minOpacity: 0.1, maxOpacity: 0.3, zNear: -13, zFar: -16 },

  // ---- Cờ bật/tắt ----
  flags: {
    cameraShake: true, // rung camera 0.3s đầu vụ nổ
    oncePerSession: true, // chỉ chạy 1 lần mỗi phiên (sessionStorage)
    respectReducedMotion: true, // prefers-reduced-motion → vào thẳng DONE
    showSkipButton: true, // nút "Bỏ qua" ở góc
  },

  // ---- Nội dung UI màn DONE (PLACEHOLDER — cập nhật sau) ----
  ui: {
    eyebrow: 'PORTFOLIO',
    title: '[TÊN WEBSITE]',
    tagline: '[Mô tả ngắn về bạn]',
    cta: 'Khám phá',
    hint: '[Chạm để kích hoạt]',
    skip: 'Bỏ qua',
  },

  // ---- Gọi khi intro kết thúc (bấm CTA hoặc bỏ qua) ----
  // Thay bằng logic điều hướng vào trang chính khi có.
  onComplete: function () {
    // eslint-disable-next-line no-console
    console.log('[CosmicIntro] done — móc nối vào trang chính ở đây.');
  },
};
