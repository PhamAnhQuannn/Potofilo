# Kiến trúc hệ thống — bản đầy đủ, giải thích dễ hiểu

Tài liệu này mô tả **toàn bộ** cách dự án được sắp xếp và mọi luật đã dựng. Viết cho người đọc **không cần rành công nghệ**.

Hình dung dự án như một **tòa nhà có sổ tay vận hành**, gồm 3 phần:
1. **Bộ luật** (`.claude/`) — quy định cách làm việc.
2. **Não bộ** (`brain/`) — cuốn sổ nhớ mọi thứ quan trọng.
3. **Sản phẩm** (`app/`, `content/`, `public/`...) — trang web thật (chưa dựng).

---

## A. Toàn bộ cây thư mục

```
Potofilo/
├── CLAUDE.md                     # Nội quy tối cao — luôn được đọc đầu tiên
├── .gitignore                    # Danh sách thứ không lưu vào lịch sử code
│
├── .claude/                      # ⚙️ BỘ LUẬT — cách máy/người làm việc
│   ├── settings.json             #   quyền hạn của công cụ
│   ├── rules/                    #   luật tự bật theo loại file đang sửa
│   │   ├── workflow.md           #     áp MỌI file  — quy trình 4 bước
│   │   ├── writing.md            #     brain/, docs/ — viết dễ hiểu
│   │   ├── components.md         #     app/, components/ — luật giao diện
│   │   ├── content.md            #     content/ — luật nội dung dự án
│   │   └── assets.md             #     public/ — luật ảnh/media
│   ├── skills/                   #   "công thức" nhiều bước
│   │   ├── add-project/SKILL.md  #     thêm 1 dự án vào portfolio
│   │   ├── seo-audit/SKILL.md    #     kiểm tra SEO
│   │   └── update-brain/SKILL.md #     tự cập nhật não bộ
│   ├── agents/                   #   trợ lý chuyên môn
│   │   ├── writer.md             #     viết nội dung
│   │   ├── designer.md           #     tư vấn thiết kế/hiệu ứng
│   │   └── reviewer.md           #     soát lỗi
│   ├── commands/                 #   lệnh gọi nhanh
│   │   ├── new-project.md        #     /new-project
│   │   ├── retro.md              #     /retro
│   │   └── ship.md               #     /ship
│   └── hooks/                    #   (để trống, dành sau)
│
├── brain/                        # 🧠 NÃO BỘ — nhớ hộ toàn bộ bối cảnh
│   ├── INDEX.md                  #   MỤC LỤC — đọc trước, chỉ đường tới file cần
│   ├── context/                  #   SỰ THẬT ỔN ĐỊNH (ít khi đổi)
│   │   ├── product.md            #     dự án là gì, cho ai, giọng điệu
│   │   ├── architecture.md       #     công nghệ + luồng dữ liệu (chờ chốt)
│   │   ├── glossary.md           #     giải nghĩa thuật ngữ nội bộ
│   │   └── constraints.md        #     giới hạn không được phá
│   ├── decisions/                #   QUYẾT ĐỊNH LỚN — chỉ thêm, không sửa cũ
│   │   ├── 0001-chon-stack.md    #     chọn công nghệ (chờ chốt)
│   │   └── 0002-noi-dung-mdx-hay-cms.md  # cách lưu nội dung (chờ chốt)
│   ├── tracking/                 #   TÌNH HÌNH HIỆN TẠI (được sửa liên tục)
│   │   ├── STATE.md              #     đang làm gì, dừng đâu, việc kế
│   │   ├── backlog.md            #     việc chờ làm
│   │   ├── roadmap.md            #     kế hoạch dài hạn
│   │   ├── reports/              #     BÁO CÁO việc đã xong (1 việc/1 tờ)
│   │   │   ├── README.md         #       quy tắc + bảng danh sách
│   │   │   ├── 0001-...md        #       dọn thư mục
│   │   │   ├── 0002-...md        #       dựng khung + não bộ
│   │   │   └── 0003-...md        #       viết tài liệu kiến trúc
│   │   └── issues/               #     VIỆC LIÊN QUAN mới lòi ra (tạm)
│   │       └── README.md         #       vòng đời + khung + bảng đang mở
│   ├── history/                  #   ĐÃ XẢY RA — chỉ thêm, không sửa cũ
│   │   ├── CHANGELOG.md          #     sổ thay đổi theo ngày
│   │   └── sessions/             #     nhật ký từng buổi làm
│   ├── memory/                   #   BÀI HỌC rút ra
│   │   ├── gotchas.md            #     lỗi đã gặp + cách tránh
│   │   └── preferences.md        #     sở thích của chủ dự án
│   └── playbooks/                #   QUY TRÌNH lặp lại
│       ├── add-feature.md        #     cách thêm 1 tính năng
│       └── deploy.md             #     cách đưa web lên mạng
│
├── app/                          # 🏗️ Trang web thật (chưa dựng)
├── content/projects/             #   dữ liệu các dự án để trưng bày
├── public/                       #   ảnh, media, mô hình 3D, font
├── scripts/                      #   công cụ phụ trợ
└── docs/                         #   tài liệu cho người ngoài
    ├── README.md                 #     giới thiệu ngắn
    └── kien-truc-he-thong.md     #     tờ bạn đang đọc
```

