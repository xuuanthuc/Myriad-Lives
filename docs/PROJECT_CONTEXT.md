# Context hiện hành của Myriad Lives

Tài liệu này mang các quyết định sản phẩm sang phiên Codex mới, không tái tạo toàn bộ chat. Kiểm tra code khi có mâu thuẫn; cập nhật mục liên quan sau thay đổi đáng kể.

## Sản phẩm và giao diện

- Số kiếp đã trải chỉ hiển thị trong trang Lịch sử, không nằm trên thanh header.

- Home `#/`, Tu tiên `#/cultivation`, lịch sử `#/history`; đường dẫn tiếng Anh. Header Home không có Trang chủ/Tu tiên/cẩm nang; game có Trang chủ và popup cẩm nang; lịch sử có Tu tiên và không có link Lịch sử trùng trang.
- Vào game lần đầu tự tạo kiếp. Kiếp mới đi qua màn Thiên mệnh sơ khai: chạy chữ và chốt bối cảnh/giới tính/xuất thân/linh căn/thể chất/tư chất/khí vận trong 5,2 giây. Không skip; sau đó người chơi bấm Bước vào tiên lộ. Refresh không gieo lại số mệnh. Kiếp đang chơi mở lại thì tiếp tục.
- Tốc độ x1/x2/x4, mỗi fact khoảng 2/1/0,5 giây. Progress mượt, tuổi tăng có animation. Tốc độ và Kiếp mới gọn phía trên list sự kiện.
- Cảnh giới ngang phía trên; tiểu cảnh giới là text ngang hàng dưới, mũi tên SVG. Luyện Khí rút gọn các tầng, không scroll ngang riêng. Ký sự mới nhất lên trên, có min/max height và scroll nội bộ. Life map ở cuối: cột theo đại cảnh giới, ô màu theo loại event, không label cột/border chia cột/scroll dọc; chú giải phía trên.
- Lựa chọn và đột phá là popup; đóng vẫn có nút mở lại và thời gian dừng. Đột phá có nút Chưa vội đột phá cùng hàng với Thử đột phá. Chỉ bấm mới roll. Có force Kiếp mới nhưng gọn, không nổi bật.
- Cẩm nang popup gồm linh căn, cảnh giới, thể chất; không mục xuất thân. Home có phần giới thiệu và card mở cẩm nang. Ảnh nền Home/game khác nhau và đủ mờ cho chữ; hỗ trợ light/dark, VI/ZH/EN, mobile.
- Card lịch sử gọn, desktop 4 cột và giảm cột theo width. Chia sẻ mở preview có hành động tải/chia sẻ thật; khóa luân hồi khi chuẩn bị/preview ảnh.

## Mô phỏng và dữ liệu

- Giới diện: mỗi kiếp mới chọn đều một trong 8 giới diện tại `src/data/worlds.js`: Thanh Bình, Linh Thịnh, Loạn Thiên, Hung Hoang, Mạt Pháp, Ẩn Tiên, Huyết Sát, Tàn Thiên. Năm hệ số được sinh trong khoảng đặc trưng của giới diện; hiện dùng chung kho sự kiện.
- Đầu trang tu tiên gộp tên và mô tả theo dạng `◈ Huyết Sát Giới - Tà tu lộng hành`, không có nhãn “Giới diện:”.
- Màn roll chỉ có dòng Giới diện, không có dòng Bối cảnh riêng; mô tả ngắn hiển thị ở đầu trang tu tiên.
- `world.planeId` lưu trong schema v1. Save cũ thiếu field dùng tên fallback theo bối cảnh cũ; không thay hệ số hay RNG. Màn sinh và đầu trang tu tiên hiển thị Giới diện trước mô tả ngắn riêng của giới diện (`worldPlaneDescription`), thay dòng bối cảnh cũ. `world.descriptor` vẫn giữ để tương thích dữ liệu lịch sử/save. Màn sinh vẫn kéo dài 5,2 giây; đổi ngôn ngữ không sinh lại thế giới.

