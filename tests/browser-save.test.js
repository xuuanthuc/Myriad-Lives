import test from 'node:test';
import assert from 'node:assert/strict';
import {createRng} from '../src/engine/rng.js';
import {startLife,autoComplete,autoUntilBreakthrough,chooseOption} from '../src/engine/lifeRunner.js';
import {encodeSave,decodeSave,saveBrowserState,loadBrowserSave} from '../src/engine/browserSave.js';
import {visibleRun} from '../src/engine/playback.js';

function snapshot(started){return {engineRun:started.run,session:started.nextSession,language:'zh',speed:4,paused:true,playback:{number:started.run.number,count:1,from:1,elapsed:720}};}

test('saving and restoring retains RNG fate, session and partially revealed story',()=>{
  for(let seed=1;seed<=100;seed++){
    const start=startLife({runCount:3,pityCount:10},createRng(seed));
    const saved=snapshot(start),restored=decodeSave(encodeSave(saved));
    assert.deepEqual(restored.session,start.nextSession);
    assert.deepEqual(restored.playback,saved.playback);
    assert.equal(restored.speed,4);
    assert.equal(restored.language,'zh');
    assert.equal(restored.paused,true);
    assert.deepEqual(visibleRun(restored.engineRun,1).state,visibleRun(start.run,1).state);
    const original=autoComplete(start.run),continued=autoComplete(restored.engineRun);
    assert.deepEqual(continued.facts,original.facts);
    assert.deepEqual(continued.result,original.result);
  }
});

test('a saved breakthrough still waits for confirmation and draws the same result',()=>{
  let start;
  for(let seed=1;seed<=100;seed++){
    start=startLife({runCount:0,pityCount:25},createRng(seed));
    start.run=autoUntilBreakthrough(start.run);
    if(start.run.pendingChoice?.kind==='breakthrough')break;
  }
  assert.equal(start.run.pendingChoice.kind,'breakthrough');
  const saved=snapshot(start);
  saved.playback.count=start.run.facts.length;
  const restored=decodeSave(encodeSave(saved));
  assert.deepEqual(restored.engineRun.pendingChoice,start.run.pendingChoice);
  assert.deepEqual(chooseOption(restored.engineRun,'attempt').facts,chooseOption(start.run,'attempt').facts);
});

test('finished lives and browser storage round-trip without duplicating the timeline',()=>{
  const started=startLife({runCount:0,pityCount:0},createRng(12));
  started.run=autoComplete(started.run);
  const saved=snapshot(started),raw=encodeSave(saved),restored=decodeSave(raw);
  assert.equal(JSON.parse(raw).run.result.timeline,undefined);
  assert.equal(restored.engineRun.result.timeline,restored.engineRun.facts);
  const previous=globalThis.localStorage;
  let stored=null;
  try{
    globalThis.localStorage={getItem:()=>stored,setItem:(key,value)=>{stored=value;}};
    assert.equal(saveBrowserState(saved),true);
    assert.equal(loadBrowserSave().engineRun.phase,'finished');
    stored='{bad json';assert.equal(loadBrowserSave(),null);
    globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('full');}};
    assert.equal(loadBrowserSave(),null);
    assert.equal(saveBrowserState(saved),false);
  }finally{if(previous===undefined)delete globalThis.localStorage;else globalThis.localStorage=previous;}
});

test('corrupt and incompatible saves are rejected; invalid playback safely falls back',()=>{
  assert.throws(()=>decodeSave('{'));
  assert.throws(()=>decodeSave(JSON.stringify({version:99})));
  const saved=JSON.parse(encodeSave(snapshot(startLife({runCount:0,pityCount:0},createRng(1)))));
  saved.playback.count=99999;
  assert.equal(decodeSave(JSON.stringify(saved)).playback,undefined);
  saved.run.rngState=-1;
  assert.throws(()=>decodeSave(JSON.stringify(saved)));
});
