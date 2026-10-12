import test from 'node:test';
import assert from 'node:assert/strict';
import {goodProfileChance} from '../src/engine/profile.js';

test('birth pity grows at one third of the previous rate while preserving base and cap',()=>{
  assert.equal(goodProfileChance(0),.05);
  for(const pity of [1,10,20,30]){
    assert.ok(Math.abs((goodProfileChance(pity)-.05)-.02*pity/3)<1e-12);
  }
  assert.ok(Math.abs(goodProfileChance(20)-11/60)<1e-12);
  assert.equal(goodProfileChance(30),.25);
  assert.ok(goodProfileChance(29)<.25);
  assert.equal(goodProfileChance(31),.25);
  assert.equal(goodProfileChance(1000),.25);
});
