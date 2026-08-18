# Audit Report — Potofilo "MỘT hệ"

- Ngày: 2026-08-17
- Đối chiếu: `brain/context/design-constitution.md` **v2.0.1** (6 trụ + phụ lục giải phẫu + quy trình 7 câu)
- Phạm vi: toàn `app/` sau 7 block (B7 hiến pháp → B2 Kepler → B3 khí hậu → B5 → B6 tile → B1 assets/mây → B4 echo)
- Người chạy: Claude Code (đọc + grep). **Không đo được** phần cần trình duyệt (env không render canvas).

---

## 1. Bảng checkbox theo hiến pháp

Ký hiệu: ✅ đạt · 🔧 đã sửa · ⚠️ cần người dùng quyết · ⛔ KHÔNG ĐẠT (treo) · 📝 nội dung chờ

### Trụ 1 — Vụ nổ sinh TẤT CẢ
| Mục | KQ | Ghi chú |
|---|---|---|
| Mọi phần tử kể được nguồn gốc | ✅ | tile/bụi/tinh vân/sao/hành tinh/nhãn đều có gốc |
| Vụ nổ sinh TOÀN BỘ hệ (light-echo + 5% ngưng tụ) | ⛔ | B4 ship bản an toàn (mây fade-in so le khi ALIVE) — THIẾU light-echo theo sóng explode + 5% hạt ngưng tụ. Xem "Sai lệch treo" §3. |
| Thiên thể được là artwork (palette+LIGHT_DIR) | ✅ | loader ảnh + procedural fallback |

### Trụ 2 — Một nguồn sáng
| Mục | KQ | Ghi chú |
|---|---|---|
| `LIGHT_DIR` 1 nguồn, không bản sao lệch | ✅ | `dust-layer.js:45` (1 định nghĩa, 7 ref) |
| Thiên thể shade theo LIGHT_DIR (terminator/limb/viền) | ✅ | `makeShadeTex`/`makePlanetTexture` |
| Tile shade theo LIGHT_DIR | ✅ | rim gradient 225° (góc trên-phải) + bóng lệch dưới-trái (CSS không đọc JS const → dùng góc đồng hướng) |
| Khí hậu màu = ánh THỨ CẤP (chỉ nhuộm, không đổ bóng/rim2/đổi terminator) | ✅ | `drawClimateHalos` chỉ tint + bụi lerp màu |

### Trụ 3 — Màu = nhiệt độ
| Mục | KQ | Ghi chú |
|---|---|---|
| Không `#000000` | ✅ | grep: chỉ trong comment |
| Palette từ CSS variable | ✅ | `:root` tokens; JS đọc qua readPalette (intro) |
| CTA vàng sáng nhất vùng nội dung / lõi sáng nhất nền | ✅ | CTA `--hot-1`; lõi galaxy brightest bg |
| Ngoại lệ ấm rocky (gỉ ấm, phản chiếu) | ✅ | `CLIMATE[2].col=[196,128,64]` |
| Vùng nóng/lạnh đúng phân | ✅ | nền dồn lạnh; ấm ở lõi/CTA/rocky |

### Trụ 4 — Chiều sâu (bảng lớp v2.0.1)
| Mục | KQ | Ghi chú |
|---|---|---|
| Z-order: mây<sao xa<thiên thể<đèn<bụi<tile | ✅ | drawClouds→nebula→stars→celestials→cursor→dust |
| Hành tinh che sao sau lưng | ✅ | celestials vẽ SAU stars |
| Parallax đồng biến (xa=nhỏ) | ✅ | mây .02–.05 / sao .05 / thiên thể .08 / bụi .15–.22 |
| Dải hoàng đạo 1 lớp (lớp 1) | ✅ | band trong drawNebulaBg |
| Lõi parallax 0.04 | ✅ | drawCelestials core px*0.04 |

### Trụ 5 — Năng lượng
| Mục | KQ | Ghi chú |
|---|---|---|
| Flash + shake CHỈ big bang | ✅ | onFlash/camera-jitter chỉ trong `_enterExplode`/`_explode` |
| Cascade không flash/shake | ✅ | `_cascade`/`_breakPlanet` không có |
| ALIVE chu kỳ ≥3s, biên nhỏ, lệch pha | ✅ | quay 140s, thở nebula 22s, xung 25–45s, sao băng 25–40s |
| Sự kiện lan nội dung = 8 (xung quét tile) | ✅ | `pingTilesSweep` glow 0.6s stagger |

### Trụ 6 — Định luật Kepler (mới)
| Mục | KQ | Ghi chú |
|---|---|---|
| Tiêu điểm lõi, giãn 1.7×, v∝1/√r | ✅ | `keplerPos`, base×[1,1.7,2.9,4.9], chu kỳ 240/420/540/1200s |
| Vị trí = hàm giải tích của time (throttle-safe) | ✅ | `keplerPos` dùng `time`, không cộng dồn |
| Trăng phân cấp quanh anchor → transit | ✅ | 150s + z luân phiên (moonFront) |
| Cấm n-body / tương tác hành tinh–hành tinh | ✅ | không có; slingshot chỉ bụi↔anchor |

### Công thức floating
| Thành phần | KQ |
|---|---|
| Tách nền tối hơn | ✅ tile gradient tối |
| Bóng đổ sâu (lệch dưới-trái) | ✅ |
| Rim gradient trên-phải theo LIGHT_DIR | ✅ |
| Vi chuyển động lệch pha | ✅ `--float-dur/delay` 7 giá trị khác |
| Parallax tách lớp (ngược) | ✅ bento ≤6px + tilt |

