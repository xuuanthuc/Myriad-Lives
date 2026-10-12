import test from 'node:test';
import assert from 'node:assert/strict';
import {advancePlayback,visibleRun,PLAYBACK_SPEEDS} from '../src/engine/playback.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';

test('x1, x2 and x4 pace events without losing partial progress',()=>{
  assert.deepEqual(PLAYBACK_SPEEDS,[1,2,4]);
  const initial={count:1,from:1,elapsed:0};
  for(const speed of PLAYBACK_SPEEDS) {
    const partial=advancePlayback(initial,1000/speed,speed,10);
    assert.equal(partial.count,1);assert.equal(partial.elapsed,1000);
    const next=advancePlayback(partial,1000/speed,speed,10);
    assert.equal(next.count,2);assert.equal(next.elapsed,0);
  }
  const changed=advancePlayback({count:1,elapsed:1000},250,4,10);
  assert.equal(changed.count,2);
  assert.equal(advancePlayback(initial,999999,4,3).count,3);
});

test('unrevealed choices, endings, realm and relationships stay hidden',()=>{
  for(let seed=1;seed<=100;seed++) {
    const {run}=startLife({runCount:0,pityCount:0},createRng(seed));
    const completed=autoComplete(run);
    const original=JSON.stringify(completed.facts);
    for(let count=1;count<completed.facts.length;count++) {
      const shown=visibleRun(completed,count);
      assert.equal(shown.facts.length,count);
      assert.equal(shown.phase,'running');
      assert.equal(shown.pendingChoice,null);
      assert.equal(shown.result,undefined);
      assert.equal(shown.state.age,shown.facts.at(-1).age);
      assert.equal(shown.state.realm,shown.facts.at(-1).realm);
      assert.equal(shown.state.sectStatus,shown.facts.at(-1).stateSnapshot.sectStatus);
      assert.equal(shown.state.partnerStatus,shown.facts.at(-1).stateSnapshot.partnerStatus);
    }
    assert.equal(visibleRun(completed,completed.facts.length),completed);
    assert.equal(JSON.stringify(completed.facts),original);
    if(run.phase==='awaiting_choice'){
      assert.equal(visibleRun(run,run.facts.length).pendingChoice,run.pendingChoice);
      assert.equal(visibleRun(run,1).pendingChoice,null);
    }
  }
});
