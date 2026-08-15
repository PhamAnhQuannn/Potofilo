# 0003 — Định dạng module Cosmic Intro

- **Trạng thái:** ĐÃ CHỐT
- **Ngày:** 2026-08-15

## Bối cảnh
Xây màn intro vũ trụ (particle system Three.js) làm việc đầu tiên. Spec cho chọn vanilla hoặc React "theo stack dự án". Nhưng stack dự án chưa chốt (`0001` còn mở) — luật cứng CLAUDE.md #5 cấm scaffold app khi chưa chốt stack.

## Quyết định
Build intro dạng **vanilla 1-file** (`CosmicIntro.html` + `config.js`), Three.js **r128** qua CDN.

## Lý do
- Framework-agnostic → KHÔNG khóa quyết định stack `0001`, vẫn để mở.
- Module tách rời, gắn được mọi trang, bê sang dự án khác dễ.
- Test nhanh như artifact (1 file + config).
- r128 CDN: đơn giản, khớp phần fallback CDN của spec.

## Hệ quả
- Khi chốt stack (React/Next) sau này: port script sang component, giữ nguyên logic, nhớ dispose khi unmount.
- Nội dung UI để placeholder trong `config.js`, cập nhật sau.
