import {combatEvents} from '../data/combatEvents.js';
import {realmConflicts} from '../data/realmConflicts.js';

const battles=new Set([...combatEvents,...realmConflicts].map(event=>event.id));
// More decision points among eligible events, without increasing event frequency.
export function choiceEncounterFactor(event){return event.choices?.length?3:1;}
// Favor unavoidable fights without making safe choices secretly lethal.
export function combatEncounterFactor(event,realm){
  if(!battles.has(event.id))return 1;
  return realm>=13?2:realm===12?1.75:1.3;
}

export function isExploring(state){return state.age<(state.explorationUntilAge??0);}
export function explorationEventFrequency(state,normal){
  if(!isExploring(state))return normal;
  const years=Math.max(1,state.explorationUntilAge-(state.explorationStartedAge??state.age));
  return Math.min(.35,Math.max(normal*3,4/years));
}
export function explorationEncounterFactor(event,state){
  if(!isExploring(state))return 1;
  return battles.has(event.id)?1.5:event.category==='opportunity'?1.4:1;
}
