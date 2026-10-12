import {useEffect, useState} from 'react';
import {startLife, chooseOption, autoComplete} from './engine/lifeRunner.js';
import {realms} from './data/realms.js';
import {languages, translate, translateName} from './i18n/index.js';
import CultivationGuide from './components/CultivationGuide.jsx';
function Mountains(){return <svg className="mountains" viewBox="0 0 1400 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="mist" x2="0" y2="1"><stop stopColor="#82988a" stopOpacity=".2"/><stop offset="1" stopColor="#e9ede4" stopOpacity=".1"/></linearGradient></defs><circle cx="1040" cy="130" r="68" fill="#c4ac76" opacity=".18"/><path d="M0 530 120 340 210 390 340 160 420 260 510 210 650 440 770 350 900 160 960 220 1050 70 1160 290 1260 230 1400 460V620H0Z" fill="url(#mist)"/><path d="m0 580 200-170 140 80 190-180 150 140 100-80 170 110 170-230 120 140 160-70v300H0Z" fill="#6e897b" opacity=".10"/><path d="m0 610 250-120 170 65 200-80 200 95 240-120 340 110v60H0Z" fill="#466857" opacity=".08"/><path d="m1035 510 8-125 6 125m-4-100-25-22m25 5 20-20" stroke="#526e5d" strokeWidth="3" opacity=".3"/></svg>}

export default function App() {
  const [language,setLanguage]=useState('vi');
  const [session,setSession]=useState({runCount:0,pityCount:0});
  const [run,setRun]=useState(null);
  const [error,setError]=useState(false);
  const [guide,setGuide]=useState(false);
  const finished=run?.phase==='finished';
  const t=value=>translate(value,language);
  useEffect(()=>{document.documentElement.lang=language==='zh'?'zh-CN':language;document.title=language==='zh'?'万劫 · Myriad Lives':language==='en'?'Myriad Lives · A cultivation journey':'Vạn Kiếp · Myriad Lives';},[language]);
  function act(fn){try{setError(false);fn();}catch(e){console.error(e);setError(true);}}
  function reincarnate(){act(()=>{const result=startLife(session);setSession(result.nextSession);setRun(result.run);});}
  return <div className={'site lang-'+language}>
    <header className="header">
      <a className="brand" href="#"><span className="brand-mark">萬</span><span>MYRIAD LIVES<small>{t('VẠN KIẾP')}</small></span></a>
      <div className="header-right">
        <span className="session"><i/>{session.runCount===0?t('Tiên lộ chưa mở'):session.runCount+t(' kiếp đã trải')}</span>
        <div className="language-picker" role="group" aria-label={t('Ngôn ngữ')}>
          {languages.map(item=><button key={item.id} lang={item.id} aria-pressed={language===item.id} onClick={()=>setLanguage(item.id)}>{item.label}</button>)}
        </div>
        <button className="text-button" onClick={()=>setGuide(!guide)} aria-expanded={guide}>{t('Cách chơi')} <span>↗</span></button>
      </div>
    </header>
    <CultivationGuide t={t} run={run}/>
    {guide&&<aside className="guide"><b>{t('Một đời, một số mệnh.')}</b>{t('Bấm Luân hồi để sinh nhân vật. Đọc những mốc đã xảy ra, chọn hành động khi gặp ngã rẽ, hoặc để số mệnh tự quyết bằng Tự động hoàn tất. Lựa chọn có rủi ro; tư chất tốt không bảo đảm kết cục tốt. Tải lại trang sẽ bắt đầu một phiên mới.')}<button onClick={()=>setGuide(false)} aria-label={t('Đóng hướng dẫn')}>×</button></aside>}
    <main>
      <section className={'hero '+(run?'compact':'')}>
        <Mountains/>
        <div className="hero-content">
          <p className="eyebrow"><span/>{t('MỘT LẦN LUÂN HỒI, MỘT ĐỜI TIÊN LỘ')}<span/></p>
          <h1>{t('Vạn')} <em>{t('Kiếp')}</em><span className="seal">輪<br/>迴</span></h1>
          <p className="hero-copy">{t('Giữa vạn giới mênh mang, một sinh mệnh thức giấc.')}<br/>{t('Phàm nhân hay tiên nhân — số mệnh nào đang đợi ngươi?')}</p>
          {!run&&<button className="primary" onClick={reincarnate}><span>⟳</span>{t('Luân hồi')}<span>→</span></button>}
          <p className="hero-note">{t(run?'Mỗi lựa chọn, một nét mực trên cuốn đời.':'Không có hai cuộc đời giống nhau.')}</p>
        </div>
        <div className="vertical-poem">{t('NHẤT NIỆM KHỞI · VẠN KIẾP SINH')}</div>
      </section>
      {error&&<div role="alert" className="error">{t('Tiên cơ tạm gián đoạn.')}<button onClick={reincarnate}>{t('Thử một kiếp mới')}</button></div>}
      {!run?<section className="intro-grid">
        {[
          ['壹','Gieo một số mệnh','Linh căn, thể chất, xuất thân.','Mỗi kiếp là một khởi đầu mới.'],
          ['貳','Đi qua tiên lộ','Gặp cơ duyên, đối diện hiểm họa.','Chọn lối đi ở những ngã rẽ.'],
          ['叁','Đọc một cuộc đời','Từ tiếng khóc đầu đến phút cuối.','Một đời ngắn ngủi, một chuyện dài.'],
        ].map(([mark,title,line1,line2])=><article key={mark}><span>{mark}</span><div><h2>{t(title)}</h2><p>{t(line1)}<br/>{t(line2)}</p></div></article>)}
      </section>:<section className="game">
        <div className="section-heading"><p className="eyebrow">{t('THIÊN MỆNH QUYỂN · KIẾP')} {String(run.number).padStart(3,'0')}</p><span className="world">◈ {t(run.world.descriptor)}</span></div>
        <div className="game-grid">
          <aside className="profile">
            <div className="profile-top"><span className="profile-icon">命</span><p>{t('SỐ MỆNH KIẾP NÀY')}</p><h2>{translateName(run.profile.name,language)}</h2><span className="realm-tag">{t(realms[run.state.realm].name)}</span>{run.profile.isGoodProfile&&<span className="gifted">✦ {t('Tiên tư xuất chúng')}</span>}</div>
            <dl>{[
              ['Xuất thân',run.profile.origin.name],['Linh căn',run.profile.root.name],['Thể chất',run.profile.physique.name],
              ['Tông môn',run.state.sectStatus==='member'?'Đệ tử tông môn':run.state.sectStatus==='resident'?'Sinh sống trong tông môn':'Chưa gia nhập'],
              ['Đạo lữ',run.state.partnerStatus==='bonded'?'Đã kết duyên':'Độc hành'],
            ].map(([label,value])=><div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl>
            <div className="stats">{[['Tư chất',run.profile.talent],['Ngộ tính',run.profile.comprehension],['Khí vận',run.profile.luck]].map(([label,value])=><div key={label}><div><span>{t(label)}</span><b>{value}<small> / 100</small></b></div><div className="bar"><span style={{width:value+'%'}}/></div></div>)}</div>
            <div className="age"><span>{t(finished?'Hưởng thọ':'Tuổi hiện tại')}</span><strong>{run.state.age}<small> {t('tuổi')}</small></strong></div>
            <p className="profile-foot">{t(finished?'Một số mệnh đã thành chuyện cũ.':'Tiên lộ còn chưa ngã ngũ.')}</p>
          </aside>
          <div className="story">
            <div className="story-heading"><h2>{t('Nhân sinh ký sự')}</h2><span>{run.facts.length} {t('mốc cuộc đời')}</span></div>
            <div className="timeline">{run.facts.map(f=><article className={'entry '+f.category} key={f.id}><div className="time"><b>{f.age}</b><small>{t('tuổi')}</small></div><div className="entry-content"><span className="dot"/><h3>{t(f.title)}</h3><p>{t(f.text)}</p></div></article>)}</div>
            {run.pendingChoice&&<section className="choice-card" aria-live="polite">
              <p className="eyebrow">✦ {t('NGÃ RẼ SỐ MỆNH')} · {run.state.age} {t('tuổi')}</p>
              <h2>{t(run.pendingChoice.title)}</h2><p>{t(run.pendingChoice.prompt)}</p>
              <div className="options">{run.pendingChoice.options.map((o,i)=><button key={o.id} onClick={()=>act(()=>setRun(chooseOption(run,o.id)))}><span className="option-number">0{i+1}</span><span><b>{t(o.text)}</b><small>{t(o.hint)}</small></span><span>→</span></button>)}</div>
              <button className="auto" onClick={()=>act(()=>setRun(autoComplete(run)))}>{t('Để số mệnh tự quyết')} <span>↗</span><small>{t('Tự động hoàn tất')}</small></button>
            </section>}
            {finished&&<section className="ending-card" aria-live="polite">
              <span className="ending-symbol">{run.result.endingType==='ascension'?'仙':'終'}</span><p className="eyebrow">{t('KẾT CỤC KIẾP NÀY')}</p><h2>{t(run.result.endingReason)}</h2>
              <p>{t('Cảnh giới cao nhất')}: <b>{t(realms[run.result.highestRealm].name)}</b> · {run.state.age} {t('tuổi')}</p>
              <p className="ending-quote">{t('“Một kiếp khép lại. Vạn kiếp vẫn còn phía trước.”')}</p><button className="primary" onClick={reincarnate}>⟳ {t('Luân hồi lần nữa')} <span>→</span></button>
            </section>}
          </div>
        </div>
      </section>}
    </main>
    <footer><span>MYRIAD LIVES <i> / </i>{t('VẠN KIẾP')}</span><p>{t('Vạn giới rộng lớn. Tiên lộ vô cùng.')}</p><span>{t('Một phiên, vạn số mệnh.')}</span></footer>
  </div>;
}
