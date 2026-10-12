# MYRIAD LIVES (VẠN KIẾP) — STORY ENGINE DESIGN

> **Phiên bản:** 1.2 — Choice Events + JSON Content  
> **Ngày cập nhật:** 12/10/2026  
> **Tài liệu liên quan:** `Myriad_Lives_GDD_v1_2.md`  
> **Mục đích:** Đặc tả engine để lập trình trực tiếp, kiểm thử xác suất và mở rộng kho nội dung.  
> **Lưu ý:** Công thức và con số ghi **[ĐỀ XUẤT / TUNING]** chưa phải cân bằng cuối cùng.

---

## 1. Ranh giới kiến trúc

Game **Auto Simulation + Choice Events**. Một lần click chạy nhanh đến ngã rẽ hoặc kết cục. Khi có lựa chọn, engine tạm dừng, nhận quyết định rồi tiếp tục; có nút **Tự động hoàn tất**.

```text
UI: click "Luân Hồi"
   ↓
Session Pity (RAM only)
   ↓
Profile Generator  ← pity
   ↓
World Generator    ← random mới mỗi kiếp
   ↓
Simulation Engine  ← profile + world
   ├── time / cultivation / breakthrough / lifespan
   ├── event selector + resolver
   └── death / ascension / ending
   ↓
Narrative Renderer ← facts + templates
   ↓
PausedAtChoice | Finished
   ├── PausedAtChoice → UI chọn option → roll outcome → resume
   └── Finished → UI render kết quả đầy đủ
```

**Phân trách nhiệm:**

| Module | Chịu trách nhiệm | Không làm |
|---|---|---|
| Profile Generator | Tạo thuộc tính sinh ra, đánh giá `profileScore` | Quyết định cảnh giới cuối |
| World Generator | Tạo hệ số môi trường ngẫu nhiên mỗi kiếp | Chọn preset độ khó từ UI |
| Simulation | Tiến tuổi, tu luyện, xử lý cơ duyên/tai họa, kết cục | Viết câu văn |
| Event Selector | Chọn sự kiện hợp điều kiện/trọng số | Bịa kết quả không hợp lệ |
| Event Resolver | Áp hiệu ứng state, ghi fact | Hiển thị UI |
| Narrative Renderer | Biến fact thành 15–35 từ | Tự thay đổi số mệnh |
| Pity | Điều chỉnh cơ hội profile tốt giữa các lần bấm trong RAM | Bảo đảm kết cục tốt |
| UI | Hiển thị kết quả ngay | Mô phỏng từng năm hoặc lưu bền vững |

Không quản lý danh tính NPC, không Story Arc, không truyện dài, không AI runtime. Có lựa chọn ngắn tại biến cố quan trọng.

---

## 2. Hợp đồng dữ liệu — JavaScript + JSDoc

Dùng **JavaScript thuần**, không dùng `interface`, `type` hay cú pháp JavaScript. Kiểm tra shape bằng validator lúc nạp JSON và trong test. JSDoc hỗ trợ gợi ý IDE.

```js
/** @typedef {'idle'|'running'|'awaiting_choice'|'finished'} RunPhase */
/** @typedef {'mortal'|'qi_refining'|'foundation'|'golden_core'|'nascent_soul'|'spirit_transformation'|'void_refining'|'body_integration'|'mahayana'|'tribulation'} RealmId */
/** @typedef {{name:string, originId:string, spiritRootId:string, physiqueId:string, talent:number, comprehension:number, luck:number, profileScore:number, isGoodProfile:boolean}} BirthProfile */
/** @typedef {{danger:number, opportunity:number, resources:number, cultivationDifficulty:number, stability:number, descriptor:string}} WorldModifiers */
/** @typedef {{age:number, realm:RealmId, realmStage:string, cultivationProgress:number, lifespanLimit:number, health:number, resources:number, sectStatus:string, partnerStatus:string, alive:boolean, highestRealm:RealmId, deathCause?:string, cooldowns:Object, eventCounts:Object}} LifeState */
/** @typedef {{id:string, age:number, eventId:string, category:string, importance:string, context:Object}} LifeFact */
/** @typedef {{age:number, eventId:string, text:string}} TimelineEntry */
/** @typedef {{profile:BirthProfile, world:WorldModifiers, ageAtEnd:number, highestRealm:RealmId, endingType:'death'|'ascension', endingReason:string, timeline:TimelineEntry[], sessionRunNumber:number}} LifeResult */
/** @typedef {{runCount:number, pityCount:number, lastResult:LifeResult|null}} SessionState */
/** @typedef {{id:string, text:string, outcomes:Array<{id:string,weight:number,text:string,effects:Object}>}} ChoiceOption */
/** @typedef {{eventId:string, age:number, prompt:string, options:ChoiceOption[]}} PendingChoice */
/** @typedef {{phase:RunPhase, profile:BirthProfile, world:WorldModifiers, state:LifeState, facts:LifeFact[], pendingChoice?:PendingChoice, result?:LifeResult, rngState:Object}} ActiveRun */
```

