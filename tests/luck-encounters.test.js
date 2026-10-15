import test from 'node:test';
import assert from 'node:assert/strict';
import {events} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';

const event=id=>{const found=events.find(e=>e.id===id);assert.ok(found,id);return found;};
const result=(e,choice,outcome)=>e.choices.find(c=>c.id===choice).outcomes.find(o=>o.id===outcome);
test('each realm rewards rescue and kept promises, while blood curses cost fortune',()=>{
  for(const realm of realms){
    for(const plane of ['peaceful','blood','shattered','hidden']){
      const e=event(`plane_${plane}_${realm.id}_04`);
      assert.equal(result(e,'commit','success').effects.luck,2,e.id);
      assert.equal(result(e,'assist','assisted').effects.luck,1,e.id);
      for(const c of e.choices)for(const o of c.outcomes){
        if(o.effects.death||!['success','assisted'].includes(o.id))assert.equal(o.effects.luck,undefined,e.id);
      }
    }
    assert.equal(result(event(`plane_hidden_${realm.id}_01`),'commit','success').effects.luck,1);
    assert.equal(result(event(`plane_blood_${realm.id}_03`),'commit','setback').effects.luck,-2);
    const covenant=event(`plane_blood_${realm.id}_05`);
    assert.equal(result(covenant,'commit','success').effects.luck,1);
    assert.equal(result(covenant,'commit','setback').effects.luck,-3);
  }
});

test('specific automatic curses and karmic debts drain fortune without replacing existing costs',()=>{
  assert.deepEqual(event('wandering_nascent_soul_ink-curse').effects,{resources:-14,health:-5,luck:-2});
  assert.deepEqual(event('realm_mahayana_karma').effects,{health:-10,resources:-16,luck:-2});
  assert.equal(event('sparse_immortal_king_oath_wraith').outcomes.find(o=>o.id==='injury').effects.luck,-2);
  assert.equal(event('peril_immortal_emperor_karma_name').outcomes.find(o=>o.id==='survive').effects.luck,-3);
});
