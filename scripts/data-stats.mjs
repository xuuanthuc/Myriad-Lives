import {events,birth,endings,validateContent} from '../src/engine/content.js';
import {realms,roots,physiques,origins} from '../src/data/realms.js';
import {sects} from '../src/data/sects.js';
import {stagesForRealm} from '../src/data/subrealms.js';
import {sectChildhood} from '../src/data/origins.js';
import {realmDataStats,summarizeEvents} from './lib/data-stats.mjs';

const args=process.argv.slice(2);
if(args.length&&!(args.length===2&&args[0]==='--realm')&&!(args.length===1&&['--help','-h'].includes(args[0]))){
  console.error('Cú pháp: npm run data:stats [-- --realm <id>]');process.exit(1);
}
if(args.includes('--help')||args.includes('-h')){
  console.log('npm run data:stats                    Thống kê toàn bộ kho dữ liệu');
  console.log('npm run data:stats -- --realm foundation    Xem chi tiết Trúc Cơ');
  console.table(realms.map(r=>({'ID':r.id,'Cảnh giới':r.name})));
  process.exit(0);
}
const chosen=args[1];
if(chosen&&!realms.some(r=>r.id===chosen)){
  console.error(`Không có cảnh giới "${chosen}". Chạy npm run data:stats -- --help để xem ID.`);
  process.exit(1);
}
validateContent();
const overall=summarizeEvents(events),all=realmDataStats(events,realms);
const report=chosen?all.filter(s=>s.realm.id===chosen):all;
console.log('\nMYRIAD LIVES · THỐNG KÊ DATA LOCAL\n');
console.log(`Kho toàn web: ${overall.total} sự kiện gốc · ${overall.choices} sự kiện lựa chọn · ${overall.options} phương án · ${overall.outcomes} kết quả.`);
console.log(`Giao chiến: ${overall.combat} sự kiện · ${overall.automatic} sự kiện có kết quả tự động.`);
console.log(`Đoạn kể sự kiện: ${overall.total+overall.outcomes} (mô tả gốc + kết quả tự động/lựa chọn).`);
console.log(`${realms.length} đại cảnh giới · ${realms.reduce((sum,_,i)=>sum+stagesForRealm(i).length,0)} tiểu cảnh giới · ${roots.length} linh căn · ${physiques.length} thể chất · ${origins.length} xuất thân · ${sects.length} tông môn.`);
console.log(`Ngoài kho sự kiện: ${birth.length} mẫu sinh · ${endings.length} mẫu kết cục · ${origins.length} đoạn xuất thân · ${Object.keys(sectChildhood).length} tình huống tuổi thơ tông môn.`);
console.log('\nSỐ LƯỢNG THEO CẢNH GIỚI');
console.table(report.map(s=>({
  'Cảnh giới':s.realm.name,'Tổng':s.total,'Đời thường':s.life,'Tu luyện':s.cultivation,
  'Cơ duyên':s.opportunity,'Hiểm cảnh':s.disaster,'Lựa chọn':s.choices,'Giao chiến':s.combat,'Đoạn kể':s.narratives,
})));
console.log('PHẠM VI VÀ ĐIỀU KIỆN');
console.table(report.map(s=>({
  'Cảnh giới':s.realm.name,'Chỉ cảnh giới này':s.exclusive,'Dùng chung':s.shared,
  'Có điều kiện':s.conditional,'Theo giới tính':s.gender,'Theo thể chất':s.physique,'Theo tông môn':s.sect,'Theo đạo lữ':s.partner,
})));
console.log('Tổng = riêng + dùng chung. Lựa chọn nằm trong Tổng; không cộng thêm vào tổng sự kiện.');
console.log('Sự kiện dùng chung được tính ở từng cảnh giới phù hợp, nên không cộng các hàng để ra tổng toàn web.');
console.log('Đây là kho data theo allowedRealms, không phải số sự kiện chắc chắn gặp trong một kiếp.');
console.log('Tuổi, điều kiện nhân vật, trọng số và giới hạn xuất hiện vẫn được engine kiểm tra khi chơi.');
console.log('Các cột điều kiện có thể giao nhau. Mốc đột phá/tiểu cảnh giới do engine sinh không nằm trong bảng.');

if(chosen){
  const categories={life:'Đời thường',cultivation:'Tu luyện',opportunity:'Cơ duyên',disaster:'Hiểm cảnh'};
  console.log(`\nDANH SÁCH DATA: ${report[0].realm.name} (${chosen})`);
  console.table(report[0].events.map(e=>({
    'ID':e.id,'Tên':e.title,'Loại':categories[e.category],
    'Phạm vi':e.allowedRealms?.length===1?'Riêng':e.allowedRealms?'Nhiều cảnh giới':'Mọi cảnh giới',
    'Lựa chọn':e.choices?.length||0,'Kết quả tự động':e.outcomes?.length||0,'Tuổi tối thiểu':e.minAge,
    'Điều kiện':Object.entries(e.conditions||{}).map(([key,value])=>`${key}: ${value}`).join('; ')||'—',
  })));
}else{
  const ranked=[...all].sort((a,b)=>a.total-b.total);
  const cutoff=ranked[Math.min(4,ranked.length-1)].total;
  const least=ranked.filter(s=>s.total<=cutoff);
  console.log('\nNHÓM CẢNH GIỚI CÓ ÍT DATA PHÙ HỢP NHẤT (5 VỊ TRÍ ĐẦU, GỒM ĐỒNG HẠNG)');
  for(const s of least)console.log(`- ${s.realm.name}: ${s.total} sự kiện, ${s.exclusive} riêng, ${s.choices} lựa chọn. ID: ${s.realm.id}`);
  console.log('\nXem tên và ID từng sự kiện: npm run data:stats -- --realm foundation');
  console.log('Danh sách ID cảnh giới: npm run data:stats -- --help');
}