Cờ `sectStatus`/`partnerStatus` chỉ là trạng thái đơn giản, không phải NPC entity.

---

## 3. RNG và khả năng tái hiện lỗi

- Trong sản phẩm: random từ nguồn đủ tốt (`crypto.getRandomValues` để sinh seed, sau đó PRNG deterministic cho mỗi kiếp).
- Trong test: dùng seed cố định để tái hiện cùng kết quả.
- Không dùng `Math.random()` rải rác trong các module; tất cả đi qua `Rng` interface.
- Seed **không phải tiến trình lưu bền vững**; refresh vẫn reset.

```js
// Contract: rng.float(), rng.int(min, max), rng.pick(items),
// rng.weightedPick([{value, weight}]); seedable và deterministic.
export function weightedPick(items, rng) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  if (!(total > 0)) throw new Error('Invalid event weights');
  let draw = rng.float() * total;
  for (const item of items) {
    draw -= item.weight;
    if (draw < 0) return item.value;
  }
  return items.at(-1).value;
}
```

`weightedPick` phải từ chối tổng trọng số <= 0; không silently chọn phần tử đầu.

---

## 4. Profile Generator

### 4.1. Thuộc tính

- `origin`: phàm gia, cô nhi, thế gia, tán tu hậu duệ, hoàng tộc...
- `spiritRoot`: phàm căn, ngũ/tứ/tam/song/thiên linh căn, biến dị linh căn...
- `physique`: thường, linh thể, dị thể, thánh thể... (một số rất hiếm).
- `talent`, `comprehension`, `luck`: điểm liên tục có phân phối, không mặc định uniform.
- `name`: ghép từ danh sách họ/tên; không dùng tên để quản lý NPC.

### 4.2. Phân phối

Không dùng `random(0..100)` uniform cho mọi thuộc tính nếu muốn đa số nhân vật bình thường. Chọn phân phối thiên về mức trung bình và đuôi hiếm.

**[ĐỀ XUẤT / TUNING]** Profile score:

```text
profileScore =
    0.35 * spiritRootScore
  + 0.25 * physiqueScore
  + 0.20 * talent
  + 0.15 * comprehension
  + 0.05 * originScore
```

`luck` không nhất thiết tính vào `profileScore`: giữ khí vận là yếu tố số mệnh ngẫu nhiên độc lập. Nếu thiết kế quyết định tính luck, cần cập nhật công thức và test.

**Định nghĩa “profile tốt” phải độc lập với kết cục**: `isGoodProfile = profileScore >= threshold`.

---

## 5. Profile Pity

### 5.1. Hợp đồng đã chốt

- Chỉ tăng nếu **profile vừa sinh không tốt**.
- Reset ngay nếu profile tốt, **dù chết sớm**.
- Không tăng theo số năm sống, cảnh giới đạt được hay số sự kiện.
- Lưu trong `SessionState` của tab, refresh là mất.
- Mỗi lần tạo kiếp thành công cập nhật đúng một lần.
- Không lưu `localStorage`, `sessionStorage`, IndexedDB hay backend.

### 5.2. Thuật toán khả thi

Để đạt chính xác tỷ lệ profile tốt `pGood(pity)`, **chọn nhánh chất lượng trước**, rồi sinh profile từ phân phối tương ứng:

```js
export function generateProfile(pity, rng) {
  const targetGood = rng.float() < getGoodProfileChance(pity);
  return sampleProfileConditionalOnQuality(targetGood, rng);
}
export function nextPity(current, profile) {
  return profile.isGoodProfile ? 0 : current + 1;
}
```

Không nên “random profile bình thường rồi sửa score cho đủ tốt” vì tạo các tổ hợp vô lý. `sampleProfileConditionalOnQuality` phải lấy từ **tổ hợp hợp lệ**, hoặc dùng rejection sampling có giới hạn và fallback được định nghĩa rõ.

**[ĐỀ XUẤT / TUNING]**

```text
pGood(pity) = min(0.50, 0.05 + 0.02 * pity)
```

Ví dụ:

| Pity trước khi roll | Cơ hội profile tốt |
|---:|---:|
| 0 | 5% |
| 5 | 15% |
| 10 | 25% |
| 15 | 35% |
| 23+ | 50% |

Các tỷ lệ này chỉ dùng làm điểm xuất phát cho test, không phải xác suất chính thức.

### 5.3. Pity update an toàn

Nên tạo toàn bộ `LifeResult` thành công trước, sau đó commit `runCount` và `pityCount` cùng lúc trong UI. Nếu engine throw lỗi, không tính lượt, không đổi pity.

---

## 6. World Generator

### 6.1. Quy tắc

**Mỗi kiếp random toàn bộ môi trường**, không có chọn “dễ/khó” từ UI.

