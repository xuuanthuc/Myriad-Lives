import {genderForProfile} from './genders.js';
const surnames=[['Lâm','林','Lin'],['Mộ','慕','Mu'],['Tần','秦','Qin'],['Diệp','叶','Ye'],['Tô','苏','Su'],['Lục','陆','Lu'],['Bạch','白','Bai'],['Vân','云','Yun'],['Hàn','韩','Han'],['Liễu','柳','Liu'],['Tiêu','萧','Xiao'],['Thẩm','沈','Shen'],['Cố','顾','Gu'],['Ninh','宁','Ning'],['Đường','唐','Tang'],['Tống','宋','Song'],['Chu','周','Zhou'],['Phương','方','Fang'],['Hứa','许','Xu'],['Mạc','莫','Mo']];
const given={
  male:[['Vô Trần','无尘','Wuchen'],['Trường Phong','长风','Changfeng'],['Thiên Hành','天行','Tianxing'],['Hoài An','怀安','Huaian'],['Cảnh Minh','景明','Jingming'],['Dật Thần','逸辰','Yichen'],['Huyền Dạ','玄夜','Xuanye'],['Thanh Huyền','清玄','Qingxuan'],['Tử Mặc','子墨','Zimo'],['Vân Chu','云舟','Yunzhou'],['Kiếm Tâm','剑心','Jianxin'],['Tinh Hà','星河','Xinghe'],['Mặc Uyên','墨渊','Moyuan'],['Thiên Dật','天逸','Tianyi'],['Hàn Sơn','寒山','Hanshan']],
  female:[['Thanh Hà','清荷','Qinghe'],['Tử Yên','紫烟','Ziyan'],['Nhược Thủy','若水','Ruoshui'],['Minh Nguyệt','明月','Mingyue'],['Vãn Ninh','晚宁','Wanning'],['Mộng Dao','梦瑶','Mengyao'],['Tuyết Ly','雪璃','Xueli'],['Vân Hi','云曦','Yunxi'],['Thanh Loan','青鸾','Qingluan'],['Linh Âm','灵音','Lingyin'],['Ngọc Dao','玉瑶','Yuyao'],['Sơ Nguyệt','初月','Chuyue'],['Uyển Thanh','婉清','Wanqing'],['Tịch Nhan','夕颜','Xiyan'],['Nhược Lan','若兰','Ruolan']],
};
export const partners=Object.entries(given).flatMap(([gender,names])=>surnames.flatMap(([surname,zh,en])=>names.map(([name,zname,ename])=>({gender,name:`${surname} ${name}`,translations:{zh:zh+zname,en:`${en} ${ename}`}}))));
export const partnerNames=new Map(partners.map(p=>[p.name,p]));
export function partnerForRun(run){
  if(run.state.partnerStatus!=='bonded')return null;
  const gender=genderForProfile(run.profile)==='male'?'female':'male';
  const pool=partners.filter(p=>p.gender===gender);
  let hash=2166136261;
  for(const char of `${run.number}|${run.profile.name}|${run.profile.luck}|${run.profile.origin.name}`)hash=Math.imul(hash^char.codePointAt(0),16777619);
  return pool[(hash>>>0)%pool.length];
}
