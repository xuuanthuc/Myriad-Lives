# Myriad Lives · Vạn Kiếp

## Bắt đầu một phiên mới

Đây là game tu tiên React + JavaScript + Vite, giao tiếp với người dùng bằng tiếng Việt. Đọc file này trước; đọc `docs/PROJECT_CONTEXT.md` khi cần quy tắc game hoặc bản đồ code. Các tài liệu GDD v1.2 trong docs là nền ban đầu; quyết định hiện hành trong context và code được ưu tiên khi khác GDD. Không cần đọc lại toàn bộ lịch sử hội thoại.

Nếu nhiệm vụ thêm/sửa data sự kiện, dùng skill `.agents/skills/myriad-lives-data/SKILL.md` (tên gọi `$myriad-lives-data`). Nếu skill chưa xuất hiện trong danh sách công cụ, đọc trực tiếp file đó. Skill nằm trong repo để dùng được ở checkout và conversation khác.

## Quy tắc duy trì

- Giữ thay đổi có sẵn của người dùng; xem `git status` trước khi sửa. Không tự commit/push/deploy khi yêu cầu chỉ là sửa local.
- UI và nội dung có Việt/Trung giản thể/Anh. Thêm nội dung cần đủ bản dịch. Đổi ngôn ngữ không thay số mệnh, RNG hoặc trạng thái.
- Profile/map/lịch sử chỉ dùng trạng thái đã kể, không lộ tương lai từ engine. Không roll lại lựa chọn/đột phá trước khi người chơi xác nhận.
- Các bản lưu hiện có phải đọc được. Field mới cần giá trị mặc định hoặc fallback ổn định; không phá schema v1 hay tạo thêm kiếp lúc refresh.
- Windows PowerShell: dùng `npm.cmd` nếu `npm.ps1` bị chặn. File dữ liệu phải UTF-8.
- Kiểm tra phù hợp thay đổi: `npm.cmd run build` kiểm tra data/bản dịch và build; `npm.cmd test` khi sửa engine, persistence hoặc trọng số. Thay CSS nhỏ chỉ cần build, không thêm test mô phỏng CSS.
- Khi đổi quy tắc/kiến trúc hoặc thêm lệnh mới, cập nhật mục liên quan trong `docs/PROJECT_CONTEXT.md` và skill nếu schema/workflow thay đổi. Viết trạng thái hiện hành, không lưu nhật ký hội thoại dài hay bí mật/token.

## Lệnh thường dùng

```powershell
npm.cmd run dev
npm.cmd run build
npm.cmd test
npm.cmd run data:stats
npm.cmd run data:stats -- --realm foundation
npm.cmd run data:new -- --realm foundation --count 6 --name foundation-new
```

Số lượng data thay đổi thường xuyên: lấy từ `data:stats`, không xem con số trong tài liệu là nguồn chuẩn.
