import test from 'node:test';
import assert from 'node:assert/strict';
import {autoPlayStep} from '../src/utils/autoPlay.js';
import {startLife} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
const controls={enabled:true,playing:false,paused:false,birthPending:false,page:'game',hidden:false};
test('auto waits for narration and never rolls while paused, hidden, or outside the game',()=>{
 const run=startLife({runCount:0,pityCount:0},createRng(12)).run;
 for(const override of [{enabled:false},{playing:true},{paused:true},{birthPending:true},{page:'home'},{hidden:true}]){
  const state=run.rng.getState();assert.equal(autoPlayStep(run,{...controls,...override}),null);assert.equal(run.rng.getState(),state);
 }
});
test('auto resolves choices and confirms breakthroughs until the current life ends',()=>{
 let breakthroughs=0,choices=0;
 for(let seed=1;seed<=40;seed++){
  let run=startLife({runCount:0,pityCount:20},createRng(seed)).run;
  for(let steps=0;run.phase!=='finished';steps++){
   assert.ok(steps<512);
   if(run.pendingChoice.kind==='breakthrough')breakthroughs++;else choices++;
   run=autoPlayStep(run,controls);
  }
  const state=run.rng.getState();assert.equal(autoPlayStep(run,controls),null);assert.equal(run.rng.getState(),state);
 }
 assert.ok(choices>0);assert.ok(breakthroughs>0);
});
