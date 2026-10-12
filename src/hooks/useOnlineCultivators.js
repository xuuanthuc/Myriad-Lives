import {useEffect,useRef,useState} from 'react';
const endpoint=import.meta.env.VITE_PRESENCE_URL?.replace(/\/$/,'');
function browserId(){
  try{
    let id=localStorage.getItem('myriad-lives-visitor');
    if(!/^[a-f0-9-]{36}$/i.test(id||'')){id=crypto.randomUUID();localStorage.setItem('myriad-lives-visitor',id);}
    return id;
  }catch{return null;}
}
export default function useOnlineCultivators({active,observe}){
  const [count,setCount]=useState(null);
  const visitor=useRef(null);
  useEffect(()=>{
    if(!endpoint||(!active&&!observe)){setCount(null);return;}
    let stopped=false,timer,controller;
    const poll=async()=>{
      if(stopped)return;
      if(!document.hidden){
        visitor.current||=browserId();
        const heartbeat=active&&visitor.current;
        controller=new AbortController();
        const timeout=setTimeout(()=>controller.abort(),8000);
        try{
          const response=await fetch(`${endpoint}/online`,{method:heartbeat?'POST':'GET',...(heartbeat?{headers:{'Content-Type':'application/json'},body:JSON.stringify({id:visitor.current})}:{}),signal:controller.signal,cache:'no-store'});
          if(!response.ok)throw Error('Presence unavailable');
          const data=await response.json();
          if(!Number.isSafeInteger(data.count)||data.count<0)throw Error('Invalid count');
          if(!stopped)setCount(data.count);
        }catch{if(!stopped)setCount(null);}finally{clearTimeout(timeout);}
      }else setCount(null);
      if(!stopped)timer=setTimeout(poll,60000);
    };
    poll();
    return ()=>{stopped=true;clearTimeout(timer);controller?.abort();};
  },[active,observe]);
  return count;
}
