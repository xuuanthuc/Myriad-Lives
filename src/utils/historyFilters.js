import {realms} from '../data/realms.js';

export const defaultHistoryFilters={query:'',realm:'',status:'',root:'',physique:'',origin:'',gender:'',endingReason:'',gifted:'',sect:'',partner:'',minAge:'',maxAge:'',sort:'newest'};
const normalize=value=>String(value??'').normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/đ/gi,'d').toLowerCase();
export function historyFilterValues(entries,field){return [...new Set(entries.map(item=>item[field]).filter(Boolean))];}

/** Work only with recorded summaries; never mutate saves or inspect the simulation. */
export function filterHistory(entries,filters,{t=value=>value,localizeName=value=>value}={}){
  const f={...defaultHistoryFilters,...filters};
  const words=normalize(f.query).trim().split(/\s+/).filter(Boolean);
  const result=entries.filter(item=>{
    if(f.realm!==''&&item.realm!==Number(f.realm))return false;
    for(const field of ['status','root','physique','origin','gender','endingReason'])if(f[field]&&item[field]!==f[field])return false;
    if(f.gifted&&Boolean(item.isGoodProfile)!==(f.gifted==='yes'))return false;
    if(f.sect&&Boolean(item.sectName)!==(f.sect==='yes'))return false;
    if(f.partner&&Boolean(item.partnerName)!==(f.partner==='yes'))return false;
    if(f.minAge!==''&&item.age<Number(f.minAge))return false;
    if(f.maxAge!==''&&item.age>Number(f.maxAge))return false;
    if(words.length){
      const fields=[item.name,localizeName(item.name),String(item.number).padStart(3,'0'),item.partnerName,item.sectName,item.origin,item.root,item.physique,item.gender,item.endingReason,item.world,realms[item.realm]?.name].filter(Boolean);
      const text=normalize([...fields,...fields.map(t)].join(' '));
      if(!words.every(word=>text.includes(word)))return false;
    }
    return true;
  });
  return result.sort((a,b)=>{
    if(f.sort==='oldest')return a.number-b.number;
    if(f.sort==='realm')return b.realm-a.realm||(b.subrealm??0)-(a.subrealm??0)||b.number-a.number;
    if(['age','luck','talent'].includes(f.sort))return (b[f.sort]??0)-(a[f.sort]??0)||b.number-a.number;
    return b.number-a.number;
  });
}
