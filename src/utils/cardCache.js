const storeName='fate-cards';
function openCache(){
  return new Promise(resolve=>{
    if(!globalThis.indexedDB){resolve(null);return;}
    let request,settled=false;
    const finish=value=>{if(settled){value?.close();return;}settled=true;clearTimeout(timeout);resolve(value);};
    const timeout=setTimeout(()=>finish(null),2500);
    try{request=indexedDB.open('myriad-lives-images',1);}catch{finish(null);return;}
    request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(storeName))request.result.createObjectStore(storeName);};
    request.onsuccess=()=>finish(request.result);
    request.onerror=()=>finish(null);
    request.onblocked=()=>finish(null);
  });
}
async function transact(key,value){
  const db=await openCache();if(!db)return null;
  return new Promise(resolve=>{
    let transaction,result=null;
    const timeout=setTimeout(()=>{try{transaction?.abort();}catch{}done(null);},2500);
    const done=value=>{clearTimeout(timeout);db.close();resolve(value);};
    try{
      transaction=db.transaction(storeName,value?'readwrite':'readonly');
      const store=transaction.objectStore(storeName);
      const request=value?store.put(value,key):store.get(key);
      request.onsuccess=()=>{result=value||request.result;};
      transaction.oncomplete=()=>done(result);
      transaction.onerror=()=>done(null);
      transaction.onabort=()=>done(null);
    }catch{done(null);}
  });
}
export const browserCardCache={get:key=>transact(key),put:(key,value)=>transact(key,value)};
export const cardCacheKey=(item,language)=>JSON.stringify({version:1,language,item});
const pending=new Map();
export async function cachedFateCard(item,language,render,cache=browserCardCache){
  const key=cardCacheKey(item,language);
  if(pending.has(key))return pending.get(key);
  const job=(async()=>{
    let cached;try{cached=await cache.get(key);}catch{}
    if(cached instanceof Blob&&cached.type==='image/png'&&cached.size>0)return cached;
    const blob=await render(item,language);
    try{await cache.put(key,blob);}catch{}
    return blob;
  })();
  pending.set(key,job);
  try{return await job;}finally{pending.delete(key);}
}