Các hệ số đề xuất:
- `danger`: hiểm họa, tử vong do biến cố.
- `opportunity`: cơ duyên, bí cảnh, truyền thừa.
- `resources`: linh khí, linh dược, tài nguyên.
- `cultivationDifficulty`: mức khó tu luyện/đột phá.
- `stability`: chiến loạn, bất ổn.

**[ĐỀ XUẤT / TUNING]** Các hệ số có thể sample trong khoảng 0.6–1.6 (hoặc log-normal có cắt ngưỡng), với tương quan nhẹ nếu cần. Không dùng năm preset cứng.

```text
function generateWorld(rng: Rng): WorldModifiers {
  // Pseudocode: sample từng chiều, clamp theo cấu hình,
  // derive descriptor từ giá trị nổi trội.
}
```

Ví dụ: một kiếp **nguy hiểm cao + cơ duyên cao** vẫn hợp lệ; không buộc mọi thế giới tàn khốc đều nghèo tài nguyên.

### 6.2. Ẩn hay hiện?

Các modifier là dữ liệu nội bộ. UI có thể chỉ hiển thị một nhãn mô tả ngắn (“Loạn thế”, “Linh khí thịnh”) nếu muốn, nhưng không cần đưa toàn bộ chỉ số ra màn hình.

---

## 7. Simulation Engine

### 7.1. State transition

Một chu kỳ mô phỏng:

```text
while (alive && !specialEnding && age < SAFETY_MAX_AGE):
    advanceAge()
    applyAgingAndCultivation()
    maybeAttemptBreakthrough()
    maybeTriggerEvent()
    checkDeathAndLifespan()
    collectMeaningfulFacts()
finalizeEnding()
renderTimeline()
```

Cần quy định thứ tự xử lý để không có sự kiện xảy ra **sau khi chết**. Khuyến nghị kiểm tra tử vong ngay sau mọi hiệu ứng có thể gây chết và dừng bước mô phỏng đó.

### 7.2. Tiến thời gian

- Mô phỏng nội bộ theo năm là phương án dễ test.
- Có thể tối ưu bước nhảy thời gian khi cảnh giới cao, nhưng phải giữ phân phối nguy cơ và đột phá tương đương.
- Không chạy `setInterval` để mô phỏng tuổi trên UI.
- Có `SAFETY_MAX_AGE` và `MAX_ITERATIONS` tránh vòng lặp vô hạn.

### 7.3. Tu luyện

**[ĐỀ XUẤT / TUNING]**

```text
progressGain =
  baseRate(realm)
  * talentFactor
  * rootFactor
  * world.resources
  / world.cultivationDifficulty
  * randomVariance
```

`progressGain` bị chặn trong khoảng hợp lệ, không âm; tiến độ đạt ngưỡng mới xét đột phá.

### 7.4. Đột phá

**[ĐỀ XUẤT / TUNING]**

```text
pBreakthrough = clamp(
  baseChance(realm)
  + comprehensionBonus
  + resourceBonus
  + luckBonus
  - injuryPenalty
  - worldDifficultyPenalty,
  minimumChance,
  maximumChance
)
```

- Thành công → sang cảnh giới kế tiếp, cập nhật `lifespanLimit`.
- Thất bại → có thể mất tiến độ, tài nguyên, sức khỏe, thọ nguyên hoặc chết, tùy cảnh giới.
- Không thể nhảy qua cảnh giới nếu không có event đặc biệt được định nghĩa.
- Mốc thành công/thất bại quan trọng được ghi fact.

### 7.5. Thọ nguyên và tử vong

- Mỗi cảnh giới có **thọ nguyên cơ sở**, có thể biến thiên theo profile và event.
- Tử vong có thể do: thọ nguyên, chiến đấu, trọng thương, tẩu hỏa, đột phá/thiên kiếp, tai họa khác.
- `danger` tác động nguy cơ sự kiện; không nhân trực tiếp tất cả xác suất chết đến mức mất cân bằng.
- Có thể chết trẻ ngay cả khi profile rất tốt.
- `ascension` là kết cục đặc biệt (không ghi là tử vong).

**[ĐỀ XUẤT / TUNING]** Bảng thọ nguyên cơ sở dùng để thử nghiệm:

| Cảnh giới | Tuổi thọ cơ sở minh họa |
|---|---:|
| Phàm nhân | 70–100 |
| Luyện Khí | 100–140 |
| Trúc Cơ | 180–250 |
| Kim Đan | 350–500 |
| Nguyên Anh | 700–1.000 |
| Hóa Thần | 1.500–2.000 |
| Cao hơn | Cấu hình theo progression |

Không hardcode bảng trên vào narrative; đặt trong `realms.js`.

---

## 8. Event System

### 8.1. Nhóm sự kiện

`birth`, `cultivation`, `opportunity`, `disaster`, `life`, `ending`.

Không có `arcId`, `npcId`, `nextEventId`, chuỗi báo thù hoặc dependency vào nhân vật cụ thể.

