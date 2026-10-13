import {realms} from '../data/realms.js';

// Game pacing, not ages taken from any particular novel.
// Each row describes the current realm's next breakthrough (including final Dao attainment).
const settings=[
  [0,0,0],[25,12,3],[90,35,5],[200,65,8],[480,130,15],
  [1000,250,30],[2100,450,50],[3800,800,80],[7000,1400,150],
  [14000,2200,300],[23000,3500,600],[39000,6000,1000],
  [62000,9000,1600],[100000,14000,2500],
];
export const cultivationTiming=settings.map(([baseAge,minimumYears,quietYears],i)=>({
  realm:realms[i].id,baseAge,minimumYears,quietYears,
}));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function rootTimeFactor(profile){return 1.7-clamp(profile.root.score,0,100)*.008;}
export function breakthroughRecoveryYears(run){
  return Math.max(8,Math.ceil(cultivationTiming[run.state.realm].minimumYears*rootTimeFactor(run.profile)));
}
function lifeTimeVariation(run){
  const source=[run.number,run.profile.name,run.profile.luck,run.world.resources,run.world.cultivationDifficulty].join('|');
  let hash=2166136261;
  for(const character of source){hash^=character.codePointAt(0);hash=Math.imul(hash,16777619)>>>0;}
  return 1+.12*hash/4294967296;
}
export function breakthroughAge(run){
  const s=run.state,t= cultivationTiming[s.realm];
  if(s.realm===0)return 0;
  const rootFactor=rootTimeFactor(run.profile);
  const aptitude=.85+(100-(run.profile.talent+run.profile.comprehension)/2)*.003;
  const environment=.9+clamp(run.world.cultivationDifficulty/run.world.resources,.4,2.5)*.1;
  const entered=s.realmEnteredAge??run.facts.find(f=>f.realm===s.realm)?.age??s.age;
  const variation=lifeTimeVariation(run);
  return Math.max(s.explorationUntilAge??0,Math.ceil(t.baseAge*rootFactor*variation),entered+Math.ceil(t.minimumYears*rootFactor*aptitude*environment*variation));
}
// Older cultivators have a better chance, but cannot outlive their remaining lifespan.
// First 30% of lifespan: ×1. Near the end: up to ×1.30. Final chance stays capped at 95%.
export function ageBreakthroughFactor(state){
  const used=clamp(state.age/Math.max(1,state.lifespanLimit),0,1);
  return 1+.3*clamp((used-.3)/.7,0,1);
}
