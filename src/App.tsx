import { useState } from 'react'

const fates = [
  'Linh căn ngũ hành bừng tỉnh dưới ánh trăng.',
  'Một tàn quyển cổ thư gọi tên ngươi từ đáy vực.',
  'Kiếm ý vô danh xé mây, mở ra con đường mới.',
  'Một hạt giống tiên liên nảy mầm nơi tâm cảnh.',
]

function App() {
  const [fate, setFate] = useState('Vạn giới rộng lớn — cơ duyên của ngươi đang chờ được chọn.')

  function drawFate() {
    setFate(fates[Math.floor(Math.random() * fates.length)])
  }

  return (
    <main className="page-shell">
      <nav className="nav" aria-label="Điều hướng chính">
        <a className="brand" href="#top">MYRIAD <span>LIVES</span></a>
        <span className="nav-status">Khung dự án · 01</span>
      </nav>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <p className="eyebrow">VẠN GIỚI · VẠN KIẾP · MỘT ĐẠO TÂM</p>
        <h1 id="hero-title">Myriad<br /><em>Lives</em></h1>
        <p className="intro">Một không gian cho những hành trình tu tiên không lặp lại — nơi mỗi lần gieo quẻ là một đời tu hành mới.</p>
        <button type="button" onClick={drawFate}>Gieo cơ duyên <span aria-hidden="true">→</span></button>
        <p className="fate" role="status">{fate}</p>
      </section>

      <section className="pillars" aria-label="Định hướng dự án">
        <article><b>01</b><h2>Random hành trình</h2><p>Mỗi khởi đầu là một mệnh số khác biệt.</p></article>
        <article><b>02</b><h2>Tu tiên nhập vai</h2><p>Từ phàm nhân đến con đường trường sinh.</p></article>
        <article><b>03</b><h2>Vạn giới mở rộng</h2><p>Nền móng sẵn sàng cho tài liệu dự án tiếp theo.</p></article>
      </section>

      <footer>MYRIAD LIVES <span>—</span> PROJECT FOUNDATION</footer>
    </main>
  )
}

export default App
