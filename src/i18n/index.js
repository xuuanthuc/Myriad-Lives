import {extraPhysiques} from '../data/extraPhysiques.js';
import { ui } from './ui.js';
import { legacy, endingsLocales } from './legacy.js';
import { events, birth, endings, wordCount,eventOutcomes } from '../engine/content.js';
import { realms, roots, physiques, origins } from '../data/realms.js';
import { sectChildhood } from '../data/origins.js';
import {sects} from '../data/sects.js';
import {partners,partnerNames} from '../data/partners.js';

export const languages = [{id:'vi',label:'Việt'},{id:'zh',label:'中文'},{id:'en',label:'English'}];
const dictionary = new Map(ui.map(([vi,zh,en]) => [vi,{vi,zh,en}]));
function add(text, translations) {
  if (text && translations) dictionary.set(text,{vi:text,zh:translations[0],en:translations[1]});
}
for (const event of events) {
  const old = legacy[event.id];
  for (const field of ['title','text']) add(event[field],old?.[field] || (event.translations && [event.translations.zh[field],event.translations.en[field]]));
  for(const outcome of event.outcomes||[])add(outcome.text,[outcome.translations?.zh.text,outcome.translations?.en.text]);
  for(const outcome of eventOutcomes(event))if(outcome.endingReason&&outcome.translations?.zh.endingReason&&outcome.translations?.en.endingReason)add(outcome.endingReason,[outcome.translations.zh.endingReason,outcome.translations.en.endingReason]);
  for (const option of event.choices || []) {
    const translated = old?.choices?.[option.id];
    for (const field of ['text','hint']) add(option[field],translated?.[field] || (option.translations && [option.translations.zh[field],option.translations.en[field]]));
    for (const outcome of option.outcomes) add(outcome.text,translated?.outcomes?.[outcome.id] || (outcome.translations && [outcome.translations.zh.text,outcome.translations.en.text]));
  }
}
for (const record of [...birth,...endings]) add(record.text,endingsLocales[record.id] || (record.translations && [record.translations.zh.text,record.translations.en.text]));
for (const origin of origins) add(origin.birthText,[origin.translations.zh.birthText,origin.translations.en.birthText]);
for(const sect of sects)add(sect.name,[sect.translations.zh,sect.translations.en]);
for(const partner of partners)add(partner.name,[partner.translations.zh,partner.translations.en]);
for(const physique of extraPhysiques){add(physique.name,[physique.translations.zh.name,physique.translations.en.name]);add(physique.description,[physique.translations.zh.description,physique.translations.en.description]);}
add('Bỏ mạng trong cấm chế',['死于洞府禁制','Killed by the cave’s restrictions']);

const surnames = {
  Lâm:['林','Lin'], Mộ:['慕','Mu'], Tần:['秦','Qin'], Diệp:['叶','Ye'],
  Tô:['苏','Su'], Lục:['陆','Lu'], Bạch:['白','Bai'], Vân:['云','Yun'],
};
const givenNames = {
  'Vô Trần':['无尘','Wuchen'],'Thanh Hà':['清河','Qinghe'],'Tử Yên':['紫烟','Ziyan'],
  'Trường Phong':['长风','Changfeng'],'Nhược Thủy':['若水','Ruoshui'],
  'Thiên Hành':['天行','Tianxing'],'Hoài An':['怀安','Huaian'],'Minh Nguyệt':['明月','Mingyue'],
};
export function translateName(name,language) {
  if (language==='vi') return name;
  if(partnerNames.has(name))return partnerNames.get(name).translations[language]||name;
  const [surname,...given]=name.split(' ');
  const index=language==='zh'?0:1;
  return (surnames[surname]?.[index] || surname)+(language==='zh'?'':' ')+(givenNames[given.join(' ')]?.[index] || given.join(' '));
}

