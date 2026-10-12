# Myriad Lives · Vạn Kiếp

Game tu tiên theo hai tài liệu v1.2 trong docs. React + JavaScript + Vite.

Nhật ký chia theo trang cảnh giới: hàng nút cảnh giới ở trên, danh sách sự kiện theo tuổi ở giữa, bảng ô xanh nhỏ kiểu GitHub ở dưới cùng. Bấm ô xanh chuyển trang cảnh giới và cuộn tới sự kiện tương ứng. Các ô chỉ đại diện cho sự kiện đã xảy ra; ngôn ngữ và diễn biến kiếp được giữ nguyên khi chuyển trang.

Chạy: npm install rồi npm run dev.

Tốc độ kể chuyện **x1 / x2 / x4**, mặc định x1: mỗi mốc mới hiện sau khoảng 2 / 1 / 0,5 giây. Có thanh tiến độ chặng và Tạm dừng/Tiếp tục. Đổi tốc độ ngay giữa chặng giữ lại thời gian đã chạy. Game dừng để chọn khi ngã rẽ được hiển thị; Tự động hoàn tất tự chọn phần còn lại nhưng vẫn kể theo tốc độ đã đặt. Đổi tab sẽ tạm ngưng nhịp kể. Hồ sơ trạng thái, nhật ký và bảng xanh chỉ hiện tới mốc đã kể; engine và RNG không chịu ảnh hưởng của tốc độ. Đây là thay đổi theo yêu cầu người chơi, thay thế quy tắc v1.2 hiển thị ngay toàn bộ chặng.

Kiểm tra: npm test (10.000 kiếp) và npm run build.

Nhịp tuổi tu luyện nằm ở `src/engine/cultivationTime.js`: mỗi cảnh giới có mốc tuổi đột phá và thời gian tích lũy tối thiểu, điều chỉnh theo linh căn, tư chất/ngộ tính và thế giới. Đủ tiến độ vẫn phải đủ thời gian; không nhảy tuổi vượt thọ nguyên. Khoảng trống dài giữa các mốc được ghi thành bế quan. Tuổi cao **tăng** tỷ lệ đột phá: dùng dưới 30% thọ nguyên là ×1, gần cuối đời tối đa ×1,30; xác suất cuối cùng vẫn không vượt 95%. Cạn thọ nguyên trước khi đủ điều kiện thì tọa hóa. Bản lưu cũ vẫn đọc được; các chặng tiếp theo áp dụng nhịp tuổi mới.

Thống kê data local: `npm run data:stats`. Lệnh chỉ log terminal, tự đọc toàn bộ kho nội dung đang dùng và đếm theo cảnh giới: loại sự kiện, lựa chọn, đoạn kể, nội dung riêng/dùng chung và điều kiện thể chất/tông môn/đạo lữ. Cuối báo cáo liệt kê nhóm 5 cảnh giới có ít data phù hợp nhất, gồm cả đồng hạng. Xem từng sự kiện bằng `npm run data:stats -- --realm foundation`; xem ID cảnh giới bằng `npm run data:stats -- --help`. Trên PowerShell nếu `npm.ps1` bị chặn, dùng `npm.cmd` thay `npm`.

**Dừng trước đột phá:** đủ tu vi thì engine trả về mốc chờ, chưa roll kết quả hay tiến tuổi thêm. Sau khi nhật ký chặng đã hiện hết, chỉ có nút **Thử đột phá**. Người chơi có thể đọc lại tự do; bấm mới roll thành/bại, chạy và kể chặng tiếp theo. Thất bại thì tích lũy lại, lần thử sau tiếp tục chờ xác nhận. Đại Thừa vượt thiên kiếp sau khi xác nhận để phi thăng thành Chân Tiên, tiếp tục Kim Tiên → Huyền Tiên → Tiên Vương → Tiên Đế. Tiên Đế Hậu kỳ chứng đạo mới kết thúc thành công. Nút tự động trong UI xử lý lựa chọn sự kiện thường nhưng dừng ở mốc đột phá kế tiếp; `autoComplete()` vẫn được giữ cho kiểm thử engine hàng loạt.

