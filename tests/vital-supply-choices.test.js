import test from 'node:test';
import assert from 'node:assert/strict';
import {events,eventOutcomes,wordCount} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';
import {eligible} from '../src/engine/eventEligibility.js';
import {startLife,chooseOption} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {luckOutcomeWeights} from '../src/engine/luck.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {translate} from '../src/i18n/index.js';
import {visibleRun} from '../src/engine/playback.js';

const added=events.filter(event=>event.id.startsWith('vital_supply_'));
const base=startLife({runCount:0,pityCount:0},createRng(14)).run;
function pending(event,seed=1,health=80,resources=200){
  const realm=realms.findIndex(item=>item.id===event.allowedRealms[0]);
  const state={...base.state,age:20,realm,subrealm:0,cultivationProgress:0,health,resources,luck:50,lifespanLimit:21,alive:true,eventCounts:{},cooldowns:{}};
  return {...base,profile:{...base.profile,luck:50},world:{...base.world,danger:1},rng:createRng(seed),state,
    facts:[{id:0,eventId:event.id,title:event.title,text:event.text,category:event.category,age:20,realm,stateSnapshot:structuredClone(state)}],result:undefined,
    phase:'awaiting_choice',pendingChoice:{eventId:event.id,age:20,title:event.title,prompt:event.text,options:event.choices}};
}
function seedFor(option,outcome){
  for(let seed=1;seed<1000;seed++){
    const rng=createRng(seed);
    if(rng.weightedPick(luckOutcomeWeights(option.outcomes,50,1)).id===outcome.id)return seed;
  }
  throw Error(`Unreachable outcome ${option.id}/${outcome.id}`);
}

test('1400 new supply choices have 100 exclusive encounters per realm and varied tradeoffs',()=>{
  assert.equal(added.length,1400);
  assert.equal(new Set(added.map(event=>event.id)).size,1400);
  assert.equal(new Set(added.map(event=>event.title)).size,1400);
  assert.deepEqual(Object.fromEntries(['life','cultivation','opportunity','disaster'].map(category=>[category,added.filter(event=>event.category===category).length])),{life:700,cultivation:280,opportunity:280,disaster:140});
  for(const realm of realms)assert.equal(added.filter(event=>event.allowedRealms.length===1&&event.allowedRealms[0]===realm.id).length,100,realm.id);
  for(const event of added){
    assert.equal(event.choices.length,3,event.id);
    assert.equal(new Set(event.choices.map(choice=>choice.text)).size,3,event.id);
    assert.equal(event.maxOccurrencesPerLife,1);
    assert.equal(event.weight,1);
    const outcomes=eventOutcomes(event);
    for(const direction of [1,-1])assert.ok(outcomes.some(outcome=>(outcome.effects.health??0)*direction>0),`${event.id}: health ${direction}`);
    assert.ok(outcomes.some(outcome=>outcome.effects.resources!==0),`${event.id}: resources change`);
    for(const outcome of outcomes){
      assert.ok(Object.keys(outcome.effects).every(key=>['health','resources','luck'].includes(key)),event.id);
      const blessedRescue=/_evacuate_(01|05)$/.test(event.id)&&outcome.id==='escaped';
      assert.equal(outcome.effects.luck,blessedRescue?1:undefined,event.id);
      if(outcome.effects.health<0){assert.ok(outcome.endingReason);assert.ok(outcome.translations.zh.endingReason);assert.ok(outcome.translations.en.endingReason);}
    }
  }
});

test('new narratives are distinct, localized, bounded and contain no draft placeholders',()=>{
  for(const language of ['vi','zh','en']){
    const prompts=added.map(event=>translate(event.text,language));
    assert.equal(new Set(prompts).size,1400,language);
    for(const event of added){
      for(const text of [event.text,...eventOutcomes(event).map(outcome=>outcome.text)]){
        const value=translate(text,language);
        assert.doesNotMatch(value,/\{[a-z]+\}|draft_event|TODO|placeholder/iu);
        if(language==='zh'){assert.match(value,/\p{Script=Han}/u);assert.ok(value.length>=15&&value.length<=160);}
        else assert.ok(wordCount(value)>=15&&wordCount(value)<=35,value);
      }
      for(const choice of event.choices)for(const field of ['text','hint'])if(language!=='vi')assert.notEqual(translate(choice[field],language),choice[field]);
    }
  }
});

