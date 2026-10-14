import test from 'node:test';
import assert from 'node:assert/strict';
import {startLife,attemptBreakthrough} from '../src/engine/lifeRunner.js';
import {breakthroughRecoveryYears} from '../src/engine/cultivationTime.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {translate} from '../src/i18n/index.js';

test('surviving failure travels before retry even when cultivation is replenished immediately',()=>{
  const started=startLife({runCount:0,pityCount:0},createRng(12));
  const rng=createRng(1);rng.float=()=>.999;
  const run={...started.run,rng,facts:[],phase:'awaiting_choice',
    profile:{...started.run.profile,root:{score:100},talent:100,comprehension:50},
    world:{...started.run.world,resources:100,cultivationDifficulty:1,danger:1},
    state:{...started.run.state,realm:3,age:400,realmEnteredAge:100,lifespanLimit:2000,health:100,alive:true,resources:0,cultivationProgress:100},
    pendingChoice:{kind:'breakthrough',options:[{id:'attempt'}]}};
  const next=attemptBreakthrough(run);
  const travel=next.facts.find(f=>f.eventId==='exploration-400');
  assert.ok(travel);
  assert.equal(travel.stateSnapshot.explorationUntilAge,400+breakthroughRecoveryYears(run));
  assert.equal(next.phase,'awaiting_choice');
  assert.equal(next.pendingChoice.kind,'breakthrough');
  assert.equal(next.state.age,travel.stateSnapshot.explorationUntilAge);
  assert.equal(next.facts.some(f=>f.eventId.startsWith('retreat-')),false);
  assert.equal(run.state.explorationUntilAge,undefined);
  for(const lang of ['zh','en']){
    assert.notEqual(translate(travel.title,lang),travel.title);
    assert.notEqual(translate(travel.text,lang),travel.text);
  }
  const restored=decodeSave(encodeSave({engineRun:next,session:started.nextSession,language:'vi',speed:1,paused:false}));
  assert.equal(restored.engineRun.state.explorationUntilAge,next.state.explorationUntilAge);
  assert.equal(restored.engineRun.rng.getState(),next.rng.getState());
});