### 8.2. Schema

```js
/** @typedef {{id:string,category:string,weight:number,minAge?:number,maxAge?:number,allowedRealms?:string[],cooldownYears?:number,maxOccurrencesPerLife?:number,importance:string,effectId?:string,templates?:string[],choices?:ChoiceOption[]}} EventDefinition */
// Event definitions được load từ JSON và validate trước khi dùng.
```

Dữ liệu không được chứa mã JavaScript tùy ý. `effectId` ánh xạ tới handler đã định nghĩa, dễ test.

### 8.3. Pipeline chọn sự kiện

1. Tạo candidate theo nhóm và giai đoạn.
2. Lọc điều kiện `minAge`, `allowedRealms`, `resources`, trạng thái...
3. Loại event đang cooldown hoặc vượt `maxOccurrencesPerLife`.
4. Tính `effectiveWeight` bằng hệ số world/profile.
5. Weighted random chọn **hoặc không chọn** sự kiện.
6. Resolver áp effect và sinh `LifeFact`.
7. Chỉ facts đủ quan trọng mới vào timeline.

**[ĐỀ XUẤT / TUNING]**:

```text
effectiveWeight =
  baseWeight
  * realmFactor
  * worldCategoryFactor
  * luckFactor (chỉ áp dụng nhóm phù hợp)
```

Không dùng một multiplier luck chung cho mọi sự kiện; may mắn cao không nên đồng thời tăng tai họa.

### 8.4. Nhịp xuất hiện

Không định kỳ N năm. Tần suất điều chỉnh theo cảnh giới/tuổi thọ và sự kiện bắt buộc.

Khoảng cách mốc tham khảo:

| Giai đoạn | Khoảng cách kỳ vọng |
|---|---|
| Phàm nhân | 1–5 năm |
| Luyện Khí | 1–4 năm |
| Trúc Cơ | 2–8 năm |
| Kim Đan | 5–15 năm |
| Nguyên Anh | 10–30 năm |
| Hóa Thần+ | Giãn tiếp theo cảnh giới |

Một năm có thể có 0–2 facts hiển thị; milestone quan trọng có thể vượt giới hạn mềm. Không thêm filler để đạt quota.

### 8.5. Cooldown và chống lặp

- `cooldowns[eventId] = nextAllowedAge`.
- `eventCounts[eventId]` để chặn vượt số lần.
- Các event hiếm/độc nhất đặt `maxOccurrencesPerLife = 1`.
- Các sự kiện có tác dụng giống nhau cần tag nhóm chống spam (tùy giai đoạn mở rộng).
- Không cần lưu **Story Memory**; các counters/cooldown chỉ là metadata kỹ thuật chống lặp.

### 8.6. Ví dụ event

```text
const herbDiscovery: EventDefinition = {
  id: "opportunity_rare_herb",
  category: "opportunity",
  weight: 8,
  minAge: 12,
  allowedRealms: ["qi_refining", "foundation", "golden_core"],
  cooldownYears: 18,
  maxOccurrencesPerLife: 2,
  importance: "major",
  effectId: "gain_resources_and_progress",
  templates: [
    "Trong chuyến lịch luyện nơi rừng sâu, ngươi tình cờ tìm thấy một cây linh dược quý hiếm, nhờ đó tu vi tiến triển rõ rệt.",
    "Khi thăm dò một sơn cốc hoang vắng, ngươi phát hiện linh thảo lâu năm, đổi được tài nguyên đủ để chuyên tâm tu luyện."
  ]
};
```

Các template phải được kiểm tra độ dài bằng test tự động.

---

## 9. Narrative Renderer

### 9.1. Input / output

Input: `LifeFact[]`, state snapshots/context của từng fact, profile/world nếu cần.

Output: `TimelineEntry[]`, tăng dần theo `age`.

**Quan trọng:** renderer không random kết quả thành/bại; chỉ chọn **cách kể** đã tương thích với fact.

### 9.2. Quy tắc 15–35 từ

Quy ước kiểm tra:

```text
function countVietnameseWords(text: string): number {
  return text.trim().split(/\s+/u).filter(Boolean).length;
}

function isValidTimelineText(text: string): boolean {
  const count = countVietnameseWords(text);
  return count >= 15 && count <= 35;
}
```

Tiếng Việt có từ ghép nhiều âm tiết; đây là **quy ước kiểm thử theo khoảng trắng**, dễ đo lường nhất cho v1. Không tính nhãn tuổi trong 15–35 từ.

### 9.3. Template có điều kiện

Nếu câu có nhắc “sư phụ”, “tông môn”, “đạo lữ” thì phải kiểm tra cờ tương ứng. Tốt nhất là chia variant theo `conditions` thay vì dùng string replace không kiểm soát.

Ví dụ:

```js
/** @typedef {{text:string,conditions?:{sectStatus?:string,partnerStatus?:string},weight?:number}} NarrativeVariant */
```

