import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {advancePlayback,visibleRun,EVENT_DURATION_MS} from '../engine/playback.js';

export default function useLifePlayback(target,speed,paused,restoredPlayback) {
  const [playback,setPlayback]=useState(()=>restoredPlayback||{number:0,count:1,from:1,elapsed:0});
  const current=useRef(playback);
  const progressNode=useRef(null);
  const progressLabel=useRef(null);
  const lastTarget=useRef(null);
  const getPlayback=useCallback(()=>({...current.current}),[]);
  const controls=useRef({speed,paused});
  controls.current={speed,paused};
  const updateProgress=useCallback((value)=>{
    const node=progressNode.current,label=progressLabel.current;
    const whole=String(Math.floor(value)),percent=whole+'%';
    if(node){
      // Transform only: the bar repaints on the compositor, not the whole page each frame.
      node.style.transform=`scaleX(${value/100})`;
      const bar=node.parentElement;
      if(bar&&bar.getAttribute('aria-valuenow')!==whole)bar.setAttribute('aria-valuenow',whole);
    }
    if(label&&label.textContent!==percent)label.textContent=percent;
  },[]);
  useEffect(()=>{
    if(!target)return;
    const previous=current.current;
    const count=previous.number===target.number?Math.min(previous.count,target.facts.length):1;
    const continuing=previous.number===target.number&&(lastTarget.current===null||lastTarget.current===target);
    lastTarget.current=target;
    current.current=continuing?previous:{number:target.number,count,from:count,elapsed:0};
    setPlayback(current.current);
    updateProgress(playbackProgress(current.current,target));
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
        const previousCount=current.current.count;
        current.current=advancePlayback(current.current,delta,controls.current.speed,target.facts.length);
        // Only a new narrated fact needs a React render. Progress stays at frame rate.
        updateProgress(playbackProgress(current.current,target));
        if(current.current.count!==previousCount)setPlayback(current.current);
      }
      if(current.current.count<target.facts.length)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    return ()=>{
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange',resetClock);
    };
  },[target,updateProgress]);
  const count=target?.number===playback.number?playback.count:1;
  const playing=!!target&&count<target.facts.length;
  const progress=playbackProgress(current.current,target);
  const run=useMemo(()=>visibleRun(target,count),[target,count]);
  return {run,playing,progress,progressNode,progressLabel,getPlayback};
}

function playbackProgress(playback,target){
  if(!target||playback.number!==target.number)return 0;
  if(playback.count>=target.facts.length)return 100;
  return Math.min(100,100*(playback.count-playback.from+playback.elapsed/EVENT_DURATION_MS)/Math.max(1,target.facts.length-playback.from));
}
