import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {realms} from '../src/data/realms.js';

export async function createDraft({realm,count=1,name},root=fileURLToPath(new URL('../',import.meta.url))){
  if(!realms.some(r=>r.id===realm))throw Error('Cảnh giới không hợp lệ');
  if(!Number.isSafeInteger(count)||count<1||count>100)throw Error('count phải là số nguyên 1–100');
  if(!/^[a-z][a-z0-9-]{0,63}$/.test(name||''))throw Error('name dùng chữ thường, số, gạch ngang; bắt đầu bằng chữ');
  const directory=resolve(root,'docs/event-drafts'),path=resolve(directory,`${name}.json`);
  const raw=await readFile(new URL('../.agents/skills/myriad-lives-data/assets/event.json',import.meta.url),'utf8');
  const template=JSON.parse(raw.replace(/^\uFEFF/,''));
  const events=Array.from({length:count},(_,i)=>({...structuredClone(template),id:`${name.replaceAll('-','_')}_${String(i+1).padStart(3,'0')}`,allowedRealms:[realm]}));
  await mkdir(directory,{recursive:true});
  await writeFile(path,JSON.stringify(events,null,2)+'\n',{encoding:'utf8',flag:'wx'});
  return path;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const args=process.argv.slice(2),options={};
    if(args.includes('--help'))console.log('npm run data:new -- --realm foundation --count 6 --name foundation-new\nTạo draft JSON, chưa thêm sự kiện vào game.');
    else{
      for(let i=0;i<args.length;i+=2){if(!['--realm','--count','--name'].includes(args[i])||!args[i+1])throw Error('Tham số sai. Dùng --help');options[args[i].slice(2)]=args[i+1];}
      const path=await createDraft({...options,count:options.count===undefined?1:Number(options.count)});
      console.log(`Đã tạo ${path}\nViết nội dung riêng và dịch trước khi chuyển vào src/data/events rồi đăng ký trong content.js.`);
    }
  }catch(error){console.error(error.message);process.exitCode=1;}
}
