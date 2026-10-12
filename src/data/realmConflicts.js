// Two additional conflicts per realm: a disputed prize and an organized pursuit.
const settings=[
  ['mortal',['bến sông','河渡','the river crossing'],['võ sĩ giang hồ','江湖武者','a wandering fighter'],['đoàn thuyền','船队','the convoy']],
  ['qi_refining',['phường thị','坊市','the spirit market'],['đệ tử tà phái','邪派弟子','a sinister disciple'],['túi linh thạch','灵石袋','the spirit stones']],
  ['foundation',['vườn linh dược','灵药园','the herb garden'],['tu sĩ áo đen','黑衣修士','a cloaked cultivator'],['gốc linh sâm','灵参','the spirit ginseng']],
  ['golden_core',['động yêu vương','妖王洞','the beast king’s cave'],['thợ săn yêu đan','妖丹猎手','a core hunter'],['viên yêu đan','妖丹','the beast core']],
  ['nascent_soul',['di tích cổ','古遗址','the ancient ruins'],['trưởng lão ma đạo','魔道长老','a demonic elder'],['ngọc giản cổ','古玉简','the ancient jade slip']],
  ['spirit_transformation',['đàn tế hoang','荒祭坛','the abandoned altar'],['hộ pháp dị tộc','异族护法','an alien guardian'],['tàn quyển thần thông','神通残卷','the incomplete technique']],
  ['void_refining',['khe nứt hư không','虚空裂隙','the void rift'],['đạo tặc hư không','虚空盗匪','a void raider'],['mảnh tinh thạch','晶石碎片','the crystal shard']],
  ['body_integration',['chiến trường cổ','古战场','the ancient battlefield'],['chiến tướng dị tộc','异族战将','an alien general'],['chiến kỳ cổ','古战旗','the ancient war banner']],
  ['mahayana',['cửa giới vực','界域之门','the realm gateway'],['lão quái ẩn thế','隐世老怪','a hidden ancient master'],['chìa khóa giới môn','界门钥匙','the gateway key']],
  ['true_immortal',['bến phi thăng','飞升渡口','the ascension harbor'],['chấp sự tiên ngục','仙狱执事','an immortal jailer'],['lệnh bài tiếp dẫn','接引令牌','the guiding token']],
  ['golden_immortal',['mỏ tiên kim','仙金矿','the immortal gold mine'],['hộ vệ tiên tộc','仙族护卫','an immortal clan guard'],['khối tiên kim','仙金','the immortal gold']],
  ['mystic_immortal',['tinh vực hoang','荒星域','the deserted star domain'],['sát thủ tinh vực','星域杀手','a stellar assassin'],['bản đồ tinh lộ','星路图','the star chart']],
  ['immortal_king',['biên thùy tiên quốc','仙国边境','the immortal kingdom’s border'],['vương hầu phản loạn','叛乱王侯','a rebellious lord'],['ấn tín lãnh địa','领地印信','the domain seal']],
  ['immortal_emperor',['đạo tràng thiên ngoại','天外道场','the celestial sanctuary'],['cổ đế thức tỉnh','苏醒古帝','an awakened ancient emperor'],['mảnh bản nguyên','本源碎片','the primordial fragment']],
];
const narrative=(vi,zh,en)=>({text:vi,translations:{zh:{text:zh},en:{text:en}}});
export const realmConflicts=settings.flatMap(([realm,place,enemy,prize])=>{
  const [p,zp,ep]=place,[e,ze,ee]=enemy,[b,zb,eb]=prize;
  return ['contest','pursuit'].map(kind=>{
    const contest=kind==='contest';
    const title=contest?`Tranh đoạt tại ${p}`:`Truy sát tại ${p}`;
    const prompt=contest
      ?narrative(`Ngươi tìm thấy ${b} tại ${p}, nhưng ${e} cũng vừa tới. Đối phương ra tay, biến cuộc tìm kiếm thành trận chiến khó tránh.`,
        `你在${zp}发现${zb}，${ze}却也赶到。对方立即出手，寻宝变成了一场无法回避的战斗。`,
        `You discover ${eb} at ${ep}, but ${ee} arrives too. The rival attacks immediately, turning the search into a battle you cannot avoid.`)
      :narrative(`${e} nhận lệnh truy sát ngươi, giấu đồng bọn quanh ${p}. Khi đường lui bị chặn, ngươi phải chống trả giữa vòng vây đang khép kín.`,
        `${ze}奉命追杀你，在${zp}埋下同伙。退路被封，你必须迎战逐渐收紧的包围。`,
        `${ee} is ordered to hunt you and stations accomplices around ${ep}. With escape blocked, you must fight against their steadily tightening encirclement.`);
    const reason=contest?`Tử trận khi tranh đoạt ${b}`:`Bị truy sát tại ${p}`;
    const zr=contest?`争夺${zb}时战死`:`在${zp}被追杀身亡`;
    const er=contest?`Slain while contesting ${eb}`:`Hunted down at ${ep}`;
    const victory=contest
      ?narrative(`Ngươi tìm được sơ hở, đánh lui ${e} rồi thu lấy ${b}. Trận chiến kết thúc, nhưng dấu pháp lực còn lưu khiến ngươi phải đổi đường trở về.`,
        `你抓住破绽，击退${ze}并取走${zb}。战斗虽已结束，残留的法力痕迹却迫使你改道返回。`,
        `You exploit an opening, repel ${ee} and claim ${eb}. The battle ends, but lingering traces of your power force you to return by another route.`)
      :narrative(`Ngươi đánh bật ${e}, phá được vòng vây quanh ${p}. Thuốc cùng vật tư bỏ lại giúp bù tổn thất, nhưng nơi trú cũ không còn an toàn.`,
        `你击退${ze}，冲出${zp}的包围。敌人遗下的药物物资弥补损失，旧日住处却已不再安全。`,
        `You repel ${ee} and break the encirclement at ${ep}. Abandoned medicine and supplies cover your losses, but your former shelter is no longer safe.`);
    const injury=narrative(`Ngươi trúng đòn của ${e}, phải bỏ lại vật tư để thoát khỏi ${p}. Vết thương chưa lấy mạng, nhưng nhiều năm tích góp đã mất sau trận chiến.`,
      `你被${ze}击伤，丢下物资才逃出${zp}。伤口尚未致命，多年积攒却在这一战后付诸流水。`,
      `A strike from ${ee} forces you to abandon supplies and flee ${ep}. The wound is not immediately fatal, but years of accumulated wealth are lost.`);
    const death=narrative(`${e} phá tan phòng thủ, chặn ngươi lại tại ${p}. Không còn ai tới ứng cứu, cuộc đời khép lại giữa trận chiến và cơ duyên chưa kịp giữ.`,
      `${ze}击碎防御，把你困在${zp}。再无人前来援救，你的一生终结于战斗和未能握住的机缘之间。`,
      `${ee} breaks your defenses and traps you at ${ep}. With nobody coming to help, your life ends amid the battle and an opportunity left unclaimed.`);
    const lethal={endingReason:reason,translations:{zh:{endingReason:zr},en:{endingReason:er}}};
    return {id:`conflict_${realm}_${kind}`,combat:true,category:'disaster',title,...prompt,
      translations:{zh:{title:contest?`${zp}争夺`:`${zp}追杀`,text:prompt.translations.zh.text},en:{title:`${contest?'Clash':'Pursuit'} at ${ep}`,text:prompt.translations.en.text}},
      allowedRealms:[realm],weight:24,minAge:18,cooldownYears:100,maxOccurrencesPerLife:1,importance:'major',
      outcomes:[
        {id:'victory',weight:5,...victory,effects:{resources:20,cultivation:10}},
        {id:'injury',weight:4,...injury,endingReason:reason,translations:{zh:{...injury.translations.zh,...lethal.translations.zh},en:{...injury.translations.en,...lethal.translations.en}},effects:{health:-38,resources:-22}},
        {id:'death',weight:2,...death,endingReason:reason,translations:{zh:{...death.translations.zh,...lethal.translations.zh},en:{...death.translations.en,...lethal.translations.en}},effects:{death:true}},
      ]};
  });
});