Nếu không có variant hợp lệ: dùng fallback **trung tính**, vẫn đúng 15–35 từ.

### 9.4. Các fact bắt buộc

- Sinh ra (age 0).
- Mốc gia nhập tiên lộ nếu xảy ra.
- Đột phá cảnh giới lớn.
- Biến cố đổi hẳn vận mệnh (tổn thọ, đại cơ duyên, trọng thương...).
- Kết cục chết hoặc phi thăng.

Tránh duplicate: nếu kết cục đã kể việc đột phá thất bại gây chết, không ghi hai dòng cùng tuổi diễn đạt cùng một việc.

### 9.5. Ví dụ output

```json
{
  "age": 35,
  "eventId": "breakthrough_foundation_success",
  "text": "Sau nhiều năm tích lũy tu vi và hai lần thất bại, ngươi cuối cùng cũng đột phá Trúc Cơ, thọ nguyên tăng mạnh."
}
```

Nếu chi tiết “hai lần thất bại” không được state/fact chứng thực, renderer phải dùng biến thể khác không nhắc con số đó.

---

## 10. Thuật toán tạo một kiếp

```js
// API cũ (v1.0) chỉ giữ để tham khảo lịch sử.
// v1.2 dùng startLife(), chooseOption(), autoComplete() tại Mục 17.
```

**Đoạn mã trên là baseline v1.0 đã được thay thế bởi API pause/resume ở Mục 17.** UI commit session/profile khi bắt đầu kiếp thành công; các lựa chọn chỉ cập nhật run đang diễn ra, không thay pity.

---

## 11. Cân bằng xác suất

### 11.1. Các câu hỏi cần trả lời bằng dữ liệu

- Bao nhiêu % kiếp kết thúc ở Phàm nhân, Luyện Khí, Trúc Cơ, Kim Đan...?
- Profile tốt xuất hiện bao nhiêu lần/100 kiếp khi có pity?
- Tỷ lệ chết trẻ (ví dụ trước 30 tuổi) là bao nhiêu?
- Tuổi thọ trung vị và p95 theo cảnh giới?
- Có kiếp profile tốt nhưng kết cục tệ và profile thường nhưng thành tựu cao không?
- Tần suất các nhóm sự kiện có bị lệch?
- Timeline có bao nhiêu dòng, độ dài và độ trùng lặp ra sao?

### 11.2. Monte Carlo

Chạy 10.000–100.000 kiếp bằng seed, không render UI. Báo cáo histogram cảnh giới, nguyên nhân tử vong, profile, số mốc và pity.

**Không đặt trước một tỷ lệ “đúng” tuyệt đối**. Điều chỉnh theo cảm giác thiết kế: phần lớn bình thường, thỉnh thoảng gặp kỳ tài, rất hiếm có đại năng; nhưng không được đến mức nhiều chục lượt chỉ thấy vài kết quả y hệt.

### 11.3. Các bất biến (invariants)

- `age >= 0`; `ageAtEnd >= max(timeline.age)`.
- Tuổi trong timeline không giảm.
- Không có fact sau tử vong.
- Realm tiến triển theo đồ thị cảnh giới.
- Mọi dòng timeline đạt 15–35 từ.
- Mỗi kiếp có đúng một kết cục.
- `pityCount` không âm và reset nếu `isGoodProfile`.
- `world` được tạo mới ở mỗi lần bấm.
- Không có trạng thái tồn tại qua refresh.

---

## 12. Chiến lược nội dung

### 12.1. Mục tiêu quy mô

| Giai đoạn | Event gốc | Variant/event |
|---|---:|---:|
| Prototype | 30–50 | 1–2 |
| MVP | 100–150 | 2–3 |
| Content v1 | 250–300 | 2–4 |

Không cần 300 event ngay để code được. Ưu tiên **độ phủ theo cảnh giới** và sự khác biệt của kết cục.

### 12.2. Ma trận phủ nội dung

Mỗi nhóm cảnh giới cần có tối thiểu:
- cơ duyên tốt;
- biến cố xấu;
- tiến triển tu luyện;
- bình cảnh/thất bại;
- mốc kết cục phù hợp.

Phàm nhân và Luyện Khí phải đủ nội dung vì xuất hiện thường xuyên. Các cảnh giới cao có ít sự kiện hơn nhưng cần đặc sắc và không lặp quá nhiều.

### 12.3. Công cụ kiểm định data

Viết script CI kiểm tra:
- ID không trùng.
- Trọng số hợp lệ.
- Realm tồn tại.
- `effectId` có handler.
- Không có variant rỗng hoặc vượt 15–35 từ.
- Không có event không bao giờ đủ điều kiện.
- Không có event gây state bất hợp lệ.

---

## 13. Kiểm thử

### 13.1. Unit tests