/** Translate presentation only: the active simulation, facts and RNG are untouched. */
export function translate(value,language='vi') {
  if (language==='vi' || !value) return value;
  const direct=dictionary.get(value)?.[language];
  if (direct) return direct;
  const retreat=/^Ngươi khép cửa tĩnh thất, chuyên tâm dưỡng đạo suốt (\d+) năm\. Khi xuất quan, cảnh vật đã đổi, còn thời gian lặng lẽ ghi thêm một đoạn trên tiên lộ\.$/u.exec(value);
  if(retreat)return language==='zh'
    ?`你闭守静室，专心养道${retreat[1]}年。出关之时，景物已有变化，时光也在仙途上悄然写下新的一段。`
    :`You close your chamber and cultivate in seclusion for ${retreat[1]} years. Upon emerging, the landscape has changed, and time has quietly added another passage to your immortal journey.`;
  if (value.startsWith('Đột phá ')) return `${translate('Đột phá',language)} ${translate(value.slice(8),language)}`;
  const breakthrough=/^Sau nhiều năm tích lũy, ngươi vượt qua bình cảnh và tiến vào (.+)\. Linh lực đổi khác, thọ nguyên kéo dài, tiên lộ lại mở thêm một đoạn\.$/u.exec(value);
  if (breakthrough) {
    const realm=translate(breakthrough[1],language);
    return language==='zh'
      ? `经过多年积累，你突破瓶颈，迈入${realm}。灵力发生蜕变，寿元延长，仙途又向前展开了一段。`
      : `After years of preparation, you overcome the bottleneck and enter ${realm}. Your energy transforms, your lifespan grows, and a new stretch of the immortal path opens.`;
  }
  const birthText=/^Ngươi sinh ra trong một (.+), giữa buổi giao mùa yên ả\. Chưa ai biết đứa trẻ này sẽ đi được bao xa trên con đường cầu đạo\.$/u.exec(value);
  if (birthText) {
    const origin=origins.find(x=>x.name.toLowerCase()===birthText[1]);
    return dictionary.get(birth[0].text)[language].replace('{origin}',translate(origin?.name || birthText[1],language));
  }
  return value;
}

export function validateTranslations() {
  const fields=[];
  fields.push(...sects.map(sect=>sect.name));
  for(const e of events){fields.push(e.title,e.text);for(const o of e.choices||[])fields.push(o.text,o.hint);for(const outcome of eventOutcomes(e)){fields.push(outcome.text);if(outcome.endingReason)fields.push(outcome.endingReason);}}
  fields.push(...[...birth,...endings].map(x=>x.text),...[...realms,...roots,...physiques,...origins].map(x=>x.name));
  fields.push(...origins.map(x=>x.birthText),...Object.values(sectChildhood).flatMap(x=>[x.title,x.text,...x.reason?[x.reason]:[]]));
  for(const text of fields) for(const language of ['zh','en']) {
    const value=dictionary.get(text)?.[language];
    if(typeof value!=='string'||!value.trim())throw Error(`Missing ${language} translation: ${text}`);
    if(language==='zh'&&!/\p{Script=Han}/u.test(value))throw Error(`Invalid Chinese translation: ${text}`);
  }
  for(const [vi,zh,en] of ui) if(!vi||!zh||!en)throw Error('Incomplete UI translation');
  const narratives=events.flatMap(e=>[e.text,...eventOutcomes(e).map(outcome=>outcome.text)]);
  for(const text of [...narratives,...[...birth,...endings].map(e=>e.text),...origins.map(e=>e.birthText),...Object.values(sectChildhood).map(e=>e.text)]) {
    if(wordCount(text)<15||wordCount(text)>35)throw Error(`Vietnamese narrative must have 15–35 words: ${text}`);
    const en=translate(text,'en'),zh=translate(text,'zh');
    if(wordCount(en)<15||wordCount(en)>35)throw Error(`English narrative must have 15–35 words: ${en}`);
    // Chinese does not separate words with spaces. Validate character length instead.
    if(zh.length<15||zh.length>160)throw Error(`Chinese narrative length is invalid: ${zh}`);
  }
  return true;
}