Luân hồi sinh nhân vật và thế giới mới, mô phỏng đến ngã rẽ hoặc kết cục. Có lựa chọn và Tự động hoàn tất. Pity chỉ đổi khi sinh hồ sơ. Kiếp hiện tại, số lần luân hồi, pity và trạng thái RNG được tự lưu trong localStorage (`myriad-lives-save`, schema v1). Lưu khi đổi trạng thái, mỗi giây và khi rời trang. Refresh tiếp tục đúng vị trí đọc và phần tiến độ đang chạy, kể cả khi chờ lựa chọn hoặc đột phá. Kết cục cũng được giữ để luân hồi tiếp; không tự sinh kiếp khác khi tải lại.

**20 xuất thân** với phân phối trọng số và tài nguyên khởi đầu khác nhau. Bốn xuất thân sinh trong tông môn: con tạp dịch, con đệ tử, hậu duệ trưởng lão, trẻ được thu dưỡng. Ban đầu là cư dân tông môn; có linh căn mới thành đệ tử khi nhập đạo. Trẻ không linh căn được trắc linh lúc 6 tuổi, có thể ở lại, xuống núi hoặc chết ở tuổi 7–14 do bị ép dẫn khí. Nguy cơ phụ thuộc khí vận và hiểm họa thế giới, không phải kết cục bắt buộc. Bảng cẩm nang liệt kê toàn bộ xuất thân và tài nguyên ban đầu.

Chọn **Việt / 中文 / English** tại đầu trang. Đổi ngôn ngữ giữa kiếp dịch lại giao diện, hồ sơ, tên nhân vật, nhật ký, lựa chọn và kết cục ngay lập tức, giữ nguyên số mệnh và pity. Ngôn ngữ, tốc độ và trạng thái tạm dừng được lưu cùng kiếp; theme được lưu riêng. Dữ liệu thuộc trình duyệt và địa chỉ web hiện tại, không đồng bộ tài khoản.

Số lượng sự kiện, lựa chọn và đoạn kể hiện tại xem bằng `npm run data:stats`; báo cáo tự cập nhật theo kho data. Mỗi đoạn có bản Việt, Trung giản thể và Anh. Các sự kiện lọc theo tuổi, cảnh giới, tài nguyên, tông môn hoặc đạo lữ; số lần xuất hiện mỗi kiếp được quy định bởi `maxOccurrencesPerLife`.

Kho sự kiện được tổng hợp tại `src/engine/content.js`, từ `src/data/events/*.json`, `extraPhysiques.js` và các bộ `realm*.js`. Bản dịch sự kiện mới nằm trong trường `translations`; bản dịch 10 sự kiện gốc nằm tại `src/i18n/legacy.js`. Giao diện, cảnh giới và hồ sơ nằm trong `src/i18n/ui.js`. Bộ kiểm tra build xác nhận bản dịch đầy đủ, 15–35 từ cho Việt/Anh và 15–160 ký tự cho Trung (không đếm từ theo khoảng trắng).

Đã có firebase.json cho dist. Liên kết Firebase project rồi chạy npm run build và firebase deploy --only hosting. Chưa triển khai hosting.

Tab **Lịch sử** (`#/history`) lưu hồ sơ cơ bản, tuổi, cảnh giới và kết cục từng kiếp, gồm kiếp luân hồi sớm. Không lưu timeline cho kiếp cũ. Kiếp hiện tại chỉ hiển thị tới mốc đã kể. Card có Tải ảnh PNG và Chia sẻ ảnh qua Web Share khi thiết bị hỗ trợ; nếu không hỗ trợ thì tải ảnh xuống. Lịch sử lưu cùng bản lưu trình duyệt, bản lưu cũ chưa có lịch sử vẫn đọc được.
