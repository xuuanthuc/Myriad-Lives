import test from 'node:test';
import assert from 'node:assert/strict';
import {generateWorld} from '../src/engine/profile.js';
import {createRng} from '../src/engine/rng.js';
import {worldPlanes,worldPlaneName} from '../src/data/worlds.js';
import {translate} from '../src/i18n/index.js';

test('world generation preserves each plane’s coefficient ranges and translations',()=>{
  const seen=new Set();
  for(let seed=0;seed<1000;seed++){
    const world=generateWorld(createRng(seed));
    const plane=worldPlanes.find(p=>p.id===world.planeId);
    seen.add(plane.id);
    ['danger','opportunity','resources','cultivationDifficulty','stability'].forEach((key,index)=>{
      const [min,max]=plane.ranges[index];
      assert.ok(world[key]>=min&&world[key]<max);
    });
    assert.equal(worldPlaneName(world),plane.name);
    assert.notEqual(translate(plane.name,'zh'),plane.name);
    assert.notEqual(translate(plane.name,'en'),plane.name);
    assert.deepEqual(world,generateWorld(createRng(seed)));
  }
  assert.equal(seen.size,8);
});

test('legacy worlds get a stable display name without changing saved coefficients',()=>{
  for(const descriptor of ['Loạn thế phong vân','Linh khí hưng thịnh','Hiểm họa trùng trùng','Thiên hạ bình hòa']){
    const world={descriptor,danger:1.12,resources:.83};
    const before=structuredClone(world);
    assert.ok(worldPlanes.some(p=>p.name===worldPlaneName(world)));
    assert.equal(worldPlaneName(world),worldPlaneName(world));
    assert.deepEqual(world,before);
  }
});
