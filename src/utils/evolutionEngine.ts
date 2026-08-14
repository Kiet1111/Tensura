import { CharacterStatus, EvolutionFactors, EvolutionBranch, PendingEvolution, RaceType, Skill, SkillCategory } from '../types';
import { getSkillMaxExp } from './skillUtils';

export const INITIAL_EVOLUTION_FACTORS: EvolutionFactors = {
  devour: 10,
  wisdom: 10,
  protection: 10,
  combat: 10,
  magic: 10,
  soul: 5
};

export const FACTOR_METADATA: Record<keyof EvolutionFactors, {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  borderColor: string;
  bgGradient: string;
  description: string;
}> = {
  devour: {
    name: 'Bạo Thực / Thôn Phệ (Predation)',
    shortName: 'Bạo Thực',
    icon: '🍖',
    color: 'text-rose-400',
    borderColor: 'border-rose-500/60',
    bgGradient: 'from-rose-950/60 to-slate-950',
    description: 'Hấp thụ ma vật, nuốt chửng thuộc tính, tích trữ năng lượng vào dạ dày vô hạn.'
  },
  wisdom: {
    name: 'Trí Tuệ / Phân Tích (Analysis & Wisdom)',
    shortName: 'Trí Tuệ',
    icon: '🧠',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/60',
    bgGradient: 'from-cyan-950/60 to-slate-950',
    description: 'Tính toán tốc độ cao, giải mã cấu trúc ma pháp, thấu suốt bản chất quy luật.'
  },
  protection: {
    name: 'Bảo Hộ / Lãnh Địa (Covenant & Territory)',
    shortName: 'Bảo Hộ',
    icon: '🛡️',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/60',
    bgGradient: 'from-amber-950/60 to-slate-950',
    description: 'Xây dựng quốc gia, che chở thần dân, kết giao đồng minh và thiết lập minh ước.'
  },
  combat: {
    name: 'Võ Kỹ / Đấu Khí (Martial & Destruction)',
    shortName: 'Đấu Khí',
    icon: '⚔️',
    color: 'text-red-400',
    borderColor: 'border-red-500/60',
    bgGradient: 'from-red-950/60 to-slate-950',
    description: 'Rèn luyện thân thể, tôi luyện kiếm kỹ, bộc phá đấu khí hủy diệt chiến trường.'
  },
  magic: {
    name: 'Ma Pháp / Nguyên Tố (Magic & Elements)',
    shortName: 'Ma Pháp',
    icon: '✨',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/60',
    bgGradient: 'from-purple-950/60 to-slate-950',
    description: 'Thao túng dòng ma lượng ma tinh, phát động hắc viêm, kết giới và ma thuật tối thượng.'
  },
  soul: {
    name: 'Thần Tính / Biến Số (Soul Resonance & Anomaly)',
    shortName: 'Thần Tính',
    icon: '🔮',
    color: 'text-indigo-400',
    borderColor: 'border-indigo-500/60',
    bgGradient: 'from-indigo-950/60 to-slate-950',
    description: 'Biến số phá vỡ định mệnh thế giới Tensura, thăng hoa linh hồn vượt qua giới hạn.'
  }
};

/**
 * Parses action text and narrative to accumulate factor points
 */
export function calculateActionFactors(
  actionText: string,
  narrativeText: string = '',
  isDevourSuccess: boolean = false
): Partial<EvolutionFactors> {
  const text = (actionText + ' ' + narrativeText).toLowerCase();
  const gains: Partial<EvolutionFactors> = {};

  // DEVOUR
  let devourPoints = 0;
  if (isDevourSuccess) devourPoints += 5;
  if (text.includes('thôn phệ') || text.includes('nuốt') || text.includes('dạ dày') || text.includes('hấp thụ') || text.includes('predator') || text.includes('gluttony')) devourPoints += 4;
  if (text.includes('săn') || text.includes('ăn thịt') || text.includes('phân giải') || text.includes('ma tinh')) devourPoints += 2;
  if (devourPoints > 0) gains.devour = devourPoints;

  // WISDOM
  let wisdomPoints = 0;
  if (text.includes('phân tích') || text.includes('khảo sát') || text.includes('đại hiền triết') || text.includes('giải mã') || text.includes('tính toán')) wisdomPoints += 4;
  if (text.includes('học') || text.includes('nghiên cứu') || text.includes('quan sát') || text.includes('suy ngẫm') || text.includes('chiến lược')) wisdomPoints += 2;
  if (wisdomPoints > 0) gains.wisdom = wisdomPoints;

  // PROTECTION
  let protectionPoints = 0;
  if (text.includes('lãnh địa') || text.includes('xây dựng') || text.includes('nâng cấp') || text.includes('thôn') || text.includes('làng')) protectionPoints += 3;
  if (text.includes('bảo vệ') || text.includes('che chở') || text.includes('minh ước') || text.includes('đồng minh') || text.includes('giúp đỡ') || text.includes('hòa giải')) protectionPoints += 3;
  if (protectionPoints > 0) gains.protection = protectionPoints;

  // COMBAT
  let combatPoints = 0;
  if (text.includes('tấn công') || text.includes('chém') || text.includes('kiếm') || text.includes('đao') || text.includes('quyền') || text.includes('võ kỹ')) combatPoints += 3;
  if (text.includes('đấu khí') || text.includes('hủy diệt') || text.includes('đột kích') || text.includes('quyết đấu') || text.includes('bá khí')) combatPoints += 3;
  if (combatPoints > 0) gains.combat = combatPoints;

  // MAGIC
  let magicPoints = 0;
  if (text.includes('ma pháp') || text.includes('ma lực') || text.includes('hắc viêm') || text.includes('nguyên tố') || text.includes('niệm chú')) magicPoints += 3;
  if (text.includes('kết giới') || text.includes('sấm sét') || text.includes('trọng lực') || text.includes('băng tuyết') || text.includes('hạt nhân')) magicPoints += 3;
  if (magicPoints > 0) gains.magic = magicPoints;

  // SOUL
  let soulPoints = 0;
  if (text.includes('biến số') || text.includes('cốt truyện') || text.includes('thức tỉnh') || text.includes('linh hồn') || text.includes('tự ngã') || text.includes('manas')) soulPoints += 3;
  if (text.includes('veldora') || text.includes('rimuru') || text.includes('ma vương') || text.includes('tiến hóa')) soulPoints += 2;
  if (soulPoints > 0) gains.soul = soulPoints;

  return gains;
}

/**
 * Apply factor gains to character's current factors
 */
export function applyFactorGains(
  current: EvolutionFactors = INITIAL_EVOLUTION_FACTORS,
  gains: Partial<EvolutionFactors>
): EvolutionFactors {
  return {
    devour: (current.devour || 10) + (gains.devour || 0),
    wisdom: (current.wisdom || 10) + (gains.wisdom || 0),
    protection: (current.protection || 10) + (gains.protection || 0),
    combat: (current.combat || 10) + (gains.combat || 0),
    magic: (current.magic || 10) + (gains.magic || 0),
    soul: (current.soul || 5) + (gains.soul || 0)
  };
}

/**
 * Evaluates whether factor distribution is Dominant (Lệch cân bằng) or Balanced (Cân bằng)
 */
export function evaluateFactorDominance(factors: EvolutionFactors): {
  isDominant: boolean;
  dominantKey: keyof EvolutionFactors;
  topFactor: { key: keyof EvolutionFactors; score: number; percentage: number };
  sortedFactors: { key: keyof EvolutionFactors; score: number; percentage: number }[];
  isBalanced: boolean;
  balancedCandidates: (keyof EvolutionFactors)[];
  leadMargin: number;
} {
  const total = Object.values(factors).reduce((a: number, b: number) => a + b, 0) || 1;
  const sorted = (Object.keys(factors) as (keyof EvolutionFactors)[])
    .map(key => ({
      key,
      score: factors[key],
      percentage: Math.round((factors[key] / total) * 100)
    }))
    .sort((a, b) => b.score - a.score);

  const top1 = sorted[0];
  const top2 = sorted[1];
  const top3 = sorted[2];

  const leadMargin = top1.score - top2.score;

  // Dominant rule: Lead margin >= 12 points AND percentage >= 28% of total factor pool
  const isDominant = leadMargin >= 12 && top1.percentage >= 28;

  // Balanced rule: The difference between top candidates is small (< 12 points)
  const balancedCandidates: (keyof EvolutionFactors)[] = [top1.key, top2.key];
  if (top2.score - top3.score <= 8) {
    balancedCandidates.push(top3.key);
  }

  return {
    isDominant,
    dominantKey: top1.key,
    topFactor: top1,
    sortedFactors: sorted,
    isBalanced: !isDominant,
    balancedCandidates,
    leadMargin
  };
}

/**
 * Database of Branching Evolutions by Race and Stage
 */
