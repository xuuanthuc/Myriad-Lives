# Myriad Lives · Vạn Kiếp

Game tu tiên theo hai tài liệu v1.2 trong docs. React + JavaScript + Vite.

Chạy: npm install rồi npm run dev.

Kiểm tra: npm test (10.000 kiếp) và npm run build.

Luân hồi sinh nhân vật và thế giới mới, mô phỏng đến ngã rẽ hoặc kết cục. Có lựa chọn và Tự động hoàn tất. Pity chỉ đổi khi sinh hồ sơ. Tải lại trang reset toàn bộ phiên.

**20 xuất thân** với phân phối trọng số và tài nguyên khởi đầu khác nhau. Bốn xuất thân sinh trong tông môn: con tạp dịch, con đệ tử, hậu duệ trưởng lão, trẻ được thu dưỡng. Ban đầu là cư dân tông môn; có linh căn mới thành đệ tử khi nhập đạo. Trẻ không linh căn được trắc linh lúc 6 tuổi, có thể ở lại, xuống núi hoặc chết ở tuổi 7–14 do bị ép dẫn khí. Nguy cơ phụ thuộc khí vận và hiểm họa thế giới, không phải kết cục bắt buộc. Bảng cẩm nang liệt kê toàn bộ xuất thân và tài nguyên ban đầu.

Chọn **Việt / 中文 / English** tại đầu trang. Đổi ngôn ngữ giữa kiếp dịch lại giao diện, hồ sơ, tên nhân vật, nhật ký, lựa chọn và kết cục ngay lập tức, giữ nguyên số mệnh và pity. Ngôn ngữ cũng nằm trong RAM; tải lại trở về tiếng Việt.

Kho nội dung gồm **60 sự kiện**, trong đó **14 sự kiện có lựa chọn** và **102 đoạn kể** (mô tả sự kiện cùng kết quả lựa chọn). Mỗi đoạn có bản Việt, Trung giản thể và Anh. Các sự kiện lọc theo tuổi, cảnh giới, tài nguyên, tông môn hoặc đạo lữ; mỗi sự kiện chỉ xuất hiện một lần trong một kiếp.

Kho dữ liệu nằm trong `src/data/events/*.json`. Bản dịch sự kiện mới nằm trong trường `translations`; bản dịch 10 sự kiện gốc nằm tại `src/i18n/legacy.js`. Giao diện, cảnh giới và hồ sơ nằm trong `src/i18n/ui.js`. Bộ kiểm tra build xác nhận bản dịch đầy đủ, 15–35 từ cho Việt/Anh và 15–160 ký tự cho Trung (không đếm từ theo khoảng trắng). Nội dung vẫn cần cân bằng và mở rộng thêm để đạt mục tiêu MVP 100–150 sự kiện trong GDD.

Đã có firebase.json cho dist. Liên kết Firebase project rồi chạy npm run build và firebase deploy --only hosting. Chưa triển khai hosting.
