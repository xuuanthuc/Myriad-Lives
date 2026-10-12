import test from 'node:test';
import assert from 'node:assert/strict';
import {realms} from '../src/data/realms.js';
import {startLife,attemptBreakthrough} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {visibleRun} from '../src/engine/playback.js';

function preparedGate(realm){
  const original=startLife({runCount:0,pityCount:25},createRng(21)).run;
  const rng=createRng(39),float=rng.float;
  let first=true;
  rng.float=()=>{if(first){first=false;return 0;}return float();};
  return {...original,rng,phase:'awaiting_choice',facts:[],
    state:{...structuredClone(original.state),age:3000,realm,subrealm:2,cultivationProgress:100,health:100,alive:true,lifespanLimit:realms[realm].lifespan},
    pendingChoice:{kind:'breakthrough',targetRealm:realm===realms.length-1?null:realm+1,tribulation:realm===8,options:[{id:'attempt'}]}};
}

test('Mahayana ascension enters True Immortal and continues the same life',()=>{
  assert.deepEqual(realms.slice(8).map(r=>r.name),['Đại Thừa','Chân Tiên','Kim Tiên','Huyền Tiên','Tiên Vương','Tiên Đế']);
  assert.equal(realms.some(r=>r.id==='tribulation'),false);
  const original=preparedGate(8),next=attemptBreakthrough(original);
  const ascension=next.facts[0];
  assert.equal(ascension.eventId,'ascension');
  assert.equal(ascension.realm,9);
  assert.equal(ascension.stateSnapshot.alive,true);
  assert.equal(ascension.stateSnapshot.subrealm,0);
  assert.equal(ascension.stateSnapshot.lifespanLimit,realms[9].lifespan);
  assert.equal(next.number,original.number);
  assert.equal(original.state.realm,8);
  if(next.facts.length>1){assert.equal(visibleRun(next,1).result,undefined);assert.equal(visibleRun(next,1).state.realm,9);}
});

test('final confirmation completes the Immortal Emperor journey',()=>{
  const next=attemptBreakthrough(preparedGate(realms.length-1));
  assert.equal(next.phase,'finished');
  assert.equal(next.result.endingReason,'Chứng đạo Tiên Đế');
  assert.equal(next.result.endingType,'transcendence');
  assert.equal(next.result.highestRealm,realms.length-1);
  assert.equal(next.facts.at(-1).category,'ending');
});
