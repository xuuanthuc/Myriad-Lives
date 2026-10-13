import test from 'node:test';
import assert from 'node:assert/strict';
import {luckOutcomeWeights,outcomeFavor} from '../src/engine/luck.js';
import {events} from '../src/engine/content.js';
const chance=(outcomes,luck,id,danger=1)=>{
  const weights=luckOutcomeWeights(outcomes,luck,danger);
  return weights.find(o=>o.value.id===id).weight/weights.reduce((sum,o)=>sum+o.weight,0);
};
test('luck changes success versus injury even without a fatal outcome',()=>{
  const outcomes=[{id:'success',weight:50,effects:{cultivation:20}},{id:'injury',weight:50,effects:{health:-20,resources:10}}];
  assert.equal(chance(outcomes,50,'success'),.5);
  assert.ok(Math.abs(chance(outcomes,0,'success')-.1)<1e-10);
  assert.ok(Math.abs(chance(outcomes,100,'success')-.9)<1e-10);
  assert.equal(outcomeFavor({effects:{cultivation:20,resources:-6}}),1);
  assert.equal(outcomeFavor({effects:{}}),0);
});
test('median luck preserves old weights and dangerous worlds remain dangerous',()=>{
  const outcomes=[{id:'success',weight:50,effects:{resources:36}},{id:'injury',weight:15,effects:{health:-28}},{id:'death',weight:35,effects:{death:true}}];
  assert.ok(Math.abs(chance(outcomes,50,'death')-35/(35+65*1.25))<1e-10);
  assert.ok(chance(outcomes,0,'death')>chance(outcomes,50,'death'));
  assert.ok(chance(outcomes,100,'death')<chance(outcomes,50,'death'));
  assert.ok(chance(outcomes,100,'death',1.6)>chance(outcomes,100,'death'));
});
test('all active outcome sets retain positive weights and new boons cover early realms',()=>{
  for(const event of events)for(const outcomes of [event.outcomes,...(event.choices||[]).map(c=>c.outcomes)].filter(Boolean))for(const luck of [0,50,100]){
    const weights=luckOutcomeWeights(outcomes,luck,1.2);
    assert.ok(weights.every(w=>Number.isFinite(w.weight)&&w.weight>0),event.id);
  }
  const boons=events.filter(e=>e.id.startsWith('luck_boon_'));
  assert.equal(boons.length,6);
  assert.equal(new Set(boons.flatMap(e=>e.allowedRealms)).size,6);
  assert.ok(boons.every(e=>e.conditions.luck>=60&&e.conditions.luck<=70));
});
