import test from 'node:test';
import assert from 'node:assert/strict';
import {events} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {translate} from '../src/i18n/index.js';

const batch=events.filter(e=>e.id.startsWith('selection_'));
const counts={qi_refining:30,foundation:30,golden_core:25,nascent_soul:25,spirit_transformation:20,void_refining:20,body_integration:20,mahayana:20,true_immortal:15,golden_immortal:15,mystic_immortal:15,immortal_king:15,immortal_emperor:15};
const base=startLife({runCount:0,pityCount:0},createRng(12)).run;

function encounter(event,{realm=realms.findIndex(r=>r.id===event.allowedRealms[0]),outcomeId='success',exhausted=false,health=100,resources=100}={}){
  const rng=createRng(1),pick=rng.weightedPick.bind(rng);
  rng.float=()=>0;
  rng.weightedPick=items=>items.find(i=>i.value.id===event.id)?.value||items.find(i=>i.value.id===outcomeId)?.value||pick(items);
  const state={...base.state,age:20,realm,subrealm:0,health,resources,lifespanLimit:23,cultivationProgress:0,alive:true,
    eventCounts:Object.fromEntries(events.filter(e=>exhausted||e.id!==event.id).map(e=>[e.id,e.maxOccurrencesPerLife]))};
  return chooseOption({...base,rng,state,facts:[{id:0,eventId:'setup',age:20,realm,stateSnapshot:structuredClone(state)}],phase:'awaiting_choice',
    pendingChoice:{eventId:'resume',options:[{id:'continue',text:'Continue',outcomes:[{id:'resume',text:'Resume',weight:1,effects:{}}]}]}},'continue');
}

test('265 new choices have exact exclusive realm counts and obey engine eligibility',()=>{
  assert.equal(batch.length,265);
  assert.equal(new Set(batch.map(e=>e.text)).size,265);
  for(const [realm,count] of Object.entries(counts))assert.equal(batch.filter(e=>e.allowedRealms.length===1&&e.allowedRealms[0]===realm).length,count,realm);
  for(const event of batch){
    const run=encounter(event);
    assert.equal(run.phase,'awaiting_choice',event.id);
    assert.equal(run.pendingChoice.eventId,event.id);
    assert.equal(run.pendingChoice.options.length,3);
    assert.ok(!run.facts.some(f=>f.eventId.startsWith(event.id+'-')));
    const wrongRealm=(run.state.realm+1)%realms.length;
    for(const excluded of [encounter(event,{realm:wrongRealm}),encounter(event,{exhausted:true}),
      ...(event.conditions?.health?[encounter(event,{health:event.conditions.health-1})]:[]),
      ...(event.conditions?.resources?[encounter(event,{resources:event.conditions.resources-1})]:[])]){
      assert.ok(!excluded.facts.some(f=>f.eventId===event.id),event.id);
    }
  }
});

test('all new branches apply the chosen outcome once; pending choices survive save and translation',()=>{
  for(const event of batch){
    for(const option of event.choices){
      for(const outcome of option.outcomes){
        const run=encounter(event,{outcomeId:outcome.id});
        const before=JSON.stringify(run.state),seed=run.rng.getState();
        for(const language of ['zh','en']){
          translate(event.text,language);
          for(const choice of run.pendingChoice.options)translate(choice.text,language);
        }
        assert.equal(run.rng.getState(),seed);
        assert.equal(JSON.stringify(run.state),before);
        const saved=decodeSave(encodeSave({engineRun:run,session:{runCount:1,pityCount:0},language:'en',speed:1,paused:true}));
        assert.deepEqual(saved.engineRun.pendingChoice,run.pendingChoice);
        assert.equal(saved.engineRun.rng.getState(),seed);
        const result=chooseOption(run,option.id);
        const facts=result.facts.filter(f=>f.eventId===`${event.id}-${outcome.id}`);
        assert.equal(facts.length,1,`${event.id}/${option.id}/${outcome.id}`);
        for(const key of ['health','resources','cultivationProgress']){
          const effectKey=key==='cultivationProgress'?'cultivation':key;
          const expected=Math.max(0,run.state[key]+(outcome.effects[effectKey]||0));
          assert.equal(facts[0].stateSnapshot[key],key==='health'?Math.min(100,expected):expected);
        }
        assert.equal(result.state.eventCounts[event.id],1);
        assert.equal(JSON.stringify(run.state),before);
      }
    }
  }
});
