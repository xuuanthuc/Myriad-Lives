import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createDraft} from '../scripts/new-event-batch.mjs';
import {validateContent} from '../src/engine/content.js';

test('event drafts are valid scaffolds and reject overwriting and unsafe inputs',async()=>{
  const root=await mkdtemp(join(tmpdir(),'myriad-event-draft-'));
  try{
    const options={realm:'foundation',count:3,name:'test-batch'};
    const path=await createDraft(options,root);
    const data=JSON.parse(await readFile(path,'utf8'));
    assert.equal(data.length,3);assert.equal(new Set(data.map(e=>e.id)).size,3);
    assert.ok(data.every(e=>e.allowedRealms[0]==='foundation'));
    assert.equal(validateContent(data),true);
    await assert.rejects(createDraft(options,root),{code:'EEXIST'});
    for(const bad of [{realm:'unknown'},{name:'../../escape'},{count:0},{count:101}])await assert.rejects(createDraft({...options,...bad},root));
  }finally{await rm(root,{recursive:true,force:true});}
});
