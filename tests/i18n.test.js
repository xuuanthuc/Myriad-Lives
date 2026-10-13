import test from 'node:test';
import assert from 'node:assert/strict';
import { languages,translate,translateName,validateTranslations } from '../src/i18n/index.js';
import { events,wordCount,eventOutcomes } from '../src/engine/content.js';
import { createRng } from '../src/engine/rng.js';
import { startLife,autoComplete } from '../src/engine/lifeRunner.js';

test('all 1338 encounters and 384 choices have complete translations',()=>{
  assert.deepEqual(languages.map(x=>x.id),['vi','zh','en']);
  assert.equal(events.length,1338);
  assert.equal(events.filter(e=>e.choices).length,384);
  assert.equal(validateTranslations(),true);
  for(const event of events) {
    assert.equal(translate(event.text,'vi'),event.text);
    for(const language of ['zh','en']) {
      assert.notEqual(translate(event.text,language),event.text);
      for(const outcome of eventOutcomes(event)){
        assert.notEqual(translate(outcome.text,language),outcome.text);
        if(outcome.endingReason)assert.notEqual(translate(outcome.endingReason,language),outcome.endingReason);
      }
      for(const option of event.choices||[]) {
        assert.notEqual(translate(option.text,language),option.text);
        for(const outcome of option.outcomes)assert.notEqual(translate(outcome.text,language),outcome.text);
      }
    }
  }
});

test('switching language mid-life preserves fate and translates generated facts',()=>{
  for(let seed=1;seed<=250;seed++) {
    const session={runCount:0,pityCount:seed%20};
    const left=startLife(session,createRng(seed));
    const right=startLife(session,createRng(seed));
    const facts=JSON.stringify(left.run.facts);
    for(const language of ['zh','en','vi']) {
      for(const fact of left.run.facts) {
        translate(fact.title,language);
        translate(fact.text,language);
      }
      if(left.run.pendingChoice)for(const option of left.run.pendingChoice.options)translate(option.text,language);
    }
    assert.equal(JSON.stringify(left.run.facts),facts);
    assert.deepEqual(left.nextSession,right.nextSession);
    const result=autoComplete(left.run),control=autoComplete(right.run);
    assert.deepEqual(result.facts,control.facts);
    assert.deepEqual(result.state,control.state);
    for(const fact of result.facts)for(const language of ['zh','en']) {
      const text=translate(fact.text,language),title=translate(fact.title,language);
      assert.notEqual(text,fact.text,`${language}: ${fact.eventId}`);
      assert.notEqual(title,fact.title,`${language}: ${fact.title}`);
      if(language==='en')assert.ok(wordCount(text)>=15&&wordCount(text)<=35,text);
      else assert.match(text,/\p{Script=Han}/u);
    }
    for(const language of ['zh','en'])assert.notEqual(translate(result.result.endingReason,language),result.result.endingReason);
  }
});

test('character names use Chinese characters or romanization',()=>{
  assert.equal(translateName('Lâm Vô Trần','vi'),'Lâm Vô Trần');
  assert.equal(translateName('Lâm Vô Trần','zh'),'林无尘');
  assert.equal(translateName('Lâm Vô Trần','en'),'Lin Wuchen');
});
