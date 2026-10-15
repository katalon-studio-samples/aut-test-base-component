# Quản lý thư viện · Vườn Tri Thức

Mở `http://127.0.0.1:5173/traffic-agent-performance` để review local. Route này thay ứng dụng benchmark cũ bằng công cụ quản lý thư viện tiếng Việt; không deploy.

## Dữ liệu và layout

Mặc định **Thư viện thành phố**: 300 đầu sách, 50 độc giả, 50 lượt mượn và 18 yêu cầu đặt trước. Dữ liệu được tạo cố định; ngày nghiệp vụ mô phỏng là **13/10/2026**, không phụ thuộc đồng hồ máy. Email dùng `example.test`, điện thoại mẫu bắt đầu bằng `000`, bìa SVG nằm trong `public/library/covers/`.

Tất cả bảng và khu vực chính được mount cùng lúc, không virtualization hoặc phân trang. Sidebar/mục lục là anchor. Filter chỉ thay đổi các dòng khi người dùng thao tác; hai tabs bản nháp/xem trước chỉ áp dụng trong panel thông báo, editor vẫn được giữ khi đổi tab. Quy mô nhỏ có 150 đầu sách; trung tâm có 500. Đổi quy mô và khôi phục mẫu đều cần xác nhận vì xóa thay đổi trong phiên.

Các bảng cuộn ngang trong khung; form, kanban, dialog và navigation thích ứng ở 320, 390, 768 và 1440px. Dark/light dùng ThemeProvider của AUT; field được tách khỏi style mặc định của AUT để không lệch màu/khoảng cách. Custom slider giữ cấu trúc `slider-container → rm-slider → rm-slider-track → rm-slider-handle` và hành vi pointer/keyboard của adapter cũ, với miền nghiệp vụ 1–10 sách.

## Flow review

1. **Danh mục:** tìm `S0002`, lọc thể loại/tình trạng/kệ, bấm tiêu đề để sort tăng/giảm. Chọn checkbox rồi mở **Thao tác sách** để chuyển kệ hoặc đưa sách vào phiếu. Xem chi tiết để mở bìa local, mô tả và ledger các bản sách; thử thêm/sửa và ISBN trùng hoặc thiếu thông tin.
2. **Độc giả:** đăng ký bằng email `nguoidoc@example.test`, số điện thoại `0000000088`, thẻ hết hạn `2027-10-13`. Chọn radio loại thẻ, checkbox sở thích, nhiều chi nhánh trong select, switch thông báo và ảnh PNG/JPEG/WebP local ≤2 MB. Ảnh chỉ được đọc bằng FileReader và preview; không upload.
3. **Mượn/trả:** chọn độc giả mới và `S0001`, áp dụng hạn trả mặc định, xác nhận mượn. Bảng lượt mượn, số bản còn lại, độc giả và cards cùng cập nhật. Gia hạn một lần rồi trả sách. Trả tình trạng hỏng sẽ giữ bản đó ngoài lưu thông.
4. **Đặt trước:** tạo yêu cầu `S0002` cho `DG003`. Kéo thẻ giữa ba cột bằng HTML5, hoặc dùng ô chuyển trạng thái. Bàn điều phối bên dưới hỗ trợ pointer/mouse drag và phím mũi tên phải. Yêu cầu mới không giữ bản; giữ/sẵn sàng nhận giữ một bản. Cho đúng độc giả mượn sách ở bước sẵn sàng nhận sẽ hoàn tất yêu cầu.
5. **Phân loại:** chọn `S0001`, kéo vào Công nghệ để đổi thể loại và kệ `B2 · Công nghệ`. Có button chuyển kệ thay cho drag, và menu hover/focus nhiều tầng Bộ sưu tập → Thể loại → Kệ để lọc danh mục.
6. **Cài đặt:** đổi số ngày mượn bằng native range; đổi hạn mức bằng custom slider (chuột/pointer, mũi tên, Home/End, PageUp/PageDown). Đổi giờ đóng cửa/màu nhãn; mở accordion. Soạn/định dạng thông báo, preview và lưu bản nháp. Nội dung dán/preview được giới hạn ở đoạn văn, chữ đậm/nghiêng và danh sách. Alert/confirm/prompt chỉ xuất hiện khi bấm các nút tương ứng.
7. **Tra cứu và phiếu:** tìm `S0002` trong widget Shadow DOM; kết quả nằm trong một open shadow root lồng bên trong và nút đặt trước mở flow chung. Phiếu mượn ở same-origin iframe có chọn độc giả/sách/ngày/ghi chú và xác nhận thực sự. Iframe quy định lồng bên trong phải được xác nhận đã đọc trước khi phiếu được gửi tới state model. Dark/light được đồng bộ với hai iframe.