1. Pity=0 dùng tỷ lệ nền; pity cao chạm trần.
2. Sinh profile tốt reset pity bất kể tuổi thọ.
3. Sinh profile kém tăng pity đúng 1.
4. Event không đủ cảnh giới không bao giờ được chọn.
5. Cooldown/maxOccurrences được tôn trọng.
6. Tử vong kết thúc mô phỏng ngay.
7. Renderer không bịa con số hoặc bối cảnh chưa có trong fact.
8. Validator bắt dòng <15 hoặc >35 từ.
9. Seed giống nhau tạo kết quả giống nhau.
10. Lỗi tạo kiếp không thay đổi session state.

### 13.2. Property-based / Monte Carlo tests

- Sinh hàng chục nghìn kiếp không crash.
- Không gặp tuổi âm, NaN, vòng lặp vô hạn.
- Không gặp cảnh giới trái thứ tự.
- Không có dòng nhật ký trùng lặp quá mức.
- Kết quả đa dạng giữa các seed.
- Distribution và pity nằm trong khoảng dung sai đã định nghĩa sau tuning.

### 13.3. UI tests

- Nút Luân Hồi hoạt động.
- Một click hiển thị trọn hồ sơ/timeline/kết cục.
- Click tiếp tạo kiếp mới.
- Refresh reset runCount và pity.
- Mobile không tràn ngang; timeline dễ đọc.

---

## 14. Quyết định kỹ thuật và chống scope creep

**Không làm trong v1:**
- AI tạo truyện thời gian thực.
- NPC entity/identity, quan hệ đa nhân vật, sự kiện báo ân nhiều đời.
- Story Arc hoặc hệ thống quest.
- Choice Life như một mode riêng, chiến đấu tương tác; Choice Events tích hợp trong simulation.
- Chạy mô phỏng từng năm trên màn hình; engine vẫn tiến thời gian nội bộ.
- Save/load, database, localStorage, tài khoản, leaderboard.
- Metagame tiến trình xuyên phiên.

**Có thể cân nhắc sau v1 nhưng không phải cam kết:** nút copy/chia sẻ kết quả, nhiều ngôn ngữ, thêm cảnh giới, chủ đề giao diện, chế độ xem thống kê trong phiên.

---

## 15. Checklist triển khai

- [ ] Data `realms`, `roots`, `physiques`, `origins` và bảng weight.
- [ ] PRNG seedable, weightedPick.
- [ ] Profile Generator + score + good threshold.
- [ ] World Generator với modifier độc lập.
- [ ] Simulation Engine + tuổi thọ + đột phá + death/ascension.
- [ ] Event Selector + Resolver + cooldown.
- [ ] Narrative Renderer + word count validator.
- [ ] Profile Pity + commit state atomic.
- [ ] UI một nút, hiện kết quả ngay.
- [ ] Monte Carlo runner + báo cáo phân phối.
- [ ] Unit/property/UI tests.
- [ ] Responsive và static deployment.

---

## 16. Các thông số còn phải tuning

Đây **không phải câu hỏi gameplay còn bỏ ngỏ**, mà là cấu hình cần thử nghiệm:

1. Phân phối linh căn/thể chất và `profileScore` threshold.
2. `pGood` nền, mức tăng/trần pity.
3. Các hệ số world, giới hạn và tương quan.
4. Bảng cảnh giới, thọ nguyên, tiến độ, xác suất đột phá.
5. Hazard/tử vong theo giai đoạn.
6. Tần suất và trọng số các event.
7. Số mốc và chất lượng câu văn sau nhiều lần chơi.

**Tiêu chí hoàn thành:** Một click bắt đầu một đời tu tiên có logic, tự chạy đến ngã rẽ hoặc kết cục, đa dạng, timeline 15–35 từ/mốc, thế giới random, pity đúng luật và không cần bất kỳ lưu trữ bền vững nào.


---

## 17. CẬP NHẬT v1.1 — State Machine cho lựa chọn

**Mục này thay thế API `generateLife()` toàn bộ trong Mục 10 và các mô tả “không có lựa chọn” ở bản v1.0.**

### 17.1. Trạng thái vòng chơi

```js
// RunPhase: 'idle' | 'running' | 'awaiting_choice' | 'finished'
// ActiveRun: {phase, profile, world, state, facts,
//   pendingChoice?, result?, rngState}
// PendingChoice: {eventId, age, prompt, options: [{id,text,outcomes}]}
// WeightedOutcome: {id, weight, text, effects}
// Xem JSDoc tại Mục 2.
```

### 17.2. API mới

```js
export function startLife(session, rng) { /* {run, nextSession} */ }
export function chooseOption(run, optionId) { /* ActiveRun */ }
export function autoComplete(run) { /* finished ActiveRun */ }
```

