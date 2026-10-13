const stories = [
  ['forest-shrine',['mortal','qi_refining'],['Miếu sáng giữa rừng','林中亮庙','A glowing forest shrine'],
    ['Trên đường núi, ngươi thấy một ngôi miếu bỏ hoang vẫn sáng đèn. Dưới tượng đá có tiếng nước chảy, nhưng dấu chân ngoài cửa đều hướng vào trong.','山路旁，荒庙仍亮着灯。石像下传来流水声，门外脚印却全都朝向庙内。','Along a mountain path, you find an abandoned shrine still lit by lamps. Water murmurs beneath its statue, but every footprint outside leads inward.'],
    ['Ngươi tìm được bình nước thuốc dưới tượng đá rồi rời miếu trước bình minh. Uống từng ngụm nhỏ giúp thân thể khỏe hơn sau những ngày đường dài.','你在石像下找到药水，天亮前离开荒庙。小口服用后，长途跋涉的身体逐渐恢复。','You find medicinal water beneath the statue and leave before dawn. Drinking small amounts restores your body after many tiring days upon the mountain roads.'],
    ['Sàn đá bất ngờ sụp xuống khi ngươi bước qua cửa. Ngươi bám vào rễ cây để thoát ra, bỏ lại hành lý dưới hố sâu tối lạnh.','跨过门槛时石地突然塌陷。你抓住树根逃出，行囊却遗落在冰冷的深坑中。','The stone floor collapses as you cross the entrance. Clinging to a tree root, you escape the pit but leave your belongings in its cold darkness.'],
    ['Ngươi đánh dấu ngôi miếu trên đường rồi đi tiếp trước khi trời tối. Bên bếp lửa đêm ấy, ngươi vẫn tự hỏi thứ gì đã thắp những ngọn đèn.','你记下荒庙位置，在天黑前继续赶路。夜里围着篝火，仍猜想是谁点亮那些灯。','You mark the shrine and continue before nightfall. Beside your campfire that evening, you still wonder who had lit the lamps within the deserted building.'],{health:10,resources:8},{health:-10,resources:-8}],
  ['buried-cauldron',['foundation','golden_core'],['Đan lô dưới lòng hồ','湖底丹炉','A cauldron beneath the lake'],
    ['Hồ nước rút xuống, để lộ một đan lô bị xích vào đá. Mùi dược hương vẫn thoảng qua khe nắp, trong khi trận văn quanh hồ chưa tắt hẳn.','湖水退去，露出锁在石上的丹炉。炉盖缝隙仍飘药香，湖边阵纹却未完全熄灭。','Receding water reveals a cauldron chained to stone. Medicinal fragrance escapes beneath its lid, while the formation markings around the lake have not entirely faded.'],
    ['Ngươi tháo được xích và thu lấy dược dịch còn sót trong đan lô. Sau khi thử độc cẩn thận, một phần được dùng để củng cố tu vi.','你解开锁链，取出炉中残余药液。谨慎验毒之后，用其中一部分巩固修为。','You unfasten the chains and collect the remaining medicinal liquid. After carefully testing it for poison, you use a portion to consolidate your cultivation.'],
    ['Nắp lô vừa mở thì hỏa khí tích tụ bùng ra. Ngươi dựng lá chắn rồi rút khỏi đáy hồ, nhưng tay áo cháy rụi và kinh mạch chịu thương tổn.','炉盖刚开，积聚火气便喷涌而出。你撑起护罩撤离湖底，衣袖烧毁，经脉也受了伤。','As the lid opens, trapped fire bursts outward. You raise a shield and retreat from the lakebed, but your sleeve burns away and your meridians suffer damage.'],
    ['Ngươi ghi lại trận văn bên hồ để nghiên cứu rồi rời đi. Đan lô vẫn nằm dưới lớp bùn, chờ một người đủ hiểu cấm chế tới mở.','你记下湖边阵纹，留待研究，随后离去。丹炉仍沉在淤泥里，等待懂得禁制的人开启。','You record the formation markings for later study and depart. The cauldron remains beneath the mud, awaiting someone who understands its restrictions well enough to open it.'],{cultivation:20,resources:12},{health:-16}],
  ['soul-bridge',['nascent_soul','spirit_transformation'],['Cầu nối vào thức hải','通往识海的桥','A bridge into consciousness'],
    ['Trong một di tích, thần thức của ngươi chạm tới cây cầu chỉ hiện trong tâm trí. Bên kia có người giảng đạo, nhưng khuôn mặt luôn bị sương che kín.','遗迹中，你的神识触及一座只在心中显现的桥。对岸有人讲道，面容始终藏在雾里。','Within a ruin, your consciousness touches a bridge visible only in the mind. Someone teaches the Dao beyond it, their face forever concealed by mist.'],
    ['Ngươi vượt cầu, nghe được pháp môn ổn định thần thức trước khi bóng người tan biến. Trở lại thân thể, những tiếng nhiễu trong thức hải đã yên xuống rõ rệt.','你过桥听得稳定神识的法门，讲道身影随即消散。回到肉身后，识海中的杂音明显平息。','Crossing the bridge, you learn a method to steady your consciousness before the speaker vanishes. Returning to your body, you find the noise within your mind quieter.'],
    ['Bóng người hóa thành vô số tiếng gọi khi ngươi bước lên cầu. Ngươi chặt đứt liên kết để tỉnh lại, chịu một vết thương sâu trong thần thức.','踏上桥时，身影化作无数呼声。你切断联系醒来，神识却留下深深的伤痕。','As you step onto the bridge, the figure becomes countless calling voices. You sever the connection to awaken, leaving a deep wound within your consciousness.'],
    ['Ngươi thu thần thức trước khi bước lên cầu, giữ lại hình ảnh để suy xét. Không nghe được lời giảng, ngươi trở về với tâm trí nguyên vẹn.','你在上桥前收回神识，留下影像慢慢思索。虽未听得讲道，却保全心神返回。','You withdraw your consciousness before crossing, keeping the image for later reflection. Though you hear no teachings, you return with your mind entirely intact.'],{cultivation:24,health:5},{health:-18,cultivation:-6}],
  ['lost-vessel',['void_refining','body_integration'],['Thuyền lạc giữa hư không','虚空失舟','A vessel lost in the void'],
    ['Ngươi gặp một thuyền cổ trôi giữa hư không, trên boong không có bóng người. Khoang chứa còn phong kín, nhưng thân thuyền đang dần bị dòng xoáy kéo lệch.','虚空中飘着古舟，甲板空无一人。货舱仍被封住，船身却正被漩涡拖离航道。','You encounter an ancient vessel adrift in the void with nobody on deck. Its hold remains sealed, but a vortex steadily drags the hull off course.'],
    ['Ngươi lên thuyền, thu được không tinh trước khi dòng xoáy mạnh lên. Một lối thoát phía đuôi giúp mình trở lại đường cũ với túi trữ vật đầy hơn.','你登舟取走空晶，赶在漩涡增强前从船尾脱身。返回原路时，储物袋又充实了几分。','You board and gather spatial crystals before the vortex strengthens. An opening near the stern lets you regain your route with a fuller storage pouch.'],
    ['Dòng xoáy đổi hướng ngay khi ngươi mở khoang chứa. Ngươi phá vách thuyền để thoát, phải bỏ lại pháp khí đang giữ đường về giữa hư không.','货舱打开时漩涡突然转向。你破开船壁逃出，却遗失了维持归路的法器。','The vortex shifts as you open the hold. Breaking through the hull to escape, you lose the artifact that was maintaining your return passage through the void.'],
    ['Ngươi giữ khoảng cách và quan sát thuyền cổ trôi vào dòng xoáy. Chờ đường đi ổn định trở lại, ngươi tiếp tục hành trình bằng lối vòng xa hơn.','你保持距离，看古舟被漩涡吞没。待通道重新稳定，便绕远路继续前行。','You keep your distance as the ancient vessel disappears into the vortex. Once the passage steadies again, you continue your journey along a longer detour.'],{resources:30},{health:-12,resources:-20}],
  ['ascending-messenger',['mahayana','true_immortal'],['Người đưa tin vượt giới','跨界信使','The messenger between worlds'],
    ['Một người đưa tin bị thương nhờ ngươi chuyển hộp ngọc qua ranh giới hai giới. Trên hộp có dấu của tiên thành, nhưng người truy đuổi đã tới gần.','受伤信使请你把玉匣送过两界边缘。匣上刻着仙城印记，追兵却已经逼近。','A wounded messenger asks you to carry a jade box across the boundary between worlds. It bears an immortal city seal, but pursuers are closing in.'],
    ['Ngươi đưa hộp ngọc tới nơi và được trả bằng tiên thạch tinh khiết. Người nhận không nói bên trong có gì, chỉ cúi đầu cảm tạ rồi khép cửa.','你送达玉匣，获得纯净仙石作为报酬。收件人不言匣中之物，只俯身致谢便关上门。','You deliver the jade box and receive pure immortal stones. Its recipient never explains the contents, offering only a respectful bow before closing the door.'],
    ['Kẻ truy đuổi chặn đường trước khi ngươi vượt giới. Ngươi giao hộp ngọc để thoát vòng vây, nhưng vẫn chịu thương tích trong lúc phá đường rút lui.','跨界之前，追兵拦住去路。你交出玉匣脱离包围，突围时仍受了伤。','The pursuers intercept you before you cross the boundary. Surrendering the jade box breaks the encirclement, but you still suffer injuries while forcing a way out.'],
    ['Ngươi chỉ đường tới một trạm dịch gần đó rồi từ chối nhận hộp. Người đưa tin rời đi trong im lặng, để lại câu chuyện chưa biết hồi kết.','你指向附近驿站，婉拒接下玉匣。信使默默离开，留下一个结局未知的故事。','You point toward a nearby relay station and decline the box. The messenger leaves in silence, carrying a story whose ending you may never learn.'],{resources:28},{health:-16,resources:-10}],
  ['law-auction',['golden_immortal','mystic_immortal'],['Mảnh pháp tắc đấu giá','法则残片竞拍','A fragment of law at auction'],
    ['Tại hội đấu giá, một mảnh pháp tắc lạ được đặt dưới màn sáng. Ngươi cảm thấy nó hợp với đường tu của mình, nhưng người bán không cho kiểm chứng.','拍卖会上，陌生法则残片置于光幕下。你感到它契合自身道路，卖家却不许验证。','At an auction, an unfamiliar fragment of law rests beneath a veil of light. It seems suited to your path, but the seller permits no examination.'],
    ['Mảnh pháp tắc thật sự chứa huyền lý mà ngươi đang tìm kiếm. Sau khi trả tiên thạch, ngươi dành nhiều năm tham ngộ, bù lại một chỗ thiếu trong đạo pháp.','残片确实蕴含你寻找的玄理。付过仙石后，你参悟多年，补上道法中的一处缺漏。','The fragment contains the principle you sought. After paying immortal stones, you spend years contemplating it, filling a gap that had long remained in your understanding.'],
    ['Rời hội đấu giá, ngươi mới phát hiện pháp tắc đã gần tan rã. Tiên thạch mất đi mà chẳng đổi được huyền lý, chỉ còn một món đồ trang trí.','离开拍卖会后，你才发现法则已近崩散。仙石花尽，却未换得玄理，只留下无用的摆件。','After leaving the auction, you discover that the law is almost dissolved. Your immortal stones buy no useful insight, leaving only an expensive ornament in your hands.'],
    ['Ngươi nhường lượt trả giá cho người khác và giữ lại tiên thạch. Khi màn sáng khép xuống, ngươi rời hội để tiếp tục tìm cơ duyên đáng tin hơn.','你让出竞价机会，保留仙石。光幕落下时，便离开会场，继续寻找更可信的机缘。','You let another bidder proceed and keep your immortal stones. As the veil closes, you leave the auction to seek a more trustworthy opportunity elsewhere.'],{cultivation:30,resources:-16},{resources:-20}],
  ['world-refuge',['immortal_king','immortal_emperor'],['Tiểu giới cầu viện','小界求援','A small world seeks refuge'],
    ['Một tiểu giới đang vỡ gửi lời cầu viện tới ngươi. Cứu nó cần mở đường qua vùng pháp tắc hỗn loạn, nơi ngay cả tiên lực cũng khó giữ ổn định.','濒临破碎的小界向你求援。救援须穿过混乱法则，连仙力都难以保持稳定。','A crumbling small world sends you a plea for aid. Saving it requires passage through chaotic laws, where even immortal power is difficult to keep stable.'],
    ['Ngươi nối được tiểu giới với vùng hư không yên ổn. Cư dân dâng bảo vật còn giữ được, còn quá trình vá giới giúp mình hiểu thêm cách pháp tắc liên kết.','你将小界接入稳定虚空。居民献上幸存宝物，修补世界的过程也让你更懂法则的联系。','You connect the small world to stable space. Its inhabitants offer their surviving treasures, while repairing its boundaries reveals more about how laws hold together.'],
    ['Vết vỡ lan nhanh hơn dự tính, cuốn trận pháp cứu viện vào hỗn loạn. Ngươi giữ được đường rút cho cư dân, nhưng tiên lực cùng bảo vật hao tổn nặng.','裂隙扩散超出预料，将救援阵卷入混乱。你保住居民退路，仙力与宝物却损耗严重。','The fractures spread faster than expected, engulfing your rescue formation. You preserve an escape route for the inhabitants, but your power and treasures are severely depleted.'],
    ['Ngươi chỉ mở một lối nhỏ cho cư dân chạy nạn rồi rút khỏi vùng vỡ. Tiểu giới không giữ được, nhưng những thuyền cuối đã tới nơi an toàn.','你只开出供居民避难的小路，随后撤离破碎之地。小界未能保住，最后的船却平安抵达。','You open a narrow passage for refugees and withdraw from the fractures. The small world is lost, but the final vessels reach safety beyond its collapsing boundaries.'],{cultivation:24,resources:20},{health:-18,resources:-28}],
  ['injured-fox',['mortal','qi_refining'],['Hồ ly mắc bẫy','困兽小狐','A fox caught in a trap'],
    ['Ngươi nghe tiếng rên dưới bụi gai, thấy một con hồ ly bị bẫy sắt giữ chân. Bộ lông của nó ánh lên màu lạ, còn tiếng thợ săn vọng tới gần.','荆棘下传来低鸣，一只毛色奇异的狐狸被铁夹困住。远处猎人的声音正在靠近。','Whimpering beneath thorns reveals a fox caught in an iron trap. Its fur has an unusual shimmer, while the voices of approaching hunters grow louder.'],
    ['Ngươi tháo bẫy, để hồ ly trốn vào rừng trước khi thợ săn tới. Vài hôm sau, một túi dược thảo sạch được đặt ngay trước cửa nơi mình nghỉ chân.','你解开铁夹，让狐狸在猎人到来前逃入林中。几天后，住处门前出现了一袋洗净的药草。','You release the fox before the hunters arrive. Several days later, a pouch of carefully cleaned medicinal herbs appears outside the place where you are staying.'],
    ['Hồ ly hoảng sợ cắn tay ngươi khi bẫy vừa mở. Ngươi để nó chạy đi, rồi phải tìm thuốc cầm máu trước khi vết thương sưng tấy nặng hơn.','铁夹刚开，惊恐的狐狸咬了你的手。你放它逃走，随后寻药止血，免得伤口更加肿痛。','As the trap opens, the frightened fox bites your hand. You let it flee and search for medicine before the swelling around your wound grows worse.'],
    ['Ngươi tránh xa bụi gai, báo vị trí bẫy cho người qua đường rồi đi tiếp. Tiếng hồ ly dần nhỏ phía sau, hòa cùng những bước chân thợ săn trong rừng.','你离开荆棘，把陷阱位置告诉路人后继续赶路。狐狸的叫声渐弱，混入林中猎人的脚步。','You step away and tell a passerby where the trap lies. Continuing along the road, you hear the fox’s cries fade beneath footsteps in the forest.'],{resources:10,health:4},{health:-10}],
  ['cracked-recipe',['foundation','golden_core'],['Đan phương thiếu một vị','缺一味的丹方','A recipe missing one ingredient'],
    ['Một đan sư nhờ ngươi thử đan phương mới vừa tìm lại. Trang giấy thiếu tên một vị thuốc, nhưng ông tin có thể dùng linh thảo khác thay vào.','丹师请你试验刚寻回的丹方。纸上少了一味药名，他却相信可以用别的灵草替代。','An alchemist asks you to test a rediscovered recipe. One ingredient name is missing from the page, but he believes another spirit herb can replace it.'],
    ['Linh thảo thay thế khiến đan dược dịu hơn dự tính, vừa hợp với kinh mạch của ngươi. Đan sư chia phần thành phẩm, giữ lại ghi chép để tiếp tục nghiên cứu.','替代灵草使药性比预想温和，恰好适合你的经脉。丹师分给你成丹，留下记录继续研究。','The substitute herb produces a gentler pill suited to your meridians. The alchemist shares the finished batch with you and keeps his notes for further study.'],
    ['Dược tính xung khắc khiến lò đan phụt khói ngay lúc kết đan. Ngươi tránh được vụ nổ nhưng hít phải chút độc khí, phải mua thêm thuốc để thanh lọc.','凝丹时药性相冲，丹炉突然喷烟。你躲过爆炸，却吸入毒气，只得购药清理。','Conflicting ingredients make the cauldron belch smoke as the pills form. You avoid the explosion but inhale poisonous fumes, requiring additional medicine to cleanse them.'],
    ['Ngươi đề nghị tìm bản đan phương đầy đủ rồi mới thử, không đưa kinh mạch vào cuộc cược. Đan sư gật đầu, cất trang giấy cùng lô thuốc chưa dùng.','你建议先寻完整丹方，不拿经脉冒险。丹师点头，收好残页与尚未使用的药材。','You suggest finding the complete recipe before testing it on your meridians. The alchemist agrees, putting away the damaged page and the unused ingredients.'],{cultivation:18,health:8},{health:-12,resources:-10}],
  ['memory-pearl',['nascent_soul','spirit_transformation'],['Ngọc lưu ký ức','留忆玉珠','A pearl that holds memories'],
    ['Trong phế tích, ngươi tìm được viên ngọc lưu giữ ký ức của chủ nhân cũ. Muốn đọc cần để thần thức tiếp xúc trực tiếp, không rõ bên trong còn gì khác.','遗迹里，你找到保存旧主记忆的玉珠。读取须让神识直接接触，却不知其中还藏着什么。','Within a ruin, you find a pearl preserving its former owner’s memories. Reading them requires direct contact with your consciousness, though its other contents remain unknown.'],
    ['Ký ức kể lại cách chủ nhân vượt một bình cảnh mà ngươi cũng đang mắc. Ngươi ghi nhớ những sai lầm trong đó, thu được hướng tham ngộ đáng giá.','记忆记下旧主如何渡过与你相同的瓶颈。你牢记其中失误，获得宝贵的参悟方向。','The memories recount how its owner overcame a bottleneck resembling your own. Studying the mistakes within them gives you a valuable new direction for contemplation.'],
    ['Ký ức cuối chứa nỗi sợ quá mạnh, khiến thần thức của ngươi lẫn vào cảnh chết cũ. Ngươi phá ngọc để thoát, nhưng phải dưỡng tâm nhiều ngày sau đó.','最后记忆中的恐惧太强，将你的神识卷入昔日死亡景象。你碎珠脱身，随后静养心神多日。','The final memory holds such terror that your consciousness becomes trapped in an old death scene. You shatter the pearl to escape, then spend days recovering.'],
    ['Ngươi niêm phong viên ngọc, đặt lại trong phế tích để người hiểu nó hơn tìm thấy. Những ký ức chưa đọc vẫn ngủ yên, còn thần thức của mình được giữ nguyên.','你封好玉珠，放回遗迹，留给更了解它的人。未读的记忆继续沉睡，你的神识也得以保全。','You seal the pearl and return it to the ruin for someone who understands it better. Its unread memories remain asleep, while your consciousness stays undisturbed.'],{cultivation:24},{health:-17,cultivation:-5}],
  ['wandering-island',['void_refining','body_integration'],['Đảo trôi ngoài giới','界外浮岛','An island drifting beyond the world'],
    ['Một đảo nhỏ trôi qua ranh giới hư không, trên mặt có linh mộc lâu năm. Ngươi chỉ còn một khoảng ngắn để lên đảo trước khi nó rời khỏi tầm cảm nhận.','小岛漂过虚空边界，上面长着古老灵木。它即将离开感知范围，你只有短暂机会登岛。','A small island drifts past the edge of the void, bearing ancient spirit trees. You have only a brief chance to board before it leaves your perception.'],
    ['Ngươi lấy được nhánh linh mộc đã rụng rồi trở về đúng lúc đảo đổi hướng. Chất gỗ bền hơn thường thấy, đủ dùng sửa một phần pháp bảo hộ thân.','你拾取落下的灵木枝，在浮岛转向前及时返回。木质异常坚韧，足以修补护身法宝。','You gather fallen spirit branches and return just before the island changes course. Their unusually durable wood is enough to repair part of your protective treasure.'],
    ['Đảo trôi đổi hướng ngay khi ngươi đặt chân xuống, cắt đứt dấu neo phía sau. Ngươi dùng pháp bảo phá đường trở về, khiến nó hỏng mất một phần quan trọng.','刚踏上岛，浮岛便转向，切断身后的锚印。你用法宝破开归路，却损坏了重要部件。','The island changes course as you land, severing your anchor behind you. Using a treasure to force a return passage damages one of its essential components.'],
    ['Ngươi quan sát quỹ đạo đảo trôi từ xa rồi ghi lại tọa độ cuối. Không có linh mộc trong tay, nhưng đường trở về vẫn chắc chắn dưới chân mình.','你远远观察浮岛轨迹，记下最后坐标。虽未得到灵木，脚下归路却仍然稳固。','You observe the drifting island from a distance and record its final coordinates. You gain no spirit wood, but your return passage remains securely within reach.'],{resources:26},{resources:-20,health:-8}],
  ['silent-gate',['mahayana','true_immortal'],['Cửa giới không người canh','无人守界门','An unguarded world gate'],
    ['Một cửa giới bỏ hoang mở ra sau cơn lôi vũ, bên kia có dòng khí khác thường. Không bia ghi điểm đến, ngươi chỉ cảm nhận được đường đi còn chưa ổn định.','雷雨后，废弃界门开启，对面流来陌生气息。没有石碑标明去向，你只觉通道尚不稳定。','An abandoned world gate opens after a thunderstorm, releasing unfamiliar energy. No inscription identifies its destination, and you can sense that the passage is still unstable.'],
    ['Bên kia cửa giới là một trạm cũ còn ít vật liệu phong trận. Ngươi thu lấy phần dùng được, trở lại trước khi lôi vân kéo tới khép đường.','界门另一端是旧驿站，留有封阵材料。你收取能用的部分，赶在雷云封路前返回。','Beyond the gate lies an old station with usable formation materials. You gather what remains and return before gathering thunderclouds close the passage behind you.'],
    ['Cửa giới thu hẹp ngay giữa chuyến đi, ép tiên lực cùng linh lực xoáy ngược. Ngươi bỏ vật liệu mang theo để thoát ra, trở về với kinh mạch đau nhức.','旅途中界门骤然收缩，仙力与灵力被压得倒旋。你丢下携带材料逃出，归来时经脉剧痛。','The gate narrows during your crossing, twisting your energy backward. Abandoning the materials you carry lets you escape, but leaves your meridians aching upon return.'],
    ['Ngươi đứng ngoài cửa giới cho tới khi lôi vân khép nó lại. Dòng khí lạ tan dần, để lại một khoảng trời trống và tọa độ đã được ghi nhớ.','你留在门外，直到雷云令界门闭合。陌生气息渐散，只余空旷天空与记下的坐标。','You remain outside until thunderclouds close the gate. Its unfamiliar energy fades away, leaving an empty sky and a set of coordinates preserved in your memory.'],{resources:28},{health:-16,resources:-12}],
  ['law-duel',['golden_immortal','mystic_immortal'],['Lời mời luận pháp','论法邀约','An invitation to debate the laws'],
    ['Một tiên nhân mời ngươi luận pháp bằng cách dựng hai tiểu trận đối nhau. Người thắng được lấy bản ghi chép của đối phương, nhưng trận thua có thể phản chấn thần thức.','仙人邀你各立小阵论法。胜者可取对方笔记，但败阵可能反震神识。','An immortal invites you to test two opposing formations. The winner receives the other’s research notes, but a collapsing formation may strike back at its creator’s consciousness.'],
    ['Tiểu trận của ngươi giữ được nhịp pháp tắc tới cuối cuộc luận. Đối phương trao bản ghi chép như đã hẹn, trong đó có cách hóa giải một chỗ xung khắc lâu năm.','你的小阵将法则节奏维持到最后。对方如约交出笔记，其中记有化解旧日冲突的方法。','Your formation maintains its rhythm until the debate ends. Your opponent honors the agreement, handing over notes that explain how to resolve a longstanding conflict in your practice.'],
    ['Pháp tắc đối phương luồn qua điểm yếu làm tiểu trận của ngươi vỡ. Ngươi nhận phản chấn, phải trao bản ghi chép và dành thời gian dưỡng lại thần thức.','对方法则穿过弱点，令你的小阵崩碎。你承受反震，交出笔记，并花时间调养神识。','Your opponent’s law slips through a weakness and shatters your formation. The backlash forces you to surrender your notes and spend time restoring your consciousness.'],
    ['Ngươi từ chối cuộc luận có đặt cược, chỉ ngồi trao đổi vài điều bên trà. Đối phương thu trận, hẹn dịp khác khi cả hai có thể thử sức thoải mái hơn.','你婉拒带赌注的论法，只在茶间交流几句。对方收阵，约定日后再轻松切磋。','You decline a debate with stakes and instead exchange a few thoughts over tea. Your companion withdraws the formation, suggesting a friendlier contest on another occasion.'],{cultivation:28},{health:-14,resources:-12}],
  ['forgotten-seal',['immortal_king','immortal_emperor'],['Phong ấn bị lãng quên','遗忘的封印','A forgotten seal'],
    ['Một phong ấn cổ trong tiên vực bắt đầu rò rỉ ánh sáng, không còn ai nhớ thứ bị giữ bên trong. Ngươi có thể thử gia cố hoặc mở nó để tìm nguyên nhân.','仙域古封印开始漏光，却无人记得里面封着什么。你可以尝试加固，或将它打开查明原因。','An ancient seal begins leaking light within the immortal domain. Nobody remembers its contents; you can attempt to stabilize it or open it to discover the cause.'],
    ['Ngươi mở phong ấn và thấy một đạo nguyên đang dần tiêu tán. Thu lấy phần còn nguyên giúp mình hiểu thêm cách các pháp tắc nương tựa để tồn tại.','你开启封印，发现逐渐消散的道源。收取完好部分后，对法则相依而存又多一层领悟。','Opening the seal reveals a slowly fading source of Dao. Gathering its intact portion deepens your understanding of how laws rely upon one another to exist.'],
    ['Phong ấn vỡ ra, giải phóng những mảnh pháp tắc hỗn loạn đã bị nén lâu năm. Ngươi chặn chúng khỏi lan tới cư dân, nhưng nguyên khí cùng bảo vật hao tổn nặng.','封印破裂，释放多年压住的混乱法则碎片。你阻止它们波及居民，却严重耗损元气与宝物。','The broken seal releases fragments of chaotic laws compressed for ages. You prevent them from reaching the inhabitants, but the effort heavily drains your vitality and treasures.'],
    ['Ngươi dựng lớp trận bên ngoài để giữ phong ấn ổn định rồi cử người theo dõi. Bí mật vẫn nằm phía sau, còn tiên vực có thêm thời gian chuẩn bị.','你在外层布阵稳住封印，安排人继续监看。秘密仍在其中，仙域却多了准备的时间。','You reinforce the seal from outside and arrange continued observation. Its secret remains hidden, but the immortal domain gains more time to prepare for what lies within.'],{cultivation:30,resources:12},{health:-18,resources:-26}],
];

