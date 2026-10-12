import {useRef,useState} from 'react';
import {createActionLock} from '../utils/actionLock.js';
import {realms} from '../data/realms.js';
import {stageName} from '../data/subrealms.js';
import {translateName} from '../i18n/index.js';
import FateCardPreview from './FateCardPreview.jsx';
import {exportFateCard,prepareFateCard} from '../utils/fateCard.js';

export default function HistoryPage({history,current,t,language}){
  const [busy,setBusy]=useState(null),[error,setError]=useState(false);
  const exportLock=useRef(createActionLock());
  const [preview,setPreview]=useState(null);
  const entries=current?[current,...history.filter(item=>item.number!==current.number)]:history;
  async function exportImage(item,share){
    if(!exportLock.current.acquire())return;
    setBusy(item.number);setError(false);
    try{if(share){const blob=await prepareFateCard(item,language);setPreview({blob,number:item.number});}else await exportFateCard(item,language,false);}catch(e){if(e.name!=='AbortError'){console.error(e);setError(true);}}finally{exportLock.current.release();setBusy(null);}
  }
  return <section className="history-page">
    {preview&&<FateCardPreview card={preview} t={t} onClose={()=>setPreview(null)}/>}
    <p className="eyebrow">{t('VẠN KIẾP')}</p><h1>{t('Lịch sử luân hồi')}</h1>
    <p className="history-intro">{t('Một kiếp qua đi, mệnh cách còn lưu. Giữ lại tấm thẻ để kể câu chuyện của ngươi.')}</p>
    {error&&<p role="alert">{t('Chưa xuất được ảnh. Hãy thử lại.')}</p>}
    {!entries.length?<div className="history-empty"><p>{t('Chưa có kiếp nào được ghi lại.')}</p><a className="primary" href="#/cultivation">{t('Tu tiên')}</a></div>:<div className="history-grid">
      {entries.map(item=><article className="history-card" key={item.number}>
        <div className="history-card-top"><span>{t('Kiếp')} {String(item.number).padStart(3,'0')}</span><small>{t(item.status==='active'?'Đang tu hành':item.status==='abandoned'?'Đã luân hồi sớm':'Một kiếp khép lại')}</small></div>
        <h2>{translateName(item.name,language)}</h2>
        <p className="history-realm">{t(realms[item.realm].name)}{stageName(item)?' · '+t(stageName(item)):''}</p>
        {item.isGoodProfile&&<p className="history-gifted">✦ {t('Tiên tư xuất chúng')}</p>}
        <dl>{[...(item.gender?[['Giới tính',item.gender]]:[]),['Xuất thân',item.origin],['Linh căn',item.root],['Thể chất',item.physique],...(item.sectName?[['Tông môn',item.sectName]]:[])].map(([label,value])=><div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl>
        <div className="history-traits">{[['Tư chất',item.talent],['Ngộ tính',item.comprehension],['Khí vận',item.luck]].map(([label,value])=><div key={label}><span>{t(label)}</span><b>{value}</b></div>)}</div>
        <p className="history-ending">{item.age} {t('tuổi')} · {t(item.endingReason||item.world)}</p>
        <div className="history-actions"><button disabled={busy!==null} onClick={()=>exportImage(item,false)}>{t(busy===item.number?'Đang tạo ảnh…':'Tải ảnh')}</button><button disabled={busy!==null} onClick={()=>exportImage(item,true)}>{t('Chia sẻ ảnh')}</button></div>
      </article>)}
    </div>}
  </section>;
}
