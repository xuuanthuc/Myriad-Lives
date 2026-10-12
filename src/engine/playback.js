export const EVENT_DURATION_MS = 2000;
export const PLAYBACK_SPEEDS = [1,2,4];

/** Advance presentation time only. Never draw RNG or modify simulation facts. */
export function advancePlayback(playback,deltaMs,speed,total) {
  const elapsed=playback.elapsed+Math.max(0,deltaMs)*speed;
  const steps=Math.floor(elapsed/EVENT_DURATION_MS);
  const count=Math.min(total,playback.count+steps);
  return {...playback,count,elapsed:count>=total?0:elapsed% EVENT_DURATION_MS};
}

export function visibleRun(target,count) {
  if(!target)return null;
  const shown=Math.max(1,Math.min(count,target.facts.length));
  if(shown===target.facts.length)return target;
  const facts=target.facts.slice(0,shown),latest=facts.at(-1);
  return {...target,facts,state:{...latest.stateSnapshot,age:latest.age,realm:latest.realm,alive:true},phase:'running',pendingChoice:null,result:undefined};
}