### Bất biến
| Mục | KQ | Ghi chú |
|---|---|---|
| Scroll/skip/Escape mọi phase (gồm planets/cascade) | ✅ | hero-sphere onSkip mọi lúc |
| Reduced-motion giữ MÀU+HÌNH, tắt chuyển động | ✅ | `renderReducedStatic` mây+nebula+hệ tĩnh (aliveT=1) |
| No-JS: nội dung đầy đủ | ✅ | bento HTML tĩnh; canvas/intro chỉ enhance |
| sessionStorage gate + ?intro | ✅ | hero-sphere:665 |
| Chữ không bị hạt đè op>0.4 | ✅ | canvas z0 dưới tile ĐỤC → không đè chữ |
| 1 canvas 2D nền ALIVE | ✅ | `#dust-layer`; WebGL dispose sau intro; khác là offscreen bake |
| Sim-time, không setTimeout cho sequence | ✅ | setTimeout chỉ non-sequence (dispose/idle-fallback/ping-remove) |
| Palette từ CSS var | ✅ | |

### Dọn dẹp
| Mục | KQ | Ghi chú |
|---|---|---|
| `app/intro/` legacy đã xóa | 🔧 | ĐÃ XÓA (5 file) — git history giữ |
| `site.js` đã xóa | 🔧 | ĐÃ XÓA + bỏ include index.html — git history giữ |
| aria-hidden đúng | ✅ | canvas/nebula/stage `aria-hidden` |
| Link không hỏng | 📝 | 7 `href="[...]"` = nội dung chờ điền (không phải bug) |

---

## 2. Giá trị đã thay đổi trong audit
**KHÔNG có sửa code bắt buộc.** Mọi mục kiểm được đều ✅ hoặc thuộc cần-quyết/treo
(không tự sửa). Audit này thuần đối chiếu + lập hồ sơ.

---

## 3. Sai lệch hiến pháp ĐANG TREO
| Lệch | Trụ | Đường về |
|---|---|---|
| **B4 thiếu light-echo + 5% ngưng tụ** | Trụ 1 | backlog "B4-đầy-đủ". ĐIỀU KIỆN: có vòng duyệt mắt trực tiếp khi đụng intro (WebGL, rủi ro, env không render). |

## 4. Cần người dùng quyết
| Việc | Trạng thái |
|---|---|
| ~~Xóa `app/intro/` + `site.js`~~ | ✅ DONE (dọn dẹp, git history giữ) |
| ~~TUNE thiếu nhóm~~ | ✅ DONE — nhóm **"Ánh sáng"** thêm ở V6 Chiaroscuro (7 slider) |
| Ảnh `app/assets/celestial/` | ⏳ CHỜ: thả ảnh (README) để dùng artwork thật; nay procedural |
| Điền 7 nội dung placeholder `[...]` | ⏳ CHỜ: nội dung thật của Quân |

## 5. Bảng backlog (đồng bộ STATE.md + backlog.md)
| Hạng | Việc |
|---|---|
| Treo hiến pháp | B4-đầy-đủ (mây VOID 0.06 + echo sóng explode + 5% ngưng tụ) |
| Polish | Khí-hậu-viền-tile (planet Kepler trôi → cần bám động) |
| Polish | Distant xuyên-khe (tính cung theo gap runtime) |
| Polish | Viền khí quyển pha `#E84A8A` hai đầu lưỡi liềm |

---

## 6. Kiểm fallback (adjustment 4)
- **Ảnh thiếu → procedural:** `tryLoadAssets` `onerror`→null; draw dùng `imgX || texX`
  (anchor: `if(imgAnchor) else drawPlanetRot`; cloud: `if(!cloudX) bake`). Mọi thiên
  thể + 3 mây có fallback riêng ✅. (Không có ảnh nào hiện tại → toàn procedural, không lỗi console.)
- **TUNE nhóm:** 3 nhóm sống (Quỹ đạo, Khí hậu, **Ánh sáng** — thêm V6 Chiaroscuro).
- **Reduced-motion:** `renderReducedStatic` vẽ mây (aliveT=1) + nebula + hệ Kepler tĩnh ✅.

## 7. Hiệu năng — CHƯA ĐO (env không chạy trình duyệt/canvas)
Cần Quân đo, điền vào đây:

| Chỉ số | Mục tiêu | Đo được |
|---|---|---|
| Frame time canvas ALIVE (`?debug` → console `[dust] avg draw`) | < 3.5ms tầm trung | ______ ms |
| Sinh texture (không frame > 50ms) | ✓ | ______ |
| Lighthouse Performance | ≥ 85 | ______ |
| Lighthouse Accessibility | ≥ 90 | ______ |

**Cách đo:** `http://localhost:4001/?intro&debug` → vào ALIVE → xem console dòng
`[dust] avg draw Xms`. Lighthouse: DevTools → Lighthouse → Desktop.
Rủi ro perf: makeBandsTex 2048×1024 + nhiều texture bake — kiểm frame idle không >50ms.

## 8. Screenshot 3 trạng thái — CHƯA CÓ (env không render)
Cần Quân chụp: cascade giữa chừng · ALIVE 1440×900 · ALIVE 1920×1080 · mobile 390×844.
