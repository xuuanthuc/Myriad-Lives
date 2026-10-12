export const qiStages = Array.from({length:9},(_,index)=>`Tầng ${index+1}`);
export const cultivationStages = ['Sơ kỳ','Trung kỳ','Hậu kỳ'];
export function stagesForRealm(realm) {
  return realm===0?[]:realm===1?qiStages:cultivationStages;
}
export function stageIndex(realm,progress) {
  const count=stagesForRealm(realm).length;
  return count?Math.min(count-1,Math.floor(Math.max(0,progress)/100*count+1e-10)):0;
}
export function stageName(state) {
  return stagesForRealm(state.realm)[state.subrealm??stageIndex(state.realm,state.cultivationProgress)]||'';
}
