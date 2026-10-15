import test from 'node:test';
import assert from 'node:assert/strict';
import {currentProfile,applyProfileEffects} from '../src/engine/profileEvolution.js';
import {startLife,chooseOption,attemptBreakthrough} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {visibleRun} from '../src/engine/playback.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';
import {summarizeLife} from '../src/engine/lifeHistory.js';
import {events,validateContent} from '../src/engine/content.js';
import {eligible} from '../src/engine/eventEligibility.js';
import {roots,realms} from '../src/data/realms.js';
import {partnerForRun} from '../src/data/partners.js';
import {sectNameForRun} from '../src/data/sects.js';
import {genderName} from '../src/data/genders.js';
import {breakthroughAge,breakthroughRecoveryYears} from '../src/engine/cultivationTime.js';
import {fatalBreakthroughChance} from '../src/engine/breakthrough.js';
import {translate} from '../src/i18n/index.js';
import {choiceEncounterFactor} from '../src/engine/encounterBalance.js';

function fixture(){
  const base=startLife({runCount:0,pityCount:0},createRng(12)).run;
  const state={...base.state,age:60,alive:true,realm:2,realmEnteredAge:40,health:100,lifespanLimit:61,resources:50,partnerStatus:'bonded',sectStatus:'member',eventCounts:{},cooldowns:{}};
  const profile={...base.profile,root:roots[1],luck:50};
  delete profile.gender;delete profile.sectName; // Also exercise legacy identity fallbacks.
  return {...base,state,profile,rng:createRng(123),result:undefined,phase:'awaiting_choice',facts:[{id:0,age:60,realm:2,title:'Mốc cũ',eventId:'before',stateSnapshot:structuredClone(state)}],pendingChoice:{eventId:'test',options:[{id:'accept',text:'Thử cải thiện linh căn',outcomes:[{id:'changed',weight:1,text:events.find(e=>e.id==='fate_blessing').text,effects:{luck:5,rootUpgrade:1}}]}]}};
}

test('trait changes resolve once, are narrated with snapshots, persist, and preserve birth identity',()=>{
  const before=fixture(),original=JSON.stringify(before),rngBefore=before.rng.getState();
  const result=chooseOption(before,'accept');
  assert.deepEqual(before.profile,result.profile);
  assert.equal(JSON.stringify({...before,rng:undefined}),JSON.stringify({...JSON.parse(original),rng:undefined}));
  assert.notEqual(result.rng.getState(),rngBefore);
  assert.equal(currentProfile(result).luck,55);
  assert.equal(currentProfile(result).root.name,roots[2].name);
  assert.deepEqual(result.facts[1].traitChanges,[{trait:'luck',before:50,after:55},{trait:'root',before:roots[1].name,after:roots[2].name}]);
  const hidden=visibleRun(result,1),shown=visibleRun(result,2);
  assert.equal(currentProfile(hidden).luck,50);assert.equal(currentProfile(hidden).root.name,roots[1].name);
  assert.equal(currentProfile(shown).luck,55);assert.equal(currentProfile(shown).root.name,roots[2].name);
  assert.equal(summarizeLife(hidden).luck,50);assert.equal(summarizeLife(shown).luck,55);
  assert.equal(summarizeLife(shown).root,roots[2].name);
  assert.deepEqual(partnerForRun(before),partnerForRun(shown));
  assert.equal(sectNameForRun(before),sectNameForRun(shown));
  assert.equal(genderName(before.profile),genderName(shown.profile));
  const saved=encodeSave({engineRun:result,session:{runCount:1,pityCount:0},language:'vi',speed:1,playback:{number:1,count:1,from:1,elapsed:0}});
  const restored=decodeSave(saved).engineRun;
  assert.deepEqual(restored.state,result.state);
  assert.deepEqual(restored.facts,result.facts);
  assert.equal(restored.rng.getState(),result.rng.getState());
  const unchanged=JSON.stringify(restored.facts),rng=restored.rng.getState();
  for(const language of ['vi','zh','en'])for(const change of restored.facts[1].traitChanges){
    assert.ok(translate(String(change.before),language));assert.ok(translate(String(change.after),language));
  }
  assert.equal(JSON.stringify(restored.facts),unchanged);assert.equal(restored.rng.getState(),rng);
  assert.throws(()=>chooseOption(restored,'accept'));
});

