# Constraints — Luật không được vi phạm

1. **Chỉ làm đúng yêu cầu.** Không tự mở rộng scope.
2. **Performance là feature.** Visual tham vọng KHÔNG được làm trang lag. Ngân sách: TODO (vd LCP < 2.5s, bundle JS < X kb).
3. **Accessibility.** Có fallback khi WebGL không chạy / prefers-reduced-motion. Contrast đạt WCAG AA.
4. **Responsive.** Chạy tốt mobile → desktop.
5. **SEO.** Meta tags, OG image, sitemap, structured data cho trang public.
6. **Không rò rỉ bí mật.** Không commit `.env`, key, credential.
7. **decisions/ và history/ append-only.**
