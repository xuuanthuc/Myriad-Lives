import test from 'node:test';
import assert from 'node:assert/strict';
import {partners,partnerForRun} from '../src/data/partners.js';
import {genderForProfile} from '../src/data/genders.js';
import {translate,translateName} from '../src/i18n/index.js';
import {startLife} from '../src/engine/lifeRunner.js';
import {createRng} from '../src/engine/rng.js';
import {summarizeLife} from '../src/engine/lifeHistory.js';
import {encodeSave,decodeSave} from '../src/engine/browserSave.js';

test('600 distinct companion names are fully localized with 300 per gender',()=>{
  assert.equal(partners.length,600);
  for(const field of ['name'])assert.equal(new Set(partners.map(p=>p[field])).size,600);
  for(const gender of ['male','female'])assert.equal(partners.filter(p=>p.gender===gender).length,300);
  for(const p of partners)for(const language of ['zh','en']){
    assert.notEqual(translate(p.name,language),p.name);
    assert.equal(translateName(p.name,language),p.translations[language]);
  }
});

test('companions appear only after bonding and remain stable through save and history without changing RNG',()=>{
  const seen=new Set();
  for(let seed=1;seed<=300;seed++){
    const started=startLife({runCount:seed,pityCount:0},createRng(seed));
    const run=started.run;
    run.state.partnerStatus='none';assert.equal(partnerForRun(run),null);
    run.state.partnerStatus='bonded';
    const before=run.rng.getState(),partner=partnerForRun(run);seen.add(partner.name);
    assert.notEqual(partner.gender,run.profile.gender);
    assert.equal(partnerForRun(run).name,partner.name);
    assert.equal(run.rng.getState(),before);
    assert.equal(summarizeLife(run).partnerName,partner.name);
    const restored=decodeSave(encodeSave({engineRun:run,session:started.nextSession}));
    assert.equal(partnerForRun(restored.engineRun).name,partner.name);
    const legacyProfile={...restored.engineRun.profile};delete legacyProfile.gender;
    restored.engineRun.profile.gender=genderForProfile(legacyProfile);
    const legacyPartner=partnerForRun(restored.engineRun);
    delete restored.engineRun.profile.gender;
    assert.equal(partnerForRun(restored.engineRun).name,legacyPartner.name);
    run.state.partnerStatus='none';assert.equal(summarizeLife(run).partnerName,null);
  }
  assert.ok(seen.size>180);
});
