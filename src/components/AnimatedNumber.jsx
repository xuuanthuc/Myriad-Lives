import {useLayoutEffect,useRef,useState} from 'react';

export default function AnimatedNumber({value,speed=1}) {
  const [displayed,setDisplayed]=useState(value);
  const current=useRef(value);
  useLayoutEffect(()=>{
    const from=current.current;
    if(from===value)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      current.current=value;
      setDisplayed(value);
      return;
    }
    const duration=Math.max(180,650/speed);
    const started=performance.now();
    let frame;
    function tick(now){
      const progress=Math.min(1,(now-started)/duration);
      const eased=1-Math.pow(1-progress,3);
      current.current=from+(value-from)*eased;
      setDisplayed(Math.round(current.current));
      if(progress<1)frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[value,speed]);
  return <span className="animated-number" aria-label={String(value)}><span aria-hidden="true">{displayed}</span></span>;
}
