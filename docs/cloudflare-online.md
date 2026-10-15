# Bộ đếm đạo hữu online — Cloudflare Free

Frontend đã tích hợp, nhưng chỉ hiện số sau khi cấu hình Worker thật. Không có số giả.
Home đọc số; tab Tu tiên đang hiển thị gửi heartbeat mỗi 60 giây. Kiếp đang gieo hoặc đã kết thúc không gửi heartbeat. Một browser dùng một mã ngẫu nhiên chung giữa các tab; server không lưu IP, tên nhân vật hay lịch sử. Phiên quá 150 giây hết hiệu lực. Đây là số phiên browser gần đây, không phải số người tuyệt đối.

## 1. Tạo Worker và Durable Object

Mở `cloudflare/presence/wrangler.jsonc`, thay `https://YOUR-PROJECT.pages.dev` bằng URL Home thật, không thêm `/` cuối hoặc `#/`. Ví dụ `https://myriad-lives.pages.dev`. Nếu dùng nhiều domain, ngăn cách bằng dấu phẩy.

Trong terminal PowerShell ở gốc dự án, chạy lần lượt:

```powershell
npx.cmd wrangler@latest login
npx.cmd wrangler@latest deploy --config cloudflare/presence/wrangler.jsonc
```

Đăng nhập bằng tài khoản Cloudflare đang dùng Pages. Wrangler sẽ tạo Worker `myriad-lives-presence`, binding `PRESENCE` và Durable Object SQLite `CultivatorPresence` từ migration trong config. Không cần bật Workers Paid. Cách này cấu hình cả namespace/migration, không chỉ dán JavaScript vào editor.

Lưu URL Worker mà lệnh deploy trả về, ví dụ `https://myriad-lives-presence.your-account.workers.dev`.

## 2. Cấu hình trong dashboard

Vào **Workers & Pages → myriad-lives-presence**:

- **Bindings**: kiểm tra có Durable Object `PRESENCE`.
- **Settings → Variables and Secrets**: kiểm tra `ALLOWED_ORIGINS` là URL web thật. Đây là biến Text, không cần Secret.
- **Settings → Domains & Routes**: kiểm tra địa chỉ `workers.dev` đang bật.

Vào **Workers & Pages → dự án Pages của game → Settings → Variables and Secrets**:

- Thêm biến Text **`VITE_PRESENCE_URL`**.
- Giá trị là URL Worker, ví dụ `https://myriad-lives-presence.your-account.workers.dev`, không thêm `/online`.
- Áp dụng cho **Production**; nếu muốn Preview cũng hoạt động, phải thêm chính xác origin preview vào `ALLOWED_ORIGINS`.
- **Save**, rồi sang **Deployments** và deploy lại nhánh `main` có code mới. Vite đưa biến vào lúc build, nên chỉ Save biến chưa đủ.

Nếu deploy lại Worker bằng terminal, config local sẽ cập nhật lại biến `ALLOWED_ORIGINS`; nhớ giữ config khớp dashboard.

## 3. Kiểm tra

Mở Home: số ban đầu có thể là 0. Mở Tu tiên trong tab khác, chờ gieo số mệnh xong và bắt đầu kiếp. Quay lại Home; trong vòng một phút số tăng. Hai tab chung browser vẫn chỉ tính một. Dùng browser khác để thử số 2. Đóng các tab Tu tiên, đợi hơn 150 giây và lần đọc kế tiếp số giảm.

F12 → Network → lọc `online`: GET từ Home, POST từ Tu tiên. 403 nghĩa là `ALLOWED_ORIGINS` sai; lỗi mạng/CORS thường do URL hoặc origin; 503 cần xem Worker logs/binding/quota. Mở URL Worker trực tiếp trong thanh địa chỉ có thể trả Forbidden vì không có Origin — đây không phải phép thử hợp lệ.

## Hạn mức

Worker và Durable Objects có hạn mức Free riêng; GET, POST và OPTIONS đều có thể dùng request Worker, nhưng OPTIONS được trả ngay nên không gọi Durable Object. Một giờ ở Home hoặc Tu tiên khoảng 60 request, chưa tính request ban đầu/preflight. Những dịch vụ khác trong tài khoản có thể dùng chung quota.

Theo tài liệu Cloudflare kiểm tra ngày 15/10/2026, Durable Objects SQLite Free có 5 triệu SQL rows read/ngày và 100.000 rows written/ngày; đây là số hàng dữ liệu, không phải số lượt truy cập hay câu SQL. Hạn mức ngày reset lúc 00:00 UTC (07:00 giờ Việt Nam). Một request có thể đọc nhiều hàng; xóa hàng cũng tính lượt ghi. Email gần hết hạn mức là cảnh báo, không chứng minh request đang lỗi. Vẫn ở gói Free thì vượt quota gây lỗi, không tự mua gói; frontend sẽ ẩn bộ đếm. CORS chỉ giới hạn browser gọi từ domain được phép, không phải cơ chế chống bot tuyệt đối.

### Cách giảm lượt đọc SQL

- Khi Durable Object khởi tạo, nạp bảng `visitors` vào Map riêng của instance một lần. Mỗi heartbeat tiếp tục lưu SQL rồi mới cập nhật Map, nên khởi tạo lại vẫn khôi phục được các phiên cũ.
- Đếm và kiểm tra TTL trong RAM, không chạy `SELECT COUNT` hay `DELETE WHERE seen` trên mỗi request. GET không có phiên hết hạn không cần truy cập SQL sau khi instance đã nạp.
- Phiên hết hạn được xóa theo khóa chính `id`, chỉ tìm đúng hàng cần xóa. Số đếm vẫn loại phiên ngay tại mốc 150 giây, không chờ cache hết hạn. Giữ nguyên chu kỳ heartbeat 60 giây.
- Không thêm index `seen`: cách đếm mới không cần nó, đồng thời tránh thêm lượt ghi index mỗi khi heartbeat đổi thời gian. Schema và migration hiện có giữ nguyên.

Bản tối ưu cần deploy lại **Worker Presence** bằng lệnh ở mục 1; push hoặc build frontend không tự cập nhật Worker này. Không cần xóa namespace hay dữ liệu cũ.

Sau deploy, so sánh phần tăng thêm của SQL rows read và requests trong cùng khoảng thời gian, vì tổng rows read đã dùng trong ngày không giảm lại. Lượt đọc vẫn có thể phát sinh khi instance khởi tạo lại và khi SQL tìm khóa để ghi/xóa; mức giảm và khả năng ở trong Free cần xác nhận bằng Metrics thực tế. Test local dùng SQLite thật để kiểm tra SQL, khôi phục phiên, TTL và các lượt đọc lặp, không mô phỏng chính xác bộ tính quota Cloudflare.

Tài liệu: https://developers.cloudflare.com/durable-objects/get-started/, https://developers.cloudflare.com/durable-objects/platform/pricing/ và https://developers.cloudflare.com/durable-objects/reference/in-memory-state/
