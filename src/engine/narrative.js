import {birth,endings} from './content.js';

// Decorative prose is chosen from known state without consuming simulation RNG.
function pickText(records,run,kind) {
  if(!records.length)return undefined;
  const key=JSON.stringify([run.number??1,run.profile.name,run.profile.origin.id,run.profile.root.name,run.profile.physique.name,run.profile.talent,kind,kind==='birth'?0:run.state.age]);
  let hash=2166136261;
  for(const char of key)hash=Math.imul(hash^char.charCodeAt(0),16777619)>>>0;
  return records[hash%records.length].text;
}

export function birthNarrative(run) {
  const origin=run.profile.origin;
  const records=[{text:origin.birthText},...birth.filter(record=>record.originId===origin.id)];
  return pickText(records,run,'birth')??origin.birthText;
}

export function endingNarrative(run,kind) {
  return pickText(endings.filter(record=>(record.kind??record.id)===kind),run,kind);
}
