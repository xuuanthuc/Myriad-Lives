import test from 'node:test';
import assert from 'node:assert/strict';
import {birth,endings} from '../src/engine/content.js';
import {origins} from '../src/data/origins.js';
import {birthNarrative,endingNarrative} from '../src/engine/narrative.js';
import {startLife,attemptBreakthrough} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {translate} from '../src/i18n/index.js';

test('birth prose respects every origin and leaves state and RNG unchanged',()=>{
  const {run}=startLife({runCount:0,pityCount:0},createRng(1));
  for(const origin of origins){
    run.profile.origin=origin;
    const valid=[origin.birthText,...birth.filter(record=>record.originId===origin.id).map(record=>record.text)],seen=new Set();
    const state=JSON.stringify(run.state),rng=run.rng.getState();
    for(let number=1;number<=40;number++){
      run.number=number;const text=birthNarrative(run);seen.add(text);
      assert.ok(valid.includes(text));assert.equal(birthNarrative(run),text);
      for(const language of ['zh','en'])assert.notEqual(translate(text,language),text);
    }
    assert.equal(seen.size,valid.length);
    assert.equal(JSON.stringify(run.state),state);assert.equal(run.rng.getState(),rng);
  }
});

test('ending prose follows the actual ending kind without rerolling or consuming RNG',()=>{
  const {run}=startLife({runCount:0,pityCount:0},createRng(2));
  const state=JSON.stringify(run.state),rng=run.rng.getState();
  for(const kind of ['age','ascend','injury']){
    const valid=endings.filter(record=>(record.kind??record.id)===kind).map(record=>record.text);
    const text=endingNarrative(run,kind);assert.ok(valid.includes(text));
    assert.equal(endingNarrative(run,kind),text);
    for(const language of ['zh','en'])assert.notEqual(translate(text,language),text);
  }
  assert.equal(JSON.stringify(run.state),state);assert.equal(run.rng.getState(),rng);
});

test('engine records matching prose while preserving the real ending reason',()=>{
  for(const [kind,reason,health,rolls] of [['age','Thọ nguyên đã cạn',100,[]],['ascend','Chứng đạo Tiên Đế',100,[0]],['injury','Trọng thương không qua khỏi',10,[.99,.99]]]){
    const {run}=startLife({runCount:0,pityCount:0},createRng(1));
    run.phase='awaiting_choice';run.pendingChoice={kind:'breakthrough'};
    Object.assign(run.state,{realm:13,age:100,health,lifespanLimit:kind==='age'?100:1000});
    run.rng={float(){assert.ok(rolls.length);return rolls.shift();}};
    const finished=attemptBreakthrough(run);
    assert.equal(finished.phase,'finished');assert.equal(finished.result.endingReason,reason);
    assert.equal(finished.facts.at(-1).text,endingNarrative(finished,kind));
    assert.equal(finished.result.endingType,kind==='ascend'?'transcendence':'death');
    assert.equal(rolls.length,0);
  }
});
