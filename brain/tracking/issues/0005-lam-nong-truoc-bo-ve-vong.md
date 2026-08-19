# 0005 — Làm nóng trước "bộ vẽ vòng" (giật có thể ở lúc nổ)

- Ngày phát hiện: 2026-08-19
- Lộ ra từ việc: đo thật để hoàn thiện chống giật intro (report 0021)
- Trạng thái: mở (có điều kiện — chỉ làm nếu Quân xác nhận thấy giật lúc nổ)

## Vấn đề là gì
Report 0020 đã cho "vẽ nóng" trước một khung lúc tải để bộ vẽ đồ hoạ biên dịch sớm, hết
giật lúc mở. Nhưng khi soi lại code thấy: hai "vòng" (ring) của hiệu ứng đang ở trạng
thái ẩn lúc dựng, nên thư viện đồ hoạ BỎ QUA chúng khi vẽ nóng → bộ vẽ của vòng chỉ được
biên dịch lần đầu ở đúng lúc NỔ (khi vòng hiện ra). Tức là có thể còn một cú khựng, nhưng
ở đoạn nổ chứ không phải lúc mở.

## Vì sao liên quan
Cùng gốc với việc "vẽ nóng trước" của report 0020 — chỉ là còn một lỗ hổng chưa bịt.

## Nếu không xử lý thì sao
Có thể có một nhịp khựng rất ngắn đúng khoảnh khắc vụ nổ. Chưa chắc thấy được bằng mắt —
cần Quân xác nhận. Nếu không thấy thì để nguyên.

## Hướng xử lý dự kiến
Trong lúc "vẽ nóng" lúc tải, tạm bật hai vòng cho hiện để bộ vẽ biên dịch xong, rồi tắt
lại (không để vòng nhấp nháy). Sửa nhỏ trong `app/hero-sphere.js` (hàm vẽ nóng). Chỉ làm
khi Quân báo có thấy giật ở đoạn nổ — không thì đây là ngoài phạm vi (chống scope creep).

## Từ ngữ
- "bộ vẽ" (shader) = chương trình nhỏ card đồ hoạ dùng để tô hình.
- "biên dịch" = bước chuẩn bị bộ vẽ; lần đầu tốn thời gian, gây khựng nếu làm giữa chừng.
- "vòng" (ring) = vòng sáng lan ra trong hiệu ứng nổ.
