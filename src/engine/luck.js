// Redistribute living outcomes without changing their combined fatal-risk budget.
// Injuries and lost cultivation remain setbacks even when some loot is gained.
export function outcomeFavor(outcome){
  const e=outcome.effects||{};
  if(e.health<0||e.cultivation<0||e.lifespan<0)return -1;
  if(e.health>0||e.cultivation>0||e.lifespan>0||e.resources>0)return 1;
  return e.resources<0?-1:0;
}

export function luckOutcomeWeights(outcomes,luck,danger){
  const value=Math.max(0,Math.min(100,luck??50));
  const bias=(value-50)*.016;
  const living=outcomes.filter(o=>!o.effects?.death);
  const total=living.reduce((sum,o)=>sum+o.weight,0);
  const adjusted=living.reduce((sum,o)=>sum+o.weight*(1+outcomeFavor(o)*bias),0);
  const survival=1.25+(value-50)*.012;
  return outcomes.map(o=>({value:o,weight:o.effects?.death?o.weight*danger:
    o.weight*(1+outcomeFavor(o)*bias)*(adjusted?total/adjusted:1)*survival}));
}
