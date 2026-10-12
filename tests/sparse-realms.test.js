import test from 'node:test';
import assert from 'node:assert/strict';
import {events} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';

const batch=events.filter(event=>/^sparse[23]?_/.test(event.id));

function encounter(event,outcomeId,{realm,partnerStatus='bonded',health=100}={}){
  const started=startLife({runCount:0,pityCount:0},createRng(12));
  const rng=createRng(1),pick=rng.weightedPick.bind(rng);
  rng.float=()=>0;
  rng.weightedPick=items=>items.find(i=>i.value.id===event.id)?.value
    ||items.find(i=>i.value.id===outcomeId)?.value||pick(items);
  const state={...started.run.state,age:20,realm:realm??realms.findIndex(r=>r.id===event.allowedRealms[0]),
    subrealm:0,health,resources:100,partnerStatus,lifespanLimit:23,cultivationProgress:0,alive:true,
    eventCounts:Object.fromEntries(events.filter(e=>e.id!==event.id).map(e=>[e.id,e.maxOccurrencesPerLife]))};
  return chooseOption({...started.run,rng,state,facts:[{id:0,age:20,realm:state.realm,stateSnapshot:structuredClone(state)}],
    phase:'awaiting_choice',pendingChoice:{eventId:'resume',options:[{id:'continue',text:'Continue',
      outcomes:[{id:'resume',text:'Resume',weight:1,effects:{}}]}]}},'continue');
}

test('all sparse-realm encounters obey realm and partner eligibility in the engine',()=>{
  for(const event of batch){
    const run=encounter(event,'victory');
    assert.ok(run.facts.some(f=>f.eventId===event.id),event.id);
    assert.equal(run.state.eventCounts[event.id],1);
    const wrongRealm=(realms.findIndex(r=>r.id===event.allowedRealms[0])+1)%realms.length;
    assert.ok(!encounter(event,'victory',{realm:wrongRealm}).facts.some(f=>f.eventId===event.id),event.id);
    if(event.conditions?.partnerStatus){
      assert.ok(!encounter(event,'victory',{partnerStatus:'none'}).facts.some(f=>f.eventId===event.id),event.id);
    }
  }
});

test('new choice routes resolve once and battles preserve their specific fatal causes',()=>{
  for(const event of batch){
    for(const option of event.choices||[]){
      for(const outcome of option.outcomes){
        const run=encounter(event,outcome.id);
        assert.equal(run.pendingChoice.eventId,event.id);
        assert.ok(!run.facts.some(f=>f.eventId===`${event.id}-${outcome.id}`));
        const result=chooseOption(run,option.id);
        assert.ok(result.facts.some(f=>f.eventId===`${event.id}-${outcome.id}`));
        assert.equal(result.state.eventCounts[event.id],1);
      }
    }
    for(const outcome of event.outcomes||[]){
      const run=encounter(event,outcome.id);
      assert.ok(run.facts.some(f=>f.eventId===`${event.id}-${outcome.id}`),event.id);
      if(outcome.effects.death){
        assert.equal(run.phase,'finished');
        assert.equal(run.result.endingReason,outcome.endingReason);
        assert.equal(run.facts.at(-1).eventId,`${event.id}-${outcome.id}`);
      }
      if(outcome.effects.health<0){
        const lethal=encounter(event,outcome.id,{health:10});
        assert.equal(lethal.result.endingReason,outcome.endingReason);
      }
    }
  }
});
