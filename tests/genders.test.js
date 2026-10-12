import test from 'node:test';
import assert from 'node:assert/strict';
import {genderForProfile,genderName} from '../src/data/genders.js';
import {genderEvents} from '../src/data/genderEvents.js';
import {realms} from '../src/data/realms.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {summarizeLife} from '../src/engine/lifeHistory.js';

test('genders vary between births, persist, and migrate old profiles without consuming RNG',()=>{
  const genders=new Set();
  for(let seed=1;seed<=200;seed++){
    const started=startLife({runCount:0,pityCount:0},createRng(seed));
    const run=started.run,gender=run.profile.gender;genders.add(gender);
    const saved={engineRun:run,session:started.nextSession};
    assert.equal(decodeSave(encodeSave(saved)).engineRun.profile.gender,gender);
    const before=run.rng.getState(),legacy={...run.profile};delete legacy.gender;
    assert.equal(genderForProfile(legacy),gender);
    assert.equal(run.rng.getState(),before);
    assert.equal(summarizeLife(run).gender,genderName(run.profile));
  }
  assert.deepEqual([...genders].sort(),['female','male']);
});

test('gender-specific encounters cover all realms and never appear for the other gender',()=>{
  for(const realm of realms)for(const gender of ['male','female']){
    assert.ok(genderEvents.some(e=>e.conditions.gender===gender&&e.allowedRealms.includes(realm.id)));
  }
  const byId=new Map(genderEvents.map(e=>[e.id,e])),seen=new Set();
  for(let seed=1;seed<=600;seed++){
    const {run}=startLife({runCount:0,pityCount:seed%26},createRng(seed));
    const completed=autoComplete(run);
    for(const fact of completed.facts){
      const event=byId.get(fact.eventId);if(!event)continue;
      assert.equal(event.conditions.gender,genderForProfile(completed.profile));
      assert.ok(event.allowedRealms.includes(realms[fact.realm].id));seen.add(event.conditions.gender);
    }
  }
  assert.deepEqual([...seen].sort(),['female','male']);
});