test('realm scopes, supply requirements and encounter limits are enforced for all new events',()=>{
  for(const event of added){
    const run=pending(event);
    assert.equal(eligible(event,run),true,event.id);
    for(let realm=0;realm<realms.length;realm++)assert.equal(eligible(event,{...run,state:{...run.state,realm}}),realm===run.state.realm,event.id);
    assert.equal(eligible(event,{...run,state:{...run.state,eventCounts:{[event.id]:1}}}),false);
    assert.equal(eligible(event,{...run,state:{...run.state,cooldowns:{[event.id]:21}}}),false);
    if(event.conditions?.resources){
      assert.equal(eligible(event,{...run,state:{...run.state,resources:event.conditions.resources-1}}),false);
      assert.equal(eligible(event,{...run,state:{...run.state,resources:event.conditions.resources}}),true);
      for(const choice of event.choices)if(choice.outcomes.length===1)assert.ok(event.conditions.resources+(choice.outcomes[0].effects.resources||0)>=0);
    }
  }
});

test('every new outcome changes health and supplies exactly once, with no extra RNG or future leakage',()=>{
  for(const event of added)for(const choice of event.choices)for(const outcome of choice.outcomes){
    const seed=seedFor(choice,outcome),run=pending(event,seed);
    const stateBefore=structuredClone(run.state),factsBefore=structuredClone(run.facts);
    const expectedRng=createRng(seed);expectedRng.weightedPick(luckOutcomeWeights(choice.outcomes,50,1));
    const next=chooseOption(run,choice.id);
    const resolved=next.facts.filter(fact=>fact.eventId===event.id+'-'+outcome.id);
    assert.equal(resolved.length,1,event.id);
    assert.equal(resolved[0].stateSnapshot.health,Math.max(0,Math.min(100,80+outcome.effects.health)),event.id);
    assert.equal(resolved[0].stateSnapshot.resources,Math.max(0,200+outcome.effects.resources),event.id);
    assert.equal(resolved[0].stateSnapshot.luck,50+(outcome.effects.luck??0),event.id);
    assert.equal(next.rng.getState(),expectedRng.getState(),event.id);
    assert.deepEqual(run.state,stateBefore);
    assert.deepEqual(run.facts,factsBefore);
    const shown=visibleRun(next,1);
    assert.equal(shown.state.health,80);
    assert.equal(shown.state.resources,200);
    assert.equal(shown.state.luck,50);
    assert.equal(shown.pendingChoice,null);
    assert.equal(shown.result,undefined);
  }
});

test('pending new choices survive save and translation, and injuries can end a life with the right cause',()=>{
  for(const realm of realms){
    const event=added.find(item=>item.allowedRealms[0]===realm.id&&item.id.includes('_salvage_'));
    const choice=event.choices[0],injury=choice.outcomes.find(outcome=>outcome.effects.health< -15);
    const original=pending(event,seedFor(choice,injury),5,2);
    const saved=encodeSave({engineRun:original,session:{runCount:original.number,pityCount:0},language:'vi',speed:1,paused:true});
    const restored=decodeSave(saved).engineRun;
    const before=JSON.stringify(restored.pendingChoice),rngBefore=restored.rng.getState();
    for(const language of ['zh','en','vi'])for(const option of restored.pendingChoice.options){translate(option.text,language);translate(option.hint,language);}
    assert.equal(JSON.stringify(restored.pendingChoice),before);
    assert.equal(restored.rng.getState(),rngBefore);
    assert.deepEqual(restored.pendingChoice.options,event.choices);
    const next=chooseOption(restored,choice.id);
    assert.equal(next.phase,'finished');
    assert.equal(next.state.health,0);
    assert.equal(next.state.resources,0);
    assert.equal(next.result.endingReason,injury.endingReason);
  }
});

test('a rescue choice saved before fortune rewards keeps its original effects when resumed',()=>{
  const event=added.find(item=>item.id==='vital_supply_mortal_evacuate_01');
  const original=pending(event);
  original.pendingChoice.options=structuredClone(event.choices);
  const guide=original.pendingChoice.options.find(option=>option.id==='guide');
  delete guide.outcomes[0].effects.luck;
  guide.outcomes[0].text='Lời kể đã lưu từ phiên bản cũ.';
  const restored=decodeSave(encodeSave({engineRun:original,session:{runCount:1,pityCount:0}})).engineRun;
  const next=chooseOption(restored,'guide');
  const resolved=next.facts.find(fact=>fact.eventId===event.id+'-escaped');
  assert.equal(resolved.text,guide.outcomes[0].text);
  assert.equal(resolved.stateSnapshot.luck,50);
  assert.equal(next.state.luck,50);
  assert.equal(resolved.traitChanges?.some(change=>change.trait==='luck')??false,false);
});
