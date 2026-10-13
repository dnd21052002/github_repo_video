# Nền (background) — thư viện & nhật ký đã dùng

**Quy tắc:** mỗi slide một kiểu nền khác hẳn nhau; mỗi video một bộ nền mới, KHÔNG trùng video trước; KHÔNG dùng lại họ "v1" (pastel loang). Chọn bộ nền theo "tính cách" repo. Sau khi làm xong, thêm dòng vào bảng dưới và `themes/THEMES_LOG.md`.

## Nhật ký đã dùng (đừng lặp lại nguyên bộ)
| Video | Bộ nền |
|---|---|
| Multica, DeepTutor, Meetily (3 video đầu) | v1: pastel loang + chấm/kẻ kem–hồng–mint — **cấm dùng lại** |
| Hairline | grey static TV, blueprint navy, riso kem + vòng tròn, flat vàng + sọc chéo, terminal đen-xanh + scanline, brand-indigo kẻ ô, vòng đồng tâm tím, blueprint |
| Aurelio | ledger kẻ ô + lề đỏ, olive + khung vàng, guilloche (vòng đồng tâm), giấy milimet, charcoal chấm vàng, sọc đứng terracotta, trời sao đêm, hazard vàng-đen |
| Answer me with HTML | tractor (giấy kẻ xanh), swiss đỏ + vòng tròn, checkerboard, sunburst, polka teal, film strip, kraft viền chỉ khâu, lilac gạch chéo |
| Agent Reach | scanlines CRT, memphis (hình khối màu), radar (vòng đồng tâm xanh), cookie (chấm nâu), lattice xanh lá, sọc kẹo, gradient tím-cam, spotlight |
| Meetily hướng dẫn (16:9) & bản TikTok màn hình | sunrise (sọc chéo + vòng cam), terrazzo, slate hex, sọc chéo tím, ô vuông xanh, cung tròn cam, kẻ ngang xanh lá, polka vàng, sọc đứng navy, vòng hồng, split teal + vòng vàng |
| Diagram Design | dấu cộng vàng, tam giác cobalt, chevron mint, khối bo xám, kẻ ô caro xanh lá, vảy cá hồng, thoi navy, ô vuông lồng lime |
| Bản YouTube Shorts của mọi video | cùng họa tiết với bản TikTok nhưng xoay tông `hue-rotate(30–260°)` (khác nhau từng video) |

## Cách làm
- Nền là một `div.bg.t-<tên>` trong từng cảnh, họa tiết bằng CSS gradient thuần (xem khối CSS ở `templates/build_*.mjs` và `examples/*/build.mjs`): `repeating-linear-gradient`, `conic-gradient` (ô vuông), `repeating-radial-gradient` (vòng đồng tâm), `radial-gradient` (chấm), pseudo-element `::after` cho hình khối lớn.
- Mỗi cảnh có bảng biến riêng (hằng `PAL`): `--ink` (màu chữ), `--acc` (nhấn), `--hl`/`--hlt` (tô từ khóa / chữ trên đó), `--term` (nền terminal), `--wire` (viền mờ), `--vsh` (bóng khối). Kiểm tra tương phản bằng `npx hyperframes check`.
- Thư viện cũ dùng được làm điểm xuất phát: `themes/themes.css` + `themes/preview.html` (blueprint, riso, terminal, flat, screen, brand).
- Có thể lấy màu thương hiệu của repo làm nền chủ đạo (brand).
- Tiêu đề có thể đổi font theo cảnh (Anton cho cảnh "mạnh", mono cho kỹ thuật, Playfair Display 900 cho tài chính).
- Luôn xem snapshot: chữ/handle không được chìm vào hình khối nền.
