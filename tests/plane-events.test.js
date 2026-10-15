import test from 'node:test';
import assert from 'node:assert/strict';
import {events,validateContent} from '../src/engine/content.js';
import {eligible} from '../src/engine/eventEligibility.js';
import {worldPlanes,worldPlaneId} from '../src/data/worlds.js';
import {realms} from '../src/data/realms.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {planeDataStats} from '../scripts/lib/data-stats.mjs';
const added=events.filter(e=>e.id.startsWith('plane_'));
const started=startLife({runCount:0,pityCount:0},createRng(12));
function pending(event){
  const realm=realms.findIndex(r=>r.id===event.allowedRealms[0]);
  const state={...started.run.state,age:30,realm,subrealm:0,realmEnteredAge:30,cultivationProgress:0,health:100,resources:100,lifespanLimit:32,alive:true,eventCounts:{},cooldowns:{}};
  return {...started.run,rng:createRng(1),world:{...started.run.world,planeId:event.allowedPlanes[0],danger:1},state,
    facts:[{id:0,eventId:event.id,age:30,realm,stateSnapshot:structuredClone(state)}],phase:'awaiting_choice',
    pendingChoice:{eventId:event.id,age:30,title:event.title,prompt:event.text,options:event.choices}};
}
test('800 plane events are evenly scoped, localized, and diverse in category',()=>{
  assert.equal(added.length,800);
  assert.equal(added.filter(e=>e.choices).length,576);
  for(const plane of worldPlanes){
    const own=added.filter(e=>e.allowedPlanes.includes(plane.id));
    assert.equal(own.length,100,plane.id);
    const counts=realms.map(r=>own.filter(e=>e.allowedRealms.includes(r.id)).length);
    assert.ok(counts.every(n=>n===7||n===8),plane.id);
    assert.equal(counts.filter(n=>n===8).length,2,plane.id);
    assert.deepEqual([...new Set(own.map(e=>e.category))].sort(),['cultivation','disaster','life','opportunity']);
  }
  for(const e of added){
    assert.equal(e.allowedPlanes.length,1);assert.equal(e.allowedRealms.length,1);
    assert.ok(e.translations.zh.text&&e.translations.en.text);
    if(e.allowedRealms[0]==='mortal')for(const effect of [e.effects,...(e.choices||[]).flatMap(c=>c.outcomes.map(o=>o.effects))].filter(Boolean))assert.equal(effect.cultivation??0,0,e.id);
    if(e.choices){assert.equal(e.choices.length,3);assert.equal(new Set(e.choices.map(c=>c.text)).size,3);}
  }
});
test('every plane event rejects all other planes and realms while respecting old conditions',()=>{
  for(const event of added){
    const run=pending(event);
    assert.equal(eligible(event,run),true,event.id);
    for(const plane of worldPlanes)assert.equal(eligible(event,{...run,world:{...run.world,planeId:plane.id}}),plane.id===event.allowedPlanes[0],event.id);
    for(let realm=0;realm<realms.length;realm++)assert.equal(eligible(event,{...run,state:{...run.state,realm}}),realms[realm].id===event.allowedRealms[0],event.id);
    assert.equal(eligible(event,{...run,state:{...run.state,age:0}}),false);
    assert.equal(eligible(event,{...run,state:{...run.state,eventCounts:{[event.id]:1}}}),false);
    assert.equal(eligible(event,{...run,state:{...run.state,cooldowns:{[event.id]:31}}}),false);
    if(event.conditions?.health)assert.equal(eligible(event,{...run,state:{...run.state,health:10}}),false);
  }
});
test('legacy world fallback is stable and shared encounters remain available',()=>{
  const event=added.find(e=>e.allowedPlanes[0]==='peaceful'),run=pending(event);
  const world={...run.world,descriptor:'Thiên hạ bình hòa'};delete world.planeId;
  const before=JSON.stringify(world);
  assert.equal(worldPlaneId(world),'peaceful');assert.equal(eligible(event,{...run,world}),true);
  assert.equal(JSON.stringify(world),before);
  const shared={...event,allowedPlanes:undefined};
  for(const plane of worldPlanes)assert.equal(eligible(shared,{...run,world:{...world,planeId:plane.id}}),true);
  assert.equal(worldPlaneId({descriptor:'Loạn thế phong vân'}),'turmoil');
  assert.equal(worldPlaneId({descriptor:'Hiểm họa trùng trùng'}),'wild');
});
test('invalid plane scopes are rejected without relaxing existing validation',()=>{
  const event=added[0];
  for(const allowedPlanes of ['blood',[],['wrong'],['blood','blood']])assert.throws(()=>validateContent([{...event,allowedPlanes}]));
  assert.equal(validateContent([{...event,allowedPlanes:undefined}]),true);
});
test('plane statistics distinguish exclusive content from the common pool',()=>{
  const summaries=planeDataStats(events,worldPlanes);
  assert.equal(summaries.length,8);
  for(const summary of summaries){
    assert.equal(summary.exclusive,100);
    assert.equal(summary.shared,2780);
    assert.equal(summary.total,2880);
  }
});
test('new choices resolve once, preserve pending saves, and never reroll on translation',()=>{
  const blocked=Object.fromEntries(events.map(e=>[e.id,e.maxOccurrencesPerLife]));
  for(const plane of worldPlanes){
    const event=added.find(e=>e.allowedPlanes[0]===plane.id&&e.category==='disaster');
    for(const option of event.choices){
      const run=pending(event);run.state.eventCounts=blocked;
      let draws=0;run.rng.float=()=>{draws++;return .999;};
      const next=chooseOption(run,option.id);
      const resolved=next.facts.filter(f=>f.eventId.startsWith(event.id+'-'));
      assert.equal(resolved.length,1);
      assert.equal(run.state.health,100);
      if(option.id==='commit'){assert.equal(next.result.endingReason,option.outcomes.at(-1).endingReason);assert.equal(draws,1);}
      else assert.ok(!resolved[0].eventId.endsWith('-death'));
    }
    const run=pending(event);
    const saved={engineRun:run,session:started.nextSession,language:'vi',speed:1,paused:false};
    const restored=decodeSave(encodeSave(saved));
    assert.deepEqual(restored.engineRun.pendingChoice,run.pendingChoice);
    assert.equal(restored.engineRun.world.planeId,plane.id);
  }
});
