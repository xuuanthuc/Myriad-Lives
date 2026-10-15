import {useMemo,useRef,useState} from 'react';
import {createActionLock} from '../utils/actionLock.js';
import {realms} from '../data/realms.js';
import {stageName} from '../data/subrealms.js';
import {translateName} from '../i18n/index.js';
import FateCardPreview from './FateCardPreview.jsx';
import {exportFateCard,prepareFateCard} from '../utils/fateCard.js';
import {defaultHistoryFilters,filterHistory,historyFilterValues} from '../utils/historyFilters.js';

const pageSize=12;
function HistorySelect({label,value,options,onChange,t}){
  return <label className="history-field"><span>{t(label)}</span><select value={value} onChange={event=>onChange(event.target.value)}><option value="">{t('Tất cả')}</option>{options.map(([id,name])=><option key={id} value={id}>{t(name)}</option>)}</select></label>;
}

export default function HistoryPage({history,current,runCount,t,language}){
  const [busy,setBusy]=useState(null),[error,setError]=useState(false);
  const exportLock=useRef(createActionLock());
  const [preview,setPreview]=useState(null);
  const [filters,setFilters]=useState(defaultHistoryFilters),[requestedPage,setRequestedPage]=useState(1);
  const entries=useMemo(()=>current?[current,...history.filter(item=>item.number!==current.number)]:history,[current,history]);
  const filtered=useMemo(()=>filterHistory(entries,filters,{t,localizeName:name=>translateName(name,language)}),[entries,filters,t,language]);
  const pageCount=Math.max(1,Math.ceil(filtered.length/pageSize)),page=Math.min(requestedPage,pageCount);
  const visible=filtered.slice((page-1)*pageSize,page*pageSize);
  const activeFilters=Object.entries(filters).filter(([key,value])=>key!=='sort'&&value!=='').length;
  function updateFilter(key,value){setFilters(previous=>({...previous,[key]:value}));setRequestedPage(1);}
  function resetFilters(){setFilters(defaultHistoryFilters);setRequestedPage(1);}
  function selectFilter(field,label,options=historyFilterValues(entries,field).sort((a,b)=>t(a).localeCompare(t(b),language)).map(value=>[value,value])){
    return <HistorySelect key={field} label={label} value={filters[field]} options={options} onChange={value=>updateFilter(field,value)} t={t}/>;
  }
  async function exportImage(item,share){
    if(!exportLock.current.acquire())return;
    setBusy(item.number);setError(false);
    try{if(share){const blob=await prepareFateCard(item,language);setPreview({blob,number:item.number});}else await exportFateCard(item,language,false);}catch(e){if(e.name!=='AbortError'){console.error(e);setError(true);}}finally{exportLock.current.release();setBusy(null);}
  }
  return <section className="history-page">
    {preview&&<FateCardPreview card={preview} t={t} onClose={()=>setPreview(null)}/>}
    <p className="eyebrow">{t('VẠN KIẾP')}</p><h1>{t('Lịch sử luân hồi')}</h1>
    <p className="history-intro">{t('Một kiếp qua đi, mệnh cách còn lưu. Giữ lại tấm thẻ để kể câu chuyện của ngươi.')}</p>
    {runCount>0&&<p className="history-intro">{runCount}{t(' kiếp đã trải')}</p>}
    {entries.length>0&&<div className="history-filters" role="search" aria-label={t('Lọc lịch sử')}>
      <div className="history-filter-main">
        <label className="history-field history-search"><span>{t('Tìm trong lịch sử')}</span><input type="search" value={filters.query} placeholder={t('Tên, số kiếp, tông môn, kết cục…')} onChange={event=>updateFilter('query',event.target.value)}/></label>
        {selectFilter('realm','Cảnh giới cao nhất',realms.map((realm,index)=>[String(index),realm.name]))}
        {selectFilter('status','Trạng thái',[['active','Đang tu hành'],['finished','Một kiếp khép lại'],['abandoned','Đã luân hồi sớm']])}
        <label className="history-field"><span>{t('Sắp xếp')}</span><select value={filters.sort} onChange={event=>updateFilter('sort',event.target.value)}>{[['newest','Kiếp mới nhất'],['oldest','Kiếp cũ nhất'],['realm','Cảnh giới cao nhất'],['age','Tuổi cao nhất'],['luck','Khí vận cao nhất'],['talent','Tư chất cao nhất']].map(([id,label])=><option key={id} value={id}>{t(label)}</option>)}</select></label>
      </div>
      <details className="history-filter-details">
        <summary>{t('Lọc chi tiết')}{activeFilters>0&&<span className="history-filter-count">{activeFilters}</span>}</summary>
        <div className="history-filter-grid">
          {selectFilter('root','Linh căn')}{selectFilter('physique','Thể chất')}{selectFilter('origin','Xuất thân')}
          {selectFilter('gender','Giới tính')}{selectFilter('endingReason','Kết cục')}
          {selectFilter('gifted','Tiên tư xuất chúng',[['yes','Có'],['no','Không']])}
          {selectFilter('sect','Tông môn',[['yes','Đã gia nhập'],['no','Chưa gia nhập']])}
          {selectFilter('partner','Đạo lữ',[['yes','Đã kết duyên'],['no','Độc hành']])}
          {['minAge','maxAge'].map(field=><label className="history-field" key={field}><span>{t(field==='minAge'?'Tuổi từ':'Tuổi đến')}</span><input type="number" min="0" step="1" value={filters[field]} placeholder="—" onChange={event=>updateFilter(field,event.target.value)}/></label>)}
        </div>
      </details>
      <div className="history-filter-footer"><p role="status">{t('Tìm thấy {count} / {total} kiếp').replace('{count}',filtered.length).replace('{total}',entries.length)}</p><button type="button" disabled={!activeFilters&&filters.sort==='newest'} onClick={resetFilters}>{t('Đặt lại bộ lọc')}</button></div>
    </div>}
    {error&&<p role="alert">{t('Chưa xuất được ảnh. Hãy thử lại.')}</p>}
    {!entries.length?<div className="history-empty"><p>{t('Chưa có kiếp nào được ghi lại.')}</p><a className="primary" href="#/cultivation">{t('Tu tiên')}</a></div>:!filtered.length?<div className="history-empty"><p>{t('Không có kiếp nào khớp bộ lọc. Thử đổi điều kiện hoặc đặt lại bộ lọc.')}</p><button className="history-reset" type="button" onClick={resetFilters}>{t('Đặt lại bộ lọc')}</button></div>:<div className="history-grid">
      {visible.map(item=><article className="history-card" key={item.number}>
        <div className="history-card-top"><span>{t('Kiếp')} {String(item.number).padStart(3,'0')}</span><small>{t(item.status==='active'?'Đang tu hành':item.status==='abandoned'?'Đã luân hồi sớm':'Một kiếp khép lại')}</small></div>
        <h2>{translateName(item.name,language)}</h2>
        <p className="history-realm">{t(realms[item.realm].name)}{stageName(item)?' · '+t(stageName(item)):''}</p>
        {item.isGoodProfile&&<p className="history-gifted">✦ {t('Tiên tư xuất chúng')}</p>}
        <dl>{[...(item.gender?[['Giới tính',item.gender]]:[]),['Xuất thân',item.origin],['Linh căn',item.root],['Thể chất',item.physique],...(item.sectName?[['Tông môn',item.sectName]]:[]),...(item.partnerName?[['Đạo lữ',item.partnerName]]:[])].map(([label,value])=><div key={label}><dt>{t(label)}</dt><dd>{t(value)}</dd></div>)}</dl>
        <div className="history-traits">{[['Tư chất',item.talent],['Ngộ tính',item.comprehension],['Khí vận',item.luck]].map(([label,value])=><div key={label}><span>{t(label)}</span><b>{value}</b></div>)}</div>
        <p className="history-ending">{item.age} {t('tuổi')} · {t(item.endingReason||item.world)}</p>
        <div className="history-actions"><button disabled={busy!==null} onClick={()=>exportImage(item,false)}>{t(busy===item.number?'Đang tạo ảnh…':'Tải ảnh')}</button><button disabled={busy!==null} onClick={()=>exportImage(item,true)}>{t('Chia sẻ ảnh')}</button></div>
      </article>)}
    </div>}
    {pageCount>1&&<nav className="history-pagination" aria-label={t('Phân trang lịch sử')}><button type="button" disabled={page===1} onClick={()=>setRequestedPage(page-1)}>{t('Trang trước')}</button><span role="status">{t('Trang {page} / {total}').replace('{page}',page).replace('{total}',pageCount)}</span><button type="button" disabled={page===pageCount} onClick={()=>setRequestedPage(page+1)}>{t('Trang sau')}</button></nav>}
  </section>;
}
