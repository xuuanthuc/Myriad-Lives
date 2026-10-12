import {translate,translateName} from '../i18n/index.js';
import {realms} from '../data/realms.js';
import {stageName} from '../data/subrealms.js';
import {cachedFateCard} from './cardCache.js';

async function bounded(promise,ms){let timer;try{return await Promise.race([promise,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('Image preparation timed out')),ms);})]);}finally{clearTimeout(timer);}}
export async function createFateCard(item,language){
  try{await bounded(document.fonts.ready,2000);}catch{}
  const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
  const ctx=canvas.getContext('2d'),t=text=>translate(text,language);
  ctx.fillStyle='#f5f2e9';ctx.fillRect(0,0,1080,1350);
  ctx.strokeStyle='#a5b497';ctx.lineWidth=2;ctx.strokeRect(38,38,1004,1274);
  ctx.strokeStyle='#d7ddcc';ctx.strokeRect(52,52,976,1246);
  const text=(value,x,y,size=28,color='#345c46',align='left',serif=false)=>{ctx.font=`${serif?'500':'400'} ${size}px "${serif?'Noto Serif':'Be Vietnam Pro'}", serif`;ctx.fillStyle=color;ctx.textAlign=align;ctx.fillText(value,x,y);};
  const fit=(value,x,y,size,maxWidth,color='#345c46',align='left',serif=false)=>{
    while(size>16){ctx.font=`500 ${size}px "${serif?'Noto Serif':'Be Vietnam Pro'}", serif`;if(ctx.measureText(value).width<=maxWidth)break;size--;}
    text(value,x,y,size,color,align,serif);
  };
  const line=y=>{ctx.strokeStyle='#d7ddcc';ctx.beginPath();ctx.moveTo(100,y);ctx.lineTo(980,y);ctx.stroke();};
  try{
    const logo=new Image();logo.src=`${import.meta.env.BASE_URL}assets/images/myriad-lives-logo-ink.png`;await bounded(logo.decode(),3000);ctx.drawImage(logo,320,75,440,147);
  }catch{text('MYRIAD LIVES',540,160,38,'#345c46','center',true);}
  text(t('SỐ MỆNH KIẾP NÀY'),540,260,22,'#aa8c52','center');
  fit(translateName(item.name,language),540,355,64,880,'#24452f','center',true);
  const realm=t(realms[item.realm].name)+(stageName(item)?' · '+t(stageName(item)):'');
  fit(realm,540,420,32,880,'#345c46','center');
  text(t('Kiếp')+' '+String(item.number).padStart(3,'0')+' · '+item.age+' '+t('tuổi'),540,475,25,'#7b856e','center');
  if(item.isGoodProfile)text('✦ '+t('Tiên tư xuất chúng'),540,526,26,'#9b7b40','center');
  line(560);
  [['Xuất thân',item.origin],['Linh căn',item.root],['Thể chất',item.physique]].forEach(([label,value],i)=>{
    text(t(label),110,635+i*82,26,'#7b856e');fit(t(value),970,635+i*82,30,640,'#345c46','right',true);
  });
  line(850);
  [['Tư chất',item.talent],['Ngộ tính',item.comprehension],['Khí vận',item.luck]].forEach(([label,value],i)=>{
    const x=235+i*305;text(t(label),x,915,24,'#7b856e','center');text(String(value),x,984,54,'#345c46','center',true);
    ctx.fillStyle='#dce3d1';ctx.fillRect(x-100,1014,200,6);ctx.fillStyle='#6d8b5c';ctx.fillRect(x-100,1014,2*value,6);
  });
  line(1070);
  fit(t(item.endingReason||(item.status==='active'?'Đang tu hành':item.status==='abandoned'?'Đã luân hồi sớm':'Một kiếp khép lại')),540,1143,30,880,'#7d6944','center',true);
  fit(t(item.world),540,1197,23,880,'#7b856e','center');
  text('MYRIAD LIVES · '+t('VẠN KIẾP'),540,1265,20,'#8b987e','center');
  return bounded(new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('PNG export failed')),'image/png')),5000);
}
export async function prepareFateCard(item,language){return cachedFateCard(structuredClone(item),language,createFateCard);}
export async function exportFateCard(item,language,share=false){
  const snapshot=structuredClone(item);
  const blob=await cachedFateCard(snapshot,language,createFateCard),filename=`myriad-lives-${snapshot.number}.png`;
  const file=new File([blob],filename,{type:'image/png'});
  if(share&&navigator.canShare?.({files:[file]})){
    try{await navigator.share({files:[file],title:'Myriad Lives'});return;}catch(e){if(e.name==='AbortError')return;}
  }
  const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download=filename;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
