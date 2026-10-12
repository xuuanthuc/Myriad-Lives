import {realms} from '../src/data/realms.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {stageIndex,stageName,stagesForRealm} from '../src/data/subrealms.js';
import {startLife,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {translate} from '../src/i18n/index.js';

test('minor stages cover each cultivation realm and translate',()=>{
  assert.equal(stageName({realm:0,cultivationProgress:0}),'');
  assert.equal(stagesForRealm(1).length,9);
  assert.equal(stageIndex(1,100),8);
  assert.equal(stageIndex(2,33.33),0);
  assert.equal(stageIndex(2,100/3),1);
  assert.equal(stageIndex(2,200/3),2);
  assert.equal(stageIndex(2,100),2);
  for(let realm=2;realm<realms.length;realm++)assert.equal(stagesForRealm(realm).length,3);
  for(let realm=1;realm<realms.length;realm++)for(const name of stagesForRealm(realm)){
    for(const language of ['zh','en'])assert.notEqual(translate(name,language),name);
  }
});

test('minor milestones retain snapshots and precede major breakthrough gates',()=>{
  let milestones=0,gates=0;
  for(let seed=1;seed<=100;seed++){
    const run=autoComplete(startLife({runCount:0,pityCount:0},createRng(seed)).run);
    for(const fact of run.facts){
      const state=fact.stateSnapshot;
      assert.equal(state.subrealm,stageIndex(state.realm,state.cultivationProgress));
      if(fact.eventId.startsWith('subrealm-')){
        milestones++;
        assert.ok(state.realm>0&&state.subrealm>0);
      }
      if(fact.eventId.startsWith('ready-')){
        gates++;
        assert.equal(state.subrealm,stagesForRealm(state.realm).length-1);
        assert.ok(state.cultivationProgress>=100);
      }
    }
  }
  assert.ok(milestones>0&&gates>0);
});
