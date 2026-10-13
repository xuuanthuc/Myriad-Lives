const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
// Better roots provide a small success bonus and steadier spiritual channels.
// Missing scores use a neutral fallback for older saves.
export function rootBreakthroughBonus(profile){
  return Math.max(0,clamp(profile.root?.score??50,0,100)-50)*.001;
}
export function fatalBreakthroughChance(profile,realm,danger){
  const stability=1-clamp(profile.root?.score??50,0,100)*.003;
  // Crossing heaven's lightning is more lethal than an ordinary bottleneck.
  return realm===8?clamp(.04*realm*danger*stability,0,.45):clamp(.005*realm*danger*stability,0,.10);
}
