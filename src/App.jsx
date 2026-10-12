import HistoryPage from './components/HistoryPage.jsx';
import {summarizeLife,archiveLife,historyWithCompletedLife} from './engine/lifeHistory.js';
import FateCardPreview from './components/FateCardPreview.jsx';
import {prepareFateCard} from './utils/fateCard.js';
import {createActionLock} from './utils/actionLock.js';
import {loadBrowserSave,saveBrowserState} from './engine/browserSave.js';
import HomePage from './components/HomePage.jsx';
import AnimatedNumber from './components/AnimatedNumber.jsx';
import AssetIcon from './components/AssetIcon.jsx';
import ChoiceDialog from './components/ChoiceDialog.jsx';
import {stageName} from './data/subrealms.js';
import {useEffect, useRef, useState} from 'react';
import {startLife, chooseOption, autoUntilBreakthrough} from './engine/lifeRunner.js';
import {realms} from './data/realms.js';
import {languages, translate, translateName} from './i18n/index.js';
import CultivationGuide from './components/CultivationGuide.jsx';
import LifeActivity from './components/LifeActivity.jsx';
import ArrowIcon from './components/ArrowIcon.jsx';
import useLifePlayback from './hooks/useLifePlayback.js';
import {PLAYBACK_SPEEDS} from './engine/playback.js';
function Mountains(){return <svg className="mountains" viewBox="0 0 1400 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="mist" x2="0" y2="1"><stop stopColor="#82988a" stopOpacity=".2"/><stop offset="1" stopColor="#e9ede4" stopOpacity=".1"/></linearGradient></defs><circle cx="1040" cy="130" r="68" fill="#c4ac76" opacity=".18"/><path d="M0 530 120 340 210 390 340 160 420 260 510 210 650 440 770 350 900 160 960 220 1050 70 1160 290 1260 230 1400 460V620H0Z" fill="url(#mist)"/><path d="m0 580 200-170 140 80 190-180 150 140 100-80 170 110 170-230 120 140 160-70v300H0Z" fill="#6e897b" opacity=".10"/><path d="m0 610 250-120 170 65 200-80 200 95 240-120 340 110v60H0Z" fill="#466857" opacity=".08"/><path d="m1035 510 8-125 6 125m-4-100-25-22m25 5 20-20" stroke="#526e5d" strokeWidth="3" opacity=".3"/></svg>}

export default function App() {
  const [restored]=useState(loadBrowserSave);
  const [language,setLanguage]=useState(restored?.language||'vi');
  const [theme,setTheme]=useState(()=>{
    try{const saved=localStorage.getItem('myriad-lives-theme');if(saved==='light'||saved==='dark')return saved;}catch{}
    return window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  });
  useEffect(()=>{
    document.documentElement.dataset.theme=theme;
    try{localStorage.setItem('myriad-lives-theme',theme);}catch{}
  },[theme]);
  const [page,setPage]=useState(()=>window.location.hash==='#/cultivation'?'game':window.location.hash==='#/history'?'history':'home');
  const [codexOpen,setCodexOpen]=useState(false);
  useEffect(()=>{const navigate=()=>{setPage(window.location.hash==='#/cultivation'?'game':window.location.hash==='#/history'?'history':'home');setCodexOpen(false);window.scrollTo({top:0,behavior:'instant'});};window.addEventListener('hashchange',navigate);return ()=>window.removeEventListener('hashchange',navigate);},[]);
  const [session,setSession]=useState(()=>restored?.session||{runCount:0,pityCount:0});
  const [engineRun,setEngineRun]=useState(()=>restored?.engineRun||null);
  const [history,setHistory]=useState(()=>restored?.history||[]);
  const [speed,setSpeed]=useState(restored?.speed||1);
  const [paused,setPaused]=useState(restored?.paused||false);
  const {run,playing,progress,getPlayback}=useLifePlayback(engineRun,speed,paused||page!=='game',restored?.playback);
  const finished=run?.phase==='finished';
  const visibleHistory=historyWithCompletedLife(history,run);
  const saveState=useRef(null);
  saveState.current={engineRun,session,language,speed,paused,history:visibleHistory};
  useEffect(()=>{
    const save=()=>saveBrowserState({...saveState.current,playback:getPlayback()});
    save();
    const interval=setInterval(save,1000);
    window.addEventListener('pagehide',save);
    document.addEventListener('visibilitychange',save);
    return ()=>{clearInterval(interval);window.removeEventListener('pagehide',save);document.removeEventListener('visibilitychange',save);};
  },[engineRun,session,language,speed,paused,history,finished,getPlayback]);
  const actionLock=useRef(false);
  useEffect(()=>{actionLock.current=false;},[engineRun]);
  const [error,setError]=useState(false);
  const firstLifeStarted=useRef(false);
  useEffect(()=>{
    if(page!=='game'||engineRun||firstLifeStarted.current)return;
    firstLifeStarted.current=true;
    try{
      const result=startLife(session);
      setSession(result.nextSession);
      setPaused(false);
      setEngineRun(result.run);
    }catch(e){console.error(e);setError(true);}
  },[page,engineRun,session]);
  const [sharing,setSharing]=useState(false);
  const [sharePreview,setSharePreview]=useState(null);
  const shareLock=useRef(createActionLock());
  const [shareError,setShareError]=useState(false);
  useEffect(()=>setShareError(false),[run?.number]);
  async function shareEnding(){
    if(!finished||!shareLock.current.acquire())return;
    setSharing(true);setShareError(false);
    try{const blob=await prepareFateCard(summarizeLife(run),language);setSharePreview({blob,number:run.number});}catch(e){console.error(e);setShareError(true);shareLock.current.release();}finally{setSharing(false);}
  }
  const t=value=>translate(value,language);
  useEffect(()=>{document.documentElement.lang=language==='zh'?'zh-CN':language;document.title=language==='zh'?'万劫 · Myriad Lives':language==='en'?'Myriad Lives · A cultivation journey':'Vạn Kiếp · Myriad Lives';},[language]);
  function act(fn){try{setError(false);fn();}catch(e){console.error(e);setError(true);}}
  function reincarnate(){if(shareLock.current.isLocked())return;act(()=>{const result=startLife(session);if(run)setHistory(previous=>archiveLife(previous,summarizeLife(run)));setSession(result.nextSession);setPaused(false);setEngineRun(result.run);});}
  function resolveChoice(optionId,automatic=false){if(playing||actionLock.current||engineRun?.phase!=='awaiting_choice')return;actionLock.current=true;act(()=>{setPaused(false);setEngineRun(automatic?autoUntilBreakthrough(engineRun):chooseOption(engineRun,optionId));});}
  const playbackControls=run&&(<section className="playback-controls" aria-label={t('Tốc độ diễn biến')}>
          <div className="playback-toolbar"><span>{t('Tốc độ')}</span>{playing&&<button type="button" className="playback-pause" onClick={()=>setPaused(!paused)}>{t(paused?'Tiếp tục':'Tạm dừng')}</button>}<div className="playback-actions"><div className="speed-buttons" role="group" aria-label={t('Tốc độ diễn biến')}>{PLAYBACK_SPEEDS.map(value=><button type="button" key={value} aria-pressed={speed===value} onClick={()=>setSpeed(value)}>x{value}</button>)}</div><button type="button" className="new-life-shortcut" disabled={sharing||!!sharePreview} onClick={reincarnate} title={t('Bỏ kiếp hiện tại và luân hồi ngay')} aria-label={t('Bỏ kiếp hiện tại và luân hồi ngay')}>⟳ {t('Kiếp mới')}</button></div></div>
          <div className="playback-status"><span>{t(playing?(paused?'Đã tạm dừng':'Tiên lộ đang mở…'):finished?'Một kiếp khép lại':run.pendingChoice?.kind==='breakthrough'?'Đang chờ đột phá':'Đang chờ lựa chọn')}</span><span>{Math.floor(progress)}%</span></div>
          <progress className="playback-progress" max="10000" value={progress*100} aria-valuetext={Math.floor(progress)+'%'} aria-label={t('Tiến độ chặng hiện tại')}/>
        </section>);
  return <div className={'site lang-'+language}>
    {sharePreview&&<FateCardPreview card={sharePreview} t={t} onClose={()=>{setSharePreview(null);shareLock.current.release();}}/>}
    <header className="header">
      <a className="brand" href="#/" aria-label={'Myriad Lives · '+t('Trang chủ')}><img className="brand-logo" src={`${import.meta.env.BASE_URL}assets/images/${theme==='dark'?'myriad-lives-logo-ink-dark.png':'myriad-lives-logo-ink.png'}`} width="2172" height="724" alt="Myriad Lives"/></a>
      <div className="header-right">
        <nav className="page-navigation" aria-label={t('Điều hướng')}>{page!=='home'&&<a href="#/">{t('Trang chủ')}</a>}{page==='history'?<a href="#/cultivation">{t('Tu tiên')}</a>:<a href="#/history">{t('Lịch sử')}</a>}</nav>
        <CultivationGuide t={t} run={run} open={codexOpen} onOpenChange={setCodexOpen} showTrigger={page==='game'}/>
        <span className="session"><i/>{session.runCount===0?t('Tiên lộ chưa mở'):session.runCount+t(' kiếp đã trải')}</span>
        <div className="display-preferences">
        <div className="language-picker" role="group" aria-label={t('Ngôn ngữ')}>
          <AssetIcon file="globe-solid-full.svg"/>
          {languages.map(item=><button key={item.id} lang={item.id} aria-pressed={language===item.id} onClick={()=>setLanguage(item.id)}>{item.label}</button>)}
        </div>
        <button className="theme-toggle" type="button" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-pressed={theme==='dark'} aria-label={t(theme==='dark'?'Chuyển sang giao diện sáng':'Chuyển sang giao diện tối')} title={t(theme==='dark'?'Chuyển sang giao diện sáng':'Chuyển sang giao diện tối')}><AssetIcon file="circle-half-stroke-solid-full.svg"/></button>
        </div>
      </div>
    </header>
    <main>
      {page==='history'?<HistoryPage history={visibleHistory} current={run?summarizeLife(run,finished?'finished':'active'):null} t={t} language={language}/>:page==='home'?<HomePage t={t} mountains={<Mountains/>} onOpenGuide={()=>setCodexOpen(true)}/>:<div className="cultivation-page">
      <div className="cultivation-backdrop" aria-hidden="true"><img src={`${import.meta.env.BASE_URL}assets/images/cultivation-retreat.jpg`} width="1536" height="1024" alt="" decoding="async"/></div>
      <section className={'hero '+(run?'compact':'')}>
        <div className="hero-content">
          <p className="eyebrow"><span/>{t('MỘT LẦN LUÂN HỒI, MỘT ĐỜI TIÊN LỘ')}<span/></p>
          <h1>{t('Vạn')} <em>{t('Kiếp')}</em><span className="seal">輪<br/>迴</span></h1>
          <p className="hero-copy">{t('Giữa vạn giới mênh mang, một sinh mệnh thức giấc.')}<br/>{t('Phàm nhân hay tiên nhân — số mệnh nào đang đợi ngươi?')}</p>
          <p className="hero-note">{t(run?'Mỗi lựa chọn, một nét mực trên cuốn đời.':'Không có hai cuộc đời giống nhau.')}</p>
        </div>
        <div className="vertical-poem">{t('NHẤT NIỆM KHỞI · VẠN KIẾP SINH')}</div>
      </section>
      {error&&<div role="alert" className="error">{t('Tiên cơ tạm gián đoạn.')}<button disabled={sharing||!!sharePreview} onClick={reincarnate}>{t('Thử một kiếp mới')}</button></div>}
      {run&&<section className="game">
        <div className="section-heading"><p className="eyebrow">{t('THIÊN MỆNH QUYỂN · KIẾP')} {String(run.number).padStart(3,'0')}</p><span className="world">◈ {t(run.world.descriptor)}</span></div>

        <div className="game-grid">
          <aside className="profile">
            <div className="profile-top"><span className="profile-icon">命</span><p>{t('SỐ MỆNH KIẾP NÀY')}</p><h2>{translateName(run.profile.name,language)}</h2><span className="realm-tag">{t(realms[run.state.realm].name)}{stageName(run.state)?' · '+t(stageName(run.state)):''}</span>{run.profile.isGoodProfile&&<span className="gifted">✦ {t('Tiên tư xuất chúng')}</span>}</div>
            <dl>{[
              ['Xuất thân',run.profile.origin.name],['Linh căn',run.profile.root.name],['Thể chất',run.profile.physique.name],
              ['Tông môn',run.state.sectStatus==='member'?'Đệ tử tông môn':run.state.sectStatus==='resident'?'Sinh sống trong tông môn':'Chưa gia nhập'],
              ['Đạo lữ',run.state.partnerStatus==='bonded'?'Đã kết duyên':'Độc hành'],
            ].map(([label,value])=><div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl>
            <div className="stats">{[['Tư chất',run.profile.talent],['Ngộ tính',run.profile.comprehension],['Khí vận',run.profile.luck]].map(([label,value])=><div key={label}><div><span>{t(label)}</span><b>{value}<small> / 100</small></b></div><div className="bar"><span style={{width:value+'%'}}/></div></div>)}</div>
            <div className="age"><span>{t(finished?'Hưởng thọ':'Tuổi hiện tại')}</span><strong><AnimatedNumber key={run.number} value={run.state.age} speed={speed}/><small> {t('tuổi')}</small></strong></div>
            <p className="profile-foot">{t(finished?'Một số mệnh đã thành chuyện cũ.':'Tiên lộ còn chưa ngã ngũ.')}</p>
          </aside>
          <div className="story">
            <div className="story-heading"><h2>{t('Nhân sinh ký sự')}</h2><span>{run.facts.length} {t('mốc cuộc đời')}</span></div>
            <LifeActivity key={run.number} run={run} t={t} toolbar={playbackControls}>
            {run.pendingChoice&&<ChoiceDialog key={run.number+'-'+run.pendingChoice.eventId+'-'+run.pendingChoice.age} t={t} breakthrough={run.pendingChoice.kind==='breakthrough'}>
            {run.pendingChoice?.kind==='breakthrough'&&<section className="choice-card breakthrough-card" aria-live="polite">
              <p className="eyebrow">✦ {t('Đang chờ đột phá')} · {run.state.age} {t('tuổi')}</p>
              <h2>{t(realms[run.state.realm].name)} · {t(stageName(run.state))} <ArrowIcon/> {t(run.pendingChoice.targetRealm===null?'Chứng đạo':realms[run.pendingChoice.targetRealm].name)}</h2>
              <p>{t(run.pendingChoice.tribulation||run.pendingChoice.targetRealm===null?run.pendingChoice.prompt:'Tu vi đã viên mãn, chỉ còn một bước vượt qua bình cảnh. Hãy thong thả nhìn lại đoạn tiên lộ vừa qua; khi tâm ý đã định, thử đột phá để biết thiên mệnh. Chừng nào chưa quyết, thời gian vẫn dừng tại đây.')}</p>
              <button className="primary" onClick={()=>resolveChoice('attempt')}>{t(run.pendingChoice.options[0].text)} <ArrowIcon/></button>
            </section>}
            {run.pendingChoice&&run.pendingChoice.kind!=='breakthrough'&&<section className="choice-card" aria-live="polite">
              <p className="eyebrow">✦ {t('NGÃ RẼ SỐ MỆNH')} · {run.state.age} {t('tuổi')}</p>
              <h2>{t(run.pendingChoice.title)}</h2><p>{t(run.pendingChoice.prompt)}</p>
              <div className="options">{run.pendingChoice.options.map((o,i)=><button key={o.id} onClick={()=>resolveChoice(o.id)}><span className="option-number">0{i+1}</span><span><b>{t(o.text)}</b><small>{t(o.hint)}</small></span><ArrowIcon/></button>)}</div>
              <button className="auto" onClick={()=>resolveChoice(null,true)}>{t('Để số mệnh tự quyết')} <ArrowIcon direction="up-right"/><small>{t('Tự động hoàn tất')}</small></button>
            </section>}
            </ChoiceDialog>}
            {finished&&<section className="ending-card" aria-live="polite">
              <span className="ending-symbol">{run.result.endingType==='transcendence'?'仙':'終'}</span><p className="eyebrow">{t('KẾT CỤC KIẾP NÀY')}</p><h2>{t(run.result.endingReason)}</h2>
              <p>{t('Cảnh giới cao nhất')}: <b>{t(realms[run.result.highestRealm].name)}{run.result.highestRealm>0?' · '+t(stageName({realm:run.result.highestRealm,subrealm:run.result.highestSubrealm})):''}</b> · {run.state.age} {t('tuổi')}</p>
              <p className="ending-quote">{t('“Một kiếp khép lại. Vạn kiếp vẫn còn phía trước.”')}</p><div className="ending-actions"><button className="primary" disabled={sharing||!!sharePreview} onClick={reincarnate}>⟳ {t('Luân hồi lần nữa')} <ArrowIcon/></button><button type="button" className="ending-share" disabled={sharing||!!sharePreview} onClick={shareEnding}>{t(sharing?'Đang tạo ảnh…':'Chia sẻ ảnh')}</button></div>
              {shareError&&<p role="alert">{t('Chưa xuất được ảnh. Hãy thử lại.')}</p>}
            </section>}
            </LifeActivity>
          </div>
        </div>
      </section>}
      </div>}
    </main>
    <footer><span>MYRIAD LIVES <i> / </i>{t('VẠN KIẾP')}</span><p>{t('Vạn giới rộng lớn. Tiên lộ vô cùng.')}</p><span>{t('Một phiên, vạn số mệnh.')}</span></footer>
  </div>;
}