test('luck clamps at both ends and current traits affect eligibility, breakthrough safety and timing',()=>{
  const run=fixture(),rng=run.rng.getState();
  applyProfileEffects(run,{luck:100});assert.equal(currentProfile(run).luck,100);
  applyProfileEffects(run,{luck:-300});assert.equal(currentProfile(run).luck,0);
  const baseline=fixture();
  const oldAge=breakthroughAge(baseline),oldRecovery=breakthroughRecoveryYears(baseline);
  applyProfileEffects(baseline,{luck:30,rootUpgrade:1});
  assert.ok(breakthroughAge(baseline)<oldAge);assert.ok(breakthroughRecoveryYears(baseline)<oldRecovery);
  assert.ok(fatalBreakthroughChance(currentProfile(baseline),3,1)<fatalBreakthroughChance(baseline.profile,3,1));
  assert.equal(eligible({...events[0],minAge:0,maxAge:999,allowedRealms:['foundation'],allowedPlanes:undefined,conditions:{luck:75,root:roots[2].name}},baseline),true);
  const gender=genderName(baseline.profile)==='Nam'?'male':'female';
  assert.equal(eligible({...events[0],minAge:0,maxAge:999,allowedRealms:['foundation'],allowedPlanes:undefined,conditions:{gender}},baseline),true);
  assert.equal(run.rng.getState(),rng);
  assert.equal(run.profile.luck,50);
  run.state.root=roots.at(-1);applyProfileEffects(run,{rootUpgrade:1});assert.deepEqual(run.state.root,roots.at(-1));
  assert.equal(currentProfile(fixture()).luck,50);
});

test('root encounters are rare, restricted to Foundation through Integration, and share one lifetime offer',()=>{
  const rootEvents=events.filter(e=>e.exclusiveGroup==='root_transformation');
  assert.equal(rootEvents.length,3);
  for(const event of rootEvents){
    assert.equal(event.weight,1);assert.equal(event.maxOccurrencesPerLife,1);
    for(let realm=0;realm<realms.length;realm++){
      const run=fixture();run.state.realm=realm;
      assert.equal(eligible(event,run),realm>=2&&realm<=7);
      run.state.encounterGroups={root_transformation:true};assert.equal(eligible(event,run),false);
    }
  }
  const run=fixture();run.state.realm=1;run.state.age=30;run.state.lifespanLimit=125;
  run.pendingChoice={kind:'breakthrough',options:[{id:'attempt'}]};
  run.rng.float=()=>0;
  run.rng.weightedPick=items=>items.find(item=>item.value.id===rootEvents[0].id)?.value??items[0].value;
  const offered=attemptBreakthrough(run);
  assert.equal(offered.pendingChoice.eventId,rootEvents[0].id);
  assert.equal(offered.state.encounterGroups.root_transformation,true);
  assert.equal(run.state.encounterGroups,undefined);
  assert.ok(rootEvents.every(event=>!eligible(event,offered)));
  const pendingSave=decodeSave(encodeSave({engineRun:offered,session:{runCount:1,pityCount:0}})).engineRun;
  assert.ok(rootEvents.every(event=>!eligible(event,pendingSave)));
  pendingSave.state.lifespanLimit=pendingSave.state.age+1;
  const declined=chooseOption(pendingSave,'leave');
  assert.equal(currentProfile(declined).root.name,roots[1].name);
  assert.equal(declined.state.encounterGroups.root_transformation,true);
});

test('new schema rejects invalid root upgrades, luck deltas and encounter groups',()=>{
  const event=events.find(e=>e.id==='fate_blessing');
  for(const effects of [{rootUpgrade:2},{rootUpgrade:'1'},{luck:NaN},{luck:'5'}])assert.throws(()=>validateContent([{...event,effects}]));
  assert.throws(()=>validateContent([{...event,exclusiveGroup:'unknown'}]));
  assert.throws(()=>validateContent([{...event,conditions:{rootBelow:'100'}}]));
});

