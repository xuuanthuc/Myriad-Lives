// Ranges: danger, opportunity, resources, cultivationDifficulty, stability.
export const worldPlanes=[
  {id:'peaceful',name:'Thanh Bình Giới',ranges:[[.6,.85],[.8,1.1],[.9,1.15],[.85,1.1],[1.3,1.6]]},
  {id:'abundant',name:'Linh Thịnh Giới',ranges:[[.8,1.15],[1.1,1.4],[1.3,1.6],[.6,.85],[1.05,1.4]]},
  {id:'turmoil',name:'Loạn Thiên Giới',ranges:[[1.3,1.6],[1.15,1.5],[.85,1.25],[1,1.3],[.6,.85]]},
  {id:'wild',name:'Hung Hoang Giới',ranges:[[1.35,1.6],[1.15,1.5],[1.3,1.6],[.8,1.1],[.95,1.2]]},
  {id:'declining',name:'Mạt Pháp Giới',ranges:[[.75,1.05],[.6,.85],[.6,.8],[1.35,1.6],[1,1.35]]},
  {id:'hidden',name:'Ẩn Tiên Giới',ranges:[[.85,1.15],[1.35,1.6],[1.05,1.25],[.85,1.1],[1.2,1.6]]},
  {id:'blood',name:'Huyết Sát Giới',ranges:[[1.45,1.6],[.9,1.2],[.8,1.1],[1.3,1.6],[.6,.8]]},
  {id:'shattered',name:'Tàn Thiên Giới',ranges:[[1.45,1.6],[1.4,1.6],[1.05,1.4],[1.35,1.6],[.6,.8]]},
];

export const worldPlaneDescriptions={
  'Thanh Bình Giới':'Thiên hạ thái bình',
  'Linh Thịnh Giới':'Linh khí dồi dào',
  'Loạn Thiên Giới':'Chiến loạn liên miên',
  'Hung Hoang Giới':'Yêu thú hoành hành',
  'Mạt Pháp Giới':'Linh khí suy kiệt',
  'Ẩn Tiên Giới':'Tiên duyên ẩn hiện',
  'Huyết Sát Giới':'Tà tu lộng hành',
  'Tàn Thiên Giới':'Thiên địa rạn vỡ',
};

export function worldPlaneDescription(world){
  return worldPlaneDescriptions[worldPlaneName(world)];
}

export function worldPlaneId(world){
  return worldPlanes.find(plane=>plane.name===worldPlaneName(world))?.id;
}

// Old saves retain every original coefficient and RNG state.
export function worldPlaneName(world){
  const plane=worldPlanes.find(plane=>plane.id===world.planeId);
  if(plane)return plane.name;
  return {'Loạn thế phong vân':'Loạn Thiên Giới','Linh khí hưng thịnh':'Linh Thịnh Giới','Hiểm họa trùng trùng':'Hung Hoang Giới'}[world.descriptor]||'Thanh Bình Giới';
}
