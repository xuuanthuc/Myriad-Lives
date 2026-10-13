export const genders=[{id:'male',name:'Nam'},{id:'female',name:'Nữ'}];
function profileGenderHash(profile){
  let hash=2166136261;
  for(const char of `${profile.name}|${profile.luck}|${profile.talent}|${profile.origin?.name}`){hash=Math.imul(hash^char.codePointAt(0),16777619);}
  return hash>>>0;
}
// New births: 40% female, 60% male, without an extra simulation RNG draw.
export function birthGenderForProfile(profile){
  return profileGenderHash(profile)/4294967296<.4?'female':'male';
}
// Stable fallback also gives existing saves a gender without rerolling their RNG.
export function genderForProfile(profile){
  if(genders.some(g=>g.id===profile.gender))return profile.gender;
  return genders[profileGenderHash(profile)%2].id;
}
export const genderName=profile=>genders.find(g=>g.id===genderForProfile(profile)).name;
