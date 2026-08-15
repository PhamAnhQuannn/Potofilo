---
paths: ['brain/**', 'docs/**']
---

# Rule — Cách viết report + file giải thích

Mọi report và file giải thích phải viết để **một người không rành công nghệ đọc cũng hiểu đã làm gì**.

## Nguyên tắc
- Dùng từ đời thường. Tránh từ chuyên môn; nếu buộc phải dùng, giải thích ngay bằng ví dụ ("build = đóng gói code thành trang web chạy được").
- Câu ngắn, một ý một câu.
- Nói **đã làm gì** và **để làm gì**, không sa đà chi tiết kỹ thuật.
- Dùng ví von/so sánh đời thường khi giúp dễ hiểu.
- Không viết tắt lạ, không thuật ngữ bỏ lửng.

## Khung 1 report (1 việc hoàn chỉnh)
```
# NNNN — <Tên việc, ngôn ngữ thường>
- Ngày:
- Trạng thái: xong / đang làm

## Đã làm gì
(kể như kể cho bạn bè nghe)

## Vì sao làm
(lý do, lợi ích)

## Kết quả
(giờ có gì khác trước)

## Từ ngữ (nếu có từ khó)
- <từ> = <giải thích đời thường>
```

## Quy tắc file report
- 1 file = 1 việc hoàn chỉnh (1 feature / 1 nhiệm vụ trọn vẹn), KHÔNG gộp nhiều việc rời.
- Đặt trong `brain/tracking/reports/`, tên `NNNN-<slug>.md`, số tăng dần.
- Report là bản kể lại — không sửa sau khi việc đã xong (append việc mới = file mới).
