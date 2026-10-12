import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeLife,archiveLife,historyWithCompletedLife} from '../src/engine/lifeHistory.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {visibleRun} from '../src/engine/playback.js';

test('history contains only basic profile details, without timeline, RNG or future events',()=>{
  const {run}=startLife({runCount:0,pityCount:25},createRng(2));
  const shown=visibleRun(run,1),summary=summarizeLife(shown);
  assert.equal(summary.age,0);
  assert.equal(summary.realm,0);
  assert.equal(summary.status,'abandoned');
  assert.equal(summary.name,run.profile.name);
  assert.equal(summary.physique,run.profile.physique.name);
  assert.equal(summary.facts,undefined);
  assert.equal(summary.rng,undefined);
  assert.equal(summary.endingReason,null);
  assert.equal(summary.profile,undefined);
});

test('history upserts newest-first, survives refresh, and restores old saves without history',()=>{
  const started=startLife({runCount:0,pityCount:0},createRng(12));
  started.run=autoComplete(started.run);
  const summary=summarizeLife(started.run);
  let history=archiveLife([],summary);
  history=archiveLife(history,summary);
  assert.equal(history.length,1);
  history=archiveLife(history,{...summary,number:2});
  assert.deepEqual(history.map(item=>item.number),[2,1]);
  const state={engineRun:started.run,session:started.nextSession,language:'vi',speed:1,paused:false,history};
  assert.deepEqual(decodeSave(encodeSave(state)).history,history);
  const old=JSON.parse(encodeSave(state));delete old.history;
  assert.deepEqual(decodeSave(JSON.stringify(old)).history,[]);
});

test('a newly revealed ending enters history and storage before reincarnation, without duplicates or spoilers',()=>{
  const started=startLife({runCount:0,pityCount:25},createRng(12));
  const final=autoComplete(started.run);
  const before=visibleRun(final,final.facts.length-1);
  assert.deepEqual(historyWithCompletedLife([],before),[]);
  const history=historyWithCompletedLife([],final);
  assert.equal(history.length,1);
  assert.equal(history[0].status,'finished');
  assert.equal(history[0].endingReason,final.result.endingReason);
  const state={engineRun:final,session:started.nextSession,history,language:'vi',speed:1,paused:false,playback:{number:final.number,count:final.facts.length,from:1,elapsed:0}};
  assert.deepEqual(decodeSave(encodeSave(state)).history,history);
  assert.equal(historyWithCompletedLife(history,final).length,1);
  assert.equal(archiveLife(history,summarizeLife(final)).length,1);
});
