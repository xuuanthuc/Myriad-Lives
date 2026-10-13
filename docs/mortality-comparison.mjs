import fs from 'node:fs';
import assert from 'node:assert/strict';
import {events} from '../src/engine/content.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {generateProfile,generateWorld} from '../src/engine/profile.js';
import {worldPlanes} from '../src/data/worlds.js';
import {luckOutcomeWeights} from '../src/engine/luck.js';

const all=[...events],original=all.filter(e=>!e.id.startsWith('plane_'));
assert.equal(all.length-original.length,800);
const perPlane=400,seeds=[],planeCounts=Object.fromEntries(worldPlanes.map(p=>[p.id,0]));
for(let seed=1;seeds.length<perPlane*worldPlanes.length;seed++){
  const rng=createRng(seed);generateProfile(seed%26,rng);const plane=generateWorld(rng).planeId;
  if(planeCounts[plane]<perPlane){seeds.push(seed);planeCounts[plane]++;}
}
const blank=()=>({lives:0,eventDeaths:0,breakthroughDeaths:0,childhoodDeaths:0,ageDeaths:0,attained:0,ascended:0,riskyChoices:0,choiceDeaths:0,expectedChoiceDeaths:0,planeEventsSeen:0});
const increment=(stats,key,value=1)=>{stats[key]+=value;};
const deathProbability=(option,run)=>{
 const weights=luckOutcomeWeights(option.outcomes,run.profile.luck,run.world.danger);
 return weights.filter(w=>w.value.effects?.death).reduce((sum,w)=>sum+w.weight,0)/weights.reduce((sum,w)=>sum+w.weight,0);
};
const report={method:{perPlane,seeds:seeds.length,policies:['random','safe','risk'],baselineEvents:original.length,currentEvents:all.length,seededBirths:'same seed, same initial profile and world, pity=seed%26'},results:{},paired:{}};
for(const policy of report.method.policies){
 const paired=[];
 for(const variant of ['before','after']){
  events.splice(0,events.length,...(variant==='before'?original:all));
  const stats=blank(),planes=Object.fromEntries(worldPlanes.map(p=>[p.id,blank()]));
  for(const [index,seed] of seeds.entries()){
   let run=startLife({runCount:0,pityCount:seed%26},createRng(seed)).run;
   const initial=JSON.stringify([run.profile,run.world]),plane=planes[run.world.planeId];
   const targets=[stats,plane];for(const t of targets)increment(t,'lives');
   for(let steps=0;run.phase!=='finished';steps++){
    assert.ok(steps<512);
    const choice=run.pendingChoice;
    let option;
    if(choice.kind==='breakthrough')option=choice.options[0];
    else if(policy==='safe')option=choice.options.find(o=>o.outcomes.every(x=>!x.effects?.death&&(x.effects?.health||0)>=0))||choice.options.at(-1);
    else if(policy==='risk'){
     const risky=choice.options.filter(o=>o.outcomes.some(x=>x.effects?.death));
     option=risky.sort((a,b)=>deathProbability(b,run)-deathProbability(a,run))[0]||run.rng.pick(choice.options);
    }else option=run.rng.pick(choice.options);
    const risk=choice.kind!=='breakthrough'&&option.outcomes.some(o=>o.effects?.death);
    if(risk)for(const t of targets){increment(t,'riskyChoices');increment(t,'expectedChoiceDeaths',deathProbability(option,run));}
    const beforeFacts=run.facts.length,next=chooseOption(run,option.id);
    if(risk){
     const deathIds=new Set(option.outcomes.filter(o=>o.effects?.death).map(o=>choice.eventId+'-'+o.id));
     if(next.facts.slice(beforeFacts).some(f=>deathIds.has(f.eventId)))for(const t of targets)increment(t,'choiceDeaths');
    }
    run=next;
   }
   let ending;
   if(run.result.endingType==='transcendence')ending='attained';
   else if(run.result.endingReason==='Thọ nguyên đã cạn')ending='ageDeaths';
   else if(run.facts.at(-1).eventId==='fatal-breakthrough')ending='breakthroughDeaths';
   else if(run.facts.at(-1).eventId==='sect-childhood-death')ending='childhoodDeaths';
   else ending='eventDeaths';
   for(const t of targets){increment(t,ending);if(run.result.highestRealm>=9)increment(t,'ascended');}
   for(const fact of run.facts){
    const id=fact.eventId.split('-')[0];
    if(id.startsWith('plane_')){
     const event=all.find(e=>e.id===id);
     assert.ok(event?.allowedPlanes.includes(run.world.planeId),fact.eventId);
     if(id===fact.eventId)for(const t of targets)increment(t,'planeEventsSeen');
    }
   }
   const premature=['eventDeaths','breakthroughDeaths','childhoodDeaths'].includes(ending);
   if(variant==='before')paired.push({initial,premature,ending});
   else{assert.equal(initial,paired[index].initial);paired[index].after=premature;paired[index].afterEnding=ending;}
   if((index+1)%800===0)console.log(`${policy} ${variant}: ${index+1}/${seeds.length}`);
  }
  report.results[`${policy}_${variant}`]={stats,planes};
 }
 const beforeOnly=paired.filter(p=>p.premature&&!p.after).length,afterOnly=paired.filter(p=>!p.premature&&p.after).length;
 const delta=(afterOnly-beforeOnly)/paired.length;
 const se=Math.sqrt(((beforeOnly+afterOnly)/paired.length-delta*delta)/paired.length);
 report.paired[policy]={beforeOnly,afterOnly,prematureDeltaPercentagePoints:delta*100,approx95Interval:[(delta-1.96*se)*100,(delta+1.96*se)*100]};
 console.log(`DONE ${policy}: ${JSON.stringify(report.paired[policy])}`);
}
events.splice(0,events.length,...all);
fs.writeFileSync('docs/mortality-comparison-results.json',JSON.stringify(report,null,2)+'\n');
console.log('Audit completed: docs/mortality-comparison-results.json');
