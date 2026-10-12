import {useEffect,useRef,useState} from 'react';

export default function FateCardPreview({card,t,onClose}){
  const dialog=useRef(null);
  const [url,setUrl]=useState(null),[busy,setBusy]=useState(false),[failed,setFailed]=useState(false);
  const filename=`myriad-lives-${card.number}.png`;
  useEffect(()=>{
    const objectUrl=URL.createObjectURL(card.blob);setUrl(objectUrl);
    const node=dialog.current,overflow=document.body.style.overflow;
    node.showModal();document.body.style.overflow='hidden';
    return ()=>{node.close();document.body.style.overflow=overflow;URL.revokeObjectURL(objectUrl);};
  },[card]);
  async function share(){
    if(busy)return;
    setBusy(true);setFailed(false);
    try{
      const file=new File([card.blob],filename,{type:'image/png'});
      if(!navigator.canShare?.({files:[file]})){setFailed(true);return;}
      await navigator.share({files:[file],title:'Myriad Lives'});
    }catch(e){if(e.name!=='AbortError')setFailed(true);}
    finally{setBusy(false);}
  }
  return <dialog ref={dialog} className="fate-preview" aria-label={t('Ảnh số mệnh')} onCancel={e=>{e.preventDefault();if(!busy)onClose();}}>
    <div className="choice-dialog-toolbar"><span>{t('Ảnh số mệnh')}</span><button disabled={busy} onClick={onClose} aria-label={t('Đóng')}>×</button></div>
    {url&&<img src={url} alt={t('Ảnh số mệnh')}/>}
    <div className="fate-preview-actions"><a href={url||undefined} download={filename}>{t('Tải PNG')}</a><button disabled={busy} onClick={share}>{t(busy?'Đang chia sẻ…':'Chia sẻ ảnh')}</button></div>
    {failed&&<p role="status">{t('Không mở được chia sẻ trên thiết bị này. Bấm Tải PNG để lưu ảnh.')}</p>}
  </dialog>;
}
