import {worldPlanes,worldPlaneName} from '../data/worlds.js';
import {genderName} from '../data/genders.js';
import {useEffect,useState} from 'react';
import {roots,physiques,origins} from '../data/realms.js';
import {translateName} from '../i18n/index.js';

// Decorative cycling never consumes the life simulation's RNG.
export default function BirthReveal({run,t,language,onEnter}){
  const [elapsed,setElapsed]=useState(0);
  const [reducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{
    let frame,last=performance.now(),total=0;
    const tick=now=>{
      if(!document.hidden)total+=Math.min(now-last,100);
      last=now;setElapsed(total);
      if(total<5200)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[]);
  const rows=[
    ['Giới diện',worldPlaneName(run.world),worldPlanes.map(plane=>plane.name),'界'],
    ['Giới tính',genderName(run.profile),['Nam','Nữ'],'命'],
    ['Xuất thân',run.profile.origin.name,origins.map(x=>x.name),'生'],
    ['Linh căn',run.profile.root.name,roots.map(x=>x.name),'根'],
    ['Thể chất',run.profile.physique.name,physiques.map(x=>x.name),'體'],
    ['Tư chất',run.profile.talent,Array.from({length:11},(_,i)=>i*9+5),'才'],
    ['Khí vận',run.profile.luck,Array.from({length:11},(_,i)=>i*9+5),'運'],
  ];
  const complete=elapsed>=5200;
  return <section className="birth-reveal">
    <div className="birth-orbit" aria-hidden="true"><span>命</span></div>
    <p className="eyebrow">{t('THIÊN MỆNH QUYỂN · KIẾP')} {String(run.number).padStart(3,'0')}</p>
    <h1>{t('Thiên mệnh sơ khai')}</h1>
    <p className="birth-copy">{t('Vạn duyên luân chuyển, một kiếp sắp thành.')}</p>
    <div className="birth-board" aria-busy={!complete}>
      {rows.map(([label,value,pool,glyph],index)=>{
        const settled=elapsed>=1300+index*550;
        const display=settled?value:reducedMotion?'…':pool[(Math.floor(elapsed/85)+index*7)%pool.length];
        return <div key={label} className={'birth-row '+(settled?'settled':'rolling')}>
          <span className="birth-glyph" aria-hidden="true">{glyph}</span><span className="birth-label">{t(label)}</span>
          <strong aria-hidden={!settled}>{typeof display==='number'?<>{display}<small> / 100</small></>:t(display)}</strong>
          <span className="birth-mark" aria-hidden="true">{settled?'✦':'·'}</span>
        </div>;
      })}
    </div>
    <div className="birth-result" aria-live="polite">{complete?<><p>{t('Một sinh mệnh mới')}</p><h2>{translateName(run.profile.name,language)}</h2></>:<p>{t('Đang dệt số mệnh…')}</p>}</div>
    {complete&&<button className="primary birth-enter" onClick={onEnter}>{t('Bước vào tiên lộ')}</button>}
  </section>;
}