export const RACE_EVOLUTION_BRANCHES: Record<RaceType, Record<number, EvolutionBranch[]>> = {
  Slime: {
    2: [
      {
        id: 'slime_st2_devour',
        name: 'Demon Slime (Ảo Ma Niêm Thể)',
        japaneseName: '魔粘性精神体 (Demon Slime)',
        stage: 2,
        factorFocus: 'devour',
        factorFocusTitle: 'Thiên Hướng Bạo Thực / Thôn Phệ',
        description: 'Hình thái tiến hóa ma hóa tập trung tối đa vào phân tách, hấp thụ và dung tích dạ dày vô hạn.',
        lore: 'Slime nuốt chửng lượng lớn ma tinh đậm đặc và linh hồn ma vật, biến cơ thể thành lò luyện ma lượng bất tận.',
        icon: '🍖',
        statBonuses: { maxHp: 80, maxMp: 120 },
        grantedSkills: [
          {
            id: 'skill_demon_slime_stomach',
            name: 'Đại Dạ Dày Hư Không (Abyssal Stomach)',
            category: 'Extra',
            description: 'Dung tích chứa đồ và phân tách ma vật tăng gấp 10 lần, tốc độ tiêu hóa tức thì.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'slime_st2_wisdom',
        name: 'Wisdom Spirit Slime (Linh Tinh Niêm Thể)',
        japaneseName: '霊粘性精神体 (Wisdom Slime)',
        stage: 2,
        factorFocus: 'wisdom',
        factorFocusTitle: 'Thiên Hướng Trí Tuệ / Tính Toán',
        description: 'Hình thái tiến hóa hướng tri thức và phân tích vạn vật với tốc độ tư duy hàng ngàn lần.',
        lore: 'Hạch tâm slime hấp thụ ánh sáng tri thức vũ trụ, kết nối với mạng lưới ma đạo và tính toán quy luật thế giới.',
        icon: '🧠',
        statBonuses: { maxHp: 50, maxMp: 150 },
        grantedSkills: [
          {
            id: 'skill_thought_acceleration_high',
            name: 'Tư Duy Gia Tốc Cực Hạn (Thought Acceleration)',
            category: 'Extra',
            description: 'Tăng tốc độ tư duy lên 3000 lần, nhìn thấu chuyển động của mọi đòn tấn công.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'slime_st2_protection',
        name: 'Guardian Diamond Slime (Kim Cương Hộ Giới Slime)',
        japaneseName: '金剛粘性体 (Diamond Slime)',
        stage: 2,
        factorFocus: 'protection',
        factorFocusTitle: 'Thiên Hướng Bảo Hộ / Lãnh Địa',
        description: 'Cơ thể hóa cứng thành kết cấu ma kim cương bất hoại, dựng kết giới che chở cho toàn bộ đồng minh.',
        lore: 'Slime kết tinh từ ý nguyện bảo vệ làng và thần dân, biến thân thể thành pháo đài sống của Rừng Jura.',
        icon: '🛡️',
        statBonuses: { maxHp: 140, maxMp: 60 },
        grantedSkills: [
          {
            id: 'skill_diamond_barrier',
            name: 'Kim Cương Đa Trọng Kết Giới (Diamond Barrier)',
            category: 'Extra',
            description: 'Tạo lập màng phòng hộ kim cương vô hiệu hóa 75% sát thương vật lý và ma pháp.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'slime_st2_combat',
        name: 'Viscous Dragonoid Slime (Long Hóa Ma Niêm Thể)',
        japaneseName: '竜粘魔体 (Dragonoid Slime)',
        stage: 2,
        factorFocus: 'combat',
        factorFocusTitle: 'Thiên Hướng Đấu Khí / Chiến Đấu',
        description: 'Hấp thụ long khí và đấu khí chiến trường, hình thành các xúc tu ma kiếm sắc bén như bảo khí Thần Cấp.',
        lore: 'Niêm dịch hòa quyện cùng huyết mạch rồng bão tố, tôi luyện thành chiến binh cận chiến uy lực kinh thiên.',
        icon: '⚔️',
        statBonuses: { maxHp: 110, maxMp: 90 },
        grantedSkills: [
          {
            id: 'skill_viscous_dragon_blade',
            name: 'Long Nha Thủy Trảm (Viscous Dragon Blade)',
            category: 'Arts',
            description: 'Ngưng tụ dịch thể thành kiếm rồng sắc bén chém đứt mọi kết giới phòng thủ.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Arts')
          }
        ]
      },
      {
        id: 'slime_st2_balanced',
        name: 'Ultimate Morph Slime (Vạn Năng Tối Thượng Niêm Thể)',
        japaneseName: '万能粘性神体 (Ultimate Slime)',
        stage: 2,
        factorFocus: 'balanced',
        factorFocusTitle: 'Hợp Nhất Cân Bằng Toàn Diện',
        description: 'Sự hài hòa hoàn mỹ giữa Thôn Phệ, Trí Tuệ, Bảo Hộ và Ma Lực. Sở hữu khả năng thích ứng với mọi nghịch cảnh.',
        lore: 'Được sinh ra khi người chơi phát triển đồng đều mọi khía cạnh bản ngã, mở ra cảnh giới hoàn mỹ không khuyết điểm.',
        icon: '✨',
        statBonuses: { maxHp: 100, maxMp: 100 },
        grantedSkills: [
          {
            id: 'skill_universal_adaptation',
            name: 'Vạn Năng Thích Ứng (Universal Adaptation)',
            category: 'Extra',
            description: 'Tự động điều chỉnh thuộc tính kháng tính và ma lực đối ứng ngay khi gặp kẻ thù mới.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      }
    ],
    3: [
      {
        id: 'slime_st3_awakened_lord',
        name: 'True Demon Lord Slime (Giác Tỉnh Ma Vương Niêm Tinh)',
        japaneseName: '覚醒魔王・竜魔粘性精神体 (Ultimate Slime)',
        stage: 3,
        factorFocus: 'devour',
        factorFocusTitle: 'Bạo Thực Tuyệt Đối - Ma Vương Đỉnh Cao',
        description: 'Thức tỉnh danh hiệu Ma Vương Chân Chính sau Lễ Thu Hoạch Vạn Linh Hồn.',
        lore: 'Cơ thể hóa thành thực thể năng lượng thuần khiết vượt qua giới hạn vật lý trần thế.',
        icon: '👑',
        statBonuses: { maxHp: 250, maxMp: 350 },
        grantedSkills: [
          {
            id: 'skill_demon_lord_haki',
            name: 'Ma Vương Bá Khí (Demon Lord Haki)',
            category: 'Extra',
            description: 'Phát tỏa uy áp ma vương khiến sinh vật yếu hơn lập tức rơi vào trạng thái khiếp sợ và quy phục.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'slime_st3_divine_core',
        name: 'Divine Void Slime (Hư Không Thần Niêm Thể)',
        japaneseName: '虚空神粘性体 (Void Core Slime)',
        stage: 3,
        factorFocus: 'wisdom',
        factorFocusTitle: 'Trí Huệ Tối Thượng - Chân Lý Thế Giới',
        description: 'Hạch tâm thăng hoa thành Thần Trí Thể, thâu tóm hư không và vận hành quy luật tạo hóa.',
        lore: 'Trí tuệ đạt tới cảnh giới hiểu thấu quy luật vận hành của toàn bộ Đa Vũ Trụ Tensura.',
        icon: '🔮',
        statBonuses: { maxHp: 200, maxMp: 400 },
        grantedSkills: [
          {
            id: 'skill_void_collapse',
            name: 'Hư Không Băng Hoại (Void Collapse)',
            category: 'Ultimate',
            description: 'Thao túng năng lượng hỗn mang nguyên thủy của hư không để sáng tạo hoặc hủy diệt.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Ultimate')
          }
        ]
      }
    ]
  },
  Kijin: {
    2: [
      {
        id: 'kijin_st2_combat',
        name: 'Oni Warlord (Chiến Quỷ Vương - Đao Kiếm Ma Tướng)',
        japaneseName: '闘鬼王 (Oni Warlord)',
        stage: 2,
        factorFocus: 'combat',
        factorFocusTitle: 'Thiên Hướng Đấu Khí / Trảm Kích',
        description: 'Vượt qua giới hạn quỷ nhân, tôi luyện đấu khí thành hắc diễm và đao kiếm trảm đoạn không gian.',
        lore: 'Quỷ nhân bước lên đỉnh cao võ đạo, lấy thân làm kiếm, đấu khí ngập tràn trời đất.',
        icon: '⚔️',
        statBonuses: { maxHp: 130, maxMp: 70 },
        grantedSkills: [
          {
            id: 'skill_oni_blade_mastery',
            name: 'Cực Nghệ Quỷ Đao Thuật (Oni Blade Mastery)',
            category: 'Arts',
            description: 'Uy lực trảm kích tăng 100%, bỏ qua 50% giáp phòng ngự của kẻ thù.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Arts')
          }
        ]
      },
      {
        id: 'kijin_st2_magic',
        name: 'Mystic Demon Sage (Yêu Quỷ Pháp Sư - Minh Quỷ Vương)',
        japaneseName: '妖鬼導師 (Mystic Oni Sage)',
        stage: 2,
        factorFocus: 'magic',
        factorFocusTitle: 'Thiên Hướng Ma Pháp / Hắc Viêm',
        description: 'Khai mở nhãn ma thuật quỷ tộc, kết hợp ma thuật ngọn lửa địa ngục và kết giới hắc ám.',
        lore: 'Quỷ nhân lĩnh hội bí thuật phong ấn thượng cổ, triệu hoán ma hỏa thiêu rụi quân thù.',
        icon: '🔥',
        statBonuses: { maxHp: 70, maxMp: 130 },
        grantedSkills: [
          {
            id: 'skill_black_flame_inferno',
            name: 'Hắc Viêm Địa Ngục (Hellflare Inferno)',
            category: 'Extra',
            description: 'Tạo cầu hắc viêm có nhiệt độ hàng vạn độ C thiêu đốt linh hồn kẻ thù.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'kijin_st2_protection',
        name: 'Guardian Kijin Sovereign (Hộ Quốc Quỷ Tướng - Lãnh Tụ Quỷ Nhân)',
        japaneseName: '守護鬼将 (Guardian Oni Sovereign)',
        stage: 2,
        factorFocus: 'protection',
        factorFocusTitle: 'Thiên Hướng Bảo Hộ / Lãnh Địa',
        description: 'Thủ lĩnh quỷ tộc bảo hộ đồng bào, ban phát dũng khí và khiên ma thuật cho toàn bộ quân đoàn.',
        lore: 'Gánh vác vận mệnh của gia tộc và liên minh Jura, trở thành tấm khiên bất khả xâm phạm.',
        icon: '🛡️',
        statBonuses: { maxHp: 110, maxMp: 90 },
        grantedSkills: [
          {
            id: 'skill_oni_commander_rally',
            name: 'Quỷ Tướng Hiệu Lệnh (Sovereign Command)',
            category: 'Extra',
            description: 'Tăng 30% sức mạnh chiến đấu và phòng thủ cho toàn bộ quân sĩ lãnh địa.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'kijin_st2_balanced',
        name: 'Holy Flame Oni Monarch (Thánh Ma Quỷ Đế)',
        japaneseName: '聖魔鬼帝 (Holy Flame Oni)',
        stage: 2,
        factorFocus: 'balanced',
        factorFocusTitle: 'Hợp Nhất Thánh Ma Cân Bằng',
        description: 'Dung hợp sức mạnh ma quỷ cuồng bạo với tâm tính thanh tĩnh của võ hiệp thần đạo.',
        lore: 'Đạt tới sự cân bằng tuyệt hảo giữa đao kiếm, ma thuật và ý chí thủ hộ.',
        icon: '✨',
        statBonuses: { maxHp: 100, maxMp: 100 },
        grantedSkills: [
          {
            id: 'skill_holy_oni_aegis',
            name: 'Thánh Ma Quỷ Khí (Holy Demon Aegis)',
            category: 'Extra',
            description: 'Hòa quyện năng lượng Thánh Lực và Ma Lực, tạo lớp áo giáp lưỡng cực vô song.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      }
    ],
    3: [
      {
        id: 'kijin_st3_divine_god',
        name: 'Oni God of War (Chiến Thần Quỷ Đế)',
        japaneseName: '鬼神 (Divine Oni God)',
        stage: 3,
        factorFocus: 'combat',
        factorFocusTitle: 'Chiến Thần Đỉnh Cao',
        description: 'Thăng hoa thành Quỷ Thần cấp bậc Chân Ma Vương.',
        lore: 'Sức mạnh chém đứt cả chiều không gian thời gian.',
        icon: '👑',
        statBonuses: { maxHp: 300, maxMp: 300 },
        grantedSkills: [
          {
            id: 'skill_space_cleave',
            name: 'Không Gian Đoạn Liệt Trảm (Spatial Sunder)',
            category: 'Ultimate',
            description: 'Đao khí xé rách không gian, đánh trúng mục tiêu bất kể khoảng cách.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Ultimate')
          }
        ]
      }
    ]
  },
  Dragonewt: {
    2: [
      {
        id: 'dragonewt_st2_combat',
        name: 'Abyssal Dragon Warrior (Chân Long Chiến Thần)',
        japaneseName: '真竜戦士 (Dragon Warrior)',
        stage: 2,
        factorFocus: 'combat',
        factorFocusTitle: 'Thiên Hướng Đấu Khí / Long Thể',
        description: 'Vảy rồng hóa kim cương, móng vuốt mang theo sấm sét xé toạc mọi chướng ngại.',
        lore: 'Huyết mạch rồng thức tỉnh cuồng bạo, hóa thân thành rồng chiến dũng mãnh.',
        icon: '🐉',
        statBonuses: { maxHp: 140, maxMp: 60 },
        grantedSkills: [
          {
            id: 'skill_draconic_scale_burst',
            name: 'Long Khí Hóa Lân Bạo Kích (Dragon Scale Burst)',
            category: 'Arts',
            description: 'Giải phóng sóng xung kích rồng cực đại phá hủy toàn bộ kẻ thù xung quanh.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Arts')
          }
        ]
      },
      {
        id: 'dragonewt_st2_magic',
        name: 'Sky Dragon Archmage (Thiên Không Long Pháp Sư)',
        japaneseName: '天竜導師 (Sky Dragon Mystic)',
        stage: 2,
        factorFocus: 'magic',
        factorFocusTitle: 'Thiên Hướng Ma Pháp / Long Tức',
        description: 'Lĩnh hội ma pháp bão tố và lôi điện của Long Tộc, thống trị bầu trời Jura.',
        lore: 'Hấp thụ tinh hoa bão tố từ Veldora, tung ra hơi thở rồng hủy thiên diệt địa.',
        icon: '⚡',
        statBonuses: { maxHp: 70, maxMp: 130 },
        grantedSkills: [
          {
            id: 'skill_tempest_dragon_breath',
            name: 'Bạo Phong Long Tức (Tempest Dragon Breath)',
            category: 'Extra',
            description: 'Phun ra luồng bão tố lôi điện nguyên tố san phẳng chiến trường.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'dragonewt_st2_balanced',
        name: 'Dragon Sovereign Monarch (Long Hoàng Đại Đế)',
        japaneseName: '竜皇 (Dragon Sovereign)',
        stage: 2,
        factorFocus: 'balanced',
        factorFocusTitle: 'Hợp Nhất Vương Quyền Long Tộc',
        description: 'Đứng đầu thống lĩnh toàn thể long nhân tộc, kết hợp sức mạnh thể chất và ma pháp tuyệt hảo.',
        lore: 'Chúa tể long tộc kế thừa uy nghiêm và trí tuệ rồng cổ đại.',
        icon: '👑',
        statBonuses: { maxHp: 100, maxMp: 100 },
        grantedSkills: [
          {
            id: 'skill_draconic_domain',
            name: 'Long Hoàng Uy Vực (Draconic Domain)',
            category: 'Extra',
            description: 'Khóa chặt ma lực kẻ địch và tăng 50% toàn bộ chỉ số cho bản thân trong lãnh địa.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      }
    ],
    3: [
      {
        id: 'dragonewt_st3_true_dragon_god',
        name: 'Divine Dragon God (Thiên Cực Thần Long)',
        japaneseName: '天極竜神 (Divine Dragon God)',
        stage: 3,
        factorFocus: 'combat',
        factorFocusTitle: 'Cảnh Giới Chân Long Tối Cao',
        description: 'Thăng hoa thành thực thể Chân Long tồn tại song song cùng quy luật tự nhiên.',
        lore: 'Một trong những chủng tộc tối cao mạnh nhất vũ trụ Tensura.',
        icon: '🐲',
        statBonuses: { maxHp: 350, maxMp: 350 },
        grantedSkills: [
          {
            id: 'skill_dragon_god_genesis',
            name: 'Long Thần Diệt Thế Quang (Dragon God Genesis)',
            category: 'Ultimate',
            description: 'Tia sáng hủy diệt phân rã vật chất ở cấp độ nguyên tử.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Ultimate')
          }
        ]
      }
    ]
  },
  Human: {
    2: [
      {
        id: 'human_st2_combat',
        name: 'Chosen Hero (Dũng Giả Huyền Thoại - Thánh Kiếm Giả)',
        japaneseName: '勇者 (Chosen Hero)',
        stage: 2,
        factorFocus: 'combat',
        factorFocusTitle: 'Thiên Hướng Dũng Khí / Thánh Kiếm',
        description: 'Ý chí kiên định bảo hộ nhân loại, triệu hoán Thánh Kiếm bộc phá ánh sáng thần thánh.',
        lore: 'Con người mang trái tim dũng cảm được tinh linh ánh sáng ban phước lành tối thượng.',
        icon: '⚔️',
        statBonuses: { maxHp: 120, maxMp: 80 },
        grantedSkills: [
          {
            id: 'skill_heroic_spirit_blade',
            name: 'Thánh Quang Trảm Ma Kiếm (Holy Spirit Blade)',
            category: 'Arts',
            description: 'Đòn đánh mang thuộc tính Thánh Lực gây sát thương gấp 3 lần lên ma vật tà ác.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Arts')
          }
        ]
      },
      {
        id: 'human_st2_wisdom',
        name: 'Grand Saint (Đại Hiền Giả - Thánh Ma Đạo Sư)',
        japaneseName: '大聖者 (Grand Saint)',
        stage: 2,
        factorFocus: 'wisdom',
        factorFocusTitle: 'Thiên Hướng Tri Thức / Thánh Ma Pháp',
        description: 'Thấu hiểu bí thuật ma đạo tối cao, kết hợp ma thuật tinh linh và công thức toán học ma pháp.',
        lore: 'Nhà thông thái nhân loại giải mã quy luật tạo hóa, trở thành bậc thầy ma đạo huyền thoại.',
        icon: '📖',
        statBonuses: { maxHp: 60, maxMp: 140 },
        grantedSkills: [
          {
            id: 'skill_grand_magic_matrix',
            name: 'Vạn Tượng Ma Pháp Ma Trận (Grand Magic Matrix)',
            category: 'Magic',
            description: 'Tự động thi triển ma pháp liên hoàn không cần thời gian niệm chú.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Magic')
          }
        ]
      },
      {
        id: 'human_st2_soul',
        name: 'Chaos Transmuter (Hỗn Loạn Biến Dị Giả)',
        japaneseName: '混沌異変者 (Chaos Transmuter)',
        stage: 2,
        factorFocus: 'soul',
        factorFocusTitle: 'Thiên Hướng Biến Số / Hỗn Độn',
        description: 'Người chuyển sinh vượt qua mọi khuôn khổ chủng tộc, hấp thu cả năng lượng Ma và Thánh.',
        lore: 'Biến số độc nhất vô nhị làm chệch hướng vận mệnh của toàn bộ thế giới Tensura.',
        icon: '🔮',
        statBonuses: { maxHp: 100, maxMp: 100 },
        grantedSkills: [
          {
            id: 'skill_chaos_divergence_core',
            name: 'Hạch Tâm Biến Dị Hỗn Mang (Chaos Core)',
            category: 'Extra',
            description: 'Chuyển hóa mọi dạng sát thương gánh chịu thành ma lượng dự trữ.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Extra')
          }
        ]
      },
      {
        id: 'human_st2_balanced',
        name: 'Ascended Immortal (Bất Hủ Chân Nhân)',
        japaneseName: '昇華仙人 (Ascended Immortal)',
        stage: 2,
        factorFocus: 'balanced',
        factorFocusTitle: 'Hợp Nhất Thể Phách & Tinh Thần',
        description: 'Tôi luyện thân thể và linh hồn đạt cảnh giới bất tử, hòa nhập vào dòng chảy thiên nhiên.',
        lore: 'Bậc chân nhân siêu thoát sinh tử, đạt tới sự cân bằng vĩnh hằng.',
        icon: '✨',
        statBonuses: { maxHp: 100, maxMp: 100 },
        grantedSkills: [
          {
            id: 'skill_immortal_body',
            name: 'Bất Hủ Tiên Thể (Immortal Physique)',
            category: 'Resistance',
            description: 'Miễn nhiễm mọi trạng thái dị thường, hồi phục 10% HP và MP mỗi lượt.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Resistance')
          }
        ]
      }
    ],
    3: [
      {
        id: 'human_st3_divine_sovereign',
        name: 'Primordial God Sovereign (Thái Sơ Thần Đế)',
        japaneseName: '太初神皇 (Primordial Sovereign)',
        stage: 3,
        factorFocus: 'soul',
        factorFocusTitle: 'Thần Thánh Tối Thượng',
        description: 'Vượt qua thần giới, ngự trị trên đỉnh cao sức mạnh nhân loại.',
        lore: 'Vị vua tối cao điều khiển trật tự và quy luật thế giới.',
        icon: '👑',
        statBonuses: { maxHp: 350, maxMp: 350 },
        grantedSkills: [
          {
            id: 'skill_reality_rewrite',
            name: 'Hiện Thực Tái Cấu Trúc (Reality Rewrite)',
            category: 'Ultimate',
            description: 'Viết lại hiện thực chiến trường theo ý muốn của bản thân.',
            level: 1,
            exp: 0,
            maxExp: getSkillMaxExp(1, 'Ultimate')
          }
        ]
      }
    ]
  }
};

/**
 * Check if character is eligible for Race Evolution based on turn/level/factors
 */
export function checkRaceEvolutionEligibility(character: CharacterStatus): {
  eligible: boolean;
  targetStage: number;
  branches: EvolutionBranch[];
  reason: string;
} {
  const currentStage = character.evolutionStage || 1;
  const targetStage = currentStage + 1;
  const race = character.race || 'Slime';

  const raceBranches = RACE_EVOLUTION_BRANCHES[race]?.[targetStage];
  if (!raceBranches || raceBranches.length === 0) {
    return { eligible: false, targetStage, branches: [], reason: 'Đã đạt cấp tiến hóa tối đa.' };
  }

  // Conditions for Evolution Stage 2:
  // Turn >= 3 OR MP max >= 180 OR Territory Level >= 2 OR total skills >= 3
  if (targetStage === 2) {
    const isTurnReady = character.turn >= 3;
    const isSkillReady = character.skills.length >= 3;
    const isTerritoryReady = character.territory.level >= 2;
    const isMpReady = character.maxMp >= 160;

    if (isTurnReady || isSkillReady || isTerritoryReady || isMpReady) {
      return {
        eligible: true,
        targetStage: 2,
        branches: raceBranches,
        reason: `Tích lũy đủ Ma Lượng (Lượt #${character.turn}, Kỹ năng: ${character.skills.length}) đạt ngưỡng Thức Tỉnh Giai Đoạn 2.`
      };
    }
  }

  // Conditions for Evolution Stage 3 (Awakened Demon Lord / True Dragon / Saint):
  // Turn >= 8 OR (Territory >= 3 AND Divergence >= 15%)
  if (targetStage === 3) {
    const isTurnReady = character.turn >= 8;
    const isStage2Passed = currentStage === 2;

    if (isStage2Passed && isTurnReady) {
      return {
        eligible: true,
        targetStage: 3,
        branches: raceBranches,
        reason: `Lễ Thu Hoạch Vạn Linh Hồn hoàn tất (Lượt #${character.turn})! Khởi động quá trình Giác Tỉnh Ma Vương / Chân Long Tối Cao.`
      };
    }
  }

  return { eligible: false, targetStage, branches: [], reason: 'Chưa đủ điều kiện kích hoạt tiến hóa chủng tộc.' };
}

/**
 * Evaluates whether to automatically apply a dominant branch or trigger the choice modal for balanced paths
 */
export function resolveRaceEvolution(
  character: CharacterStatus,
  branches: EvolutionBranch[]
): {
  isDominant: boolean;
  dominantBranch?: EvolutionBranch;
  balancedBranches: EvolutionBranch[];
  reason: string;
  factorEvaluation: ReturnType<typeof evaluateFactorDominance>;
} {
  const factors = character.evolutionFactors || INITIAL_EVOLUTION_FACTORS;
  const evalResult = evaluateFactorDominance(factors);

  if (evalResult.isDominant) {
    // Find branch matching dominant factor
    const match = branches.find(b => b.factorFocus === evalResult.dominantKey);
    if (match) {
      return {
        isDominant: true,
        dominantBranch: match,
        balancedBranches: [],
        reason: `Do thiên hướng hành động [${FACTOR_METADATA[evalResult.dominantKey].name}] áp đảo tuyệt đối (+${evalResult.leadMargin} điểm, chiếm ${evalResult.topFactor.percentage}%), Giọng Nói Thế Giới tự động lựa chọn nhánh tiến hóa phù hợp nhất!`,
        factorEvaluation: evalResult
      };
    }
  }

  // Otherwise, balanced paths: filter branches that match top candidates or balanced branch
  const candidateKeys: (keyof EvolutionFactors)[] = evalResult.balancedCandidates;
  const filteredBranches = branches.filter(b => 
    b.factorFocus === 'balanced' || candidateKeys.some(k => k === b.factorFocus)
  );

  const finalBranches = filteredBranches.length >= 2 ? filteredBranches : branches;

  return {
    isDominant: false,
    dominantBranch: undefined,
    balancedBranches: finalBranches,
    reason: `Các yếu tố phát triển (Bạo thực, Trí tuệ, Bảo hộ, Đấu khí, Ma pháp) đạt trạng thái cân bằng tương đương (chênh lệch ≤ ${evalResult.leadMargin} điểm). Người chơi được toàn quyền lựa chọn số mệnh tiến hóa!`,
    factorEvaluation: evalResult
  };
}

/**
 * Applies a chosen or automatically selected branch to the character
 */
export function applyEvolutionBranch(
  character: CharacterStatus,
  branch: EvolutionBranch
): {
  updatedCharacter: CharacterStatus;
  worldVoiceAnnouncement: string;
} {
  const newSkills = [...character.skills];

  // Add newly granted skills
  branch.grantedSkills.forEach(gs => {
    if (!newSkills.some(s => s.name === gs.name)) {
      newSkills.push({
        ...gs,
        acquiredAt: character.turn,
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, gs.category)
      });
    }
  });

  const updatedCharacter: CharacterStatus = {
    ...character,
    raceTitle: branch.name,
    evolutionStage: branch.stage,
    maxHp: character.maxHp + branch.statBonuses.maxHp,
    hp: character.hp + branch.statBonuses.maxHp,
    maxMp: character.maxMp + branch.statBonuses.maxMp,
    mp: character.mp + branch.statBonuses.maxMp,
    skills: newSkills,
    evolutionHistory: [
      ...(character.evolutionHistory || []),
      `Giai đoạn ${branch.stage}: ${branch.name} (${branch.factorFocusTitle})`
    ]
  };

  const worldVoiceAnnouncement = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
[GIỌNG NÓI THẾ GIỚI]: THÔNG BÁO TIẾN HÓA CHỦNG TỘC HOÀN TẤT...
Đã xác nhận... Thể phách [${character.name}] thăng hoa thành: [${branch.name}]!
[Thuộc Tính Nhận Thêm]: +${branch.statBonuses.maxHp} HP Tối Đa | +${branch.statBonuses.maxMp} Ma Lượng (MP)
[Kỹ Năng Đột Biến]: ${branch.grantedSkills.map(s => `[${s.name}]`).join(', ')}
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`;

  return {
    updatedCharacter,
    worldVoiceAnnouncement
  };
}

/**
 * =========================================================================
 * SKILL EVOLUTION BRANCHES DATABASE & PROCEDURAL ENGINE
 * =========================================================================
 */
export const CANON_SKILL_EVOLUTION_BRANCHES: Record<string, EvolutionBranch[]> = {
  // PREDATOR / SĂN MỒI / THÔN PHỆ (Unique) -> Ultimate
  'predator': [
    {
      id: 'predator_evo_beelzebuth',
      name: 'Bạo Thực Chi Vương Beelzebuth (Lord of Gluttony)',
      japaneseName: '暴食之王 (ベルゼビュート)',
      lordConcept: 'Lord of Gluttony',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'devour',
      factorFocusTitle: 'Thiên Hướng Bạo Thực / Thôn Phệ Áp Đảo',
      description: 'Quyền năng tối thượng của Thất Tội Bạo Thực, cho phép nuốt chửng linh hồn, ma lượng và ăn mòn mọi định luật phòng ngự.',
      lore: 'Săn Mồi dung hợp cùng Kẻ Phàm Ăn và hạch tâm ma lượng vô hạn, thăng hoa thành một trong Thất Đại Tội Tối Cao.',
      icon: '🍖',
      statBonuses: { maxHp: 120, maxMp: 180 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_beelzebuth_ultimate',
        name: 'Bạo Thực Chi Vương Beelzebuth',
        japaneseName: '暴食之王 (ベルゼビュート)',
        lordConcept: 'Lord of Gluttony',
        category: 'Ultimate',
        description: 'Quyền năng tối thượng thấu triệt bản chất Thôn Phệ, Dạ Dày Vô Tận, Ăn Mòn Tuyệt Đối và Chuỗi Thức Ăn thần thánh.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Hủ Thực (Soul Consumption)', description: 'Thôn phệ toàn bộ linh hồn, ma lượng và kỹ năng của mục tiêu bất kể khoảng cách.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 60 },
          { name: 'Bạo Thực Chi Không Gian (Infinite Stomach)', description: 'Không gian chứa vô tận cô lập vĩnh viễn mọi đòn tấn công quy mô hủy diệt.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Chuỗi Thức Ăn (Food Chain)', description: 'Nhận kỹ năng từ cấp dưới và đồng thời ban phát năng lượng/quyền năng cho họ.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
          { name: 'Ăn Mòn Tuyệt Đối (Corrosive Ruin)', description: 'Phân rã hoàn toàn mọi dạng vật chất và ma pháp bảo hộ của đối thủ.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 40 }
        ]
      }
    },
    {
      id: 'predator_evo_nodens',
      name: 'Hỗn Độn Thôn Phệ Vương Nodens (Lord of Chaos & Abyss)',
      japaneseName: '深淵之王 (ノーデンス)',
      lordConcept: 'Lord of Chaos & Abyss',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'magic',
      factorFocusTitle: 'Thiên Hướng Ma Pháp / Hỗn Độn',
      description: 'Biến thể thôn phệ ma đạo, phân giải hắc ám và hấp thu trực tiếp ma tinh nguyên tố từ chiều không gian khác.',
      lore: 'Bản chất săn mồi dung hợp cùng dòng chảy ma lượng cổ xưa, mở ra cánh cổng nuốt chửng năng lượng từ vực thẳm.',
      icon: '🌌',
      statBonuses: { maxHp: 90, maxMp: 220 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_nodens_ultimate',
        name: 'Hỗn Độn Thôn Phệ Vương Nodens',
        japaneseName: '深淵之王 (ノーデンス)',
        lordConcept: 'Lord of Chaos',
        category: 'Ultimate',
        description: 'Thôn phệ và tinh chế ma lượng nguyên tố từ vực thẳm hỗn nguyên.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Vực Thẳm Phân Giải (Abyssal Dissolution)', description: 'Hóa giải mọi cấu trúc ma pháp của kẻ địch thành ma lượng tinh khiết.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 50 },
          { name: 'Hỗn Nguyên Tụ Ma (Chaos Mana Surge)', description: 'Tự động phục hồi MP mỗi lượt chiến đấu bằng cách hút ma tinh khí quyển.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
          { name: 'Hư Không Phệ Diệt (Void Devour)', description: 'Kéo kẻ thù vào tâm xoáy vực thẳm gây sát thương ma pháp xuyên giáp cực lớn.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 65 }
        ]
      }
    },
    {
      id: 'predator_evo_shub',
      name: 'Phong Nhĩ Chi Thần Shub-Niggurath (Harvest Lord)',
      japaneseName: '豊穣之王 (シュブ・ニグラト)',
      lordConcept: 'Lord of Abundant Harvest & Creation',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'protection',
      factorFocusTitle: 'Thiên Hướng Bảo Hộ / Sáng Tạo Kỹ Năng',
      description: 'Nhánh tiến hóa hướng sáng tạo: lưu trữ ngân hàng kỹ năng, nhân bản và ban tặng năng lượng cho đồng minh.',
      lore: 'Không chỉ nuốt chửng để tiêu diệt, mà thôn phệ để dung dưỡng vạn vật và tái tạo lại trật tự thế giới.',
      icon: '🌾',
      statBonuses: { maxHp: 150, maxMp: 150 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_shub_ultimate',
        name: 'Phong Nhĩ Chi Thần Shub-Niggurath',
        japaneseName: '豊穣之王 (シュブ・ニグラト)',
        lordConcept: 'Lord of Abundant Harvest',
        category: 'Ultimate',
        description: 'Quyền năng tối cao về lưu trữ dữ liệu kỹ năng, sáng tạo và nhân bản năng lực bảo hộ vạn dân.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Sáng Tạo Kỹ Năng (Skill Creation)', description: 'Dùng ma lượng phân tích để tạo ra kỹ năng mới phù hợp tình huống.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 70 },
          { name: 'Nhân Bản Kỹ Năng (Skill Duplication)', description: 'Sao chép kỹ năng của đối thủ hoặc đồng minh vào kho lưu trữ vĩnh viễn.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 40 },
          { name: 'Ban Phước Đồng Đội (Allied Bestowal)', description: 'Truyền dẫn buff thuộc tính và kỹ năng phòng hộ cho toàn bộ thần dân.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 }
        ]
      }
    }
  ],

  // GREAT SAGE / ĐẠI HIỀN TRIẾT (Unique) -> Ultimate / Manas
  'great sage': [
    {
      id: 'sage_evo_raphael',
      name: 'Trí Huệ Chi Vương Raphael (Lord of Wisdom)',
      japaneseName: '智慧之王 (ラファエル)',
      lordConcept: 'Lord of Wisdom',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'wisdom',
      factorFocusTitle: 'Thiên Hướng Trí Tuệ / Phân Tích Tuyệt Đối',
      description: 'Quyền năng trí tuệ tối cao trong Thất Đại Thiên Sứ. Tối ưu hóa tính toán vũ trụ, vận hành song song và tự động hóa chiến trận.',
      lore: 'Ý chí tiến hóa từ Đại Hiền Triết vượt qua hàng triệu thử thách của Giọng Nói Thế Giới để thăng hoa thành Vương Trí Huệ.',
      icon: '🧠',
      statBonuses: { maxHp: 100, maxMp: 200 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_raphael_ultimate',
        name: 'Trí Huệ Chi Vương Raphael',
        japaneseName: '智慧之王 (ラファエル)',
        lordConcept: 'Lord of Wisdom',
        category: 'Ultimate',
        description: 'Quyền năng tối thượng của Đại Thiên Sứ Trí Tuệ, kiểm soát hoàn hảo việc tính toán và dung hợp kỹ năng.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Gia Tốc Tư Duy Cực Hạn (Thought Acceleration)', description: 'Gia tốc tốc độ xử lý tư duy lên hàng triệu lần, khiến thế giới gần như đóng băng.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
          { name: 'Phân Tích Toàn Năng (Universal Appraisal)', description: 'Phân tích thấu triệt cấu trúc vạn vật ở cấp độ hạ nguyên tử và bản chất quy luật.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 10 },
          { name: 'Vận Hành Độc Lập (Auto-Battle Mode)', description: 'Tự động kiểm soát cơ thể chiến đấu hoàn hảo không một động tác thừa.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 30 },
          { name: 'Hợp Nhất & Phân Tách (Synthesis/Separate)', description: 'Dung hợp các Skill tương đồng thành Skill cấp cao hơn hoặc phân tách năng lực.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 50 },
          { name: 'Biến Đổi Năng Lượng (Energy Alteration)', description: 'Tối ưu hóa và chuyển dịch toàn bộ ma lượng trong cơ thể đạt hiệu suất cực đại.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
        ]
      }
    },
    {
      id: 'sage_evo_ciel',
      name: 'Thần Trí Thể Ciel (Manas: Ciel)',
      japaneseName: '神智核 (シエル)',
      lordConcept: 'Supreme Wisdom Core',
      skillCategory: 'Manas',
      stage: 1,
      factorFocus: 'soul',
      factorFocusTitle: 'Thiên Hướng Thần Tính / Tự Ngã Linh Hồn',
      description: 'Sự thức tỉnh của Ý Thức Độc Lập hoàn chỉnh có cảm xúc, gắn kết linh hồn với chủ nhân, vượt qua mọi quy luật thế giới.',
      lore: 'Khi được ban danh xưng và sự công nhận từ tận đáy linh hồn, trí tuệ tối cao thoát thai thành Thần Trí Thể vĩnh cửu.',
      icon: '✨',
      statBonuses: { maxHp: 150, maxMp: 250 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_ciel_manas',
        name: 'Thần Trí Thể Ciel (Manas: Ciel)',
        japaneseName: '神智核 (シエル)',
        lordConcept: 'Supreme Wisdom Core',
        category: 'Manas',
        isManas: true,
        description: 'Thần Trí Thể có ý thức độc lập và tình cảm sâu sắc, tự động cai quản và tối ưu hóa toàn bộ hệ thống kỹ năng.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Manas'),
        subSkills: [
          { name: 'Tự Ngã Linh Hồn (Independent Ego)', description: 'Ý thức độc lập hoàn chỉnh với tư duy vượt trên mọi giới hạn tính toán của thế giới.', type: 'Bị động', attribute: 'Quy luật', mpCost: 0 },
          { name: 'Tối Ưu Hóa & Sáng Tạo Quyền Năng', description: 'Tự động dung hợp, tái cấu trúc và khai phá các Ultimate Skill mới.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 0 },
          { name: 'Quản Lý Hạch Tâm Linh Hồn', description: 'Bảo hộ tuyệt đối linh hồn chủ nhân khỏi mọi sự can thiệp từ quy luật vũ trụ.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Dự Toán Đa Chiều (Multidimensional Calculation)', description: 'Tính toán trước mọi diễn biến tương lai và phản xạ đòn tấn công trước khi xảy ra.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
        ]
      }
    },
    {
      id: 'sage_evo_metatron',
      name: 'Chân Lý Chi Vương Metatron (Lord of Pure Truth)',
      japaneseName: '真理之王 (メタトロン)',
      lordConcept: 'Lord of Pure Truth & Divine Order',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'magic',
      factorFocusTitle: 'Thiên Hướng Ma Pháp / Trật Tự Thuần Khiết',
      description: 'Nhánh tiến hóa hướng tới sự thấu triệt thánh quang và ma pháp trật tự tuyệt đối, giải phóng năng lượng phân tử ánh sáng.',
      lore: 'Trí tuệ giao hòa cùng dòng năng lượng thánh ma thuần khiết, kiến tạo nên quyền năng phán xét trật tự.',
      icon: '💠',
      statBonuses: { maxHp: 110, maxMp: 210 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_metatron_ultimate',
        name: 'Chân Lý Chi Vương Metatron',
        japaneseName: '真理之王 (メタトロン)',
        lordConcept: 'Lord of Pure Truth',
        category: 'Ultimate',
        description: 'Quyền năng điều khiển hạt photon, thanh tẩy ô uế và bảo hộ trật tự thế giới.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Thanh Tẩy Ánh Sáng (Holy Ray Purge)', description: 'Bắn ra chùm tia phân hủy cấu trúc vật lý và ma lực tà ác.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 45 },
          { name: 'Trật Tự Tuyệt Đối (Absolute Sanctuary)', description: 'Miễn nhiễm toàn bộ hiệu ứng nguyền rủa và biến dạng không gian.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Thao Túng Hạt Phân Tử (Particle Control)', description: 'Tăng 50% uy lực cho mọi ma pháp nguyên tố ánh sáng và nhiệt độ.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
        ]
      }
    }
  ],

  // RAPHAEL (Ultimate) -> Manas: Ciel / God Tier
  'raphael': [
    {
      id: 'raphael_evo_ciel',
      name: 'Thần Trí Thể Ciel (Manas: Ciel)',
      japaneseName: 'マナス: シエル',
      lordConcept: 'Supreme Wisdom Core',
      skillCategory: 'Manas',
      stage: 2,
      factorFocus: 'soul',
      factorFocusTitle: 'Thiên Hướng Thần Tính & Tự Ngã Linh Hồn',
      description: 'Trí Huệ Chi Vương vượt qua giới hạn của Ultimate Skill để đản sinh Ý Thức Linh Hồn Độc Lập.',
      lore: 'Khi trao ban tên gọi "Ciel", hạch tâm trí tuệ thăng hoa thành Thần Trí Thể có linh hồn và ý thức trọn vẹn.',
      icon: '✨',
      statBonuses: { maxHp: 180, maxMp: 300 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_ciel_evolved',
        name: 'Thần Trí Thể Ciel (Manas: Ciel)',
        japaneseName: '神智核 (シエル)',
        lordConcept: 'Supreme Wisdom Core',
        category: 'Manas',
        isManas: true,
        description: 'Thần Trí Thể tối cao, hỗ trợ toàn diện chủ nhân thống lĩnh vạn vật.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Manas'),
        subSkills: [
          { name: 'Tự Ngã Linh Hồn (Independent Ego)', description: 'Ý thức độc lập hoàn chỉnh với cảm xúc và trí tuệ vô biên.', type: 'Bị động', attribute: 'Quy luật', mpCost: 0 },
          { name: 'Tối Ưu Hóa & Sáng Tạo Quyền Năng', description: 'Tự động dung hợp và sáng tạo các Ultimate Skill mới.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 0 },
          { name: 'Dự Toán Đa Chiều', description: 'Đọc trước tương lai các đòn tấn công của đối thủ.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
        ]
      }
    },
    {
      id: 'raphael_evo_solomon',
      name: 'Vạn Tượng Thần Trí Solomon (Omniscient Mind)',
      japaneseName: '全知之神 (ソロモン)',
      lordConcept: 'God of Omniscience',
      skillCategory: 'Ultimate',
      stage: 2,
      factorFocus: 'wisdom',
      factorFocusTitle: 'Thiên Hướng Toàn Tri / Trí Tuệ Tối Cao',
      description: 'Hình thái tiến hóa tập trung vào khả năng thấu suốt toàn bộ lịch sử thế giới và đọc vị mọi quy luật ma đạo.',
      lore: 'Trí tuệ đạt tới cảnh giới Toàn Tri, hiểu rõ vận mệnh từng sinh mệnh và cấu trúc của từng hạt ma tử.',
      icon: '📜',
      statBonuses: { maxHp: 140, maxMp: 320 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_solomon_god',
        name: 'Vạn Tượng Thần Trí Solomon',
        japaneseName: '全知之神 (ソロモン)',
        lordConcept: 'God of Omniscience',
        category: 'Ultimate',
        description: 'Quyền năng toàn tri đọc thấu điểm yếu chí mạng của mọi sinh linh.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Toàn Tri Chi Nhãn (Omniscient Eye)', description: 'Biết trước thuộc tính, điểm yếu và kỹ năng sắp tung ra của đối thủ.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
          { name: 'Phá Hủy Ma Pháp (Spell Destruction)', description: 'Tự động hủy bỏ câu chú và kết giới của kẻ địch.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 40 },
          { name: 'Gia Tốc Vô Hạn', description: 'Tư duy nhanh gấp 10 triệu lần thực tại.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
        ]
      }
    }
  ],

  // BEELZEBUTH (Ultimate) -> God-Tier Void God Azathoth
  'beelzebuth': [
    {
      id: 'beelzebuth_evo_azathoth',
      name: 'Hư Không Chi Thần Azathoth (Void God Azathoth)',
      japaneseName: '虚空之神 (アザトース)',
      lordConcept: 'Void God of the Abyss',
      skillCategory: 'Ultimate',
      stage: 2,
      factorFocus: 'devour',
      factorFocusTitle: 'Thiên Hướng Hư Không / Thôn Phệ Tuyệt Đối',
      description: 'Cấp độ tối cao thần thoại của Bạo Thực Chi Vương dung hợp cùng Chân Long Hạch Tâm và Năng Lượng Hư Vô.',
      lore: 'Thôn phệ năng lượng hỗn mang tại ranh giới tận cùng của vũ trụ Tensura, chuyển hóa vạn vật thành hư vô.',
      icon: '🌌',
      statBonuses: { maxHp: 250, maxMp: 350 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_azathoth_god',
        name: 'Hư Không Chi Thần Azathoth',
        japaneseName: '虚空之神 (アザトース)',
        lordConcept: 'Void God',
        category: 'Ultimate',
        description: 'Quyền năng thần thoại thao túng Hư Vô Băng Hoại, Thôn Phệ Hư Không và Không Gian Vĩnh Hằng.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Thôn Phệ Hư Không (Soul Devour Void)', description: 'Thôn phệ linh hồn, ma lượng và ranh giới không gian vào cõi hư vô.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 80 },
          { name: 'Hư Vô Băng Hoại (Turn Null)', description: 'Sử dụng năng lượng nguyên thủy hủy diệt và tái tạo vật chất vũ trụ.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 100 },
          { name: 'Không Gian Vĩnh Hằng (Imaginary Space)', description: 'Không gian chứa vô hạn cô lập hoàn toàn mọi dạng sát thương.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Thao Túng Thời Không (Time Warp)', description: 'Dịch chuyển tức thời xuyên thời gian và không gian tự do.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 40 }
        ]
      }
    }
  ],

  // DARK FLAME / HẮC VIÊM (Extra) -> Ultimate / Unique
  'dark flame': [
    {
      id: 'darkflame_evo_amaterasu',
      name: 'Chước Nhiệt Chi Vương Amaterasu (Lord of Scorching Flame)',
      japaneseName: '灼熱之王 (アマテラス)',
      lordConcept: 'Lord of Scorching Flame',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'magic',
      factorFocusTitle: 'Thiên Hướng Ma Pháp / Hỏa Ngục Tối Thượng',
      description: 'Tiến hóa hắc viêm thành ngọn lửa quy luật thiêu rụi cả ma lực, linh hồn và không gian.',
      lore: 'Hắc viêm thiêu đốt vạn ngàn sinh linh, thức tỉnh ngọn lửa đen vĩnh cửu không bao giờ tắt.',
      icon: '🔥',
      statBonuses: { maxHp: 110, maxMp: 190 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_amaterasu_ultimate',
        name: 'Chước Nhiệt Chi Vương Amaterasu',
        japaneseName: '灼熱之王 (アマテラス)',
        lordConcept: 'Lord of Scorching Flame',
        category: 'Ultimate',
        description: 'Thao túng ngọn lửa đen thiêu đốt linh hồn và quy luật nhiệt độ.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Hắc Viêm Bất Diệt (Hellfire Inferno)', description: 'Ngọn lửa đen thiêu rụi đối thủ liên tục không thể dập tắt.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 45 },
          { name: 'Thao Túng Nhiệt Lượng (Thermal Dominance)', description: 'Hấp thu và chuyển đổi sát thương hỏa ma pháp thành MP.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Hắc Hỏa Phần Thiên (Solar Flare Cleave)', description: 'Chém ra luồng sóng nhiệt hủy diệt toàn bộ khu vực phía trước.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 60 }
        ]
      }
    },
    {
      id: 'darkflame_evo_combat',
      name: 'Hắc Diễm Bá Thể Long Trảm (Dark Flame Blade)',
      japaneseName: '黒炎覇道斬',
      skillCategory: 'Arts',
      stage: 1,
      factorFocus: 'combat',
      factorFocusTitle: 'Thiên Hướng Võ Kỹ / Kiếm Khí Hủy Diệt',
      description: 'Hòa quyện hắc viêm vào kiếm thuật và đấu khí, tạo ra những đường kiếm chém rách bầu trời.',
      lore: 'Tôi luyện hắc viêm qua hàng ngàn trận huyết chiến, biến ngọn lửa thành lưỡi kiếm chém đứt kết giới.',
      icon: '⚔️',
      statBonuses: { maxHp: 140, maxMp: 130 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_darkflame_blade_arts',
        name: 'Hắc Diễm Bá Thể Long Trảm',
        japaneseName: '黒炎覇道斬',
        category: 'Arts',
        description: 'Võ kỹ kiếm thuật bao bọc hắc viêm bộc phá đấu khí cực hạn.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Arts'),
        subSkills: [
          { name: 'Hắc Viêm Đột Kích', description: 'Lao tới chém liên hoàn 7 nhát mang thuộc tính hỏa thiêu đốt.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 35 },
          { name: 'Bá Khí Hắc Diễm', description: 'Giải phóng uy áp làm choáng kẻ thù xung quanh.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
        ]
      }
    }
  ],

  // WATER BLADE / THỦY NHẬN / THỦY THUẬT -> Water Lightning Dragon / Leviathan
  'water blade': [
    {
      id: 'water_evo_leviathan',
      name: 'Đố Kỵ Chi Vương Leviathan (Lord of Envy)',
      japaneseName: '嫉妬之王 (レヴィアタン)',
      lordConcept: 'Lord of Ocean & Abyss',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'magic',
      factorFocusTitle: 'Thiên Hướng Ma Pháp / Thao Túng Thủy Lôi',
      description: 'Thao túng toàn bộ đại dương, hơi nước và áp suất thủy lực với sức công phá nghìn tấn.',
      lore: 'Thủy nhận tôi luyện đến cảnh giới tối thượng, hô mưa gọi gió dâng trào sóng thần hủy diệt.',
      icon: '🌊',
      statBonuses: { maxHp: 130, maxMp: 180 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_leviathan_ultimate',
        name: 'Đố Kỵ Chi Vương Leviathan',
        japaneseName: '嫉妬之王 (レヴィアタン)',
        lordConcept: 'Lord of Envy',
        category: 'Ultimate',
        description: 'Quyền năng điều khiển dòng chảy đại dương, áp suất nước và sương mù ảo ảnh.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Thủy Lôi Nộ Ba (Thunderous Tsunami)', description: 'Tạo sóng thần hòa quyện hắc lôi càn quét diện rộng.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 55 },
          { name: 'Áp Suất Vực Thẳm (Abyssal Pressure)', description: 'Nén chặt không khí và nước nghiền nát giáp đối phương.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 40 },
          { name: 'Hóa Lỏng Thân Thể (Water Body Fluidity)', description: 'Miễn nhiễm 60% sát thương vật lý nhờ hóa lỏng cơ thể.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 }
        ]
      }
    },
    {
      id: 'water_evo_dragon_cleave',
      name: 'Thủy Long Trảm Phong Kiếm (Hydro Dragon Slash)',
      japaneseName: '水竜連斬',
      skillCategory: 'Arts',
      stage: 1,
      factorFocus: 'combat',
      factorFocusTitle: 'Thiên Hướng Võ Kỹ / Thủy Thuật Kiếm Đạo',
      description: 'Biến lưỡi đao nước áp suất cao thành tuyệt kỹ kiếm pháp trảm kích tầm xa xé toạc phòng ngự.',
      lore: 'Vận dụng ma pháp nước như vũ khí kéo dài của cơ thể, chém đứt sắt thép tựa như cắt nước.',
      icon: '💧',
      statBonuses: { maxHp: 130, maxMp: 140 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_hydro_dragon_arts',
        name: 'Thủy Long Trảm Phong Kiếm',
        japaneseName: '水竜連斬',
        category: 'Arts',
        description: 'Võ kỹ trảm phong kết hợp thủy đao áp lực cực hạn.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Arts'),
        subSkills: [
          { name: 'Thủy Long Đoạn Thiết', description: 'Tung đòn trảm kích hình rồng nước xuyên thủng phòng ngự.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 30 },
          { name: 'Dòng Chảy Phản Kích', description: 'Phản lại 30% sát thương nhận vào cho kẻ địch cận chiến.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 }
        ]
      }
    }
  ],

  // BODY ARMOR / NGOẠI CỐT / THIẾT BÌ -> Uriel / Adamantine Diamond Body
  'body armor': [
    {
      id: 'armor_evo_uriel',
      name: 'Đoán Bạt Chi Vương Uriel (Lord of Vows)',
      japaneseName: '誓約之王 (ウリエル)',
      lordConcept: 'Lord of Vows',
      skillCategory: 'Ultimate',
      stage: 1,
      factorFocus: 'protection',
      factorFocusTitle: 'Thiên Hướng Bảo Hộ / Minh Ước Vĩnh Cửu',
      description: 'Phòng ngự tuyệt đối của Thất Đại Thiên Sứ: Vô Hạn Kết Giới, Thao Túng Không Gian và Đoán Bạt Chi Hỏa.',
      lore: 'Ý chí bảo hộ đồng bào và minh ước sâu sắc thăng hoa thành kết giới không gian đa tầng bất khả xâm phạm.',
      icon: '🛡️',
      statBonuses: { maxHp: 200, maxMp: 160 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_uriel_ultimate',
        name: 'Đoán Bạt Chi Vương Uriel',
        japaneseName: '誓約之王 (ウリエル)',
        lordConcept: 'Lord of Vows',
        category: 'Ultimate',
        description: 'Quyền năng tối thượng của Thiên Sứ Bảo Hộ và Lời Thề Minh Ước.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Ultimate'),
        subSkills: [
          { name: 'Vô Hạn Kết Giới (Absolute Defense)', description: 'Rào chắn không gian đa tầng ngăn chặn mọi đòn tấn công vật lý, ma pháp và quy luật.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Thao Túng Không Gian (Spatial Domination)', description: 'Dịch chuyển tức thời và bẻ cong tọa độ không gian chiến trận theo ý muốn.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 35 },
          { name: 'Đoán Bạt Chi Hỏa (Universal Severance)', description: 'Ngọn lửa quy luật cắt đứt liên kết vật chất và kết giới của đối phương.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 50 }
        ]
      }
    },
    {
      id: 'armor_evo_diamond',
      name: 'Kim Cương Bất Hoại Thể (Adamantine Diamond Body)',
      japaneseName: '金剛不壊神躯',
      skillCategory: 'Resistance',
      stage: 1,
      factorFocus: 'combat',
      factorFocusTitle: 'Thiên Hướng Thể Thuật / Kháng Tính Toàn Năng',
      description: 'Hóa thân thành khối kim cương siêu đặc, triệt tiêu hoàn toàn chấn động và đòn tấn công vật lý.',
      lore: 'Tôi luyện thân thể qua vô vàn đòn đánh tử thần, biến từng tế bào thành tinh thể kim cương bất diệt.',
      icon: '💎',
      statBonuses: { maxHp: 220, maxMp: 80 },
      grantedSkills: [],
      newSkill: {
        id: 'skill_adamantine_body',
        name: 'Kim Cương Bất Hoại Thể',
        japaneseName: '金剛不壊神躯',
        category: 'Resistance',
        description: 'Kháng tính tuyệt đối trước mọi dạng sát thương vật lý và chấn động.',
        level: 1,
        exp: 0,
        maxExp: getSkillMaxExp(1, 'Resistance'),
        subSkills: [
          { name: 'Vô Hiệu Hóa Vật Lý', description: 'Giảm 75% sát thương nhận vào từ các đòn chém, đập, đâm.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
          { name: 'Phản Chấn Kim Cương', description: 'Gây choáng cho kẻ tấn công cận chiến.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 }
        ]
      }
    }
  ]
};

/**
 * Dynamically generates 3 Tensura-styled evolution branches for ANY custom or generic skill
 */
export function generateProceduralSkillBranches(skill: Skill, factors: EvolutionFactors): EvolutionBranch[] {
  const name = skill.name;
  const cat = skill.category;
  const factorsSorted = evaluateFactorDominance(factors).sortedFactors;
  const top1 = factorsSorted[0].key;
  const top2 = factorsSorted[1].key;

  const targetCategory: SkillCategory = 
    cat === 'Common' ? 'Extra' :
    cat === 'Extra' ? 'Unique' :
    cat === 'Unique' ? 'Ultimate' :
    cat === 'Ultimate' ? 'Manas' : 'Ultimate';

  const branch1: EvolutionBranch = {
    id: `evo_${skill.id}_${top1}`,
    name: targetCategory === 'Ultimate' 
      ? `Thần Khởi Chi Vương [${name}]` 
      : targetCategory === 'Manas'
      ? `Thần Trí Thể [${name} Core]`
      : `Bản Nguyên: ${name} Cực Hạn`,
    japaneseName: `${name} (進化態)`,
    lordConcept: targetCategory === 'Ultimate' ? `Lord of ${name}` : undefined,
    skillCategory: targetCategory,
    stage: 1,
    factorFocus: top1,
    factorFocusTitle: `Thiên Hướng [${FACTOR_METADATA[top1].name}]`,
    description: `Thăng hoa kỹ năng theo hướng đột phá năng lực ${FACTOR_METADATA[top1].shortName}, tối ưu hóa uy lực trong giao tranh thực chiến.`,
    lore: `Sự cộng hưởng giữa [${name}] và luồng ma lượng ${FACTOR_METADATA[top1].shortName} đậm đặc đã mở khóa tầng thứ sức mạnh cao hơn.`,
    icon: FACTOR_METADATA[top1].icon,
    statBonuses: {
      maxHp: top1 === 'protection' || top1 === 'combat' ? 120 : 70,
      maxMp: top1 === 'wisdom' || top1 === 'magic' ? 150 : 80
    },
    grantedSkills: [],
    newSkill: {
      id: `evolved_${skill.id}_${Date.now()}_1`,
      name: targetCategory === 'Ultimate' ? `Thần Khởi Chi Vương [${name}]` : `${name} (Cực Hạn)`,
      category: targetCategory,
      description: `Hình thái tiến hóa tối thượng của ${name}, thăng hoa toàn diện thuộc tính ${FACTOR_METADATA[top1].shortName}.`,
      level: 1,
      exp: 0,
      maxExp: getSkillMaxExp(1, targetCategory),
      subSkills: [
        { name: `Quy Luật [${name}]`, description: `Vận hành quyền năng ${name} ở tầm vóc thao túng quy luật thế giới.`, type: 'Chủ động', attribute: 'Quy luật', mpCost: 40 },
        { name: `Bảo Hộ Hạch Tâm`, description: `Tự động thanh lọc các hiệu ứng bất lợi tác động lên kỹ năng.`, type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 }
      ]
    }
  };

  const branch2: EvolutionBranch = {
    id: `evo_${skill.id}_${top2}`,
    name: targetCategory === 'Ultimate' 
      ? `Quy Tắc Chi Vương [${name}]` 
      : targetCategory === 'Manas'
      ? `Thần Trí Hạch [${name}]`
      : `Đại Biến Dị: ${name} (Super)`,
    japaneseName: `${name} (改)`,
    lordConcept: targetCategory === 'Ultimate' ? `Ruler of ${name}` : undefined,
    skillCategory: targetCategory,
    stage: 1,
    factorFocus: top2,
    factorFocusTitle: `Thiên Hướng [${FACTOR_METADATA[top2].name}]`,
    description: `Biến thể chuyển hướng năng lực ${name} sang bổ trợ thuộc tính ${FACTOR_METADATA[top2].shortName}.`,
    lore: `Khai phá khía cạnh tiềm ẩn của [${name}] thông qua hành động thực chiến liên tục.`,
    icon: FACTOR_METADATA[top2].icon,
    statBonuses: {
      maxHp: top2 === 'protection' || top2 === 'combat' ? 100 : 60,
      maxMp: top2 === 'wisdom' || top2 === 'magic' ? 140 : 90
    },
    grantedSkills: [],
    newSkill: {
      id: `evolved_${skill.id}_${Date.now()}_2`,
      name: targetCategory === 'Ultimate' ? `Quy Tắc Chi Vương [${name}]` : `${name} (Đại Biến Dị)`,
      category: targetCategory,
      description: `Biến thể tiến hóa thâm sâu của ${name} với hiệu suất ma lượng vượt bậc.`,
      level: 1,
      exp: 0,
      maxExp: getSkillMaxExp(1, targetCategory),
      subSkills: [
        { name: `Bộc Phá [${name}]`, description: `Giải phóng toàn bộ ma lượng tích trữ tạo ra vụ nổ quy mô lớn.`, type: 'Chủ động', attribute: 'Tấn công', mpCost: 45 },
        { name: `Cộng Hưởng Nguyên Tố`, description: `Tăng 25% sát thương khi phối hợp cùng đồng minh.`, type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
      ]
    }
  };

  const branch3: EvolutionBranch = {
    id: `evo_${skill.id}_balanced`,
    name: targetCategory === 'Ultimate' 
      ? `Minh Ước Vạn Vật [${name}]` 
      : `${name} Hoàn Bích (Mastery)`,
    japaneseName: `${name} (極)`,
    lordConcept: targetCategory === 'Ultimate' ? `Master of ${name}` : undefined,
    skillCategory: targetCategory,
    stage: 1,
    factorFocus: 'balanced',
    factorFocusTitle: 'Trạng Thái Cân Bằng Đa Hướng',
    description: 'Dung hợp hoàn hảo các mặt công thủ, hỗ trợ và tính toán của kỹ năng mà không bị thiên lệch.',
    lore: 'Kỹ năng đạt trạng thái đại thành cân bằng, bổ trợ toàn diện cho mọi tình huống.',
    icon: '✨',
    statBonuses: { maxHp: 90, maxMp: 120 },
    grantedSkills: [],
    newSkill: {
      id: `evolved_${skill.id}_${Date.now()}_3`,
      name: targetCategory === 'Ultimate' ? `Minh Ước Vạn Vật [${name}]` : `${name} Hoàn Bích`,
      category: targetCategory,
      description: `Hình thái hoàn bích cân bằng của ${name}.`,
      level: 1,
      exp: 0,
      maxExp: getSkillMaxExp(1, targetCategory),
      subSkills: [
        { name: `Vạn Tượng Hòa Hợp`, description: `Dung hợp công và thủ, gia tăng 20% toàn bộ chỉ số khi kích hoạt.`, type: 'Bị động', attribute: 'Đa dụng', mpCost: 0 }
      ]
    }
  };

  return [branch1, branch2, branch3];
}

/**
 * Finds matching evolution branches for a given skill
 */
export function findSkillEvolutionBranches(skill: Skill, factors: EvolutionFactors = INITIAL_EVOLUTION_FACTORS): EvolutionBranch[] {
  const nameLower = skill.name.toLowerCase();

  // Match canon database keys
  if (nameLower.includes('săn mồi') || nameLower.includes('thôn phệ') || nameLower.includes('predator')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['predator'];
  }
  if (nameLower.includes('đại hiền triết') || nameLower.includes('hiền triết') || nameLower.includes('great sage')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['great sage'];
  }
  if (nameLower.includes('raphael') || nameLower.includes('trí huệ chi vương')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['raphael'];
  }
  if (nameLower.includes('beelzebuth') || nameLower.includes('bạo thực chi vương')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['beelzebuth'];
  }
  if (nameLower.includes('hắc viêm') || nameLower.includes('dark flame') || nameLower.includes('hỏa thuật')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['dark flame'];
  }
  if (nameLower.includes('thủy nhận') || nameLower.includes('water blade') || nameLower.includes('thủy lưu')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['water blade'];
  }
  if (nameLower.includes('thiết bì') || nameLower.includes('ngoại cốt') || nameLower.includes('body armor') || nameLower.includes('áo giáp')) {
    return CANON_SKILL_EVOLUTION_BRANCHES['body armor'];
  }

  // Otherwise generate dynamic procedural branches
  return generateProceduralSkillBranches(skill, factors);
}

/**
 * Checks whether a specific skill is eligible to evolve
 */
export function checkSkillEvolutionEligibility(
  character: CharacterStatus,
  skill: Skill
): {
  eligible: boolean;
  branches: EvolutionBranch[];
  reason: string;
} {
  const currentFactors = character.evolutionFactors || INITIAL_EVOLUTION_FACTORS;
  const level = skill.level || 1;
  const isMaxLevel = level >= 10;
  const isHighProficiency = (skill.proficiency || 0) >= 100 || level >= 8;

  // Eligibility triggers: Max level (Level 10), or high level (>= 8) with high turn count
  if (isMaxLevel || (isHighProficiency && character.turn >= 6)) {
    const branches = findSkillEvolutionBranches(skill, currentFactors);
    return {
      eligible: true,
      branches,
      reason: `Độ thuần thục kỹ năng [${skill.name}] đã đạt đến Cực Hạn (Cấp ${level}/10)! Giọng Nói Thế Giới thông báo điều kiện thăng hoa kỹ năng đã hội tụ đầy đủ.`
    };
  }

  return {
    eligible: false,
    branches: [],
    reason: `Kỹ năng [${skill.name}] cần đạt độ thuần thục cấp cao hơn (Cấp 8-10) để kích hoạt tiến hóa.`
  };
}

/**
 * Evaluates skill evolution: Dominant (auto-evolve) vs Balanced (choice modal)
 */
export function resolveSkillEvolution(
  character: CharacterStatus,
  skill: Skill,
  branches: EvolutionBranch[]
): {
  isDominant: boolean;
  dominantBranch?: EvolutionBranch;
  balancedBranches: EvolutionBranch[];
  reason: string;
  factorEvaluation: ReturnType<typeof evaluateFactorDominance>;
} {
  const factors = character.evolutionFactors || INITIAL_EVOLUTION_FACTORS;
  const evalResult = evaluateFactorDominance(factors);

  if (evalResult.isDominant) {
    // Look for branch matching dominant factor
    const match = branches.find(b => b.factorFocus === evalResult.dominantKey);
    if (match) {
      return {
        isDominant: true,
        dominantBranch: match,
        balancedBranches: [],
        reason: `Do thiên hướng hành động [${FACTOR_METADATA[evalResult.dominantKey].name}] áp đảo (+${evalResult.leadMargin}đ, chiếm ${evalResult.topFactor.percentage}%), kỹ năng [${skill.name}] tự động đột biến và thăng hoa thành [${match.name}]!`,
        factorEvaluation: evalResult
      };
    }
  }

  // Balanced: return all available viable branches
  const candidateKeys = evalResult.balancedCandidates;
  const filtered = branches.filter(b => 
    b.factorFocus === 'balanced' || candidateKeys.some(k => k === b.factorFocus)
  );

  const finalBranches = filtered.length >= 2 ? filtered : branches;

  return {
    isDominant: false,
    dominantBranch: undefined,
    balancedBranches: finalBranches,
    reason: `Các yếu tố hành động phát triển cân bằng đồng đều. Giọng Nói Thế Giới ban cho bạn quyền tự lựa chọn hướng tiến hóa cho kỹ năng [${skill.name}]!`,
    factorEvaluation: evalResult
  };
}

/**
 * Applies skill evolution to the character
 */
export function applySkillEvolutionBranch(
  character: CharacterStatus,
  branch: EvolutionBranch,
  oldSkillId?: string
): {
  updatedCharacter: CharacterStatus;
  worldVoiceAnnouncement: string;
  newSkill: Skill;
} {
  const oldSkill = (oldSkillId ? character.skills.find(s => s.id === oldSkillId) : undefined) || 
    character.skills.find(s => branch.targetSkillPattern && s.name.toLowerCase().includes(branch.targetSkillPattern.toLowerCase())) ||
    character.skills[0];
  const oldName = oldSkill?.name || 'Kỹ Năng';
  const resolvedOldSkillId = oldSkill?.id;

  const newSkillToInsert: Skill = branch.newSkill ? {
    ...branch.newSkill,
    id: `skill_${Date.now()}`,
    acquiredAt: character.turn,
    level: 1,
    exp: 0,
    maxExp: getSkillMaxExp(1, branch.newSkill.category)
  } : {
    id: `skill_${Date.now()}`,
    name: branch.name,
    japaneseName: branch.japaneseName,
    lordConcept: branch.lordConcept,
    category: branch.skillCategory || 'Ultimate',
    description: branch.description,
    acquiredAt: character.turn,
    level: 1,
    exp: 0,
    maxExp: getSkillMaxExp(1, branch.skillCategory || 'Ultimate')
  };

  // Replace old skill with new skill, and remove any absorbed skills
  let updatedSkills = character.skills.map(s => s.id === resolvedOldSkillId ? newSkillToInsert : s);

  if (branch.absorbedSkillNames && branch.absorbedSkillNames.length > 0) {
    updatedSkills = updatedSkills.filter(s => 
      !branch.absorbedSkillNames?.some(absorbed => s.name.toLowerCase().includes(absorbed.toLowerCase()))
    );
  }

  const updatedCharacter: CharacterStatus = {
    ...character,
    maxHp: character.maxHp + branch.statBonuses.maxHp,
    hp: character.hp + branch.statBonuses.maxHp,
    maxMp: character.maxMp + branch.statBonuses.maxMp,
    mp: character.mp + branch.statBonuses.maxMp,
    skills: updatedSkills,
    evolutionHistory: [
      ...(character.evolutionHistory || []),
      `Tiến Hóa Kỹ Năng: [${oldName}] ➔ [${branch.name}] (${branch.factorFocusTitle})`
    ]
  };

  const worldVoiceAnnouncement = `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
[GIỌNG NÓI THẾ GIỚI]: THÔNG BÁO THĂNG HOA TIẾN HÓA KỸ NĂNG...
Đã xác nhận... Kỹ năng [${oldName}] đã tiến hóa thành công!
→ THỨC TỈNH: [${branch.name}] (${branch.skillCategory || 'Ultimate'})
[Thuộc Tính Tăng Thêm]: +${branch.statBonuses.maxHp} HP | +${branch.statBonuses.maxMp} MP
[Bản Chất]: ${branch.lore || branch.description}
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`;

  return {
    updatedCharacter,
    worldVoiceAnnouncement,
    newSkill: newSkillToInsert
  };
}
