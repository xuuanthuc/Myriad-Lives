import {events} from '../src/engine/content.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {realms} from '../src/data/realms.js';
import {realmEncounters} from '../src/data/realmEncounters.js';
import {realmChoices} from '../src/data/realmChoices.js';
import {realmJourneys} from '../src/data/realmJourneys.js';
import {realmTales} from '../src/data/realmTales.js';
import {realmWanderings} from '../src/data/realmWanderings.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';

test('every realm has its own ordinary, beneficial and dangerous encounters plus an applicable choice',()=>{
  for(const realm of realms){
    const own=[...realmEncounters,...realmJourneys,...realmTales,...realmWanderings].filter(e=>e.allowedRealms.includes(realm.id));
    assert.equal(own.length,13,realm.id);
    assert.ok(own.some(e=>e.category==='life'),realm.id);
    assert.ok(own.some(e=>e.category==='disaster'),realm.id);
    assert.ok(own.some(e=>['opportunity','cultivation'].includes(e.category)),realm.id);
    assert.ok(realmChoices.some(e=>e.allowedRealms.includes(realm.id)),realm.id);
  }
});

test('new encounters appear only in their allowed realms, once per life; choices resolve and simulations finish',()=>{
  const added=new Map([...realmEncounters,...realmChoices,...realmJourneys,...realmTales,...realmWanderings,...events.filter(event=>/^sparse[23]?_/.test(event.id))].map(e=>[e.id,e]));
  const seen=new Set(),choicesSeen=new Set();
  for(let seed=1;seed<=600;seed++){
    const run=autoComplete(startLife({runCount:0,pityCount:25},createRng(seed)).run);
    assert.equal(run.phase,'finished');
    const inLife=new Set();
    for(const fact of run.facts){
      const event=added.get(fact.eventId);
      if(!event)continue;
      assert.ok(event.allowedRealms.includes(realms[fact.realm].id),fact.eventId);
      assert.ok(fact.age>=event.minAge);
      for(const [key,value] of Object.entries(event.conditions||{})){
        if(['sectStatus','partnerStatus'].includes(key))assert.equal(fact.stateSnapshot[key],value,event.id);
        else assert.ok((fact.stateSnapshot[key]??run.profile[key])>=value,event.id);
      }
      assert.ok(!inLife.has(event.id),event.id);
      inLife.add(event.id);seen.add(event.id);
      if(event.choices){
        choicesSeen.add(event.id);
        assert.ok(run.facts.some(f=>event.choices.some(c=>c.outcomes.some(o=>f.eventId===`${event.id}-${o.id}`))),event.id);
      }
    }
  }
  assert.ok(seen.size>=20,`Only ${seen.size} new encounters appeared`);
  assert.ok(choicesSeen.size>=3,`Only ${choicesSeen.size} new choices appeared`);
});
