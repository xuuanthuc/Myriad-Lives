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
  assert.ok(Math.abs(fatalBreakthroughChance(profile(92),8,1)-.23168)<1e-10);
  assert.ok(fatalBreakthroughChance(profile(92),8,1)<fatalBreakthroughChance(profile(22),8,1));
  assert.ok(fatalBreakthroughChance(profile(92),8,1.5)>fatalBreakthroughChance(profile(92),8,1));
  assert.equal(fatalBreakthroughChance(profile(22),13,10),.1);
  assert.equal(fatalBreakthroughChance(profile(22),8,10),.45);
  assert.ok(fatalBreakthroughChance(profile(50),13,1)<.06);
  assert.ok(Number.isFinite(fatalBreakthroughChance({},8,1)));
});
test('high luck modestly reduces fatal failure with neutral legacy and low luck',()=>{
  for(const realm of [3,8,13])for(const danger of [1,10]){
    const baseline=fatalBreakthroughChance(profile(50),realm,danger);
    for(const [luck,factor] of [[-10,1],[20,1],[50,1],[80,.88],[100,.8],[120,.8]]){
      assert.ok(Math.abs(fatalBreakthroughChance({...profile(50),luck},realm,danger)-baseline*factor)<1e-10);
    }
  }
});
test('confirmed breakthroughs use root and luck protection without extra RNG draws',()=>{
  const base=startLife({runCount:0,pityCount:0},createRng(12)).run;
  function resolve(score,luck=50,realm=8,fatalRoll=.26){
    let draws=0;const rng=createRng(1);rng.float=()=>++draws===1?.999:draws===2?fatalRoll:.999;
    const state={...base.state,age:500,realm,subrealm:2,realmEnteredAge:400,lifespanLimit:501,health:100,resources:0,cultivationProgress:100};
    const run={...base,rng,state,profile:{...base.profile,root:{score},comprehension:50,luck},world:{...base.world,danger:1,cultivationDifficulty:1},facts:[{id:0,eventId:'ready',age:500,realm,stateSnapshot:structuredClone(state)}],phase:'awaiting_choice',pendingChoice:{kind:'breakthrough',options:[{id:'attempt'}]}};
    const next=attemptBreakthrough(run);
    assert.equal(draws,2);
    assert.equal(run.state.health,100);
    return next;
  }
  assert.equal(resolve(22).result.endingReason,'Bỏ mạng trong thiên kiếp');
  assert.equal(resolve(22).facts.at(-1).eventId,'fatal-tribulation');
  assert.equal(resolve(92).facts[1].eventId,'failed-500');
  assert.equal(resolve(22,100).facts[1].eventId,'failed-500');
  assert.equal(resolve(50,50,3,.012).result.endingReason,'Tẩu hỏa khi đột phá');
  assert.equal(resolve(50,80,3,.012).facts[1].eventId,'failed-500');
});
