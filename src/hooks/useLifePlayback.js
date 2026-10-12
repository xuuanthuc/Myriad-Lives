import {useCallback,useEffect,useRef,useState} from 'react';
import {advancePlayback,visibleRun,EVENT_DURATION_MS} from '../engine/playback.js';

export default function useLifePlayback(target,speed,paused,restoredPlayback) {
  const [playback,setPlayback]=useState(()=>restoredPlayback||{number:0,count:1,from:1,elapsed:0});
  const current=useRef(playback);
  const lastTarget=useRef(null);
  const getPlayback=useCallback(()=>({...current.current}),[]);
  const controls=useRef({speed,paused});
  controls.current={speed,paused};
  useEffect(()=>{
    if(!target)return;
    const previous=current.current;
    const count=previous.number===target.number?Math.min(previous.count,target.facts.length):1;
    const continuing=previous.number===target.number&&(lastTarget.current===null||lastTarget.current===target);
    lastTarget.current=target;
    current.current=continuing?previous:{number:target.number,count,from:count,elapsed:0};
    setPlayback(current.current);
    if(count>=target.facts.length)return;
    let last=performance.now();
    let frame;
    const resetClock=()=>{last=performance.now();};
    document.addEventListener('visibilitychange',resetClock);
    const tick=now=>{
      const delta=now-last;
      last=now;
      // Do not silently skip the story while the user is on another tab.
      if(!controls.current.paused&&!document.hidden){
        current.current=advancePlayback(current.current,delta,controls.current.speed,target.facts.length);
        setPlayback(current.current);
      }
      if(current.current.count<target.facts.length)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>{
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange',resetClock);
    };
  },[target]);
  const count=target?.number===playback.number?playback.count:1;
  const playing=!!target&&count<target.facts.length;
  const remaining=target?target.facts.length-playback.from:0;
  const progress=!playing?100:target.number!==playback.number?0:Math.min(100,100*(count-playback.from+playback.elapsed/EVENT_DURATION_MS)/Math.max(1,remaining));
  return {run:visibleRun(target,count),playing,progress,getPlayback};
}
