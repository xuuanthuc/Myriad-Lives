import test from 'node:test';
import assert from 'node:assert/strict';
import {breakthroughAge,ageBreakthroughFactor} from '../src/engine/cultivationTime.js';
import {startLife,autoComplete,attemptBreakthrough,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {translate} from '../src/i18n/index.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';

test('weak roots need later age milestones and minimum years within each realm',()=>{
  const profile={root:{score:22},talent:50,comprehension:50};
  const world={resources:1,cultivationDifficulty:1};
  const run={profile,world,facts:[],state:{realm:3,age:150,realmEnteredAge:100}};
  assert.ok(breakthroughAge(run)>=305&&breakthroughAge(run)<=342);
  const strong=breakthroughAge({...run,profile:{...profile,root:{score:100}}});
  assert.ok(strong>=180&&strong<=202);
  assert.ok(breakthroughAge({...run,state:{...run.state,realmEnteredAge:400}})>400);
});

test('age multiplies breakthrough chances upward rather than penalizing elderly cultivators',()=>{
  const factors=[10,30,50,80,99].map(age=>ageBreakthroughFactor({age,lifespanLimit:100}));
  assert.equal(factors[0],1);assert.equal(factors[1],1);
  for(let i=1;i<factors.length;i++)assert.ok(factors[i]>=factors[i-1]);
  assert.equal(ageBreakthroughFactor({age:100,lifespanLimit:100}),1.3);
  function gate(age){
    const base=startLife({runCount:0,pityCount:0},createRng(12)).run;
    const rng=createRng(123),originalFloat=rng.float;
    let draws=0;rng.float=()=>++draws===1?.7:draws===2?.99:originalFloat();
    return {...base,rng,facts:[],profile:{...base.profile,comprehension:50,luck:50},world:{...base.world,cultivationDifficulty:1},
      state:{...base.state,realm:3,age,realmEnteredAge:90,lifespanLimit:480,resources:0,health:100,cultivationProgress:100,alive:true},
      phase:'awaiting_choice',pendingChoice:{kind:'breakthrough',options:[{id:'attempt'}]}};
  }
  assert.ok(attemptBreakthrough(gate(100)).facts[0].eventId.startsWith('failed-'));
  assert.equal(attemptBreakthrough(gate(400)).facts[0].eventId,'breakthrough-4');
  const expired=gate(480),before=expired.rng.getState();
  const ended=attemptBreakthrough(expired);
  assert.equal(ended.phase,'finished');assert.equal(ended.result.endingReason,'Thọ nguyên đã cạn');
  assert.equal(ended.rng.getState(),before);
});

test('full cultivation cannot skip time requirements or survive an exhausted lifespan',()=>{
  const base=startLife({runCount:0,pityCount:0},createRng(12)).run;
  const rng=createRng(1);rng.float=()=>.999;
  const run={...base,rng,profile:{...base.profile,root:{score:22}},phase:'awaiting_choice',
    state:{...base.state,realm:3,age:200,realmEnteredAge:100,lifespanLimit:250,cultivationProgress:100,subrealm:2,health:100,alive:true},
    facts:[{id:0,age:200,realm:3,eventId:'test',stateSnapshot:{}}],
    pendingChoice:{eventId:'wait',options:[{id:'continue',text:'Continue',outcomes:[{id:'safe',text:'Safe',weight:1,effects:{}}]}]}};
  const next=chooseOption(run,'continue');
  assert.equal(next.phase,'finished');assert.equal(next.state.age,250);
  assert.equal(next.result.highestRealm,3);assert.equal(next.result.endingReason,'Thọ nguyên đã cạn');
  assert.ok(next.facts.some(f=>f.eventId.startsWith('retreat-')));
  assert.equal(next.facts.at(-1).category,'ending');
});

test('new gates obey the time model; seclusion translates and saves restore realm residence',()=>{
  let checked=0,retreats=0;
  for(let seed=1;seed<=300;seed++){
    const started=startLife({runCount:0,pityCount:seed%26},createRng(seed));
    const run=autoComplete(started.run);
    for(const fact of run.facts){
      if(fact.eventId.startsWith('ready-')){
        const snapshot={...run,state:fact.stateSnapshot};
        assert.ok(fact.age>=breakthroughAge(snapshot));
        assert.ok(fact.age<fact.stateSnapshot.lifespanLimit);checked++;
      }
      if(fact.eventId.startsWith('retreat-')){
        for(const language of ['zh','en']){
          assert.notEqual(translate(fact.text,language),fact.text);
          assert.notEqual(translate(fact.title,language),fact.title);
        }
        retreats++;
      }
    }
    const saved={engineRun:run,session:started.nextSession,language:'vi',speed:1,paused:false};
    assert.equal(decodeSave(encodeSave(saved)).engineRun.state.realmEnteredAge,run.state.realmEnteredAge);
  }
  assert.ok(checked>100);assert.ok(retreats>100);
});
