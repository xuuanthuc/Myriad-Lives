export function createActionLock(){
  let locked=false;
  return {isLocked:()=>locked,acquire(){if(locked)return false;locked=true;return true;},release(){locked=false;}};
}
