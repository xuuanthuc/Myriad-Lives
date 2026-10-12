import test from 'node:test';
import assert from 'node:assert/strict';
import {sects,sectNameForRun} from '../src/data/sects.js';
import {generateProfile} from '../src/engine/profile.js';
import {createRng} from '../src/engine/rng.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {visibleRun} from '../src/engine/playback.js';
import {summarizeLife} from '../src/engine/lifeHistory.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {translate} from '../src/i18n/index.js';

test('300 distinct sect names have distinct Vietnamese, Chinese and English translations',()=>{
  assert.equal(sects.length,300);
  assert.equal(new Set(sects.map(s=>s.id)).size,300);
  assert.equal(new Set(sects.map(s=>s.name)).size,300);
  for(const language of ['zh','en']){
    assert.equal(new Set(sects.map(s=>translate(s.name,language))).size,300);
    for(const sect of sects){
      assert.equal(translate(sect.name,language),sect.translations[language]);
      assert.notEqual(translate(sect.name,language),sect.name);
    }
  }
});

test('sect assignments vary across lives and stay stable without changing simulation RNG',()=>{
  const seen=new Set();
  for(let seed=1;seed<=1200;seed++){
    const rng=createRng(seed),profile=generateProfile(seed%26,rng);
    const run={profile,state:{sectStatus:'member'}};
    const rngState=rng.getState();
    const name=sectNameForRun(run);
    assert.ok(sects.some(s=>s.name===name));
    assert.equal(sectNameForRun({...run,profile:{...profile,sectName:undefined}}),name);
    assert.equal(rng.getState(),rngState);
    assert.equal(sectNameForRun({...run,state:{sectStatus:'resident'}}),name);
    assert.equal(sectNameForRun({...run,state:{sectStatus:'none'}}),null);
    seen.add(name);
  }
  assert.ok(seen.size>=280,`Only ${seen.size} sects appeared`);
});

test('birth affiliation, playback, history and old browser saves preserve the same sect without future spoilers',()=>{
  let started;
  for(let seed=1;seed<=100;seed++){
    const candidate=startLife({runCount:0,pityCount:25},createRng(seed));
    if(candidate.run.profile.origin.bornInSect){started=candidate;break;}
  }
  assert.ok(started);
  const birth=visibleRun(started.run,1),name=sectNameForRun(birth);
  assert.equal(name,birth.profile.sectName);
  const history=[summarizeLife(birth,'active')];
  assert.equal(history[0].sectName,name);
  const state={engineRun:started.run,session:started.nextSession,history,language:'vi',speed:1,paused:false};
  const restored=decodeSave(encodeSave(state));
  assert.equal(restored.engineRun.profile.sectName,name);
  assert.equal(restored.history[0].sectName,name);
  const old=JSON.parse(encodeSave(state));
  delete old.run.profile.sectName;delete old.history[0].sectName;
  const compatible=decodeSave(JSON.stringify(old));
  assert.equal(sectNameForRun(visibleRun(compatible.engineRun,1)),name);
  assert.equal(compatible.history[0].sectName,undefined);
  assert.deepEqual(autoComplete(compatible.engineRun).facts,autoComplete(restored.engineRun).facts);
  const unaffiliated={...birth,state:{...birth.state,sectStatus:'none'}};
  assert.equal(summarizeLife(unaffiliated).sectName,null);
});