- 14 đại cảnh giới: Phàm nhân → Luyện Khí → Trúc Cơ → Kim Đan → Nguyên Anh → Hóa Thần → Luyện Hư → Hợp Thể → Đại Thừa → Chân Tiên → Kim Tiên → Huyền Tiên → Tiên Vương → Tiên Đế.
- Không đại cảnh giới Độ Kiếp riêng. Đại Thừa vượt thiên kiếp rồi tiếp tục cùng một kiếp tới Chân Tiên; Tiên Đế chứng đạo mới kết thúc thành công.
- Luyện Khí 9 tầng; từ Trúc Cơ trở lên 3 tiểu cảnh giới sơ/trung/hậu kỳ, không Viên mãn.
- Đủ tu vi chưa đủ để đột phá: cần tuổi gate và thời gian trong cảnh giới theo `cultivationTime.js`. Gốc linh căn yếu cần lâu hơn; khoảng trống được kể là bế quan. Cạn thọ nguyên thì tọa hóa. Tuổi già tăng xác suất đột phá ×1 tới ×1,30, cuối cùng tối đa 95%; không phạt tuổi già ngược yêu cầu người dùng.
- Có 20 xuất thân, gồm sinh trong tông môn. Trẻ không linh căn có thể được ở lại, đuổi đi hoặc chết do ép dẫn khí; không chết bắt buộc. 300 tên tông môn.
- Nam/Nữ cố định theo profile, fallback ổn định cho save cũ. Giới tính ảnh hưởng tập sự kiện, không tự đặt ưu thế tư chất cho một giới. 600 tên đạo lữ, 300 mỗi giới; hiện ghép khác giới. Chỉ hiện tên sau bonded; tên ổn định, không tiêu thụ RNG.
- Giao chiến cần thắng/trọng thương/tử trận và nguyên nhân chết cụ thể; không biến mọi hiểm cảnh thành tẩu hỏa. `outcomes` tự roll; `choices` chờ người chơi. Death outcome cần `endingReason`, đầy đủ dịch. Nguy hiểm thế giới và luck ảnh hưởng trọng số; số lần/cảnh giới/điều kiện vẫn được lọc.
- Sự kiện JSON mới được ghép vào file sẵn có theo `category`: `life.json`, `cultivation.json`, `opportunities.json`, `disasters.json`; không tạo file riêng theo đợt thêm hoặc cảnh giới. Đạo lữ thuộc `life` và có điều kiện `partnerStatus: bonded`; lựa chọn/giao chiến theo category của sự kiện. Giữ nguyên ID khi chuyển file.
- Mở đầu dùng lời kể gốc của xuất thân hoặc bản trong birth.json khớp originId. Kết thúc trong endings.json có kind: age/ascend/injury; ID cũ age/ascend vẫn hợp lệ. narrative.js chọn đoạn bằng hash từ trạng thái đã biết, không tiêu thụ RNG. Fact lưu nguyên văn nên refresh/ngôn ngữ không chọn lại; tử vong có đoạn kể riêng từ outcome vẫn giữ nguyên nguyên nhân và lời kể. Bản dịch mới đặt inline trong JSON.
- Pity thay đổi khi sinh hồ sơ; không dùng animation hay ngôn ngữ để tiêu thụ RNG mô phỏng. Xác suất hồ sơ tốt = min(25%, 5% + pity × (2% / 3)): bonus giảm 2/3 so với trước, đạt trần 25% sau 30 hồ sơ chưa tốt liên tiếp. Pity đếm liên tiếp hồ sơ chưa tốt, reset khi sinh hồ sơ tốt, không đếm tử trận hay thất bại đột phá. Không trực tiếp bảo đảm đạt Tiên Đế.

## Lưu và deploy

- localStorage `myriad-lives-save` schema v1: kiếp hiện tại, RNG, session, playback, language, history; theme riêng. IndexedDB `myriad-lives-images` cache PNG. Lịch sử chỉ thông tin cơ bản, không timeline kiếp cũ; kết thúc được lưu ngay khi kết cục được kể.
- Hosting đang dùng Cloudflare qua GitHub tự build: `npm run build`, output `dist`, main; Vite base `./`, hash routes. Workflow GitHub Pages vẫn có trong repo nhưng không phải nơi deploy chính hiện tại.
- Presence là Worker riêng `cloudflare/presence`, Durable Object SQLite. Home chỉ đọc, game tab hiển thị/đã qua màn sinh/chưa kết thúc gửi mỗi 60 giây. TTL 150 giây; browser ID chung các tab. Pause đọc vẫn tính; tab ẩn không gửi. Số >0 mới hiện ở cuối đoạn VẠN GIỚI · VẠN DUYÊN, căn đầu, text “X Vị đạo hữu đang tu luyện”. Lỗi/hết quota ẩn, không ảnh hưởng game.
- Biến Pages `VITE_PRESENCE_URL`, Worker `ALLOWED_ORIGINS`. Worker deploy riêng, push frontend không tự deploy Worker. Xem `docs/cloudflare-online.md`. Không lưu credentials hoặc giả định giá/hạn mức dịch vụ chưa kiểm tra khi cần tư vấn mới.

## Bản đồ code

| Phần | Nguồn |
|---|---|
| UI/router/state | `src/App.jsx`, `src/components/`, `src/styles.css` |
| Run/choice/breakthrough | `src/engine/lifeRunner.js` |
| Profile/world/RNG | `src/engine/profile.js`, `rng.js` |
| Tuổi/mốc | `src/engine/cultivationTime.js` |
| Nội dung & validator | `src/engine/content.js` |
| Sự kiện | `src/data/events/*.json` và các module `realm*.js`, combat/gender/physique |
| Dịch | `src/i18n/index.js`, `ui.js`, `legacy.js`; event mới có translations inline |
| Giới tính/đạo lữ/tông môn | `src/data/genders.js`, `partners.js`, `sects.js` |
| Kể dần/che tương lai | `src/engine/playback.js`, `src/hooks/useLifePlayback.js` |
| Save/history/ảnh | `browserSave.js`, `lifeHistory.js`, `src/utils/fateCard.js`, `cardCache.js` |
| Thống kê & kiểm tra | `scripts/data-stats.mjs`, `scripts/validate.mjs`, `tests/` |
