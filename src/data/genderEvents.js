const chapters=[
  [['mortal','qi_refining'],['tuyển nam hộ viện','招募男护院','male guard recruitment'],['tuyển nữ đệ tử','招收女弟子','female disciple recruitment']],
  [['foundation','golden_core'],['truyền thừa nam đệ tử','男弟子传承','a male disciple legacy'],['truyền thừa nữ đệ tử','女弟子传承','a female disciple legacy']],
  [['nascent_soul','spirit_transformation'],['hội luận đạo nam tu','男修论道会','a male cultivator gathering'],['hội luận đạo nữ tu','女修论道会','a female cultivator gathering']],
  [['void_refining','body_integration'],['đội hộ tống nam tu','男修护送队','a male cultivator escort'],['đội hộ tống nữ tu','女修护送队','a female cultivator escort']],
  [['mahayana','true_immortal'],['động thiên nam tu','男修洞天','a male cultivator sanctuary'],['động thiên nữ tu','女修洞天','a female cultivator sanctuary']],
  [['golden_immortal','mystic_immortal'],['đạo hội tiên quân','仙君道会','an immortal lord assembly'],['đạo hội tiên tử','仙子道会','an immortal lady assembly']],
  [['immortal_king','immortal_emperor'],['đế cung nam truyền','男传帝宫','an emperor’s male lineage'],['đế cung nữ truyền','女传帝宫','an emperor’s female lineage']],
];
export const genderEvents=chapters.flatMap(([allowedRealms,male,female],index)=>['male','female'].map((gender,g)=>{
  const [subject,zh,en]=g?female:male;
  const risky=index===3;
  const text=risky
    ?`Ngươi nhận lời tham gia ${subject}, nhưng đoàn bị phục kích giữa đường. Đồng đội cùng phá vòng vây, còn ngươi phải dùng vật tư để dưỡng thương sau trận đánh.`
    :`Ngươi được mời tới ${subject}, nơi chỉ nhận người hợp lệ truyền đời. Qua thử thách, ngươi lĩnh tài nguyên và cùng đồng đạo trao đổi kinh nghiệm tu hành.`;
  return {id:`gender_${gender}_${index}`,title:subject,text,category:risky?'disaster':index===0?'life':'opportunity',
    translations:{zh:{title:zh,text:risky?`你加入${zh}，队伍却在途中遭到伏击。同伴合力突围，而你必须花费物资治疗战后的伤势。`:`你受邀参加${zh}，此处只接纳符合历代规矩之人。通过考验后，你领取资源，并与同道交流修行经验。`},
      en:{title:en,text:risky?`You join ${en}, but the party is ambushed along the road. Your companions break the encirclement together, while you spend supplies recovering from battle injuries.`:`You receive an invitation to ${en}, which admits only those matching its inherited rules. Passing the trial earns supplies and an exchange of cultivation experience with fellow practitioners.`}},
    conditions:{gender},allowedRealms,weight:15,minAge:18,cooldownYears:150,maxOccurrencesPerLife:1,
    effects:risky?{health:-22,resources:-12}:{resources:16,cultivation:6}};
}));
