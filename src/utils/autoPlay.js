import {chooseOption} from '../engine/lifeRunner.js';

export function autoPlayStep(run,{enabled,playing,paused,birthPending,page,hidden}){
  if(!enabled||playing||paused||birthPending||page!=='game'||hidden||run?.phase!=='awaiting_choice')return null;
  const option=run.pendingChoice.kind==='breakthrough'?run.pendingChoice.options[0]:run.rng.pick(run.pendingChoice.options);
  return chooseOption(run,option.id);
}
