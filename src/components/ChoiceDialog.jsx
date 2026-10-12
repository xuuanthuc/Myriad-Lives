import {useEffect,useRef,useState} from 'react';

export default function ChoiceDialog({t,breakthrough,children}) {
  const [open,setOpen]=useState(true);
  const dialog=useRef(null);
  const trigger=useRef(null);
  const label=t(breakthrough?'Đang chờ đột phá':'Đang chờ lựa chọn');
  useEffect(()=>{
    if(!open){trigger.current?.focus({preventScroll:true});return;}
    const node=dialog.current;
    const previousOverflow=document.body.style.overflow;
    node.showModal();
    document.body.style.overflow='hidden';
    return ()=>{node.close();document.body.style.overflow=previousOverflow;};
  },[open]);
  function close(){setOpen(false);}
  function closeBackdrop(event){
    if(event.target!==dialog.current)return;
    const rect=dialog.current.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();
  }
  return <>
    <button ref={trigger} type="button" className="pending-choice-trigger" onClick={()=>setOpen(true)} aria-haspopup="dialog" aria-expanded={open}><span aria-hidden="true">✦</span> {label} <span className="pending-choice-action">{t('Mở lại')}</span></button>
    <dialog ref={dialog} className="choice-dialog" aria-label={label} onCancel={event=>{event.preventDefault();close();}} onClose={()=>{if(!dialog.current?.open)setOpen(false);}} onClick={closeBackdrop}>
      <div className="choice-dialog-toolbar"><span>{label}</span><button type="button" onClick={close} aria-label={t('Đóng để đọc ký sự')}>×</button></div>
      {children}
    </dialog>
  </>;
}
