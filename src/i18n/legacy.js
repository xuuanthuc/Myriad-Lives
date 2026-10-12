// Localizations for the original ten encounters. Order is [Chinese, English].
export const legacy = {
  cave: {
    title:['无名洞府','The nameless cave'],
    text:['在雾气笼罩的山谷中，你发现一座古老洞府。石门之后灵气翻涌，但禁制尚未消散。','In a mist-covered valley, you discover an ancient cave dwelling. Spiritual energy surges behind its stone door, but the protective restrictions have not yet faded.'],
    choices:{
      enter:{text:['破开封印','Break the seal'],hint:['大机缘 · 高风险','Great opportunity · High risk'],outcomes:{
        treasure:['穿过层层禁制，你找到一部完好的古书。其中功法推动修为增长，为下一次突破带来希望。','Passing through the restrictions, you find an intact ancient manual. Its techniques strengthen your cultivation and bring renewed hope of reaching the next realm.'],
        injury:['阵法突然苏醒，将你击成重伤。你挣扎着逃出洞府，留下的伤势使修行变得缓慢。','The formation suddenly awakens and badly wounds you. You struggle out of the cave, carrying injuries that slow your cultivation in the years to come.'],
        death:['禁制在你来得及退走前爆发。身躯消散于冰冷光芒中，仙途终结在这座无名洞府。','The restrictions erupt before you can retreat. Your body dissolves in cold light, and your immortal path ends within this nameless cave dwelling.'],
      }},
      leave:{text:['悄然离去','Quietly leave'],hint:['保全性命','Preserve your life'],outcomes:{safe:['你最后看了一眼石门，随即转身离开。虽与机缘擦肩而过，却在险恶山林中保住了性命。','You take one last look at the stone door and turn away. An opportunity is left behind, but your life is preserved in these dangerous mountains.']}},
    },
  },
  sect:{title:['入宗之邀','An invitation to join a sect'],text:['山脚下，一座宗门正在招收弟子。你站在山门前，权衡宗门庇护与自由修行的道路。','A sect is recruiting disciples at the foot of the mountain. At its gates, you weigh the protection it offers against the freedom of independent cultivation.'],choices:{
    join:{text:['拜入宗门','Join the sect'],hint:['资源 · 责任','Resources · Obligations'],outcomes:{accepted:['你通过考验，成为宗门弟子。宗门发下法诀与灵石，让修行的最初几年少了许多艰难。','You pass the trial and become a disciple. The sect grants you techniques and spirit stones, making your early years of cultivation less difficult.'],rejected:['考验结束，名单中没有你的名字。你空手离开山门，继续独自寻找修行之路。','The trial ends without your name on the list. You leave the sect gates empty-handed and continue searching for your own way to cultivate.']}},
    wander:{text:['继续做散修','Remain an independent cultivator'],hint:['自由 · 自力','Freedom · Self-reliance'],outcomes:{free:['你拒绝邀请，带着行囊远行。没有宗门庇护，每一块灵石都只能靠自己挣得。','You decline the invitation and travel onward with your belongings. Without a sect to shelter you, every spirit stone must be earned through your own efforts.']}},
  }},
  market:{title:['夜市残卷','A torn manual at the night market'],text:['夜市里，一部残卷正在出售。古老字迹似乎记载着功法，但真假依旧难辨。','At a night market, you notice a torn manual for sale. Its ancient writing hints at a cultivation technique, but its authenticity is difficult to judge.'],choices:{
    buy:{text:['购买残卷','Buy the torn manual'],hint:['消耗20资源','Costs 20 resources'],outcomes:{real:['残卷记载了一种实用的运气方法。你钻研多日，终于学会了更有效地积累修为。','The manual records a useful method of circulating energy. After days of study, you understand how to build your cultivation more efficiently than before.'],fake:['纸页上只有虚妄之言。你花了灵石，却未得到任何功法，只能将此当作仙途上的教训。','The pages contain nothing but empty promises. Your spirit stones buy no useful technique, and you accept the loss as another lesson on the immortal path.']}},
    pass:{text:['不理会叫卖','Pass on the offer'],hint:['保留资源','Keep your resources'],outcomes:{pass:['你放下残卷，离开市集。剩余灵石留作修炼之用，而不是押在真假不明的功法上。','You return the manual and leave the market. Your remaining stones are kept for cultivation rather than risked on a technique whose value remains uncertain.']}},
  }},
  herb:{title:['雾中灵草','Spirit herbs in the mist'],text:['历练深入森林时，你发现一株多年灵草。炼化之后，体内灵气变得更加充沛。','During an expedition into the forest, you discover an aged spirit herb. After refining it, the spiritual energy within your body becomes noticeably more abundant.']},
  spring:{title:['一脉灵泉','A hidden spirit spring'],text:['荒僻石壁下，你发现一眼尚无人开采的灵泉。在泉边修炼多日，经脉渐渐畅通。','Beneath a deserted cliff, you discover an untouched spirit spring. Several days of cultivation beside its waters gradually clear the pathways of your meridians.']},
  storm:{title:['途中劫难','A calamity on the road'],text:['一场灵力风暴席卷你的落脚之地。你逃出险区，但伤势与遗失的行囊令修行陷入停滞。','A spiritual storm sweeps through your resting place. You escape the danger, but injuries and lost belongings bring your cultivation to a temporary standstill.']},
  war:{title:['人间烽火','War among mortals'],text:['战乱蔓延到你的居所。你被迫离开修炼之地，花费灵石，在流离的人群中寻找安身之处。','War reaches the region where you live. Forced to abandon your retreat, you spend spirit stones finding a safe place among the crowds of displaced people.']},
  meditate:{title:['月下静坐','Meditation beneath the moon'],text:['月明之夜，你静坐重温所学法诀。一处疑难迎刃而解，修为因而又前进了一步。','On a moonlit night, you meditate and reconsider the techniques you have learned. A troublesome point becomes clear, allowing your cultivation to advance another step.']},
  illness:{title:['久病一季','A season of illness'],text:['一场久病迫使你停止修炼。数月休养后，身体终于恢复，但寿元已受到损耗。','A lingering illness forces you to suspend cultivation. After months of rest, your body recovers, though the ordeal has taken a toll on your remaining lifespan.']},
  partner:{title:['仙途同行','A companion on the path'],text:['历练途中，你遇见一位志同道合之人。交换法诀之后，双方考虑是否一起度过修行岁月。','On your travels, you meet someone who shares your aspirations. After exchanging techniques, you consider whether to spend the coming years of cultivation together.'],choices:{
    accept:{text:['结为道侣','Become companions'],hint:['同行 · 分享','Company · Shared resources'],outcomes:{together:['你选择结为道侣，共同分享资源。修炼岁月多了同行之人，但仙途依旧充满变数。','You become companions and share your resources. Someone now walks beside you through your cultivation years, though the immortal path remains full of uncertainty.']}},
    alone:{text:['继续独行','Continue alone'],hint:['专心求道','Devotion to the Dao'],outcomes:{alone:['你珍惜这次相逢，却仍独自上路。全部心力用于修行，任一轮轮明月静静流过。','You treasure the meeting but continue your journey alone. All your efforts are devoted to cultivation as the passing moons mark another season of solitude.']}},
  }},
};
export const endingsLocales={
  birth:['你出生于{origin}，恰逢安静的换季时节。无人知晓，这个孩子会在求道之路上走多远。','You are born into {origin} as the seasons quietly change. No one yet knows how far this child will travel along the path toward the Dao.'],
  age:['寿元耗尽，你静坐望着最后一次夕阳。旅途就此落幕，求道之路上只留下渐淡的足迹。','Your lifespan is exhausted. You sit quietly before your final sunset as the journey closes, leaving only fading footprints on the long road toward the Dao.'],
  ascend:['仙帝之巅，你突破最后的瓶颈，证成大道。一生求道就此落幕，名字仍留在万界之间。','At the summit of Immortal Emperor, you overcome the final bottleneck and realize the great Dao. Your lifelong journey ends, leaving your name across countless worlds.'],
};