---

## B. Nội quy tối cao — `CLAUDE.md`
Luôn được đọc trước mọi việc. 5 luật cứng:

1. **Chỉ làm đúng thứ được yêu cầu** — không tự thêm tính năng, không dọn dẹp lan man. Trước mỗi việc: đánh giá tác động + giữ đúng phạm vi (theo `workflow.md`).
2. **Não bộ là nguồn sự thật** — làm gì cũng đọc `brain/INDEX.md` trước, xong thì cập nhật `STATE.md`.
3. **decisions/ và history/ chỉ thêm, không sửa cái cũ** — giữ lịch sử trung thực.
4. **Không tự lưu code lên (commit) khi chưa được bảo** — không bỏ qua bước kiểm tra an toàn.
5. **Công nghệ chưa chốt → chưa dựng trang, chưa cài công cụ.**

---

## C. Chi tiết TỪNG LUẬT (`.claude/rules/`)

Điểm chung: mỗi luật có dòng ghi "áp cho file nào". Khi đụng vào loại file đó, luật tự bật. Không phải nhớ thủ công.

### C1. `workflow.md` — áp cho MỌI file
Luật quan trọng nhất, kích hoạt với mọi việc mới (tính năng, vấn đề, sửa lỗi). 4 bước:

- **Bước 1 — Nghĩ trước khi làm (đánh giá tác động).** Liệt kê thay đổi này đụng tới:
  - *Files:* file nào sửa trực tiếp, file nào bị ảnh hưởng theo.
  - *Mục tiêu kinh doanh (business case):* việc này phục vụ điều gì.
  - *Câu chuyện người dùng (user/business stories):* đụng luồng trải nghiệm nào.
  - *Quyết định + kế hoạch cũ:* có mâu thuẫn với `decisions/`, `tracking/` không.
- **Bước 2 — Ghi kế hoạch + ghi việc liên quan.** Viết việc định làm vào `STATE.md`/`backlog.md`. Nếu lòi ra việc liên quan khác → tạo một tờ trong `tracking/issues/` (KHÔNG tự làm ngoài phạm vi).
- **Bước 3 — Kỷ luật phạm vi (rất quan trọng).** Chỉ đụng đúng phần đang làm. Ví dụ: sửa nút bấm ở một khu → chỉ khu đó, không đổi các khu bên cạnh. **Cốt lõi:** nếu phát hiện phải sửa thứ khác ngoài phạm vi → *không tự sửa* → ghi một issue → để chủ dự án quyết. Issue sinh ra chính vì lý do này.
- **Bước 4 — Gặp khó thì hỏi.** Không làm gọn được trong phạm vi (vd không đủ chỗ, đụng thiết kế/quyết định) → không tự mở rộng. Giải thích rõ ràng (dễ hiểu) + nêu vài phương án + được–mất → chủ dự án chọn rồi mới làm.

