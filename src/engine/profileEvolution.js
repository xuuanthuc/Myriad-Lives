import {roots} from '../data/realms.js';

// Birth identity stays immutable; current traits live in state and fact snapshots.
export function currentProfile(run){
  if(!run)return null;
  if(run.state.luck===undefined&&run.state.root===undefined)return run.profile;
  return {...run.profile,luck:run.state.luck??run.profile.luck,root:run.state.root??run.profile.root};
}

export function applyProfileEffects(run,effects){
  const before=currentProfile(run),changes=[];
  if(effects.luck!==undefined){
    run.state.luck=Math.max(0,Math.min(100,(before.luck??50)+effects.luck));
    if(run.state.luck!==before.luck)changes.push({trait:'luck',before:before.luck??50,after:run.state.luck});
  }
  if(effects.rootUpgrade){
    const next=roots.find(root=>root.score>before.root.score);
    if(next){
      run.state.root={...next};
      changes.push({trait:'root',before:before.root.name,after:next.name});
    }
  }
  if(changes.length)run.facts.at(-1).traitChanges=changes;
}
