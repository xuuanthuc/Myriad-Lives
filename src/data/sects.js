// 25 names × 12 schools: 300 sects, each with a Chinese and English name.
const names = [
  ['Thanh Vân','青云','Azure Cloud'],['Bích Lạc','碧落','Jade Sky'],
  ['Huyền Sương','玄霜','Mystic Frost'],['Thái Hư','太虚','Great Void'],
  ['Vân Mộng','云梦','Cloud Dream'],['Tử Tiêu','紫霄','Violet Heaven'],
  ['Phong Lôi','风雷','Wind and Thunder'],['Thiên Huyền','天玄','Celestial Mystery'],
  ['Cửu U','九幽','Nine Netherworlds'],['Ngọc Thanh','玉清','Jade Purity'],
  ['Thái Thanh','太清','Supreme Purity'],['Thượng Thanh','上清','High Purity'],
  ['Tinh Hà','星河','Star River'],['Trường Sinh','长生','Eternal Life'],
  ['Huyền Vũ','玄武','Black Tortoise'],['Ngũ Hành','五行','Five Elements'],
  ['Xích Hà','赤霞','Crimson Dawn'],['Bạch Lộc','白鹿','White Deer'],
  ['Huyền Nguyệt','玄月','Mystic Moon'],['Thanh Liên','青莲','Azure Lotus'],
  ['Thiên Cơ','天机','Heavenly Secret'],['Vô Cực','无极','Boundless'],
  ['Bắc Đẩu','北斗','Northern Dipper'],['Lưu Ly','琉璃','Glazed Jade'],
  ['Phù Quang','浮光','Drifting Light'],
];
const schools = [
  ['Tông','宗','Sect'],['Kiếm Tông','剑宗','Sword Sect'],
  ['Đạo Tông','道宗','Dao Sect'],['Tiên Tông','仙宗','Immortal Sect'],
  ['Linh Tông','灵宗','Spirit Sect'],['Môn','门','School'],
  ['Các','阁','Pavilion'],['Kiếm Các','剑阁','Sword Pavilion'],
  ['Đan Các','丹阁','Alchemy Pavilion'],['Cốc','谷','Valley'],
  ['Cung','宫','Palace'],['Sơn Trang','山庄','Mountain Estate'],
];
export const sects=names.flatMap(([vi,zh,en],i)=>schools.map(([suffix,zhSuffix,enSuffix],j)=>({
  id:`sect_${i}_${j}`,name:`${vi} ${suffix}`,
  translations:{zh:`${zh}${zhSuffix}`,en:`${en} ${enSuffix}`},
})));

// A separate deterministic selection keeps the existing life RNG untouched.
export function sectNameForProfile(profile){
  const source=[profile.name,profile.origin?.id,profile.root?.name,profile.physique?.name,
    profile.talent,profile.comprehension,profile.luck].join('|');
  let hash=2166136261;
  for(const character of source){hash^=character.codePointAt(0);hash=Math.imul(hash,16777619)>>>0;}
  return sects[hash%sects.length].name;
}
export function sectNameForRun(run){
  if(!['member','resident'].includes(run.state.sectStatus))return null;
  return run.profile.sectName||sectNameForProfile(run.profile);
}