test('later choice rolls and confirmed breakthroughs use evolved traits rather than birth traits',()=>{
  const run=fixture();run.state.luck=80;
  run.pendingChoice.options[0].outcomes=[
    {id:'good',weight:50,text:'good',effects:{resources:10}},
    {id:'bad',weight:50,text:'bad',effects:{health:-10}},
  ];
  run.rng.float=()=>.6;
  const result=chooseOption(run,'accept');
  assert.equal(result.facts[1].eventId,'test-good');
  assert.equal(result.profile.luck,50);
  const breakthrough=fixture();
  breakthrough.state.realm=8;breakthrough.state.root=roots[5];breakthrough.state.luck=100;
  breakthrough.world={...breakthrough.world,danger:1,cultivationDifficulty:1};
  breakthrough.pendingChoice={kind:'breakthrough',options:[{id:'attempt'}]};
  let draws=0;breakthrough.rng.float=()=>++draws===1?.999:.26;
  const survived=attemptBreakthrough(breakthrough);
  assert.equal(draws,2);assert.equal(survived.facts[1].eventId,'failed-60');
  assert.equal(survived.result.endingReason,'Thọ nguyên đã cạn');
});

test('eligible choice encounters receive triple base weight without altering their outcome odds',()=>{
  const rootEvent=events.find(e=>e.id==='root_jade_spring');
  const run=fixture();run.state.realm=1;run.state.age=30;run.state.lifespanLimit=125;
  run.pendingChoice={kind:'breakthrough',options:[{id:'attempt'}]};run.rng.float=()=>0;
  run.rng.weightedPick=items=>{
    const item=items.find(item=>item.value.id===rootEvent.id);
    assert.ok(item);
    assert.equal(item.weight,rootEvent.weight*3*run.world.opportunity*1.1);
    return item.value;
  };
  const offered=attemptBreakthrough(run);
  assert.deepEqual(offered.pendingChoice.options,rootEvent.choices);
  assert.equal(choiceEncounterFactor(events.find(e=>e.id==='fate_blessing')),1);
});

test('selected older encounters change luck only on their special outcomes and preserve saved pending options',()=>{
  const selected=[
    ['v2_healer','risk','success',3],
    ['v2_bridge','risk','failure',3],
    ['treasure30_spirit_transformation_echo','claim','gain',5],
    ['peril_immortal_king_ancestral_curse',null,'survive',-5],
    ['sparse2_immortal_emperor_karma_vines',null,'injury',-4],
    ['treasure30_nascent_soul_mirror',null,'injury',-3],
    ['sparse3_immortal_emperor_quiet_world','attempt','success',4],
    ['ascendant30_immortal_king_chess',null,null,3],
    ['early_realms_echoes_035','engage','result',3],
    ['lower_realms_colors_041',null,null,3],
  ];
  for(const [id,choiceId,outcomeId,delta] of selected){
    const event=events.find(e=>e.id===id),run=fixture();
    assert.equal(event.maxOccurrencesPerLife,1);
    run.state.realm=realms.findIndex(r=>r.id===(event.allowedRealms?.[0]??'qi_refining'));
    run.state.cultivationProgress=0;
    run.rng.float=()=>0;
    run.rng.weightedPick=items=>items.find(item=>item.value.id===(outcomeId||id))?.value??items.find(item=>item.value.id===id)?.value??items[0].value;
    if(choiceId){run.pendingChoice={eventId:id,options:event.choices};}
    else{
      // Resolve a neutral action, then force the automatic encounter next year.
      run.pendingChoice.options[0].outcomes[0].effects={};
      run.state.lifespanLimit=run.state.age+2;
      run.state.eventCounts=Object.fromEntries(events.filter(e=>e.id!==id).map(e=>[e.id,e.maxOccurrencesPerLife]));
    }
    const next=chooseOption(run,choiceId||'accept');
    assert.equal(currentProfile(next).luck,50+delta,id);
    assert.equal(run.profile.luck,50);
    const change=next.facts.find(f=>f.traitChanges?.some(c=>c.trait==='luck'));
    assert.deepEqual(change.traitChanges,[{trait:'luck',before:50,after:50+delta}]);
    for(const language of ['zh','en'])assert.notEqual(translate(change.text,language),change.text);
  }
  const bridge=events.find(e=>e.id==='v2_bridge');
  assert.equal(bridge.choices.find(c=>c.id==='safe').outcomes[0].effects.luck,undefined);
  const run=fixture(),oldOptions=structuredClone(bridge.choices);
  for(const c of oldOptions)for(const o of c.outcomes)delete o.effects.luck;
  run.pendingChoice={eventId:bridge.id,options:oldOptions};
  const loaded=decodeSave(encodeSave({engineRun:run,session:{runCount:1,pityCount:0}})).engineRun;
  loaded.rng.weightedPick=items=>items.find(item=>item.value.id==='failure').value;
  assert.equal(currentProfile(chooseOption(loaded,'risk')).luck,50);
});