### C2. `writing.md` — áp cho `brain/` và `docs/`
Mọi báo cáo và lời giải thích phải để **người không rành công nghệ đọc cũng hiểu**.
- Dùng từ đời thường; buộc dùng từ chuyên môn thì giải thích ngay bằng ví dụ.
- Câu ngắn, một ý một câu. Nói *đã làm gì* + *để làm gì*, không sa đà kỹ thuật.
- Dùng ví von đời thường.
- **Khung 1 báo cáo:** Đã làm gì → Vì sao làm → Kết quả → Từ ngữ khó.
- **Quy tắc:** 1 tờ = 1 việc hoàn chỉnh; đặt ở `tracking/reports/`, đánh số tăng dần; viết xong không sửa (việc mới = tờ mới).

### C3. `components.md` — áp cho `app/` và `components/`
Luật khi làm giao diện:
- Viết bằng TypeScript, không dùng kiểu mơ hồ (`any`).
- Cách khai báo thành phần theo lối "đặt tên rõ" (named export), không dùng "mặc định".
- Thành phần giao diện chỉ lo trình bày, KHÔNG nhét cứng dữ liệu dự án (dữ liệu lấy từ `content/`).
- Có phương án dự phòng khi hiệu ứng đặc biệt (WebGL/3D) không chạy; tôn trọng cài đặt "giảm chuyển động" của người dùng.
- Thân thiện người khiếm thị (thẻ đúng nghĩa, mô tả ảnh, viền chọn, độ tương phản đạt chuẩn) và chạy tốt trên điện thoại.

### C4. `content.md` — áp cho `content/`
Luật khi thêm nội dung một dự án:
- Mỗi dự án một mục, bắt buộc có: tên, đường dẫn (slug), tóm tắt, công nghệ dùng, ảnh bìa, ngày, các link (repo/demo).
- Ảnh để trong `public/`, tham chiếu bằng đường dẫn tương đối.
- Đánh dấu "nháp" (`draft: true`) → chưa hiện công khai.
- Không đổi đường dẫn (slug) sau khi đã đăng — để link không bị hỏng.

### C5. `assets.md` — áp cho `public/`
Luật cho ảnh, media, mô hình 3D, phông chữ:
- Ảnh nén nhẹ trước khi thêm, ưu tiên định dạng nhẹ (WebP/AVIF); không thêm ảnh nặng quá 1MB khi chưa tối ưu.
- Mô hình 3D nén lại cho nhẹ.
- Phông chữ tự lưu trong dự án, cắt bớt phần không dùng.
- Đặt tên file gọn: chữ thường, không dấu, không khoảng trắng.

---

## D. Công cụ trong `.claude/`

### D1. Skills (công thức nhiều bước)
- **add-project** — thêm một dự án: thu thập thông tin → tạo mục nội dung → thêm ảnh → viết bài chi tiết (nếu cần) → kiểm tra trên trình duyệt → ghi sổ.
- **seo-audit** — soát để Google tìm thấy trang: kiểm tra tiêu đề, mô tả, ảnh chia sẻ, sơ đồ trang, dữ liệu có cấu trúc, mô tả ảnh.
- **update-brain** — cập nhật não bộ cuối buổi: sửa STATE, viết báo cáo, đóng issue đã xong (chuyển thành báo cáo rồi xóa), ghi sổ thay đổi, ghi nhật ký buổi, thêm quyết định/bài học nếu có.

### D2. Agents (trợ lý chuyên môn)
- **writer** — viết và biên tập nội dung (bài giới thiệu dự án, tiểu sử), theo giọng điệu đã định. Không đụng code.
- **designer** — tư vấn giao diện/hiệu ứng, luôn kèm phương án dự phòng, đưa 2–3 lựa chọn để chủ dự án chọn. Chỉ gợi ý, không sửa file.
- **reviewer** — soát lỗi code (đúng/sai, tốc độ, khả năng tiếp cận, an toàn, nề nếp). Chỉ báo lỗi, không tự sửa.

