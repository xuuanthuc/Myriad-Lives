import test from 'node:test';
import assert from 'node:assert/strict';
import {realmDataStats,summarizeEvents} from '../scripts/lib/data-stats.mjs';
import {events} from '../src/engine/content.js';
import {realms} from '../src/data/realms.js';

test('stats distinguish unrestricted, shared and exclusive events without counting choices as extra events',()=>{
  const fixtures=[
    {id:'global',category:'life'},
    {id:'shared',category:'opportunity',allowedRealms:['a','b'],conditions:{physique:'Rare',sectStatus:'member'},choices:[{outcomes:[{},{}]},{outcomes:[{}]}]},
    {id:'exclusive',category:'disaster',allowedRealms:['a'],conditions:{partnerStatus:'bonded'}},
    {id:'empty',category:'cultivation',allowedRealms:[]},
  ];
  const [a,b,c]=realmDataStats(fixtures,[{id:'a'},{id:'b'},{id:'c'}]);
  assert.equal(a.total,3);assert.equal(a.exclusive,1);assert.equal(a.shared,2);
  assert.equal(a.choices,1);assert.equal(a.options,2);assert.equal(a.outcomes,3);assert.equal(a.narratives,6);
  assert.equal(a.conditional,2);assert.equal(a.physique,1);assert.equal(a.sect,1);assert.equal(a.partner,1);
  assert.equal(b.total,2);assert.equal(b.exclusive,0);assert.equal(b.shared,2);
  assert.equal(c.total,1);assert.equal(c.life,1);assert.equal(c.choices,0);
  assert.equal(summarizeEvents(fixtures).total,4);
  assert.equal(summarizeEvents([]).outcomes,0);
});

test('real content totals and per-realm category counts remain internally consistent as data grows',()=>{
  const overall=summarizeEvents(events),report=realmDataStats(events,realms);
  assert.equal(overall.total,events.length);
  assert.equal(report.length,realms.length);
  for(const row of report){
    assert.equal(row.total,row.life+row.cultivation+row.opportunity+row.disaster);
    assert.equal(row.total,row.exclusive+row.shared);
    assert.equal(row.narratives,row.total+row.outcomes);
    assert.ok(row.conditional<=row.total);
    assert.ok(row.choices<=row.total);
    assert.equal(new Set(row.events.map(e=>e.id)).size,row.total);
  }
});

test('automatic battle outcomes count as narrative variants, not additional encounters or choices',()=>{
  const event={id:'battle',category:'disaster',combat:true,allowedRealms:['a'],outcomes:[{},{},{}]};
  const [row]=realmDataStats([event],[{id:'a'}]);
  assert.equal(row.total,1);assert.equal(row.choices,0);assert.equal(row.automatic,1);
  assert.equal(row.combat,1);assert.equal(row.outcomes,3);assert.equal(row.narratives,4);
});
