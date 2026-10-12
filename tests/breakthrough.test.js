import test from 'node:test';
import assert from 'node:assert/strict';
import {createRng} from '../src/engine/rng.js';
import {startLife,chooseOption,attemptBreakthrough,autoUntilBreakthrough} from '../src/engine/lifeRunner.js';
import {visibleRun} from '../src/engine/playback.js';

test('automatic choices stop before rolling a breakthrough',()=>{
  let gates=0,failures=0,successes=0;
  for(let seed=1;seed<=300;seed++){
    const {run,nextSession}=startLife({runCount:0,pityCount:0},createRng(seed));
    const ready=autoUntilBreakthrough(run);
    if(ready.phase==='finished')continue;
    gates++;
    assert.equal(ready.phase,'awaiting_choice');
    assert.equal(ready.pendingChoice.kind,'breakthrough');
    assert.deepEqual(ready.pendingChoice.options.map(x=>x.id),['attempt']);
    assert.ok(ready.state.cultivationProgress>=100);
    assert.equal(ready.facts.at(-1).title,'Sẵn sàng đột phá');
    const state=structuredClone(ready.state),facts=JSON.stringify(ready.facts),session=structuredClone(nextSession);
    assert.equal(autoUntilBreakthrough(ready),ready);
    assert.throws(()=>chooseOption(ready,'decline'));
    assert.deepEqual(ready.state,state);
    assert.equal(JSON.stringify(ready.facts),facts);
    if(ready.facts.length>1)assert.equal(visibleRun(ready,ready.facts.length-1).pendingChoice,null);
    assert.equal(visibleRun(ready,ready.facts.length).pendingChoice.kind,'breakthrough');
    const next=attemptBreakthrough(ready);
    const outcome=next.facts[ready.facts.length];
    assert.equal(outcome.age,ready.state.age);
    if(outcome.eventId.startsWith('breakthrough-'))successes++;
    if(outcome.eventId.startsWith('failed-')){
      failures++;
      const retry=autoUntilBreakthrough(next);
      if(retry.phase!=='finished'){
        assert.equal(retry.pendingChoice.kind,'breakthrough');
        assert.ok(retry.state.age>ready.state.age);
      }
    }
    assert.deepEqual(nextSession,session);
    assert.deepEqual(ready.state,state);
    assert.equal(JSON.stringify(ready.facts),facts);
  }
  assert.ok(gates>100&&successes>20&&failures>20);
  assert.throws(()=>attemptBreakthrough({phase:'finished'}));
});
