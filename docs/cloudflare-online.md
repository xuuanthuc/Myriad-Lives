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

Worker và Durable Objects có hạn mức Free riêng; GET, POST và OPTIONS đều có thể dùng request. Một giờ ở Home hoặc Tu tiên khoảng 60 request, chưa tính phụ phí request như kết nối ban đầu/preflight. Những dịch vụ khác trong tài khoản có thể dùng chung quota. Vẫn ở gói Free thì vượt quota gây lỗi, không tự mua gói; frontend sẽ ẩn bộ đếm. CORS chỉ giới hạn browser gọi từ domain được phép, không phải cơ chế chống bot tuyệt đối.

Tài liệu: https://developers.cloudflare.com/durable-objects/get-started/ và https://developers.cloudflare.com/durable-objects/platform/pricing/
