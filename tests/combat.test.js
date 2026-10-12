import test from 'node:test';
import assert from 'node:assert/strict';
import {combatEvents} from '../src/data/combatEvents.js';
import {combatChoices} from '../src/data/combatChoices.js';
import {realmConflicts} from '../src/data/realmConflicts.js';
import {realms} from '../src/data/realms.js';
import {startLife,chooseOption,autoComplete} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {summarizeLife} from '../src/engine/lifeHistory.js';

function prepared(outcome,health=100){
  const started=startLife({runCount:0,pityCount:0},createRng(12));
  const event=combatEvents[0],rng=createRng(1),pick=rng.weightedPick.bind(rng);
  rng.float=()=>0;
  rng.weightedPick=items=>items.find(i=>i.value.id===event.id)?.value||items.find(i=>i.value.id===outcome)?.value||pick(items);
  const state={...started.run.state,age:20,realm:0,subrealm:0,health,resources:10,lifespanLimit:25,cultivationProgress:0,alive:true};
  return {...started.run,rng,state,facts:[{id:0,age:20,realm:0,stateSnapshot:structuredClone(state)}],
    phase:'awaiting_choice',pendingChoice:{eventId:'resume',options:[{id:'continue',text:'Continue',outcomes:[{id:'resume',text:'Resume',weight:1,effects:{}}]}]}};
}

test('all realms have automatic battles and optional fights with safe withdrawal',()=>{
  for(const realm of realms){
    const auto=combatEvents.find(e=>e.allowedRealms.includes(realm.id));
    assert.ok(auto,realm.id);assert.equal(auto.outcomes.length,3);
    assert.ok(auto.outcomes.some(o=>o.effects.death&&o.endingReason));
    const choice=combatChoices.find(e=>e.allowedRealms.includes(realm.id));
    assert.ok(choice,realm.id);
    assert.ok(choice.choices.find(c=>c.id==='fight').outcomes.some(o=>o.effects.death));
    assert.ok(choice.choices.find(c=>c.id==='retreat').outcomes.every(o=>!o.effects.death));
  }
});

test('automatic fights resolve without a popup, preserve loot or injuries, and stop immediately on death',()=>{
  const event=combatEvents[0];
  const victory=chooseOption(prepared('victory'),'continue');
  const won=victory.facts.find(f=>f.eventId===event.id+'-victory');
  assert.ok(won);assert.equal(won.stateSnapshot.resources,28);
  const injury=chooseOption(prepared('injury'),'continue');
  assert.equal(injury.facts.find(f=>f.eventId===event.id+'-injury').stateSnapshot.health,70);
  const fatal=chooseOption(prepared('death'),'continue');
  assert.equal(fatal.phase,'finished');assert.equal(fatal.pendingChoice,null);
  assert.equal(fatal.result.endingReason,event.outcomes[2].endingReason);
  assert.equal(fatal.facts.at(-1).eventId,event.id+'-death');
  assert.equal(fatal.facts.at(-1).category,'ending');assert.equal(fatal.facts.at(-1).stateSnapshot.alive,false);
  assert.equal(fatal.state.age,21);assert.throws(()=>chooseOption(fatal,'continue'));
  const wounded=chooseOption(prepared('injury',10),'continue');
  assert.equal(wounded.phase,'finished');assert.equal(wounded.result.endingReason,event.outcomes[1].endingReason);
});

test('combat outcomes obey realm scopes and survive browser/history persistence',()=>{
  const byId=new Map([...combatEvents,...combatChoices,...realmConflicts].map(e=>[e.id,e]));
  let deaths=0,automatic=0;
  for(let seed=1;seed<=500;seed++){
    const started=startLife({runCount:0,pityCount:seed%26},createRng(seed));
    const run=autoComplete(started.run);
    for(const fact of run.facts){
      const event=byId.get(fact.eventId);
      if(!event)continue;
      assert.ok(event.allowedRealms.includes(realms[fact.realm].id));
      assert.equal(run.state.eventCounts[event.id],1);
      if(event.outcomes){automatic++;assert.ok(run.facts.some(f=>event.outcomes.some(o=>f.eventId===`${event.id}-${o.id}`)));}
    }
    const reasons=[...combatEvents.flatMap(e=>e.outcomes),...realmConflicts.flatMap(e=>e.outcomes),...combatChoices.flatMap(e=>e.choices.flatMap(c=>c.outcomes))].map(o=>o.endingReason).filter(Boolean);
    if(!reasons.includes(run.result.endingReason))continue;
    deaths++;
    const history=[summarizeLife(run)],saved={engineRun:run,session:started.nextSession,history,language:'vi',speed:1,paused:false};
    const restored=decodeSave(encodeSave(saved));
    assert.equal(restored.engineRun.result.endingReason,run.result.endingReason);
    assert.equal(restored.history[0].endingReason,run.result.endingReason);
  }
  assert.ok(automatic>100);assert.ok(deaths>10);
});

test('each realm has two distinct new conflicts with loot, injury and explicit fatal causes',()=>{
  assert.equal(realmConflicts.length,28);
  for(const realm of realms){
    const encounters=realmConflicts.filter(e=>e.allowedRealms.includes(realm.id));
    assert.equal(encounters.length,2);
    assert.notEqual(encounters[0].text,encounters[1].text);
    for(const event of encounters){
      assert.equal(event.maxOccurrencesPerLife,1);
      assert.ok(event.outcomes.some(o=>o.effects.resources>0));
      assert.ok(event.outcomes.some(o=>o.effects.health<0&&o.endingReason));
      assert.ok(event.outcomes.some(o=>o.effects.death&&o.translations.zh.endingReason&&o.translations.en.endingReason));
    }
  }
});
