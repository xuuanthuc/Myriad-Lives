import {realms} from '../data/realms.js';
import {genderForProfile} from '../data/genders.js';
import {worldPlaneId} from '../data/worlds.js';

export function eligible(e,run){
  const s=run.state,p=run.profile;
  if(s.age<e.minAge||s.age>(e.maxAge??Infinity)||
    e.allowedRealms&&!e.allowedRealms.includes(realms[s.realm].id)||
    e.allowedPlanes&&!e.allowedPlanes.includes(worldPlaneId(run.world))||
    (s.eventCounts[e.id]||0)>=e.maxOccurrencesPerLife||s.age<(s.cooldowns[e.id]||0))return false;
  return Object.entries(e.conditions||{}).every(([k,v])=>k==='gender'?genderForProfile(p)===v:
    k==='root'?p.root.name===v:k==='physique'?p.physique.name===v:
    ['sectStatus','partnerStatus'].includes(k)?s[k]===v:(s[k]??p[k])>=v);
}