- `startLife`: sinh profile và world, commit `pityCount` **đúng một lần** khi khởi tạo thành công, rồi chạy đến Choice Event đầu tiên hoặc kết cục.
- `chooseOption`: xác thực `phase=awaiting_choice`, `optionId` hợp lệ, roll **một outcome** theo weight, áp hiệu ứng, thêm fact, tiếp tục chạy. Không cập nhật pity.
- `autoComplete`: tự chọn option theo chính sách định sẵn (ví dụ weighted/random hợp lệ), xử lý outcomes như bình thường, tiếp tục qua mọi lựa chọn đến kết cục. Không “auto thắng”.
- Giới hạn `MAX_ITERATIONS`, `MAX_CHOICES_PER_LIFE` (safety cap, không quota gameplay) để tránh JSON lỗi gây lặp vô hạn.
- Nếu lỗi trong lúc bắt đầu, không commit phiên; nếu lỗi sau khi đã tạo profile, báo lỗi kiếp đang dở và không tăng pity lần hai.

### 17.3. Timeline tại mốc lựa chọn

UI hiển thị **toàn bộ các mốc đã xảy ra**, không chờ hiệu ứng; thêm thẻ prompt và 2–3 phương án. Không hiển thị tương lai hay kết cục chưa được tính. Sau khi người chơi chọn, outcome được ghi thành một mốc ngắn 15–35 từ và engine tiếp tục. Khi kết thúc, UI hiển thị trọn timeline và summary.

### 17.4. Ràng buộc gameplay

- Không bắt chọn tại mọi mốc; chỉ những bước ngoặt lớn.
- Mục tiêu tuning ban đầu: khoảng 2–5 lựa chọn trong một kiếp thông thường; kiếp sống lâu có thể nhiều hơn.
- Mỗi lựa chọn thường có 2–3 phương án, mỗi phương án có thể có nhiều outcome.
- `option` là hành động; `outcome` mới là kết quả ngẫu nhiên.
- Xác suất outcome có thể điều chỉnh theo `luck`, `realm`, `comprehension`, `world.danger` qua modifier **được định nghĩa trong engine**, không để code tùy ý trong JSON.
- Một lựa chọn rủi ro cao không bắt buộc dẫn đến kết quả tốt, kể cả profile rất mạnh.

---

## 18. CẬP NHẬT v1.1 — JSON Event Content Contract

### 18.1. Thư mục nội dung

```text
src/data/events/
  birth.json
  cultivation.json
  opportunities.json
  disasters.json
  life.json
  endings.json
```

### 18.2. Ví dụ sự kiện có lựa chọn

```json
{
  "id": "ancient_cave_001",
  "category": "opportunity",
  "minAge": 16,
  "allowedRealms": ["qi_refining", "foundation", "golden_core"],
  "weight": 10,
  "cooldownYears": 100,
  "maxOccurrencesPerLife": 1,
  "importance": "major",
  "text": "Trong chuyến lịch luyện nơi núi sâu, ngươi phát hiện một động phủ cổ xưa bị phong ấn, bên trong tỏa ra linh khí mạnh mẽ cùng sát cơ khó lường.",
  "choices": [
    {
      "id": "enter",
      "text": "Phá phong ấn, tiến vào động phủ",
      "outcomes": [
        {
          "id": "inheritance",
          "weight": 30,
          "text": "Ngươi vượt qua cấm chế và tìm được một phần truyền thừa cổ xưa, nhờ đó tu vi tăng mạnh, mở ra hy vọng đột phá cảnh giới tiếp theo.",
          "effects": { "cultivation": 30 }
        },
        {
          "id": "injury",
          "weight": 50,
          "text": "Trận pháp bất ngờ kích hoạt, đánh ngươi trọng thương và buộc phải tháo chạy khỏi động phủ, cơ duyên trước mắt cuối cùng hóa thành tai họa.",
          "effects": { "health": -40 }
        },
        {
          "id": "death",
          "weight": 20,
          "text": "Cấm chế trong động phủ bộc phát uy lực kinh người, thân thể ngươi tan biến trước khi kịp phản ứng, tiên lộ từ đây hoàn toàn đoạn tuyệt.",
          "effects": { "death": true }
        }
      ]
    },
    {
      "id": "leave",
      "text": "Rời đi, không mạo hiểm",
      "outcomes": [
        {
          "id": "safe",
          "weight": 100,
          "text": "Ngươi kiềm chế lòng tham và rời khỏi động phủ, bảo toàn tính mạng trước sát cơ khó lường, dù cơ hội nhận được truyền thừa đã trôi qua.",
          "effects": {}
        }
      ]
    }
  ]
}
```

**Quy tắc:** `choices` là trường tùy chọn; event không có `choices` được xử lý tự động. `text` và `outcomes[].text` phải đạt 15–35 từ theo quy ước khoảng trắng. Tên phương án là nhãn nút ngắn, không chịu giới hạn 15–35 từ.

### 18.3. Điều kiện và hiệu ứng hỗ trợ

**Điều kiện chuẩn:** tuổi, cảnh giới, sức khỏe, tài nguyên, linh căn, ngộ tính, khí vận, trạng thái tông môn/đạo lữ, cooldown và số lần xuất hiện.

