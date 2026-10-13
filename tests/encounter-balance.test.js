import test from 'node:test';
import assert from 'node:assert/strict';
import {combatEncounterFactor,explorationEventFrequency,explorationEncounterFactor} from '../src/engine/encounterBalance.js';
import {combatEvents} from '../src/data/combatEvents.js';
import {realmConflicts} from '../src/data/realmConflicts.js';
import {combatChoices} from '../src/data/combatChoices.js';

test('automatic enemies gain weight, especially at the last two realms; voluntary choices retain their weights',()=>{
  for(const event of [...combatEvents,...realmConflicts]){
    assert.equal(combatEncounterFactor(event,1),1.3);
    assert.equal(combatEncounterFactor(event,12),1.75);
    assert.equal(combatEncounterFactor(event,13),2);
  }
  for(const event of [...combatChoices,{id:'quiet-retreat'}])assert.equal(combatEncounterFactor(event,13),1);
});

test('post-failure travel increases encounters and favors enemies and opportunities until its deadline',()=>{
  const state={age:200,explorationStartedAge:200,explorationUntilAge:300};
  assert.equal(explorationEventFrequency(state,.01),.04);
  assert.equal(explorationEncounterFactor(combatEvents[0],state),1.5);
  assert.equal(explorationEncounterFactor({category:'opportunity'},state),1.4);
  assert.equal(explorationEventFrequency({...state,age:300},.01),.01);
  assert.equal(explorationEncounterFactor(combatEvents[0],{...state,age:300}),1);
  assert.equal(explorationEventFrequency({age:200},.01),.01);
});
