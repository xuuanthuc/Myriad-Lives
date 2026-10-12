import {useLayoutEffect,useRef} from 'react';

/** Animate real layout height so the content below moves with the panel. */
export default function SmoothHeight({children}) {
  const shell=useRef(null),content=useRef(null);
  useLayoutEffect(()=>{
    const measure=()=>{
      if(shell.current&&content.current)shell.current.style.height=`${content.current.getBoundingClientRect().height}px`;
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(content.current);
    return ()=>observer.disconnect();
  },[]);
  return <div ref={shell} className="smooth-height"><div ref={content} className="smooth-height-content">{children}</div></div>;
}
