export const extraPhysiques = [
  {
    "name": "Thuần Dương Thể",
    "score": 72,
    "weight": 4,
    "rarity": "Hiếm",
    "description": "Thuần dương bẩm sinh, có thể luyện hỏa tức trong động phủ để tăng tu vi.",
    "translations": {
      "zh": {
        "name": "纯阳体",
        "description": "先天纯阳，可借洞府火息增长修为。"
      },
      "en": {
        "name": "Pure Yang Body",
        "description": "Innate yang energy grants cultivation through the fiery breath of caves."
      }
    },
    "event": {
      "id": "physique-0",
      "title": "Dương tức trong động phủ",
      "text": "Trong động phủ nóng rực, thuần dương thể giúp ngươi điều hòa hỏa tức. Sau một lần bế quan, linh lực vững vàng hơn và tu vi tăng thêm.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Thuần Dương Thể"
      },
      "effects": {
        "cultivation": 16
      },
      "translations": {
        "zh": {
          "title": "洞府阳息",
          "text": "炽热洞府中，纯阳体助你调和火息。一次闭关之后，灵力更加稳固，修为随之增长。"
        },
        "en": {
          "title": "Yang breath in the cave",
          "text": "Within a blazing cave, your Pure Yang Body helps harmonize its fiery breath. After seclusion, your spiritual energy steadies and your cultivation grows."
        }
      }
    }
  },
  {
    "name": "Thái Âm Thể",
    "score": 74,
    "weight": 3,
    "rarity": "Hiếm",
    "description": "Linh thể hợp nguyệt hoa, tu luyện dưới trăng có thể tăng tu vi và dưỡng thương.",
    "translations": {
      "zh": {
        "name": "太阴体",
        "description": "体质契合月华，可借月光修炼并疗伤。"
      },
      "en": {
        "name": "Lunar Body",
        "description": "Attuned to moonlight, this body can gain cultivation and recover beneath the moon."
      }
    },
    "event": {
      "id": "physique-1",
      "title": "Nguyệt hoa dưỡng thể",
      "text": "Dưới vầng trăng sáng, thái âm thể dẫn nguyệt hoa qua kinh mạch. Ngươi tĩnh tọa suốt đêm, thương tổn dịu xuống và tu vi thêm phần tích lũy.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Thái Âm Thể"
      },
      "effects": {
        "cultivation": 10,
        "health": 12
      },
      "translations": {
        "zh": {
          "title": "月华养体",
          "text": "明月之下，太阴体引月华流转经脉。你静坐整夜，伤势缓解，修为也有所积累。"
        },
        "en": {
          "title": "Moonlight nourishes the body",
          "text": "Beneath a bright moon, your Lunar Body draws moonlight through your meridians. You meditate all night, easing your wounds and gathering further cultivation."
        }
      }
    }
  },
  {
    "name": "Ngũ Hành Linh Thể",
    "score": 82,
    "weight": 3,
    "rarity": "Rất hiếm",
    "description": "Ngũ hành cân bằng, có thể dung hòa linh khí hỗn tạp để tăng tu vi.",
    "translations": {
      "zh": {
        "name": "五行灵体",
        "description": "五行平衡，可调和混杂灵气增长修为。"
      },
      "en": {
        "name": "Five Elements Body",
        "description": "Balanced elements allow cultivation through harmonizing mixed spiritual energies."
      }
    },
    "event": {
      "id": "physique-2",
      "title": "Ngũ hành quy nguyên",
      "text": "Bên linh tuyền giao hội ngũ hành, ngươi điều hòa các luồng khí khác biệt. Linh thể giữ chúng cân bằng, giúp lần tu luyện này thu được tiến bộ.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Ngũ Hành Linh Thể"
      },
      "effects": {
        "cultivation": 18
      },
      "translations": {
        "zh": {
          "title": "五行归元",
          "text": "五行交汇的灵泉旁，你调和不同灵气。灵体维持平衡，让这次修炼有所进境。"
        },
        "en": {
          "title": "Five elements in harmony",
          "text": "Beside a spring where five elements meet, you harmonize their differing energies. Your spirit body maintains balance, allowing this cultivation session to yield progress."
        }
      }
    }
  },
  {
    "name": "Kiếm Tâm Thể",
    "score": 80,
    "weight": 3,
    "rarity": "Rất hiếm",
    "description": "Kiếm tâm thanh minh, dễ lĩnh hội kiếm ý từ cổ bia để tăng tu vi.",
    "translations": {
      "zh": {
        "name": "剑心体",
        "description": "剑心清明，可参悟古碑剑意增长修为。"
      },
      "en": {
        "name": "Sword Heart Body",
        "description": "A clear sword heart can gain cultivation from ancient sword inscriptions."
      }
    },
    "event": {
      "id": "physique-3",
      "title": "Kiếm ý trên cổ bia",
      "text": "Trước cổ bia đầy vết kiếm, ngươi lặng nhìn đường nét suốt nhiều ngày. Kiếm tâm dần thông suốt, một phần kiếm ý hóa thành tích lũy tu vi.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Kiếm Tâm Thể"
      },
      "effects": {
        "cultivation": 17
      },
      "translations": {
        "zh": {
          "title": "古碑剑意",
          "text": "古碑剑痕之前，你凝视数日。剑心渐渐通明，一缕剑意化为修为的积累。"
        },
        "en": {
          "title": "Sword intent on an ancient stele",
          "text": "Before an ancient stele scarred by blades, you study its marks for days. Your sword heart clears, turning a trace of sword intent into cultivation."
        }
      }
    }
  },
  {
    "name": "Bách Độc Bất Xâm Thể",
    "score": 76,
    "weight": 3,
    "rarity": "Hiếm",
    "description": "Kháng độc đặc biệt, có thể hái linh thảo giữa độc chướng để đổi tài nguyên; không miễn mọi hiểm họa.",
    "translations": {
      "zh": {
        "name": "百毒不侵体",
        "description": "抗毒体质，可深入毒瘴采药换取资源，但并非免疫所有危险。"
      },
      "en": {
        "name": "Poison Resistant Body",
        "description": "Poison resistance allows gathering herbs in toxic mist for resources, but does not prevent every danger."
      }
    },
    "event": {
      "id": "physique-4",
      "title": "Linh thảo giữa độc chướng",
      "text": "Nhờ thể chất kháng độc, ngươi vượt qua lớp chướng khí để hái linh thảo. Mang chúng về đổi linh thạch, ngươi có thêm tài nguyên cho đường tu luyện.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Bách Độc Bất Xâm Thể"
      },
      "effects": {
        "resources": 24
      },
      "translations": {
        "zh": {
          "title": "毒瘴灵草",
          "text": "凭借抗毒体质，你穿过瘴气采得灵草。将其换成灵石，修炼路上又添一份资源。"
        },
        "en": {
          "title": "Spirit herbs in poisonous mist",
          "text": "Your poison resistance lets you cross a toxic mist to gather spirit herbs. Trading them for spirit stones brings more resources for the cultivation ahead."
        }
      }
    }
  },
  {
    "name": "Huyền Băng Thể",
    "score": 83,
    "weight": 2,
    "rarity": "Rất hiếm",
    "description": "Hợp hàn khí để tu luyện, nhưng hấp thu quá lâu có thể bị phản phệ và tổn thương.",
    "translations": {
      "zh": {
        "name": "玄冰体",
        "description": "适合借寒气修炼，但吸收过久可能反噬受伤。"
      },
      "en": {
        "name": "Mystic Ice Body",
        "description": "Attuned to cold energy, but prolonged absorption can cause backlash and injury."
      }
    },
    "event": {
      "id": "physique-5",
      "title": "Hàn khí nơi băng động",
      "text": "Trong băng động, huyền băng thể hấp thu hàn khí để tăng tu vi. Ngươi tham luyện quá lâu, khí lạnh phản phệ khiến thân thể chịu vài thương tổn.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Huyền Băng Thể"
      },
      "effects": {
        "cultivation": 22,
        "health": -9
      },
      "translations": {
        "zh": {
          "title": "冰洞寒气",
          "text": "冰洞中，玄冰体吸收寒气增长修为。你贪练过久，寒气反噬，身体受到些许损伤。"
        },
        "en": {
          "title": "Cold breath in the ice cave",
          "text": "Within an ice cave, your Mystic Ice Body absorbs cold energy for cultivation. Staying too long invites a chilling backlash that leaves your body wounded."
        }
      }
    }
  },
  {
    "name": "Hoang Cổ Thánh Thể",
    "score": 94,
    "weight": 1,
    "rarity": "Cực hiếm",
    "description": "Nhục thân mạnh; luyện thể bằng linh dược tăng tu vi, dưỡng thương nhưng tiêu hao nhiều tài nguyên.",
    "translations": {
      "zh": {
        "name": "荒古圣体",
        "description": "肉身强大，灵药炼体可增修为并疗伤，但资源消耗较多。"
      },
      "en": {
        "name": "Ancient Sacred Body",
        "description": "A powerful body; medicinal tempering grants cultivation and recovery at a substantial resource cost."
      }
    },
    "event": {
      "id": "physique-6",
      "title": "Linh dược luyện thánh thể",
      "text": "Ngươi dùng linh dược tôi luyện thánh thể, tiêu hao không ít linh thạch. Nhục thân dần hồi phục, linh lực thêm vững chắc sau những ngày chịu đựng.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Hoang Cổ Thánh Thể",
        "resources": 18
      },
      "effects": {
        "cultivation": 20,
        "health": 16,
        "resources": -18
      },
      "translations": {
        "zh": {
          "title": "灵药炼圣体",
          "text": "你以灵药淬炼圣体，耗费不少灵石。熬过数日后，肉身逐渐恢复，灵力也更加稳固。"
        },
        "en": {
          "title": "Spirit medicine tempers the sacred body",
          "text": "You temper your sacred body with spirit medicine, spending a considerable supply of spirit stones. After days of endurance, your body recovers and spiritual energy steadies."
        }
      }
    }
  },
  {
    "name": "Thiên Sinh Đạo Cốt",
    "score": 96,
    "weight": 1,
    "rarity": "Cực hiếm",
    "description": "Đạo cốt bẩm sinh, có thể lĩnh hội pháp quyết truyền thừa để tăng tu vi.",
    "translations": {
      "zh": {
        "name": "天生道骨",
        "description": "天生道骨，可参悟传承法诀增长修为。"
      },
      "en": {
        "name": "Innate Dao Bones",
        "description": "Innate Dao bones favor cultivation through understanding inherited techniques."
      }
    },
    "event": {
      "id": "physique-7",
      "title": "Đạo vận trong truyền thừa",
      "text": "Giữa di tích truyền thừa, đạo cốt cộng hưởng với pháp quyết khắc trên vách đá. Ngươi lĩnh hội một phần huyền ý, tích thêm tu vi trước khi rời đi.",
      "category": "opportunity",
      "weight": 14,
      "minAge": 12,
      "cooldownYears": 30,
      "maxOccurrencesPerLife": 2,
      "allowedRealms": [
        "qi_refining",
        "foundation",
        "golden_core",
        "nascent_soul",
        "spirit_transformation",
        "void_refining",
        "body_integration",
        "mahayana",
        "true_immortal",
        "golden_immortal",
        "mystic_immortal",
        "immortal_king",
        "immortal_emperor"
      ],
      "conditions": {
        "physique": "Thiên Sinh Đạo Cốt"
      },
      "effects": {
        "cultivation": 24
      },
      "translations": {
        "zh": {
          "title": "传承道韵",
          "text": "传承遗迹中，道骨与石壁法诀共鸣。你领悟一缕玄意，积下修为后才离去。"
        },
        "en": {
          "title": "Dao resonance in an inheritance",
          "text": "Within an inheritance ruin, your Dao bones resonate with techniques carved into stone. You grasp a trace of their hidden meaning, gathering cultivation before departing."
        }
      }
    }
  }
];
