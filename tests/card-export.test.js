import test from 'node:test';
import assert from 'node:assert/strict';
import {createActionLock} from '../src/utils/actionLock.js';
import {cachedFateCard,cardCacheKey} from '../src/utils/cardCache.js';

test('share lock blocks repeat clicks and reincarnation until success, cancel or failure releases it',async()=>{
  for(const failure of [false,true]){
    const lock=createActionLock();
    assert.equal(lock.acquire(),true);
    assert.equal(lock.acquire(),false);
    assert.equal(lock.isLocked(),true);
    try{if(failure)throw Error('cancelled or failed');}catch{}finally{lock.release();}
    assert.equal(lock.isLocked(),false);
    assert.equal(lock.acquire(),true);
  }
});

test('PNG cache reuses images and separates lives, languages and changed profiles',async()=>{
  const data=new Map(),cache={get:key=>data.get(key),put:(key,blob)=>data.set(key,blob)};
  let renders=0;
  const render=async()=>{renders++;return new Blob(['png'],{type:'image/png'});};
  const item={number:1,name:'A',age:40};
  const first=await cachedFateCard(item,'vi',render,cache);
  assert.equal(await cachedFateCard(item,'vi',render,cache),first);
  assert.equal(renders,1);
  await cachedFateCard(item,'en',render,cache);
  await cachedFateCard({...item,number:2},'vi',render,cache);
  await cachedFateCard({...item,age:41},'vi',render,cache);
  assert.equal(renders,4);
  assert.notEqual(cardCacheKey(item,'vi'),cardCacheKey(item,'zh'));
});

test('concurrent image requests render once; cache failures still allow export and render failures allow retry',async()=>{
  const item={number:300,name:'Concurrent'};
  let renders=0,release;
  const render=()=>{renders++;return new Promise(resolve=>{release=resolve;});};
  const cache={get:()=>null,put:()=>{throw Error('quota');}};
  const left=cachedFateCard(item,'vi',render,cache),right=cachedFateCard(item,'vi',render,cache);
  await Promise.resolve();
  release(new Blob(['png'],{type:'image/png'}));
  assert.equal(await left,await right);assert.equal(renders,1);
  await assert.rejects(cachedFateCard(item,'vi',()=>{throw Error('canvas');},cache));
  const blob=await cachedFateCard(item,'vi',()=>new Blob(['retry'],{type:'image/png'}),{get(){throw Error('blocked');},put(){throw Error('blocked');}});
  assert.equal(await blob.text(),'retry');
});