## Quy tắc nhất quán

- Số bản còn lại = tổng bản − bản hỏng − bản đang mượn − bản giữ cho yêu cầu. Mỗi bản đang mượn có mã copy cụ thể; giảm tổng bản không được xóa copy đang mượn/hỏng hoặc làm thiếu bản đang giữ.
- Thẻ phải còn hạn và độc giả không có sách quá hạn. Hạn mức mặc định 6 sách, dùng chung cho các loại thẻ; có thể đổi trong cài đặt. Thư viện đóng cửa không cho mượn mới nhưng vẫn nhận sách trả.
- Ngày mượn không sau ngày mô phỏng; hạn trả phải sau ngày mượn, từ ngày mô phỏng trở đi và tối đa 30 ngày kể từ ngày mượn. Mặc định 14 ngày, có nút áp dụng lại sau khi đổi cài đặt.
- Gia hạn tối đa một lần, thêm 7 ngày; không gia hạn phiếu đã trả/quá hạn, thẻ hết hạn hoặc sách có yêu cầu đặt trước.
- Các thao tác dùng cùng model `transact`; borrow nhiều sách là một transaction, lỗi không để lại phiếu/tồn sách cập nhật dở.
- State chỉ ở bộ nhớ của phiên trang. Reload hoặc khôi phục đưa về dữ liệu mẫu; không có backend, email, upload hoặc tự chạy interaction.

## SDK/agent isolation

`index.html` return trước khi tạo script SDK/agent cho route này và các alias `.html/.php/.asp/.aspx/.jsp`, với mọi query mode và client-code đã lưu. Banner cấu hình được bỏ qua. `main.tsx` không import TrueTestDetector trên route; App dùng layout thư viện riêng, không có UI cấu hình AUT/benchmark. Extension đã lưu của AUT không viết lại URL thư viện. Link sidebar từ AUT dùng full document navigation để không mang SDK đã tải từ trang khác sang thư viện.

Hai iframe là HTML local tĩnh, không có loader chung hoặc dịch vụ nhúng ngoài. Bridge kiểm tra origin và đúng source window trước khi nhận thao tác; mọi xác nhận mượn vẫn qua cùng validation của model.

## Kiểm tra

Chạy `npm run test:library` hoặc thêm `--project=webkit` vào lệnh Playwright trực tiếp. Suite kiểm tra SDK isolation với localStorage/client code/mode query/alias và extension lưu sẵn, search/filter/sort, thêm/sửa, ảnh local, mượn/trả/gia hạn, atomic stock/cards/readers, đặt trước → giữ → nhận, HTML5/mouse drag, hover menu, editor/native dialogs, nested Shadow DOM/iframe và layout 320–1440px. Mỗi test kiểm tra không có page runtime error.

DOM được đếm sau khi dữ liệu iframe và Shadow DOM sẵn sàng, ở trạng thái mẫu light mode, không có modal mở. `document.querySelectorAll('*')` đếm document chính; số sâu hơn cộng từng open shadow root và same-origin iframe document một lần. Số chính xác của build review và kết quả test được ghi trong [biên bản kiểm tra](library-management-validation.md).
