import test from 'node:test';
import assert from 'node:assert/strict';
import {physiques} from '../src/data/realms.js';
import {extraPhysiques} from '../src/data/extraPhysiques.js';
import {translate} from '../src/i18n/index.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';

test('twelve physiques have positive birth weights and localized exclusive encounters',()=>{
  assert.equal(physiques.length,12);
  assert.equal(physiques.reduce((total,p)=>total+p.weight,0),100);
  for(const p of extraPhysiques){
    assert.ok(p.weight>0);
    assert.equal(p.event.conditions.physique,p.name);
    for(const language of ['zh','en']){
      assert.notEqual(translate(p.name,language),p.name);
      assert.notEqual(translate(p.description,language),p.description);
    }
  }
});

test('exclusive encounters only appear for matching physiques and respect their effects',()=>{
  const seen=new Set();
  for(let seed=1;seed<=1000;seed++){
    const run=autoComplete(startLife({runCount:0,pityCount:25},createRng(seed)).run);
    for(let index=0;index<run.facts.length;index++){
      const fact=run.facts[index];
      const physique=extraPhysiques.find(p=>p.event.id===fact.eventId);
      if(!physique)continue;
      seen.add(physique.name);
      assert.equal(run.profile.physique.name,physique.name);
      assert.ok(fact.realm>0);
      assert.ok((run.state.eventCounts[fact.eventId]||0)<=2);
      const before=run.facts[index-1].stateSnapshot;
      if(physique.event.effects.resources){
        assert.equal(fact.stateSnapshot.resources,before.resources+physique.event.effects.resources);
      }
    }
  }
  assert.equal(seen.size,8);
});
