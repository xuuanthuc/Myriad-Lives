import ArrowIcon from './ArrowIcon.jsx';
import {roots,physiques,realms} from '../data/realms.js';

export default function HomePage({t,mountains,onOpenGuide,onlineCount}) {
  return <>
    <section className="hero">
      {mountains}
      <div className="hero-content">
        <p className="eyebrow"><span/>{t('MỘT LẦN LUÂN HỒI, MỘT ĐỜI TIÊN LỘ')}<span/></p>
        <h1>{t('Vạn')} <em>{t('Kiếp')}</em><span className="seal">輪<br/>迴</span></h1>
        <p className="hero-copy">{t('Giữa vạn giới mênh mang, một sinh mệnh thức giấc.')}<br/>{t('Phàm nhân hay tiên nhân — số mệnh nào đang đợi ngươi?')}</p>
        <a className="primary home-cultivation-button" href="#/cultivation">{t('Tu tiên')}</a>
        <p className="hero-note">{t('Không có hai cuộc đời giống nhau.')}</p>
      </div>
      <div className="vertical-poem">{t('NHẤT NIỆM KHỞI · VẠN KIẾP SINH')}</div>
    </section>
    <section className="intro-grid">
      {[
        ['壹','Gieo một số mệnh','Luân hồi định linh căn, thể chất và nơi xuất thế.','Một tiếng khóc chào đời, một cuốn thiên mệnh mở ra.'],
        ['貳','Đi qua tiên lộ','Cơ duyên và kiếp nạn cùng chờ trên đường cầu đạo.','Đến ngã rẽ, tự chọn; chạm bình cảnh, thử đột phá.'],
        ['叁','Đọc một cuộc đời','Từ tiếng khóc đầu đến phút cuối.','Một đời ngắn ngủi, một chuyện dài.'],
      ].map(([mark,title,line1,line2])=><article key={mark}><span>{mark}</span><div><h2>{t(title)}</h2><p>{t(line1)}<br/>{t(line2)}</p></div></article>)}
    </section>
    <section className="home-world" aria-labelledby="home-world-heading">
      <div className="home-world-art" aria-hidden="true">
        <img src={`${import.meta.env.BASE_URL}assets/images/immortal-path.jpg`} width="1536" height="1024" loading="lazy" decoding="async" alt=""/>
      </div>
      <div className="home-world-copy">
        <p className="eyebrow">{t('VẠN GIỚI · VẠN DUYÊN')}</p>
        <h2 id="home-world-heading">{t('Một đời phàm tục, một giấc mộng trường sinh.')}</h2>
        <p>{t('Có người sinh giữa sơn thôn, có người mở mắt dưới mái tông môn. Một lần trắc linh có thể mở ra tiên lộ, cũng có thể để lại cả đời sống giữa nhân gian.')}</p>
        <p>{t('Vạn Kiếp kể hành trình ấy qua từng mốc tuổi: tu luyện, gặp gỡ, lựa chọn và vượt bình cảnh. Không phải ai cũng đến được tiên giới; một đời ngắn ngủi vẫn có câu chuyện của riêng mình.')}</p>
        {onlineCount>0&&<p className="online-cultivators"><i aria-hidden="true"/><strong>{onlineCount}</strong> {t('đạo hữu đang cùng tu luyện')}</p>}
      </div>
    </section>
    <section className="home-codex">
      <p className="eyebrow">{t('CẨM NANG TIÊN LỘ')}</p>
      <h2>{t('Trước khi bước vào tiên lộ')}</h2>
      <p>{t('Hiểu căn cốt, biết cảnh giới, rồi tự viết một đời cầu đạo. Lật cẩm nang để xem từng bậc tu hành và những tiên tư có thể gặp khi luân hồi.')}</p>
      <div className="home-codex-grid">
        {[
          ['Linh căn',roots.length,'Căn cốt dẫn khí, khởi đầu tiên lộ.'],
          ['Thể chất',physiques.length,'Phàm thân hay dị thể, mỗi kiếp một tiên tư.'],
          ['Cảnh giới',realms.length,'Chín tầng Luyện Khí, từng bước vượt đại cảnh giới.'],
        ].map(([name,count,description])=><button key={name} onClick={onOpenGuide}><span className="home-codex-count">{String(count).padStart(2,'0')}</span><h3>{t(name)}</h3><p>{t(description)}</p><span className="home-codex-link">{t('Xem cẩm nang')} <ArrowIcon/></span></button>)}
      </div>
    </section>
    <section className="home-invitation">
      <span className="home-invitation-seal" aria-hidden="true">道</span>
      <p className="eyebrow">{t('TIÊN LỘ ĐANG ĐỢI')}</p>
      <h2>{t('Kiếp này, ngươi sẽ đi được bao xa?')}</h2>
      <p>{t('Đọc chậm một đoạn đời, tự chọn một ngã rẽ. Khi kiếp này khép lại, luân hồi sẽ mở ra một khởi đầu khác.')}</p>
      <a className="primary home-cultivation-button" href="#/cultivation">{t('Tu tiên')}</a>
    </section>
  </>;
}
