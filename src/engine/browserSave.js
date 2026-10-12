import {createRng} from './rng.js';
import {realms} from '../data/realms.js';
import {EVENT_DURATION_MS,PLAYBACK_SPEEDS} from './playback.js';

export const SAVE_KEY='myriad-lives-save';
const version=1;
const integer=value=>Number.isSafeInteger(value)&&value>=0;
export function encodeSave({engineRun,session,language,speed,paused,playback,history=[],birthPending=false}) {
  let run=null;
  if(engineRun){
    const {rng,result,...data}=engineRun;
    const {timeline,...ending}=result||{};
    run={...data,rngState:rng.getState(),...(result?{result:ending}:{})};
  }
  return JSON.stringify({version,run,session,language,speed,paused,playback,history,birthPending});
}
export function decodeSave(raw) {
  const saved=JSON.parse(raw);
  if(saved?.version!==version||!integer(saved.session?.runCount)||!integer(saved.session?.pityCount))throw Error('Invalid save');
  let engineRun=null;
  if(saved.run){
    const run=saved.run;
    if(!integer(run.rngState)||run.rngState>0xffffffff||!integer(run.number)||run.number!==saved.session.runCount||!integer(run.state?.realm)||!realms[run.state.realm]||!integer(run.state?.age)||!run.profile?.root||!run.profile?.physique||!run.profile?.origin||!run.world||!Array.isArray(run.facts)||!run.facts.length||!['finished','awaiting_choice'].includes(run.phase))throw Error('Invalid saved life');
    if(run.facts.some(f=>!integer(f.realm)||!realms[f.realm]||!f.stateSnapshot||!integer(f.age)))throw Error('Invalid saved facts');
    if(run.phase==='awaiting_choice'&&(!run.pendingChoice?.options?.length||!run.state.alive))throw Error('Invalid saved choice');
    if(run.phase==='finished'&&(!run.result||run.state.alive))throw Error('Invalid saved ending');
    const {rngState,...data}=run;
    engineRun={...data,rng:createRng(rngState)};
    if(engineRun.result)engineRun.result.timeline=engineRun.facts;
  }
  const p=saved.playback;
  const validPlayback=engineRun&&p?.number===engineRun.number&&integer(p.count)&&p.count>=1&&p.count<=engineRun.facts.length&&integer(p.from)&&p.from>=1&&p.from<=p.count&&Number.isFinite(p.elapsed)&&p.elapsed>=0&&p.elapsed<EVENT_DURATION_MS;
  const history=Array.isArray(saved.history)?saved.history.filter(item=>integer(item.number)&&integer(item.realm)&&realms[item.realm]&&integer(item.age)&&typeof item.name==='string'&&['active','finished','abandoned'].includes(item.status)):[];
  return {history,engineRun,birthPending:!!engineRun&&saved.birthPending===true,session:saved.session,language:['vi','zh','en'].includes(saved.language)?saved.language:'vi',speed:PLAYBACK_SPEEDS.includes(saved.speed)?saved.speed:1,paused:saved.paused===true,playback:validPlayback?p:undefined};
}
export function loadBrowserSave(){try{const raw=localStorage.getItem(SAVE_KEY);return raw?decodeSave(raw):null;}catch{return null;}}
export function saveBrowserState(state){try{localStorage.setItem(SAVE_KEY,encodeSave(state));return true;}catch{return false;}}
