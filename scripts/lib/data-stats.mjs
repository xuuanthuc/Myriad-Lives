export function summarizeEvents(events){
  return {
    total:events.length,
    life:events.filter(e=>e.category==='life').length,
    cultivation:events.filter(e=>e.category==='cultivation').length,
    opportunity:events.filter(e=>e.category==='opportunity').length,
    disaster:events.filter(e=>e.category==='disaster').length,
    choices:events.filter(e=>e.choices?.length).length,
    options:events.reduce((sum,e)=>sum+(e.choices?.length||0),0),
    outcomes:events.reduce((sum,e)=>sum+(e.outcomes?.length||0)+(e.choices||[]).reduce((n,c)=>n+c.outcomes.length,0),0),
    automatic:events.filter(e=>e.outcomes?.length).length,
    combat:events.filter(e=>e.combat).length,
    conditional:events.filter(e=>Object.keys(e.conditions||{}).length>0).length,
    gender:events.filter(e=>e.conditions?.gender!==undefined).length,
    physique:events.filter(e=>e.conditions?.physique!==undefined).length,
    sect:events.filter(e=>e.conditions?.sectStatus!==undefined).length,
    partner:events.filter(e=>e.conditions?.partnerStatus!==undefined).length,
  };
}

export function realmDataStats(events,realms){
  return realms.map(realm=>{
    const applicable=events.filter(e=>!e.allowedRealms||e.allowedRealms.includes(realm.id));
    const exclusive=applicable.filter(e=>e.allowedRealms?.length===1).length;
    const counts=summarizeEvents(applicable);
    return {realm,events:applicable,...counts,exclusive,shared:counts.total-exclusive,
      narratives:counts.total+counts.outcomes};
  });
}

export function planeDataStats(events,planes){
  return planes.map(plane=>{
    const exclusive=events.filter(e=>e.allowedPlanes?.length===1&&e.allowedPlanes[0]===plane.id);
    const applicable=events.filter(e=>!e.allowedPlanes||e.allowedPlanes.includes(plane.id));
    return {plane,exclusive:exclusive.length,shared:applicable.length-exclusive.length,...summarizeEvents(applicable)};
  });
}
