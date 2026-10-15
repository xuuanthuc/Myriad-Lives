import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker,{CultivatorPresence} from '../cloudflare/presence/worker.js';

function storage(t){
  const db=new DatabaseSync(':memory:'),queries=[];
  t.after(()=>db.close());
  return {db,queries,sql:{exec(query,...args){
    queries.push({query,args});
    const statement=db.prepare(query);
    if(query.startsWith('SELECT')){
      const rows=statement.all(...args);
      return {toArray:()=>rows,one:()=>rows[0]};
    }
    statement.run(...args);
    return {};
  }}};
}
const id='12345678-1234-1234-1234-123456789abc';
const request=(method='GET',body,origin='https://game.pages.dev')=>new Request('https://counter.workers.dev/online',{method,headers:{Origin:origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('online registry deduplicates browsers, expires inactive sessions and survives object recreation',async t=>{
  const store=storage(t),clock=Date.now;let now=1000000;Date.now=()=>now;
  try{
    let object=new CultivatorPresence({storage:store});
    assert.equal((await (await object.fetch(request())).json()).count,0);
    for(let i=0;i<2;i++)assert.equal((await (await object.fetch(request('POST',{id}))).json()).count,1);
    object=new CultivatorPresence({storage:store});
    assert.equal((await (await object.fetch(request())).json()).count,1);
    now+=149999;assert.equal((await (await object.fetch(request())).json()).count,1);
    now++;assert.equal((await (await object.fetch(request())).json()).count,0);
    assert.equal((await object.fetch(request('POST',{id:'invalid'}))).status,400);
  }finally{Date.now=clock;}
});
test('Worker enforces allowed origins and methods, handles preflight and tolerates unavailable service',async t=>{
  const object=new CultivatorPresence({storage:storage(t)});
  const env={ALLOWED_ORIGINS:'https://game.pages.dev',PRESENCE:{idFromName:()=>1,get:()=>object}};
  assert.equal((await worker.fetch(request('GET',null,'https://other.pages.dev'),env)).status,403);
  assert.equal((await worker.fetch(request('DELETE'),env)).status,405);
  const options=await worker.fetch(request('OPTIONS'),env);
  assert.equal(options.status,204);assert.equal(options.headers.get('Access-Control-Allow-Origin'),'https://game.pages.dev');
  const response=await worker.fetch(request('POST',{id}),env);
  assert.equal(response.status,200);assert.equal((await response.json()).count,1);
  assert.equal(response.headers.get('Cache-Control'),'no-store');
  assert.equal((await worker.fetch(request(),{ALLOWED_ORIGINS:env.ALLOWED_ORIGINS})).status,503);
});

test('repeated reads and heartbeats do not scan SQL; expiration uses the primary key',async t=>{
  const store=storage(t),clock=Date.now;let now=1000000;Date.now=()=>now;
  try{
    const object=new CultivatorPresence({storage:store});
    const ids=Array.from({length:60},(_,i)=>`12345678-1234-1234-1234-${i.toString(16).padStart(12,'0')}`);
    for(const visitorId of ids)await object.fetch(request('POST',{id:visitorId}));
    const beforeReads=store.queries.length;
    for(let i=0;i<100;i++)assert.equal((await (await object.fetch(request())).json()).count,60);
    assert.equal(store.queries.length,beforeReads,'warm GETs must not access SQL');
    now+=60000;
    for(const visitorId of ids)await object.fetch(request('POST',{id:visitorId}));
    assert.equal(store.queries.filter(({query})=>query.startsWith('SELECT')).length,1,'only initialization loads the registry');
    now+=150000;
    assert.equal((await (await object.fetch(request())).json()).count,0);
    assert.equal(store.db.prepare('SELECT COUNT(*) AS count FROM visitors').get().count,0);
    const deletes=store.queries.filter(({query})=>query.startsWith('DELETE'));
    assert.equal(deletes.length,60);
    const plan=store.db.prepare(`EXPLAIN QUERY PLAN ${deletes[0].query}`).all(...deletes[0].args);
    assert.ok(plan.some(row=>row.detail.includes('SEARCH')&&row.detail.includes('INDEX')),JSON.stringify(plan));
    assert.ok(plan.every(row=>!row.detail.includes('SCAN')),JSON.stringify(plan));
  }finally{Date.now=clock;}
});

test('recreation restores legacy rows, removes expired sessions and keeps renewed ones',async t=>{
  const store=storage(t),clock=Date.now;let now=1000000;Date.now=()=>now;
  try{
    new CultivatorPresence({storage:store});
    const expiredId='87654321-1234-1234-1234-123456789abc';
    store.db.prepare('INSERT INTO visitors (id,seen) VALUES (?,?)').run(id,now-149999);
    store.db.prepare('INSERT INTO visitors (id,seen) VALUES (?,?)').run(expiredId,now-150000);
    let object=new CultivatorPresence({storage:store});
    assert.equal((await (await object.fetch(request())).json()).count,1);
    assert.equal(store.db.prepare('SELECT COUNT(*) AS count FROM visitors').get().count,1);
    now++;
    assert.equal((await (await object.fetch(request('POST',{id}))).json()).count,1);
    object=new CultivatorPresence({storage:store});
    assert.equal((await (await object.fetch(request())).json()).count,1);
    now+=150000;
    object=new CultivatorPresence({storage:store});
    assert.equal((await (await object.fetch(request())).json()).count,0);
  }finally{Date.now=clock;}
});

test('a failed heartbeat does not create a phantom visitor in memory',async t=>{
  const store=storage(t),object=new CultivatorPresence({storage:store});
  store.db.exec("CREATE TRIGGER fail_heartbeat BEFORE INSERT ON visitors BEGIN SELECT RAISE(FAIL, 'quota'); END");
  await assert.rejects(object.fetch(request('POST',{id})),/quota/);
  assert.equal((await (await object.fetch(request())).json()).count,0);
});

test('delayed request bodies cannot move a renewed session back in time',async t=>{
  const store=storage(t),clock=Date.now;let now=1000000;Date.now=()=>now;
  try{
    const object=new CultivatorPresence({storage:store});
    let finishBody;
    const delayed=object.fetch({method:'POST',json:()=>new Promise(resolve=>{finishBody=resolve;})});
    now+=60000;
    await object.fetch(request('POST',{id}));
    now+=60000;
    finishBody({id});
    await delayed;
    now+=149999;
    assert.equal((await (await object.fetch(request())).json()).count,1);
    assert.equal(store.db.prepare('SELECT seen FROM visitors WHERE id = ?').get(id).seen,1120000);
  }finally{Date.now=clock;}
});
