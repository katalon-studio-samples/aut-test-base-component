# Biên bản kiểm tra Library Management

Ngày kiểm tra: 13/10/2026. Hoàn thành local; không deploy.

## DOM thực tế

Đếm sau khi dữ liệu iframe và các Shadow roots đã sẵn sàng, ở light mode, quy mô mặc định Thư viện thành phố, chưa mở modal hoặc thao tác filter.

| Môi trường local | Document chính | Cộng open Shadow DOM và same-origin iframe | Shadow roots | Iframe documents |
| --- | ---: | ---: | ---: | ---: |
| Vite dev · port 5173 | 10.672 | 11.099 | 2 | 2 |
| Production preview · port 5174 | 10.664 | 11.081 | 2 | 2 |

Document chính có 300 dòng sách, 50 độc giả và 50 lượt mượn; kanban có 18 yêu cầu. Các con số sâu hơn tính mỗi root/document một lần và không tính text nodes. Dev có thêm elements phục vụ Vite. CSS ẩn các submenu/tab nhỏ vẫn giữ DOM; không có hàng/node placeholder và không virtualization cho bảng chính.

## Kết quả

- Chromium: 10/10 scenarios trên ứng dụng local và 10/10 trên production preview.
- WebKit: 10/10 scenarios; đã retest mouse drag sau HTML5 drag và layout 320px. Custom slider được kiểm tra keyboard và chọn giá trị bằng chuột.
- Pharmacy Workflow: 11/11 regression scenarios sau thay đổi App shell.
- Vite production build: pass. ESLint các module mới và library tests: pass.
- Không có page runtime error trong các scenario; kiểm tra riêng khi mở trang cũng không ghi nhận error.
- SDK/agent: 0 request đến thư viện SDK/traffic-agent, không có `window.TrueTest`, không có banner/cấu hình benchmark. Kiểm tra cả query `mode=agent`, `mode=replay`, client-code URL/localStorage, alias `.html` và setting extension `.php` đã lưu.
- Layout được kiểm tra ở 1440, 768, 390 và 320px, cả dark/light. Field/modal không tràn document; bảng rộng cuộn trong khung.
- Typecheck toàn AUT còn lỗi có sẵn ở các trang khác; không có diagnostic cho `LibraryManagementPage` hoặc các module `library-management`.

## Flow đã kiểm tra

Search/filter/sort chín cột sách; chọn nhiều và bulk chuyển kệ; bìa local, copy ledger, validation thêm/sửa sách; đăng ký độc giả, radio/checkbox/multiple select/switch và preview ảnh local; mượn/trả/gia hạn cùng stock/cards/readers; card hết hạn và hạn mức; bản hỏng; đặt trước → giữ → sẵn sàng nhận → hoàn tất khi mượn; HTML5 drag, mouse/pointer drag và chuyển kệ; hover menu nhiều tầng; native range/custom slider/time; contenteditable, định dạng, preview và lưu; alert/confirm/prompt/reset; tra cứu/đặt trước qua nested open Shadow DOM; mượn qua same-origin iframe và xác nhận ở nested iframe; đồng bộ dark mode.

Dữ liệu chỉ ở bộ nhớ: reload đưa về mẫu. Test dùng dữ liệu giả và ảnh local; không gửi email, gọi backend nghiệp vụ hoặc upload file.