**Hiệu ứng chuẩn:** cộng/trừ `cultivation`, `health`, `resources`, `lifespan`, các cờ trạng thái đơn giản, `death` và kết cục đặc biệt thông qua handler được kiểm soát. Không cho JSON tự đặt cảnh giới vượt cấp hoặc sửa tùy ý mọi field của state.

`outcomes[].weight` là trọng số tương đối, không nhất thiết tổng 100; engine chuẩn hóa khi roll. Trọng số âm/NaN/tổng 0 bị từ chối.

### 18.4. Content Validator

Tại build/test, kiểm tra:

1. JSON đúng schema, ID duy nhất toàn kho.
2. `category`, `realm`, điều kiện và effect key hợp lệ.
3. Mọi choice có 2–3 options; mỗi option có >=1 outcome.
4. `weight` hữu hạn và không âm, mỗi tập roll có tổng >0.
5. `text` và mọi outcome text đạt 15–35 từ; option label không rỗng.
6. Không có event không thể kích hoạt, cooldown vô lý hoặc outcome thiếu kết cục khi `death=true`.
7. Không có chuỗi tham chiếu NPC cụ thể hoặc điều kiện dựa vào Story Memory.
8. Thử chạy Monte Carlo với bộ content mới để tìm lỗi logic và vòng lặp.

### 18.5. Khả năng mở rộng

**Thêm hàng trăm/hàng nghìn sự kiện chủ yếu bằng cách thêm JSON** nếu chỉ dùng bộ điều kiện/hiệu ứng đã hỗ trợ. Khi cần cơ chế hoàn toàn mới (ví dụ luyện đan nhiều nguyên liệu, đấu pháp tương tác), mới phải thêm handler JavaScript và test.

Không thêm script thực thi vào JSON, không dùng `eval`, không dùng AI runtime.

---

## 19. Kiểm thử bổ sung v1.1

- [ ] Event tự động không làm engine pause.
- [ ] Choice Event dừng đúng một lần và có 2–3 option hợp lệ.
- [ ] Không thể chọn `optionId` không thuộc pending choice.
- [ ] Một lựa chọn chỉ roll đúng một outcome, áp effect đúng một lần.
- [ ] Outcome tử vong kết thúc ngay, không còn event về sau.
- [ ] `autoComplete` luôn xử lý outcome theo xác suất, không bảo đảm kết quả tốt.
- [ ] Pity không tăng thêm ở mỗi lựa chọn.
- [ ] Refresh giữa kiếp xóa cả active run và pity.
- [ ] Không lộ tương lai trước khi chọn; khi kết thúc hiện đủ timeline.
- [ ] Thêm event JSON hợp lệ không cần sửa simulation core.
- [ ] Validator bắt JSON lỗi, text ngoài 15–35 từ, weight sai, handler không tồn tại.


---

## 19. CẬP NHẬT v1.2 — JavaScript, thương hiệu và Firebase

**Tên chính thức:** **Myriad Lives** (tiếng Việt **Vạn Kiếp**). Repo đề xuất: `myriad-lives`; Firebase project ID phụ thuộc tình trạng còn trống.

**Stack chốt:** React + **JavaScript ES Modules** (`.js`, `.jsx`) + Vite, **không dùng TypeScript**. Dùng JSDoc và validation runtime cho JSON, đặc biệt là `choices`, `outcomes`, `effects`, weights, conditions, cooldown và 15–35 từ/mốc.

**API authoritative (thay `generateLife()` v1.0):**

```js
// engine/lifeRunner.js
export function startLife(session, rng) {
  // Roll profile theo pity; random world; mô phỏng đến choice đầu/ending.
  // Trả { run, nextSession }; commit pity đúng một lần khi thành công.
}
export function chooseOption(run, optionId) {
  // Kiểm tra pending choice, roll outcome theo weight, áp effects, chạy tiếp.
}
export function autoComplete(run) {
  // Tự chọn các ngã rẽ còn lại, chạy đến finished, không bảo đảm thắng.
}
```

**Cấu trúc source ưu tiên:**

```text
myriad-lives/
  public/assets/
  src/
    components/            # .jsx
    engine/                # .js: rng, profile, world, simulation, runner, resolver, pity
    data/events/           # .json: birth, cultivation, opportunities, disasters, life, endings
    App.jsx
    main.jsx
  package.json
  vite.config.js
  firebase.json
```

**Firebase Hosting:** build `npm run build` tạo `dist/`; cấu hình `firebase.json` tối thiểu:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  }
}
```

Sau khi liên kết đúng Firebase project: `npm run build && firebase deploy --only hosting`. Không cần Firestore, Auth, Functions, backend hay lưu tiến trình; refresh reset pity và run.

**Changelog:** v1.0 Auto Life → v1.1 Choice Events + JSON → **v1.2 Myriad Lives + React/JavaScript + Firebase Hosting**.