### D3. Commands (lệnh gọi nhanh)
- **/new-project** — chạy công thức thêm dự án.
- **/retro** — tổng kết buổi làm + cập nhật não bộ.
- **/ship** — chạy bảng kiểm trước khi đưa web lên mạng (không tự đưa lên khi chưa được duyệt).

---

## E. Não bộ (`brain/`) — chi tiết

- **INDEX.md** — mục lục: "cần biết X → mở file Y". Đọc trước tiên.
- **context/** — điều ít đổi:
  - *product* — dự án là gì, cho ai, giọng điệu, phạm vi.
  - *architecture* — công nghệ + luồng dữ liệu (đang chờ chốt).
  - *glossary* — giải nghĩa từ nội bộ (dự án, case study, nháp...).
  - *constraints* — giới hạn không được phá (tốc độ, khả năng tiếp cận, SEO, không lộ bí mật...).
- **decisions/** — quyết định lớn, chỉ thêm mới, đánh số tăng.
- **tracking/** — tình hình hiện tại:
  - *STATE* — đang ở đâu, việc kế tiếp.
  - *backlog / roadmap* — việc chờ và kế hoạch dài.
  - *reports/* — báo cáo từng việc đã xong (dễ hiểu, 1 tờ/việc).
  - *issues/* — việc liên quan mới lòi ra; là chỗ **tạm**, xử lý xong → chuyển thành báo cáo → **xóa tờ issue**.
- **history/** — nhật ký đã xảy ra (sổ thay đổi + nhật ký từng buổi), chỉ thêm.
- **memory/** — bài học (lỗi đã gặp) và sở thích chủ dự án.
- **playbooks/** — quy trình lặp lại (thêm tính năng, đưa web lên mạng).

---

## F. Vòng làm việc đầy đủ

```
Việc mới
  │
  1. Đọc brain/INDEX.md → biết đọc gì
  2. Đánh giá tác động (files, mục tiêu, người dùng, quyết định cũ)   [workflow B1]
  3. Cần đụng thứ NGOÀI phạm vi? → KHÔNG tự sửa → ghi tracking/issues/  [workflow B3]
  4. Ghi việc dự tính vào STATE / backlog                             [workflow B2]
  5. Làm ĐÚNG phạm vi (không đụng phần lân cận)
  6. Kẹt? → không tự quyết → giải thích + phương án → chủ dự án chọn   [workflow B4]
  7. Xong:
       • viết báo cáo dễ hiểu → tracking/reports/NNNN-*.md
       • cập nhật history/CHANGELOG.md + tracking/STATE.md
       • nếu việc đó là 1 issue → chuyển thành báo cáo rồi XÓA tờ issue
       • chỉ lưu code lên (commit) khi được bảo
```

### Vòng đời một issue
```
Đánh giá tác động lòi ra việc liên quan
  → tạo tracking/issues/NNNN-*.md (viết dễ hiểu)
  → xử lý
  → viết báo cáo tracking/reports/NNNN-*.md
  → XÓA tờ issue + xóa dòng khỏi bảng "đang mở"
```
Ý nghĩa: issue là bản ghi tạm để không quên; bản lưu lâu dài là báo cáo + sổ thay đổi.

---

## G. Những nguyên tắc xuyên suốt
- Chỉ làm đúng yêu cầu, không lan man.
- Nghĩ trước (đánh giá tác động), làm sau.
- Việc lan sang chỗ khác → ghi issue, không tự sửa.
- Viết dễ hiểu cho người ngoài (báo cáo, issue, giải thích).
- Quyết định + lịch sử: chỉ thêm, không sửa cũ.
- Không tự lưu code lên, không tự chốt công nghệ khi chưa có lệnh.

---

## H. Đang chờ quyết định
- Chọn công nghệ dựng web — `brain/decisions/0001-chon-stack.md`.
- Chọn cách lưu nội dung dự án — `brain/decisions/0002-noi-dung-mdx-hay-cms.md`.

Chốt xong hai điều này mới bắt tay dựng trang web thật trong `app/`.
