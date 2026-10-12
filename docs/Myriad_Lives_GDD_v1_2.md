# MYRIAD LIVES (VẠN KIẾP) — GAME DESIGN DOCUMENT

> **Phiên bản:** 1.2 — Interactive Choice Events  
> **Ngày cập nhật:** 12/10/2026  
> **Tên chính thức:** Myriad Lives · **Tên tiếng Việt:** Vạn Kiếp · **Repo đề xuất:** `myriad-lives`  
> **Stack:** React + JavaScript (.js/.jsx) + Vite; Firebase Hosting.  
> **Trạng thái:** Gameplay và kiến trúc cốt lõi đã chốt; số liệu cân bằng là mục tiêu thử nghiệm, chưa phải xác suất cuối cùng.  
> **Tham chiếu:** [1 in 8 Billion](https://1in8b.life/en/) — tham khảo hình thức mô phỏng một đời người bằng timeline; không sao chép nội dung, thương hiệu hoặc thiết kế.

---

## 1. Tóm tắt sản phẩm

**Myriad Lives (Vạn Kiếp)** là web game mô phỏng số mệnh trong thế giới tiên hiệp. Người chơi **bấm Luân Hồi** để sinh nhân vật ngẫu nhiên; hệ thống tự mô phỏng đến một ngã rẽ quan trọng, tạm dừng cho người chơi lựa chọn, rồi tiếp tục đến kết cục: hồ sơ, cảnh giới cao nhất, tuổi thọ, các mốc cuộc đời và nguyên nhân kết thúc.

Trải nghiệm cốt lõi: **“Kiếp này ta có tiên duyên gì, đi được bao xa trên tiên lộ, và cuối cùng kết thúc ra sao?”**

Game thiên về khám phá kết quả ngẫu nhiên, đọc nhật ký ngắn, thử lại nhiều lần; **không có điều khiển hoặc chiến đấu trực tiếp**; chỉ có lựa chọn tại một số bước ngoặt, không phải thao tác mỗi năm.

### 1.1. Những quyết định không thay đổi trong v1

| Chủ đề | Quyết định |
|---|---|
| Vòng chơi | 1 lượt Luân Hồi = 1 kiếp độc lập, có thể gồm vài lựa chọn |
| Chế độ | **Auto Simulation + Choice Events**, kèm nút tự động hoàn tất |
| Đầu vào | **Luân Hồi** để bắt đầu; lựa chọn khi có bước ngoặt |
| Mô phỏng | Tính tự động đến sự kiện cần lựa chọn; tiếp tục sau khi chọn; không phát từng năm trên UI |
| Đầu ra | Hiển thị toàn bộ nhật ký đã diễn ra đến điểm lựa chọn; khi kết thúc hiện toàn bộ kết quả |
| Timeline | Mốc quan trọng, **15–35 từ tiếng Việt/mốc** |
| Nhịp sự kiện | Ngẫu nhiên theo giai đoạn/cảnh giới, không định kỳ cứng |
| NPC | Không tạo/ghi nhớ danh tính NPC riêng |
| Story Memory | Không có Story Arc, lời hứa, báo ân, thù hận nhiều năm |
| AI | Không dùng AI runtime |
| Thế giới | Mỗi kiếp random cả độ khắc nghiệt, tài nguyên, cơ duyên và may mắn |
| Pity | Tăng cơ hội **profile tốt** sau các lượt profile chưa đạt ngưỡng |
| Lưu trữ | **Chỉ runtime trong RAM tab**; refresh/đóng tab reset mọi thứ |
| Backend | Không cần trong MVP |

### 1.2. Nguyên tắc thiết kế

1. **Random có luật**: các thuộc tính và môi trường được bốc ngẫu nhiên, nhưng sự kiện phải hợp tuổi, cảnh giới, điều kiện hiện tại.
2. **Không phải ai cũng là thiên tài**: phần lớn hồ sơ thông thường; trường hợp hiếm đáng nhớ.
3. **Profile tốt không đảm bảo kết cục tốt**: tài năng, cơ duyên và hiểm họa tác động độc lập có điều kiện.
4. **Không ép đủ số dòng**: một đời ngắn có ít mốc; đại năng sống lâu có nhiều mốc.
5. **Câu chuyện ngắn, rõ và nhất quán**: ưu tiên kết quả có ý nghĩa thay vì các câu chung chung.
6. **Pity chỉ thay đổi phân phối hồ sơ đầu vào**, không ép nhân vật đạt cảnh giới cao.

---

## 2. Hành trình người chơi

### 2.1. Màn hình ban đầu

- Tên/logo **Myriad Lives** (phụ đề **Vạn Kiếp**) và tagline ngắn.
- Một nút chính **Luân Hồi**.
- Có thể có dòng giới thiệu: “Một lần luân hồi, một đời tiên lộ”.
- Không yêu cầu đăng nhập, đặt tên, chọn chủng tộc, chọn độ khó hay thiết lập số mệnh.

### 2.2. Khi bấm Luân Hồi

1. Lấy `sessionPity` trong RAM, random profile (có pity) và thế giới mới.
2. Khởi tạo simulation; chạy tự động qua những năm và sự kiện không cần quyết định.
3. **Nếu gặp Choice Event:** dừng tại mốc đó, hiển thị nhật ký đã xảy ra và 2–3 phương án; người chơi chọn một phương án.
4. Roll kết quả theo trọng số/điều kiện, áp dụng hiệu ứng, ghi mốc 15–35 từ rồi tiếp tục chạy.
5. Lặp lại cho đến lựa chọn kế tiếp hoặc kết cục (chết/phi thăng).
6. Khi kết thúc, hiển thị **toàn bộ hồ sơ, timeline, cảnh giới cao nhất, tuổi thọ, kết cục**.

**Tự động hoàn tất:** tại bất kỳ điểm lựa chọn nào, người chơi có thể để engine tự chọn các phương án còn lại và chạy thẳng đến kết cục. Đây không phải chế độ chơi riêng hay AI; chỉ là chính sách chọn mặc định dựa trên trọng số.

### 2.3. Khi bấm Luân Hồi lần nữa

- Khởi tạo một kiếp độc lập mới, thay kết quả trước đó.
- `runCount` và pity tiếp tục trong cùng tab; pity được cập nhật **một lần khi profile sinh thành công**, không theo số lần chọn.
- Không có điểm cộng, vật phẩm, NPC hay di sản xuyên kiếp.
- **Refresh/đóng tab = reset** tất cả kết quả, pity, kiếp đang dở.

### 2.4. Thời lượng

- Simulation tính rất nhanh giữa các lựa chọn, **không đợi từng năm**.
- Đa số kiếp có thể có khoảng **2–5 lựa chọn quan trọng** như mục tiêu tuning, kiếp dài có thể nhiều hơn; không áp quota.
- Thời gian trải nghiệm chủ yếu là đọc và chọn. Nút tự động hoàn tất giúp giữ nhịp nhanh.

---

## 3. Thiết kế giao diện

### 3.1. Cấu trúc trang kết quả

```text
┌───────────────────────────────────────────────┐
│ MYRIAD LIVES · VẠN KIẾP                             │
│ Một lần luân hồi, một đời tiên lộ             │
├───────────────────────────────────────────────┤
│ LÂM VÔ TRẦN                    [NGUYÊN ANH]    │
│ Kiếp #12 · Thiên linh căn                     │
│ Xuất thân: Tu tiên thế gia                    │
│ Thể chất: Lôi Linh Thể                        │
│ Khí vận: 89/100                               │
│ Hưởng thọ: 832 tuổi                           │
├───────────────────────────────────────────────┤
│ NHÂN SINH KÝ SỰ                               │
│  0 tuổi  Sinh ra tại...                       │
│ 12 tuổi  Được phát hiện...                    │
│ 38 tuổi  Trúc Cơ thành công...                │
│ ...                                           │
│ 832 tuổi  Đột phá thất bại...                 │
├───────────────────────────────────────────────┤
│ KẾT CỤC                                      │
│ Cảnh giới cao nhất: Nguyên Anh hậu kỳ         │
│ Nguyên nhân: Tâm ma khi đột phá               │
│                                               │
│             [ LUÂN HỒI LẦN NỮA ]             │
└───────────────────────────────────────────────┘
```

### 3.2. Phong cách

- Tiên hiệp/cổ phong, tối giản, dễ đọc; có thể dùng nền giấy, núi mực tàu, điểm nhấn vàng/trầm.
- Ưu tiên mobile-first; desktop dùng cột nội dung có chiều rộng vừa phải.
- Timeline theo thứ tự tuổi tăng dần, tuổi hiển thị rõ.
- Cảnh giới, tuổi thọ, kết cục nằm ngay đầu/cuối để dễ lướt.
- **Không che kết cục sau khi kiếp hoàn tất; trước đó **không tiết lộ tương lai chưa xảy ra**.
- Hiệu ứng trang trí nếu có phải nhẹ, không chặn kết quả.

### 3.3. Trạng thái UI

- **Empty:** tên game + nút Luân Hồi.
- **Generating:** chỉ hiển thị loading ngắn nếu tính toán thực sự cần.
- **Choice Pending:** hồ sơ hiện tại + nhật ký đến tuổi hiện tại + 2–3 lựa chọn + nút Tự động hoàn tất.
- **Result:** hồ sơ + timeline đầy đủ + kết cục + nút Luân Hồi lần nữa.
- **Error:** thông báo tạo kiếp thất bại và nút thử lại; không tăng pity khi tạo thất bại.

---

## 4. Mô hình nhân vật

### 4.1. Hồ sơ sinh ra

| Thuộc tính | Ý nghĩa |
|---|---|
| `name` | Tên được random từ các danh sách họ/tên |
| `origin` | Xuất thân: phàm gia, thế gia, cô nhi, hoàng tộc... |
| `spiritRoot` | Linh căn và phẩm chất |
| `physique` | Thể chất thường/hiếm/đặc biệt |
| `talent` | Tốc độ học và khả năng tu luyện |
| `comprehension` | Ngộ tính, ảnh hưởng bình cảnh/đột phá |
| `luck` | Khí vận cá nhân, tác động xác suất cơ duyên |
| `temperament` | Tính cách tổng quát nếu cần để biến đổi trọng số, **không tạo hệ NPC** |

### 4.2. Trạng thái mô phỏng tối thiểu

`age`, `realm`, `realmStage`, `cultivationProgress`, `lifespanLimit`, `health`, `resources`, `sectStatus`, `partnerStatus`, `alive`, `causeOfDeath`, `highestRealm`, `eventCooldowns`.

Các trạng thái `sectStatus` và `partnerStatus` là **cờ đơn giản**, không lưu danh tính tông môn/NPC hay lịch sử quan hệ. Có thể bỏ khỏi MVP nếu kho sự kiện chưa dùng.

### 4.3. Cảnh giới

Danh sách cấu hình ban đầu (có thể mở rộng bằng data):

1. Phàm nhân
2. Luyện Khí
3. Trúc Cơ
4. Kim Đan
5. Nguyên Anh
6. Hóa Thần
7. Luyện Hư
8. Hợp Thể
9. Đại Thừa
10. Độ Kiếp
11. Phi Thăng / kết cục đặc biệt

Mỗi cảnh giới có điều kiện đột phá, giới hạn thọ nguyên và mức khó riêng. **Phi Thăng** cần quy tắc kết thúc rõ: hoặc một kết cục thành công, hoặc mở tầng tu luyện cao hơn trong phiên bản sau. MVP đề xuất xem là **kết cục đặc biệt**.

---

## 5. Thế giới và số mệnh ngẫu nhiên

Mỗi kiếp tạo `WorldModifiers` mới:

- `danger`: mức nguy hiểm, tác động xác suất tai họa/tử vong.
- `opportunity`: mức dồi dào cơ duyên.
- `resources`: tài nguyên tu luyện phổ biến/hiếm.
- `cultivationDifficulty`: độ khó tiến bộ và đột phá.
- `stability`: mức bình ổn/hỗn loạn, tác động biến cố.

Không có menu chọn “cân bằng / tàn khốc”. Nhãn như “bình ổn”, “hỗn loạn”, “tàn khốc” chỉ là **cách diễn giải** từ các modifier ngẫu nhiên, không phải preset cố định.

Các biến có thể có tương quan vừa phải nhưng không bị khóa thành bộ preset: một thế giới nguy hiểm vẫn có thể giàu tài nguyên.

---

## 6. Mô phỏng cuộc đời

### 6.1. Quy trình

- Khởi tạo tuổi 0 và mốc xuất sinh.
- Tiến thời gian trong engine theo bước thích hợp (năm hoặc giai đoạn).
- Cập nhật tiến độ tu luyện, tuổi thọ, sức khỏe, tài nguyên.
- Kiểm tra đột phá, thất bại, cơ duyên, tai họa và tử vong.
- Chọn biến cố đủ quan trọng để ghi timeline.
- Dừng khi chết hoặc đạt kết cục đặc biệt.
- Chốt tuổi thọ, cảnh giới cao nhất và nguyên nhân kết thúc.

### 6.2. Nhịp sự kiện

**Random theo giai đoạn**, không phải cứ N năm bắt buộc một mốc. Khoảng cách tham khảo ban đầu:

| Giai đoạn | Khoảng cách sự kiện đáng ghi nhận |
|---|---|
| Phàm nhân | 1–5 năm |
| Luyện Khí | 1–4 năm |
| Trúc Cơ | 2–8 năm |
| Kim Đan | 5–15 năm |
| Nguyên Anh | 10–30 năm |
| Hóa Thần+ | Tự giãn theo cảnh giới/tuổi thọ |

Các con số là **tham số thử nghiệm**, không phải hợp đồng xác suất. Mốc sinh, đột phá lớn và kết cục luôn được ghi ngay cả khi chưa đến “nhịp”.

### 6.3. Số mốc kỳ vọng

| Cảnh giới cao nhất | Mốc tham khảo |
|---|---|
| Phàm nhân | 3–7 |
| Luyện Khí | 5–10 |
| Trúc Cơ | 8–15 |
| Kim Đan | 12–20 |
| Nguyên Anh | 16–25 |
| Hóa Thần+ | 20–40+ |

Đây là **mục tiêu quan sát khi cân bằng**, không phải quota cần thêm câu cho đủ.

---

## 7. Story Engine và nội dung

### 7.1. Phạm vi

Story Engine chỉ:
- nhận state và biến cố đã được simulation quyết định;
- lọc/chọn sự kiện phù hợp;
- tạo câu bằng template có điều kiện;
- kiểm tra 15–35 từ/mốc;
- trả timeline sắp xếp theo tuổi.

**Không có AI runtime, NPC identity, Story Memory hay chuỗi báo ân/báo thù. Có lựa chọn ngắn tại Choice Events.**

### 7.2. Nhóm sự kiện

1. **Khởi đầu:** sinh ra, phát hiện linh căn, gia nhập tiên môn.
2. **Tu luyện:** bình cảnh, bế quan, đột phá, tẩu hỏa.
3. **Cơ duyên:** bí cảnh, linh dược, pháp bảo, truyền thừa.
4. **Tai họa:** yêu thú, truy sát, đại chiến, thiên kiếp.
5. **Nhân sinh:** du lịch, ẩn cư, kết đạo lữ, khai tông.
6. **Kết cục:** tọa hóa, chiến tử, đột phá thất bại, phi thăng.

### 7.3. Nguyên tắc câu chữ

- **15–35 từ tiếng Việt/mốc** (quy ước đếm bằng khoảng trắng sau khi chuẩn hóa).
- Một mốc diễn đạt **một biến cố trọng tâm**.
- Không cần gắn tên NPC hoặc tham chiếu nhân vật đã gặp ở quá khứ.
- Biến thể văn bản phải phù hợp hoàn cảnh; không bốc ngẫu nhiên câu “nhờ sư phụ” khi nhân vật không có sư phụ.
- Không mô tả đột phá trái thứ tự hoặc nhân vật sống sau khi đã chết.
- Sự kiện trùng lặp cần cooldown/giới hạn số lần.

### 7.4. Ví dụ timeline minh họa

> **0 tuổi:** Ngươi sinh ra trong một gia đình nông dân nghèo tại Thanh Vân Châu, cuộc đời tưởng chừng sẽ gắn với ruộng đồng.  
> **8 tuổi:** Một lần kiểm tra linh căn bất ngờ phát hiện ngươi sở hữu Lôi linh căn, mở ra cơ hội bước lên con đường tu luyện.  
> **35 tuổi:** Sau nhiều năm tích lũy tu vi và hai lần thất bại, ngươi cuối cùng cũng đột phá Trúc Cơ, thọ nguyên tăng mạnh.  
> **146 tuổi:** Nhờ một lần ngộ đạo trong lúc bế quan, ngươi kết thành Kim Đan, trở thành tu sĩ có danh tiếng trong vùng.  
> **436 tuổi:** Thọ nguyên gần cạn, ngươi cưỡng ép đột phá cảnh giới tiếp theo nhưng thất bại, cuối cùng tọa hóa trong động phủ.

Các dòng trên chỉ là **minh họa phong cách**, không xác định công thức thọ nguyên/cảnh giới.

---

## 8. Profile Pity

### 8.1. Mục tiêu

Sau nhiều lần liên tiếp sinh ra profile không đạt ngưỡng “tốt”, xác suất xuất hiện profile tốt tăng dần. **Ngay khi profile tốt xuất hiện, pity reset về 0**, bất kể kết cục kiếp đó tốt hay xấu.

### 8.2. Định nghĩa

- `profileScore`: điểm đánh giá **hồ sơ lúc sinh**, từ linh căn, thể chất, thiên phú, ngộ tính... (không tính cảnh giới cuối đời).
- `goodProfileThreshold`: ngưỡng profile tốt, sẽ hiệu chỉnh bằng mô phỏng.
- `pityCount`: số kiếp liên tiếp chưa ra profile tốt.
- Pity điều chỉnh phân phối **profile**, không tăng trực tiếp cơ duyên, tỷ lệ sống hoặc cảnh giới.
- Cần có trần xác suất để giữ độ hiếm; không bắt buộc bảo hiểm 100%.

### 8.3. Vòng đời pity

```text
Bắt đầu phiên: pity = 0
      ↓
Bấm Luân Hồi
      ↓
Random profile với xác suất phụ thuộc pity
      ↓
profileScore >= ngưỡng?
  ├─ Có   → pity = 0
  └─ Không → pity += 1
      ↓
Random thế giới, mô phỏng đời, hiển thị kết quả
```

Việc cập nhật pity phải diễn ra **chính xác một lần trên mỗi kiếp tạo thành công**.

### 8.4. Ví dụ tỷ lệ thử nghiệm (chưa chốt)

`pGood(pity) = min(0.50, 0.05 + 0.02 × pity)`

Tức xác suất nền 5%, tăng 2 điểm phần trăm/kiếp không đạt, tối đa 50%. **Chỉ là ví dụ để benchmark**, không phải bảng cân bằng cuối.

---

## 9. Lưu trữ và quyền riêng tư

- Chỉ dùng React state / module-level store trong RAM.
- Không dùng `localStorage`, `sessionStorage`, IndexedDB, cookie lưu game hay backend.
- Refresh, đóng tab hoặc mở phiên mới đều xóa pity và kết quả.
- Không có tài khoản, leaderboard hay lịch sử xuyên phiên.
- Có thể hiển thị `sessionRunCount` trong phiên hiện tại; đây không phải tiến trình bền vững.

---

## 10. Kiến trúc kỹ thuật

### 10.1. Stack đề xuất

- **React + JavaScript (ES Modules) + Vite**.
- Logic simulation viết JavaScript thuần, tách khỏi UI.
- Dữ liệu profile, cảnh giới, sự kiện, câu chữ dạng JSON hoặc JavaScript data.
- CSS/Tailwind tùy giai đoạn; ưu tiên responsive và accessibility.
- Triển khai Firebase Hosting (website tĩnh, không cần backend).

### 10.2. Các module

```text
src/
  app/
    App.jsx
  components/
    LifeProfile.jsx
    LifeTimeline.jsx
    LifeEnding.jsx
    ReincarnateButton.jsx
  engine/
    generateLife.js
    generateProfile.js
    generateWorld.js
    simulateLife.js
    eventSelector.js
    eventResolver.js
    narrativeRenderer.js
    pity.js
    rng.js
    validation.js
  data/
    origins.js
    spiritRoots.js
    physiques.js
    realms.js
    events/
  data/
    events/               # JSON event packs
  styles/
```

### 10.3. Giao tiếp module

`startLife(session, rng) → PausedAtChoice | Finished` và `chooseOption(run, choiceId) → PausedAtChoice | Finished`; `autoComplete(run) → Finished`

Engine chạy đồng bộ theo từng chặng đến lựa chọn hoặc kết cục; UI không cần polling hay gọi AI.

---

## 11. Quy mô nội dung và kế hoạch phát triển

### 11.1. Mục tiêu nội dung

| Giai đoạn | Sự kiện gốc | Biến thể/sự kiện |
|---|---:|---:|
| Prototype | 30–50 | 1–2 |
| MVP | 100–150 | 2–3 |
| Content v1 | 250–300 | 2–4 |

Mục tiêu dài hạn thêm 20–30 nhóm nguyên nhân chết, 20–40 kết cục/danh hiệu. Không cam kết số lượng lớn ngay ở prototype.

### 11.2. Lộ trình

1. **Foundation:** types, RNG có seed để test, profile, world modifiers, cảnh giới.
2. **Simulation:** tiến tuổi, tu luyện, đột phá, thọ nguyên, tử vong.
3. **Events:** điều kiện, trọng số, cooldown, template, Choice Events (2–3 phương án/outcomes), validator 15–35 từ.
4. **Pity:** đánh giá profile, điều chỉnh tỷ lệ, reset đúng quy tắc.
5. **UI:** Luân Hồi, hồ sơ, timeline, lựa chọn tại ngã rẽ, Tự động hoàn tất, kết cục.
6. **Balance:** chạy 10.000–100.000 kiếp tự động, phân tích phân phối.
7. **Content:** tăng số sự kiện, thêm biến thể, kiểm tra lặp và câu vô lý.
8. **Release:** responsive, performance, accessibility, static deploy.

---

## 12. Tiêu chí nghiệm thu MVP

- [ ] Từ màn hình đầu, một nút bắt đầu một kiếp và tự chạy đến Choice Event hoặc kết cục.
- [ ] Khi gặp Choice Event, dừng đúng mốc và hiển thị 2–3 lựa chọn; khi kết thúc hiển thị toàn bộ kết quả.
- [ ] Mỗi kiếp random profile và world modifiers mới.
- [ ] Có thể sinh nhân vật bình thường, thiên tài, chết trẻ và đại năng hiếm.
- [ ] Cảnh giới/tuổi thọ tuân thủ quy tắc mô phỏng.
- [ ] Timeline sắp tuổi tăng dần; mỗi mốc 15–35 từ.
- [ ] Lựa chọn roll outcome theo trọng số, áp hiệu ứng đúng; không xuất hiện sự kiện trái trạng thái hoặc sau kết cục.
- [ ] Nút Tự động hoàn tất bỏ qua các lựa chọn còn lại và kết thúc kiếp.
- [ ] Pity tăng sau profile chưa đạt ngưỡng, reset ngay khi ra profile tốt.
- [ ] Pity không bị tác động bởi kết cục tu luyện.
- [ ] Refresh trang reset mọi trạng thái.
- [ ] Không gửi yêu cầu AI và không cần backend.
- [ ] Có thể chạy hàng nghìn kiếp bằng script test mà không phụ thuộc UI.

---

## 13. Những tham số **chưa** chốt

Đây là tham số cần tuning, **không phải tính năng còn bỏ ngỏ**:

- Bảng trọng số cụ thể của linh căn, thể chất, xuất thân.
- Công thức tu luyện, đột phá, thọ nguyên và tử vong theo cảnh giới.
- Ngưỡng `goodProfileThreshold`, tỷ lệ gốc, bước tăng và trần pity.
- Số lượng sự kiện và phân phối theo cảnh giới sau thử nghiệm.
- Thang điểm hiển thị khí vận và chi tiết mỹ thuật.

**Tài liệu kỹ thuật đi kèm:** `STORY_ENGINE_DESIGN_v1_2.md`.

---

## 14. Phụ lục cập nhật v1.1 — Choice Events và mở rộng JSON

### 14.1. Quy tắc tương tác đã chốt

- Simulation chạy tự động; **chỉ tạm dừng tại biến cố lớn có lựa chọn** (cơ duyên, bí cảnh, nguy cơ đột phá, nhập tông, đối đầu hiểm họa...).
- Choice Event có **2–3 phương án**; mỗi phương án có **nhiều outcome trọng số**. Chọn hành động **không bảo đảm thành công**.
- Outcome có thể tác động `cultivation`, `health`, `resources`, `lifespan`, `realm` (qua handler hợp lệ), `death` và cờ trạng thái đơn giản.
- Nhật ký trước lựa chọn được hiển thị ngay; sau khi chọn, kết quả được ghi và engine chạy tiếp.
- **Tự động hoàn tất** cho phép engine tự chọn phương án hợp lệ ở các Choice Events còn lại, tính đến kết cục.
- Pity chỉ phụ thuộc profile khi sinh, không phụ thuộc lựa chọn hay kết cục.

### 14.2. Kiến trúc content-driven

Kho nội dung chia file JSON: `birth.json`, `cultivation.json`, `opportunities.json`, `disasters.json`, `life.json`, `endings.json`. Mỗi event có ID, nhóm, điều kiện, trọng số, cooldown, mô tả và (tùy chọn) choices/outcomes/effects.

**Mở rộng nội dung thường chỉ cần thêm JSON** nếu dùng các điều kiện và hiệu ứng đã được engine hỗ trợ. Khi thêm loại cơ chế mới chưa có handler (ví dụ hệ luyện đan nguyên liệu phức tạp) mới cần cập nhật JavaScript.

### 14.3. Giới hạn chống phức tạp

Không cần NPC entity, Story Memory, nhiệm vụ nhiều bước hay AI. Trạng thái tối thiểu (tu vi, cảnh giới, máu, tài nguyên, cờ tông môn/đạo lữ) là đủ cho lựa chọn đơn giản.

### 14.4. Điều chỉnh so với v1.0

Các mô tả trước đây về “một click hiện trọn đời ngay”, “không có lựa chọn” được **thay thế** bằng mô hình chạy tự động **đến lựa chọn hoặc kết cục**. Phương án A (hiển thị ngay) được giữ ở ý nghĩa: **không animate timeline, hiện toàn bộ mốc đã diễn ra ngay**; không hiển thị trước tương lai khi người chơi chưa chọn.


---

## 15. CẬP NHẬT v1.2 — Thương hiệu, JavaScript và Firebase Hosting

**Quyết định chính thức:** tên sản phẩm tiếng Anh là **Myriad Lives**, tên hiển thị tiếng Việt là **Vạn Kiếp**. Tên `myriad-lives` được đề xuất cho repo và Firebase project ID; ID thực tế tùy khả dụng.

**Stack được chốt:** React + **JavaScript (ES2022, `.js`/`.jsx`)** + Vite + CSS; không dùng TypeScript. Dùng **JSDoc** ở các hàm engine quan trọng để hỗ trợ IDE và tài liệu hóa kiểu dữ liệu mà không phải biên dịch TS. Các sự kiện, lựa chọn, outcome và hiệu ứng nằm trong JSON; engine là JavaScript thuần, độc lập UI.

**Triển khai:** Firebase Hosting phục vụ thư mục `dist/` từ `npm run build`; cấu hình SPA rewrite về `/index.html` cho route client-side nếu có. Không yêu cầu Firebase Auth, Firestore, Functions hay Storage. Không lưu pity/result qua refresh.

**Phạm vi gameplay giữ nguyên v1.1:** Auto Simulation + Choice Events; tạm dừng tại ngã rẽ, 2–3 lựa chọn, random outcome; có nút **Tự động hoàn tất**. Nhật ký 15–35 từ/mốc, không AI runtime, không NPC entity.

**Changelog:** v1.0 Auto Life → v1.1 Choice Events + JSON → **v1.2 Myriad Lives + JavaScript + Firebase Hosting**.
