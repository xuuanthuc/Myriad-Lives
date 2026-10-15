import {currentProfile} from './profileEvolution.js';
import {sectNameForRun} from '../data/sects.js';
import {genderName} from '../data/genders.js';
import {partnerForRun} from '../data/partners.js';
export function summarizeLife(run,status=run.phase==='finished'?'finished':'abandoned'){
  const p=currentProfile(run),s=run.state;
  return {number:run.number,name:p.name,partnerName:partnerForRun(run)?.name||null,gender:genderName(run.profile),origin:p.origin.name,root:p.root.name,physique:p.physique.name,sectName:sectNameForRun(run),talent:p.talent,comprehension:p.comprehension,luck:p.luck,isGoodProfile:p.isGoodProfile,age:s.age,realm:run.result?.highestRealm??s.realm,subrealm:run.result?.highestSubrealm??s.subrealm,status,endingReason:run.result?.endingReason||null,world:run.world.descriptor};
}
export function archiveLife(history,summary){return [summary,...history.filter(item=>item.number!==summary.number)].sort((a,b)=>b.number-a.number);}
export function historyWithCompletedLife(history,run){
  return run?.phase==='finished'?archiveLife(history,summarizeLife(run)):history;
}
