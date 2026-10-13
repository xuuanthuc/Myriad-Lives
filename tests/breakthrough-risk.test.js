import test from 'node:test';
import assert from 'node:assert/strict';
import {rootBreakthroughBonus,fatalBreakthroughChance} from '../src/engine/breakthrough.js';
import {startLife,attemptBreakthrough} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
const profile=score=>({root:{score}});
test('strong roots modestly help success and reduce fatal failure, with bounded danger',()=>{
  assert.equal(rootBreakthroughBonus(profile(22)),0);
  assert.equal(rootBreakthroughBonus(profile(92)),.042);
  assert.equal(rootBreakthroughBonus(profile(100)),.05);
  assert.ok(Math.abs(fatalBreakthroughChance(profile(92),8,1)-.11584)<1e-10);
  assert.ok(fatalBreakthroughChance(profile(92),8,1)<fatalBreakthroughChance(profile(22),8,1));
  assert.ok(fatalBreakthroughChance(profile(92),8,1.5)>fatalBreakthroughChance(profile(92),8,1));
  assert.equal(fatalBreakthroughChance(profile(22),13,10),.3);
  assert.ok(Number.isFinite(fatalBreakthroughChance({},8,1)));
});
test('confirmed breakthroughs use root protection without extra RNG draws',()=>{
  const base=startLife({runCount:0,pityCount:0},createRng(12)).run;
  function resolve(score){
    let draws=0;const rng=createRng(1);rng.float=()=>++draws===1?.999:draws===2?.13:.999;
    const state={...base.state,age:500,realm:8,subrealm:2,realmEnteredAge:400,lifespanLimit:501,health:100,resources:0,cultivationProgress:100};
    const run={...base,rng,state,profile:{...base.profile,root:{score},comprehension:50,luck:50},world:{...base.world,danger:1,cultivationDifficulty:1},facts:[{id:0,eventId:'ready',age:500,realm:8,stateSnapshot:structuredClone(state)}],phase:'awaiting_choice',pendingChoice:{kind:'breakthrough',options:[{id:'attempt'}]}};
    const next=attemptBreakthrough(run);
    assert.equal(draws,2);
    assert.equal(run.state.health,100);
    return next;
  }
  assert.equal(resolve(22).result.endingReason,'Tẩu hỏa khi đột phá');
  assert.equal(resolve(92).facts[1].eventId,'failed-500');
});
