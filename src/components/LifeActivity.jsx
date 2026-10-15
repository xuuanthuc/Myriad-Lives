import {stageName} from '../data/subrealms.js';
import {memo,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import { realms } from '../data/realms.js';
import { events } from '../engine/content.js';
import SmoothHeight from './SmoothHeight.jsx';

const choiceEvents=new Set(events.filter(event=>event.choices).map(event=>event.id));
const eventColors=[['birth','Xuất sinh'],['life','Nhân sinh'],['cultivation','Tu luyện'],['opportunity','Cơ duyên'],['disaster','Hiểm họa'],['choice','Lựa chọn'],['breakthrough','Đột phá'],['ending','Kết cục']];
function eventType(fact){
  if(fact.category==='ending')return 'ending';
  if(fact.eventId.startsWith('ready-')||fact.eventId.startsWith('breakthrough-')||fact.eventId==='ascension')return 'breakthrough';
  if(choiceEvents.has(fact.eventId)||fact.category==='choice')return 'choice';
  return fact.category;
}

const EventEntry=memo(function EventEntry({fact,t,selected,registerNode}){
  const attach=useCallback(node=>registerNode(fact.id,node),[fact.id,registerNode]);
  const stage=stageName(fact.stateSnapshot);
  return <article key={fact.id} tabIndex={-1} ref={attach} className={'entry '+fact.category+' event-type-'+eventType(fact)+(selected?' event-highlight':'')}>
    <div className="time"><b>{fact.age}</b><small>{t('tuổi')}</small></div>
    <div className="entry-content"><span className="dot"/><h3>{t(fact.title)}</h3>{stage&&<small className="event-subrealm">{t(realms[fact.realm].name)} · {t(stage)}</small>}<p>{t(fact.text)}</p>{fact.traitChanges?.map(change=><p className="trait-change" key={change.trait}><strong>{t(change.trait==='luck'?'Khí vận':'Linh căn')}</strong>: {t(String(change.before))} → {t(String(change.after))}</p>)}</div>
  </article>;
});

export default function LifeActivity({run,t,children,toolbar}) {
  const latest=run.facts.at(-1);
  const [page,setPage]=useState(run.state.realm);
  const [selectedId,setSelectedId]=useState(latest?.id);
  const eventNodes=useRef(new Map());
  const listNode=useRef(null);
  const scrollToEvent=useRef(false);
  const grouped=useMemo(()=>{
    const groups=realms.map(()=>[]);
    for(const fact of run.facts)groups[fact.realm].push(fact);
    return groups;
  },[run.facts]);
  const entries=useMemo(()=>[...grouped[page]].reverse(),[grouped,page]);
  const counts=useMemo(()=>grouped.map(facts=>facts.length),[grouped]);
  const registerNode=useCallback((id,node)=>{
    if(node)eventNodes.current.set(id,node);else eventNodes.current.delete(id);
  },[]);
  const heatmapRows=Math.max(7,...counts);

  useEffect(()=>{
    setPage(run.state.realm);
    setSelectedId(latest?.id);
  },[latest?.id,run.state.realm]);

  useEffect(()=>{
    if(listNode.current)listNode.current.scrollTop=0;
  },[page]);

  useEffect(()=>{
    if(selectedId!==latest?.id||page!==latest?.realm||scrollToEvent.current)return;
    const node=eventNodes.current.get(selectedId),list=listNode.current;
    // Follow the newest event only while the reader stays at the top; never pull them back mid-scroll.
    if(node&&list&&list.scrollTop<48){
      list.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
  },[selectedId,latest?.id,page]);

  useEffect(()=>{
    if(!scrollToEvent.current)return;
    const node=eventNodes.current.get(selectedId);
    if(node){
      node.focus({preventScroll:true});
      node.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    }
    scrollToEvent.current=false;
  },[page,selectedId]);

  function openEvent(fact){
    if(page===fact.realm&&selectedId===fact.id){
      const node=eventNodes.current.get(fact.id);
      node?.focus({preventScroll:true});
      node?.scrollIntoView({block:'center',behavior:'instant'});
      return;
    }
    scrollToEvent.current=true;
    setPage(fact.realm);
    setSelectedId(fact.id);
  }

  return <section className="life-pages" aria-label={t('Nhân sinh ký sự')}>
    <nav className="realm-pages" aria-label={t('Chọn trang cảnh giới')}>
      {realms.map((realm,index)=><button
        type="button" key={realm.id} disabled={!counts[index]}
        aria-pressed={page===index}
        onClick={()=>{setPage(index);setSelectedId(run.facts.find(f=>f.realm===index)?.id);}}
      ><span>{t(realm.name)}</span><small>{counts[index] ? counts[index]+' '+t('sự kiện'):t('Chưa đạt')}</small></button>)}
    </nav>
    <div className="realm-page-heading"><h3>{t(realms[page].name)}</h3><span>{entries.length} {t('mốc cuộc đời')}</span></div>
    {toolbar}
    <div ref={listNode} className="timeline realm-event-list" aria-live="polite" role="region" aria-label={t(realms[page].name)+' · '+t('Nhân sinh ký sự')} tabIndex={0}>
      {entries.map(fact=><EventEntry key={fact.id} fact={fact} t={t} selected={selectedId===fact.id} registerNode={registerNode}/>)}
    </div>
    <SmoothHeight>{children}</SmoothHeight>
    <div className="life-heatmap-scroll" role="region" aria-label={t('Bấm ô màu để chuyển tới sự kiện')} tabIndex={0}>
      <h3 className="life-map-title">{t('Dấu tích một kiếp')}</h3>
      <div className="heatmap-legend" aria-label={t('Chú giải')}>
        {eventColors.map(([type,label])=><span key={type}><i className={'type-'+type} aria-hidden="true"/>{t(label)}</span>)}
      </div>
      <div className="life-heatmap" style={{gridTemplateColumns:`repeat(${realms.length},minmax(0,1fr))`}}>
        {realms.map((realm,index)=>{
          const realmFacts=grouped[index];
          return <div key={realm.id} className={'heatmap-realm'+(page===index?' current':'')} role="group" aria-label={t(realm.name)}>
            <div className="heatmap-realm-cells">
              {realmFacts.map(fact=><button
          type="button" key={fact.id}
          className={'life-square type-'+eventType(fact)+(selectedId===fact.id?' selected':'')}
          title={`${t(realms[fact.realm].name)}${stageName(fact.stateSnapshot)?' · '+t(stageName(fact.stateSnapshot)):''} · ${fact.age} ${t('tuổi')} · ${t(eventColors.find(([type])=>type===eventType(fact))?.[1]||'Nhân sinh')} · ${t(fact.title)}`}
          aria-label={`${t(realms[fact.realm].name)} · ${fact.age} ${t('tuổi')} · ${t(eventColors.find(([type])=>type===eventType(fact))?.[1]||'Nhân sinh')} · ${t(fact.title)}`}
          aria-pressed={selectedId===fact.id}
          onClick={()=>openEvent(fact)}
              />)}
              {Array.from({length:heatmapRows-realmFacts.length},(_,row)=><span key={'empty-'+row} className="life-square-empty" aria-hidden="true"/>)}
            </div>
          </div>;
        })}
      </div>
    </div>
  </section>;
}
