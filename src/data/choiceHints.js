// Resolve visible notes by action, including choices stored in older saves.
// Effects and the saved outcome tables are never changed.
export const choiceHintTranslations=[
 ['Bỏ chút linh tài, đổi lấy phần linh dược.','花些灵材，换取一份灵药。','Offer some spirit materials in exchange for a share of the herb.'],
 ['Hao chút giấy mực, tìm hiểu điều ẩn trong những nét cũ.','花些纸墨，探究旧纹中隐藏的奥妙。','Spend some ink and paper to study what the old markings conceal.'],
 ['Bỏ chút linh tài để nhìn rõ thật giả.','花些灵材，辨明真假。','Spend some spirit materials to distinguish the genuine from the false.'],
 ['Mượn linh khí ngoài rìa, chậm mà chắc.','借外围灵气，稳步修行。','Draw on the energy at the edge and practice at a steady pace.'],
 ['Tốn công chuẩn bị, đổi lấy một đường đi vững hơn.','费心准备，换一条更稳妥的路。','Invest in preparations for a more secure passage.'],
 ['Gửi chút linh tài, giúp đoàn người từ phía sau.','送些灵材，从后方帮助旅队。','Send some spirit materials to support the travelers from behind.'],
 ['Lấy trao đổi thay tranh thắng, biết đâu có điều đáng học.','以交流代替争胜，或许有所领悟。','Exchange ideas instead of competing; there may be something to learn.'],
 ['Hao tiền thuốc, nhọc đường đi, nhưng vẫn còn cách cứu người.','花些药钱，奔走劳累，仍有救人的办法。','Medicine and the journey take their toll, but there is still a way to help.'],
 ['Chia bớt vật tư, cùng giữ lấy một nơi dung thân.','分出物资，共守一处容身之所。','Share some supplies to help preserve a place of refuge.'],
 ['Góp chút vật tư, giúp người khác có thêm đường lui.','贡献些物资，为他人留一条退路。','Contribute supplies to give others another way out.'],
 ['Hao chút linh tài, tìm người cùng kiểm chứng chuyện chưa rõ.','花些灵材，请人一起核实未明之事。','Spend some spirit materials to seek help verifying what remains unclear.'],
 ['Chia chút của mình, giúp người qua cơn thiếu thốn.','分出自己的物资，助人渡过困境。','Share what you have to help someone through their hardship.'],
 ['Bỏ chút linh tài, thử tìm điều hữu ích.','花些灵材，尝试寻得有用之物。','Spend some spirit materials in search of something useful.'],
 ['Lắng nghe và suy ngẫm, biết đâu nhận ra điều mới.','静听深思，或许有所领悟。','Listen and reflect; you may discover something new.'],
];
const notes=new Map();
function assign(index,texts){for(const text of texts)notes.set(text,choiceHintTranslations[index][0]);}
assign(0,['Đổi linh tài lấy phần lá']);
assign(1,['Chép trận văn ngoài cửa','Chép trận văn khi nước rút','Thuê chép phần còn nguyên','Sao dấu ngoài ngọc để đối chiếu']);
assign(2,['Trả phí nhờ giám định']);
assign(3,['Luyện khí trên bờ linh trì','Thu khí ở sườn núi','Dò tiếng nước từ ngoài miếu']);
assign(4,['Thuê thợ gia cố lối nông','Tài trợ tuyến vòng tạm','Góp vật tư neo thuyền để cứu sau']);
assign(5,['Góp phù hộ đường thay hộ tống']);
assign(6,['Đổi so tài thành diễn giải chiêu thức']);
assign(7,['Mua thuốc thường và đưa tới y quán']);
assign(8,['Góp vật liệu cho đội vá giới','Góp đạo nguyên dựng nơi trú ngoài','Tặng vật liệu làm nguồn sáng riêng']);
assign(10,['Thuê người đối chiếu giọng nói','Mời người làng tới xác nhận','Mời người khác chứng kiến lời khai','Giao tráp niêm cho người làm chứng','Góp vật tư đo lưu lượng chung','Đối chiếu dược tính trước khi luyện','Thuê người truy dấu để báo hội']);
assign(11,['Mua thức ăn cho đứa trẻ','Trả tiền bánh thay người đói','Trả phí chia đậu trước người làm chứng','Cho mượn vật tư thay trục tạm']);
assign(13,['Ghi đạo âm bên bờ cầu']);

export function choiceHint(option){
  if(!/[0-9]|[+−]/.test(option.hint||''))return option.hint;
  if(notes.has(option.text))return notes.get(option.text);
  if(option.text==='Mua tàn quyển')return choiceHintTranslations[12][0];
  return choiceHintTranslations[9][0];
}
