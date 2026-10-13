import test from 'node:test';
import assert from 'node:assert/strict';
import {events} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';

const added=events.filter(e=>e.id.startsWith('danger_'));
const fatal=events.filter(e=>e.choices?.some(c=>c.outcomes.some(o=>o.effects?.death)));
const base=startLife({runCount:0,pityCount:0},createRng(12)).run;

function resolve(event,danger,quantile,optionId='risk'){
  const realm=realms.findIndex(r=>r.id===event.allowedRealms[0]);
  const rng=createRng(1);
  rng.float=()=>quantile;
  const state={...base.state,age:20,realm,subrealm:0,cultivationProgress:0,health:100,resources:100,lifespanLimit:23,alive:true,
    eventCounts:Object.fromEntries(events.map(e=>[e.id,e.maxOccurrencesPerLife]))};
  const run={...base,rng,state,profile:{...base.profile,luck:50},world:{...base.world,danger},facts:[{id:0,eventId:event.id,age:20,realm,stateSnapshot:structuredClone(state)}],phase:'awaiting_choice',pendingChoice:{eventId:event.id,options:event.choices}};
  const next=chooseOption(run,optionId);
  return next.facts.some(f=>f.eventId===`${event.id}-death`);
}

test('new danger covers all realms and existing danger retains a nonfatal alternative',()=>{
  assert.equal(added.length,28);
  assert.equal(fatal.length,249);
  for(const realm of realms)assert.equal(added.filter(e=>e.allowedRealms.length===1&&e.allowedRealms[0]===realm.id).length,2,realm.id);
  for(const event of fatal){
    assert.ok(event.choices.some(c=>c.outcomes.every(o=>!o.effects?.death&&(o.effects?.health||0)>=0)),event.id);
    for(const option of event.choices.filter(c=>c.outcomes.some(o=>o.effects?.death))){
      assert.ok(option.outcomes.some(o=>!o.effects?.death&&o.weight>0),event.id);
      assert.ok(option.outcomes.filter(o=>!o.effects?.death).some(o=>(o.effects?.resources||0)>=32||(o.effects?.cultivation||0)>=24),event.id);
    }
  }
});

test('actual outcome rolls cross the 30–35 percent fatal boundary while retreat stays safe',()=>{
  for(const event of added){
    // With luck 50, danger 1 gives 30.1% death; danger 1.2 gives 34.1%.
    assert.equal(resolve(event,1,.69),false,event.id);
    assert.equal(resolve(event,1,.70),true,event.id);
    assert.equal(resolve(event,1.2,.65),false,event.id);
    assert.equal(resolve(event,1.2,.66),true,event.id);
    assert.equal(resolve(event,1.6,.99,'leave'),false,event.id);
  }
});
