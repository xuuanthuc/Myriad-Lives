import {birth} from '../src/engine/content.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { origins } from '../src/data/origins.js';
import { startLife,autoComplete } from '../src/engine/lifeRunner.js';
import { createRng } from '../src/engine/rng.js';

test('twenty origins include weighted sect births and distinct starting supplies',()=>{
  assert.equal(origins.length,20);
  assert.equal(new Set(origins.map(x=>x.id)).size,20);
  assert.equal(origins.filter(x=>x.bornInSect).length,4);
  assert.ok(new Set(origins.map(x=>x.startingResources)).size>10);
  for(const origin of origins)assert.ok(origin.weight>0&&origin.startingResources>=0);
});

test('sect children can awaken, be sheltered, leave, or die young without roots',()=>{
  const found=new Set(),births=new Set();
  for(let seed=1;seed<=5000;seed++) {
    const {run,nextSession}=startLife({runCount:0,pityCount:0},createRng(seed));
    births.add(run.profile.origin.id);
    assert.ok([run.profile.origin.birthText,...birth.filter(record=>record.originId===run.profile.origin.id).map(record=>record.text)].includes(run.facts[0].text));
    if(!run.profile.origin.bornInSect)continue;
    const completed=autoComplete(run);
    if(run.profile.root.score>0) {
      assert.equal(completed.state.sectStatus,'member');
      assert.ok(completed.facts.some(x=>x.eventId==='awaken'));
      assert.ok(!completed.facts.some(x=>x.eventId==='sect-screening'));
      found.add('awakened');
    }else {
      const screening=completed.facts.find(x=>x.eventId==='sect-screening');
      assert.equal(screening.age,6);
      for(const id of ['sect-sheltered','sect-expelled','sect-childhood-death'])if(completed.facts.some(x=>x.eventId===id))found.add(id);
      if(completed.facts.at(-1).eventId==='sect-childhood-death') {
        assert.ok(completed.state.age>=7&&completed.state.age<=14);
        assert.equal(completed.state.realm,0);
        assert.equal(completed.phase,'finished');
        assert.equal(completed.facts.at(-1).category,'ending');
        assert.equal(completed.result.endingReason,'Không linh căn, bỏ mạng khi dẫn khí');
        assert.equal(nextSession.pityCount,1);
      }
    }
  }
  assert.equal(births.size,20);
  assert.deepEqual([...found].sort(),['awakened','sect-childhood-death','sect-expelled','sect-sheltered'].sort());
});
