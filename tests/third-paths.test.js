import test from 'node:test';
import assert from 'node:assert/strict';
import {events} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {translate} from '../src/i18n/index.js';

const upgraded=events.filter(e=>e.choices?.some(c=>c.id==='third_path'));
const base=startLife({runCount:0,pityCount:0},createRng(12)).run;
function pending(event,options=event.choices){
  const realm=realms.findIndex(r=>r.id===(event.allowedRealms?.[0]||'qi_refining'));
  const state={...base.state,age:20,realm,subrealm:0,cultivationProgress:0,health:100,resources:100,lifespanLimit:22,alive:true,
    eventCounts:Object.fromEntries(events.map(e=>[e.id,e.maxOccurrencesPerLife]))};
  return {...base,rng:createRng(1),state,facts:[{id:0,eventId:event.id,age:20,realm,stateSnapshot:structuredClone(state)}],phase:'awaiting_choice',pendingChoice:{eventId:event.id,age:20,title:event.title,prompt:event.text,options}};
}

test('third paths stay within three options and binary commitments remain binary',()=>{
  assert.equal(upgraded.length,46);
  assert.equal(events.filter(e=>e.choices?.length===3).length,325);
  for(const id of ['sect','partner','v2_furnace','v2_tablet','ascendant30_true_immortal_coin','combat_choice_pool-contest']){
    assert.equal(events.find(e=>e.id===id).choices.length,2,id);
  }
  for(const event of upgraded){
    assert.equal(event.choices.length,3);
    assert.equal(new Set(event.choices.map(c=>c.text)).size,3);
    const option=event.choices.find(c=>c.id==='third_path');
    for(const language of ['zh','en']){
      assert.notEqual(translate(option.text,language),option.text);
      assert.notEqual(translate(option.hint,language),option.hint);
    }
  }
});

test('new actions apply their own effects once and older pending two-option saves still resolve',()=>{
  for(const event of upgraded){
    const run=pending(event),before=JSON.stringify(run.state);
    const next=chooseOption(run,'third_path');
    const facts=next.facts.filter(f=>f.eventId===`${event.id}-third_path_done`);
    assert.equal(facts.length,1,event.id);
    const effects=event.choices.find(c=>c.id==='third_path').outcomes[0].effects;
    assert.equal(facts[0].stateSnapshot.resources,100+(effects.resources||0));
    assert.equal(facts[0].stateSnapshot.health,Math.min(100,100+(effects.health||0)));
    assert.equal(facts[0].stateSnapshot.cultivationProgress,effects.cultivation||0);
    assert.equal(JSON.stringify(run.state),before);
    const original=event.choices.filter(c=>c.id!=='third_path');
    const old=pending(event,original);
    const restored=decodeSave(encodeSave({engineRun:old,session:{runCount:1,pityCount:0},language:'vi',speed:1,paused:true})).engineRun;
    assert.equal(restored.pendingChoice.options.length,2);
    assert.deepEqual(restored.pendingChoice.options,original);
    assert.doesNotThrow(()=>chooseOption(restored,original.at(-1).id));
  }
});
