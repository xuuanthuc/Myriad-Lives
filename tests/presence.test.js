import test from 'node:test';
import assert from 'node:assert/strict';
import worker,{CultivatorPresence} from '../cloudflare/presence/worker.js';

function storage(){
  const rows=new Map();
  return {sql:{exec(query,...args){
    if(query.startsWith('INSERT'))rows.set(args[0],args[1]);
    if(query.startsWith('DELETE'))for(const [id,seen] of rows)if(seen<=args[0])rows.delete(id);
    return {one:()=>({count:[...rows.values()].filter(seen=>seen>args[0]).length})};
  }}};
}
const id='12345678-1234-1234-1234-123456789abc';
const request=(method='GET',body,origin='https://game.pages.dev')=>new Request('https://counter.workers.dev/online',{method,headers:{Origin:origin,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});
test('online registry deduplicates browsers, expires inactive sessions and survives object recreation',async()=>{
  const store=storage(),clock=Date.now;let now=1000000;Date.now=()=>now;
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
test('Worker enforces allowed origins and methods, handles preflight and tolerates unavailable service',async()=>{
  const object=new CultivatorPresence({storage:storage()});
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