const translatedText=([vi,zh,en])=>({text:vi,translations:{zh:{text:zh},en:{text:en}}});
const thirdPaths={
  "realm_choice_forest-shrine": {
    "id": "third_path",
    "text": "Dò tiếng nước từ ngoài miếu",
    "hint": "-3 tài nguyên · +5 tu vi",
    "translations": {
      "zh": {
        "text": "在庙外探查水声",
        "hint": "-3 物资 · +5 修为"
      },
      "en": {
        "text": "Trace the water from outside",
        "hint": "-3 resources · +5 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi thả phù dò theo tiếng nước từ ngoài miếu, không bước qua cửa. Phù hao đi nhưng đường khí hiện rõ, giúp hiểu cách trận che giấu lối ngầm.",
        "translations": {
          "zh": {
            "text": "你在庙外沿水声放出探符，没有跨过门槛。符箓耗去，气路却显露出来，帮助你理解隐藏暗道的阵法。"
          },
          "en": {
            "text": "You release a scouting talisman along the water sounds without entering the shrine. It is consumed, but revealed energy paths explain how the formation conceals passages."
          }
        },
        "effects": {
          "resources": -3,
          "cultivation": 5
        }
      }
    ]
  },
  "realm_choice_buried-cauldron": {
    "id": "third_path",
    "text": "Chép trận văn khi nước rút",
    "hint": "-4 tài nguyên · +6 tu vi",
    "translations": {
      "zh": {
        "text": "趁退水拓录阵纹",
        "hint": "-4 物资 · +6 修为"
      },
      "en": {
        "text": "Copy exposed formation marks",
        "hint": "-4 resources · +6 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi dùng giấy chép trận văn lộ trên bờ, để nguyên xích và nắp lò. Không thu đan dược, việc đối chiếu nét trận vẫn giúp tu luyện thêm vững.",
        "translations": {
          "zh": {
            "text": "你拓录岸边露出的阵纹，保留锁链和炉盖原状。没有取得丹药，但对照纹路仍使修炼有了更稳固的依据。"
          },
          "en": {
            "text": "You copy exposed formation marks while leaving the chains and lid untouched. No medicine is obtained, but comparing the strokes gives your cultivation a firmer basis."
          }
        },
        "effects": {
          "resources": -4,
          "cultivation": 6
        }
      }
    ]
  },
  "realm_choice_soul-bridge": {
    "id": "third_path",
    "text": "Ghi đạo âm bên bờ cầu",
    "hint": "+5 tu vi",
    "translations": {
      "zh": {
        "text": "在桥边记录道音",
        "hint": "+5 修为"
      },
      "en": {
        "text": "Record the teachings from the near bank",
        "hint": "+5 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi giữ thần thức ở bờ cầu, chỉ ghi những lời giảng vọng tới. Không thấy người bên kia, ngươi vẫn đối chiếu được vài ý với pháp quyết đang dùng.",
        "translations": {
          "zh": {
            "text": "你把神识留在桥边，只记录传来的讲道声。没有看清对岸之人，却能把一些道理与现用法诀对照。"
          },
          "en": {
            "text": "You keep your senses on the near bank and record distant teachings. Without seeing the speaker, you can still compare a few ideas with your current methods."
          }
        },
        "effects": {
          "cultivation": 5
        }
      }
    ]
  },
  "realm_choice_lost-vessel": {
    "id": "third_path",
    "text": "Góp vật tư neo thuyền để cứu sau",
    "hint": "-8 tài nguyên · +5 tu vi",
    "translations": {
      "zh": {
        "text": "提供材料锚船待救",
        "hint": "-8 物资 · +5 修为"
      },
      "en": {
        "text": "Provide materials to anchor the ship",
        "hint": "-8 resources · +5 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi dùng vật tư dựng neo ngoài thân thuyền, không mở khoang phong kín. Dòng trôi chậm lại, còn cách phân tải giúp ngươi hiểu thêm phép giữ không gian.",
        "translations": {
          "zh": {
            "text": "你用材料在船外架起锚点，没有打开密封船舱。漂移减缓，分配受力的过程也让你更懂空间稳定之法。"
          },
          "en": {
            "text": "You spend materials anchoring the vessel from outside without opening its sealed hold. Slowing its drift teaches you more about distributing forces to stabilize space."
          }
        },
        "effects": {
          "resources": -8,
          "cultivation": 5
        }
      }
    ]
  },
  "realm_choice_ascending-messenger": {
    "id": "third_path",
    "text": "Báo trạm giới đến tiếp nhận",
    "hint": "-6 tài nguyên",
    "translations": {
      "zh": {
        "text": "通知界站接应",
        "hint": "-6 物资"
      },
      "en": {
        "text": "Notify the world station to receive the messenger",
        "hint": "-6 resources"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi gửi phù báo trạm giới, cho người bị thương ít vật tư chờ tiếp nhận. Không mang hộp qua ranh giới, ngươi giữ khoảng cách với người truy đuổi.",
        "translations": {
          "zh": {
            "text": "你用符通知界站，给伤者少量补给等候接应。没有携盒越界，也与追赶者保持了距离。"
          },
          "en": {
            "text": "You notify the world station and leave supplies for the injured messenger awaiting reception. Without carrying the box across, you keep your distance from the pursuers."
          }
        },
        "effects": {
          "resources": -6
        }
      }
    ]
  },
  "realm_choice_world-refuge": {
    "id": "third_path",
    "text": "Góp vật liệu cho đội vá giới",
    "hint": "-12 tài nguyên · +5 tu vi",
    "translations": {
      "zh": {
        "text": "提供材料给修界队",
        "hint": "-12 物资 · +5 修为"
      },
      "en": {
        "text": "Supply materials to a world repair team",
        "hint": "-12 resources · +5 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi chuyển vật liệu tới đội cứu viện, giúp họ dựng điểm trú trước khi vào vùng vỡ. Không tự nối tiểu giới, ngươi vẫn học cách chuẩn bị nền neo.",
        "translations": {
          "zh": {
            "text": "你把材料送给救援队，协助搭好避难点，再让他们进入破碎区域。没有亲自连接小界，却学到了准备锚基的方法。"
          },
          "en": {
            "text": "You supply a repair team and help prepare shelter before they enter the fractures. Without connecting the world yourself, you learn how to prepare anchoring foundations."
          }
        },
        "effects": {
          "resources": -12,
          "cultivation": 5
        }
      }
    ]
  },
  "realm_choice_cracked-recipe": {
    "id": "third_path",
    "text": "Đối chiếu dược tính trước khi luyện",
    "hint": "-4 tài nguyên · +6 tu vi",
    "translations": {
      "zh": {
        "text": "炼前对照药性",
        "hint": "-4 物资 · +6 修为"
      },
      "en": {
        "text": "Compare medicinal properties before brewing",
        "hint": "-4 resources · +6 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi mua ít mẫu thuốc để so dược tính, không đưa vào đan lô. Một vị thay thế được loại khỏi danh sách, giúp đan sư tránh thử sai vô ích.",
        "translations": {
          "zh": {
            "text": "你购买少量药样比较药性，没有投入丹炉。一种替代药材被排除，帮助丹师避免没有意义的错误试验。"
          },
          "en": {
            "text": "You buy small samples to compare their properties without using the furnace. Ruling out one substitute helps the alchemist avoid an unnecessary and mistaken trial."
          }
        },
        "effects": {
          "resources": -4,
          "cultivation": 6
        }
      }
    ]
  },
  "realm_choice_memory-pearl": {
    "id": "third_path",
    "text": "Sao dấu ngoài ngọc để đối chiếu",
    "hint": "-3 tài nguyên · +5 tu vi",
    "translations": {
      "zh": {
        "text": "拓录玉外印记核对",
        "hint": "-3 物资 · +5 修为"
      },
      "en": {
        "text": "Copy the pearl’s outer marks for comparison",
        "hint": "-3 resources · +5 cultivation"
      }
    },
    "outcomes": [
      {
        "id": "third_path_done",
        "weight": 1,
        "text": "Ngươi sao những dấu ngoài viên ngọc lên giấy, không nối thần thức vào trong. So với ký hiệu từng biết, ngươi nhận ra cách người cũ phân lớp ký ức.",
        "translations": {
          "zh": {
            "text": "你拓录玉外印记，没有把神识接入内部。与已知符号对照后，认出了旧主人划分记忆层次的方式。"
          },
          "en": {
            "text": "You copy the pearl’s outer marks without connecting your senses inside. Comparing familiar symbols reveals how its former owner separated the layers of stored memory."
          }
        },
        "effects": {
          "resources": -3,
          "cultivation": 5
        }
      }
    ]
  }
};
export const realmChoices=stories.map(([id,allowedRealms,title,prompt,success,failure,leave,reward,penalty])=>({
  id:`realm_choice_${id}`,category:'opportunity',title:title[0],...translatedText(prompt),
  translations:{zh:{title:title[1],text:prompt[1]},en:{title:title[2],text:prompt[2]}},
  allowedRealms,weight:7,minAge:16,cooldownYears:100,maxOccurrencesPerLife:1,importance:'major',
  choices:[
    {id:'attempt',text:'Thử nắm cơ duyên',hint:'Có thể được lợi hoặc chịu tổn thất',
      translations:{zh:{text:'尝试争取机缘',hint:'可能获益，也可能受损'},en:{text:'Take the chance',hint:'Possible reward or loss'}},
      outcomes:[{id:'success',weight:3,...translatedText(success),effects:reward},{id:'failure',weight:2,...translatedText(failure),effects:penalty}]},
    {id:'withdraw',text:'Chọn đường thận trọng',hint:'Không nhận thưởng, bảo toàn bản thân',
      translations:{zh:{text:'选择稳妥之路',hint:'不取奖励，保全自身'},en:{text:'Take the cautious path',hint:'No reward; preserve yourself'}},
      outcomes:[{id:'withdraw',weight:1,...translatedText(leave),effects:{}}]},
  ],
})).map(event=>{const option=thirdPaths[event.id];if(option)event.choices.splice(1,0,option);return event;});
