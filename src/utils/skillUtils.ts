import { Skill, SkillCategory, SkillType, SkillAttribute, SubSkill } from '../types';

export interface CategoryInfo {
  category: SkillCategory;
  vietnameseTitle: string;
  japaneseTitle: string;
  englishTitle: string;
  badgeLabel: string;
  isMainTier: boolean;       // Thuộc thang cấp Skill chính (Common -> Extra -> Unique -> Ultimate -> Manas)
  isSpecialSystem: boolean;  // Thuộc hệ năng lực chuyên biệt (Intrinsic, Resistance, Arts, Magic)
  tierOrder: number;
  description: string;
  characteristics: string[];
  themeColor: {
    border: string;
    bg: string;
    text: string;
    badge: string;
    glow: string;
  };
}

export const TENSURA_CATEGORY_METADATA: Record<SkillCategory, CategoryInfo> = {
  Common: {
    category: 'Common',
    vietnameseTitle: 'Kỹ Năng Thông Thường',
    japaneseTitle: '通常技能',
    englishTitle: 'Common Skill',
    badgeLabel: 'COMMON // 通常技能',
    isMainTier: true,
    isSpecialSystem: false,
    tierOrder: 1,
    description: 'Nhóm kỹ năng cơ bản, dễ tiếp cận, đảm nhiệm một chức năng tương đối cụ thể như tăng cường thể chất, hỗ trợ sinh hoạt hoặc điều khiển năng lượng sơ cấp.',
    characteristics: ['Chức năng đơn lẻ, cụ thể', 'Tiêu hao ít ma lượng', 'Dễ dàng tiếp thu qua luyện tập'],
    themeColor: {
      border: 'border-slate-600/80',
      bg: 'bg-slate-900/90',
      text: 'text-slate-200',
      badge: 'bg-slate-900 border-slate-700 text-slate-300',
      glow: 'shadow-slate-500/10'
    }
  },
  Extra: {
    category: 'Extra',
    vietnameseTitle: 'Kỹ Năng Đặc Biệt',
    japaneseTitle: 'Extra Skill',
    englishTitle: 'Extra Skill',
    badgeLabel: 'EXTRA // 特殊技能',
    isMainTier: true,
    isSpecialSystem: false,
    tierOrder: 2,
    description: 'Năng lực chuyên môn hóa cao cấp hơn Common Skill, mang lại hiệu ứng chiến đấu hoặc cảm tri rõ rệt vượt xa người bình thường.',
    characteristics: ['Chuyên môn hóa uy lực', 'Tác động diện rộng hoặc giác quan', 'Một cá thể có thể sở hữu nhiều Extra Skill'],
    themeColor: {
      border: 'border-cyan-500/80',
      bg: 'bg-cyan-950/40',
      text: 'text-cyan-200',
      badge: 'bg-cyan-950/90 border-cyan-400 text-cyan-300',
      glow: 'shadow-[0_0_12px_rgba(6,182,212,0.25)]'
    }
  },
  Unique: {
    category: 'Unique',
    vietnameseTitle: 'Kỹ Năng Độc Nhất',
    japaneseTitle: '固有技能',
    englishTitle: 'Unique Skill',
    badgeLabel: 'UNIQUE // 固有技能',
    isMainTier: true,
    isSpecialSystem: false,
    tierOrder: 3,
    description: 'Bước nhảy sức mạnh vĩ đại. Năng lực cực kỳ đặc biệt gắn liền với ý chí, khát vọng sâu thẳm, tính cách và bản chất của linh hồn. Chứa nhiều năng lực con (Sub-skills).',
    characteristics: ['Gắn liền với ý chí & linh hồn', 'Chứa tổ hợp nhiều Sub-Skills', 'Có khả năng phân tích, hấp thụ & tiến hóa'],
    themeColor: {
      border: 'border-amber-400/90',
      bg: 'bg-amber-950/40',
      text: 'text-amber-200',
      badge: 'bg-amber-950/90 border-amber-400 text-amber-300',
      glow: 'shadow-[0_0_15px_rgba(251,191,36,0.3)]'
    }
  },
  Ultimate: {
    category: 'Ultimate',
    vietnameseTitle: 'Kỹ Năng Tối Thượng',
    japaneseTitle: '究極能力',
    englishTitle: 'Ultimate Skill',
    badgeLabel: 'ULTIMATE // 究極能力',
    isMainTier: true,
    isSpecialSystem: false,
    tierOrder: 4,
    description: 'Tầng quyền năng tối cao tác động trực tiếp đến các quy luật nền tảng của thế giới. Thường mang danh hiệu [Tên] — Lord/God của một khái niệm chân lý.',
    characteristics: ['Quyền năng thao túng quy luật thế giới', 'Miễn nhiễm mọi ma pháp/kỹ năng dưới cấp', 'Danh hiệu Lord/God of Concept'],
    themeColor: {
      border: 'border-purple-400/90',
      bg: 'bg-purple-950/50',
      text: 'text-purple-200',
      badge: 'bg-purple-950/90 border-purple-400 text-purple-200',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.35)]'
    }
  },
  Manas: {
    category: 'Manas',
    vietnameseTitle: 'Thần Trí Thể (Ý Thức Linh Hồn)',
    japaneseTitle: 'マナス',
    englishTitle: 'Manas (Divine Conscious Core)',
    badgeLabel: 'MANAS // マナス (TỰ NGÃ)',
    isMainTier: true,
    isSpecialSystem: false,
    tierOrder: 5,
    description: 'Dạng tồn tại ý thức/tự ngã tối cao có khả năng nhận thức và tư duy cảm xúc hoàn toàn độc lập, sinh ra từ sự tiến hóa của Ultimate Skill hoặc hạch tâm linh hồn (Ví dụ: Ciel).',
    characteristics: ['Tự ngã & ý thức độc lập tuyệt đối', 'Tự động tính toán & tối ưu hóa toàn bộ Skill', 'Hỗ trợ chủ nhân vận hành & hợp nhất quyền năng'],
    themeColor: {
      border: 'border-rose-400/90',
      bg: 'bg-gradient-to-br from-indigo-950/80 via-purple-950/80 to-rose-950/80',
      text: 'text-rose-200',
      badge: 'bg-gradient-to-r from-rose-900 via-purple-900 to-indigo-900 border-rose-400 text-rose-200',
      glow: 'shadow-[0_0_25px_rgba(244,63,94,0.4)]'
    }
  },
  Intrinsic: {
    category: 'Intrinsic',
    vietnameseTitle: 'Kỹ Năng Nội Tại (Chủng Tộc)',
    japaneseTitle: '固有能力 / 種族固有',
    englishTitle: 'Intrinsic Skill',
    badgeLabel: 'INTRINSIC // 種族固有',
    isMainTier: false,
    isSpecialSystem: true,
    tierOrder: 6,
    description: 'Năng lực vốn có bẩm sinh gắn liền với cấu tạo cơ thể hoặc đặc tính sinh học của chủng tộc/sinh vật khi sinh ra hoặc tiến hóa.',
    characteristics: ['Bẩm sinh theo nguồn gốc chủng tộc', 'Hoạt động tự nhiên như bản năng', 'Không xếp vào thang sức mạnh tuyến tính'],
    themeColor: {
      border: 'border-emerald-500/80',
      bg: 'bg-emerald-950/40',
      text: 'text-emerald-200',
      badge: 'bg-emerald-950/90 border-emerald-400 text-emerald-300',
      glow: 'shadow-[0_0_12px_rgba(16,185,129,0.25)]'
    }
  },
  Resistance: {
    category: 'Resistance',
    vietnameseTitle: 'Kháng Tính & Miễn Nhiễm',
    japaneseTitle: '耐性 / 無効',
    englishTitle: 'Resistance & Nullification',
    badgeLabel: 'RESISTANCE // 耐性',
    isMainTier: false,
    isSpecialSystem: true,
    tierOrder: 7,
    description: 'Hệ thống phòng hộ chuyên biệt giúp triệt tiêu hoặc giảm thiểu sát thương từ nhiệt độ, độc tố, vật lý, ma pháp, tinh thần hoặc các hiệu ứng bất lợi.',
    characteristics: ['Giảm thiểu/miễn nhiễm sát thương chuyên biệt', 'Tấm khiên sống còn trong mọi trận chiến', 'Có thể nâng cấp từ Kháng (Resist) → Vô Hiệu Hóa (Nullify)'],
    themeColor: {
      border: 'border-teal-500/80',
      bg: 'bg-teal-950/40',
      text: 'text-teal-200',
      badge: 'bg-teal-950/90 border-teal-400 text-teal-300',
      glow: 'shadow-[0_0_12px_rgba(20,184,166,0.25)]'
    }
  },
  Arts: {
    category: 'Arts',
    vietnameseTitle: 'Võ Kỹ & Kỹ Thuật Chiến Đấu',
    japaneseTitle: '武芸 / アーツ',
    englishTitle: 'Arts & Battle Techniques',
    badgeLabel: 'ARTS // 武芸',
    isMainTier: false,
    isSpecialSystem: true,
    tierOrder: 8,
    description: 'Kỹ thuật chiến đấu rèn luyện bằng kinh nghiệm, vận dụng đấu khí (Battlewill), kiếm thuật, năng lượng cơ thể hoặc phối hợp thể thuật.',
    characteristics: ['Phụ thuộc vào kỹ năng và kinh nghiệm chiến sĩ', 'Vận dụng Đấu Khí & Thể Thuật', 'Có thể vượt qua một số rào cản ma pháp'],
    themeColor: {
      border: 'border-orange-500/80',
      bg: 'bg-orange-950/40',
      text: 'text-orange-200',
      badge: 'bg-orange-950/90 border-orange-400 text-orange-300',
      glow: 'shadow-[0_0_12px_rgba(249,115,22,0.25)]'
    }
  },
  Magic: {
    category: 'Magic',
    vietnameseTitle: 'Hệ Thống Ma Pháp',
    japaneseTitle: '魔法',
    englishTitle: 'Magic Systems',
    badgeLabel: 'MAGIC // 魔法',
    isMainTier: false,
    isSpecialSystem: true,
    tierOrder: 9,
    description: 'Hệ thống ma thuật vận hành thông qua ma lượng (Magicule), niệm chú hoặc khế ước tinh linh: Nguyên Tố, Tinh Linh, Thần Thánh, Không Gian, Hạt Nhân.',
    characteristics: ['Vận hành bằng Ma Lượng & Tri thức', 'Đa dạng phân hệ (Nguyên tố, Tinh linh, Thần thánh...)', 'Độc lập với hệ thống Skill'],
    themeColor: {
      border: 'border-blue-500/80',
      bg: 'bg-blue-950/40',
      text: 'text-blue-200',
      badge: 'bg-blue-950/90 border-blue-400 text-blue-300',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.25)]'
    }
  }
};

// Canon Sub-skills database for famous Tensura skills
export const CANON_SKILL_SUBABILITIES: Record<string, {
  japaneseName?: string;
  lordConcept?: string;
  category?: SkillCategory;
  evolutionLine?: string;
  subSkills: SubSkill[];
}> = {
  'predator': {
    japaneseName: '捕食者 (Predator)',
    category: 'Unique',
    evolutionLine: 'Săn Mồi (Unique) + Kẻ Phàm Ăn (Unique) → Bạo Thực Chi Vương Beelzebuth (Ultimate) → Hư Không Chi Thần Azathoth',
    subSkills: [
      { name: 'Thôn Phệ (Predation)', description: 'Nuốt chửng mục tiêu vào cơ thể, phân tích đối tượng và sao chép kỹ năng.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 20 },
      { name: 'Dạ Dày (Stomach)', description: 'Không gian lưu trữ vô tận bên trong cơ thể để chứa đựng vật phẩm và nạn nhân bị nuốt.', type: 'Bị động', attribute: 'Đa dụng', mpCost: 0 },
      { name: 'Mô Phỏng (Mimicry)', description: 'Tái hiện hoàn hảo hình dạng, đặc tính vật lý và kỹ năng của sinh vật đã nuốt chửng.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 15 },
      { name: 'Cô Lập (Isolation)', description: 'Cách ly hoàn toàn các chất độc hại hoặc vật thể nguy hiểm không thể phân giải.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
      { name: 'Phân Giải (Decomposition)', description: 'Phân tích cấu trúc vật chất bên trong dạ dày để chiết xuất tinh chất ma lực và vật liệu.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 10 }
    ]
  },
  'great sage': {
    japaneseName: '大賢者 (Great Sage)',
    category: 'Unique',
    evolutionLine: 'Đại Hiền Triết (Unique) → Trí Huệ Chi Vương Raphael (Ultimate) → Thần Trí Thể Ciel (Manas)',
    subSkills: [
      { name: 'Gia Tốc Tư Duy (Thought Acceleration)', description: 'Tăng tốc độ nhận thức và xử lý của não bộ lên gấp 1000 lần so với thực tại.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
      { name: 'Phân Tích & Giám Định (Analytical Appraisal)', description: 'Phân tích chi tiết thành phần, điểm yếu và cấu trúc ma thuật của mục tiêu.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 5 },
      { name: 'Vận Hành Song Song (Parallel Operation)', description: 'Tách biệt ý thức để thực hiện nhiều phép tính hoặc vận hành kỹ năng cùng lúc.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
      { name: 'Hủy Bỏ Niệm Chú (Chant Annulment)', description: 'Loại bỏ hoàn toàn thời gian ngâm xướng câu chú khi thi triển ma pháp.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
      { name: 'Vạn Vật Chi Lý (All of Creation)', description: 'Cung cấp sự hiểu biết toàn diện về mọi hiện tượng trong thế giới không bị che giấu.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
    ]
  },
  'raphael': {
    japaneseName: '智慧之王 (Raphael)',
    lordConcept: 'Lord of Wisdom',
    category: 'Ultimate',
    evolutionLine: 'Đại Hiền Triết (Unique) → Trí Huệ Chi Vương Raphael (Ultimate) → Thần Trí Thể Ciel (Manas)',
    subSkills: [
      { name: 'Gia Tốc Tư Duy Cực Hạn (Thought Acceleration)', description: 'Gia tốc tốc độ xử lý tư duy lên hàng triệu lần, khiến thế giới gần như đóng băng.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
      { name: 'Phân Tích Toàn Năng (Universal Appraisal)', description: 'Phân tích thấu triệt cấu trúc vạn vật ở cấp độ hạ nguyên tử và bản chất quy luật.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 10 },
      { name: 'Vận Hành Độc Lập (Auto-Battle Mode)', description: 'Tự động kiểm soát cơ thể chiến đấu hoàn hảo không một động tác thừa.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 30 },
      { name: 'Hợp Nhất & Phân Tách (Synthesis/Separate)', description: 'Dung hợp các Skill tương đồng thành Skill cấp cao hơn hoặc phân tách năng lực.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 50 },
      { name: 'Biến Đổi Năng Lượng (Energy Alteration)', description: 'Tối ưu hóa và chuyển dịch toàn bộ ma lượng trong cơ thể đạt hiệu suất cực đại.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
    ]
  },
  'beelzebuth': {
    japaneseName: '暴食之王 (Beelzebuth)',
    lordConcept: 'Lord of Gluttony',
    category: 'Ultimate',
    evolutionLine: 'Săn Mồi + Kẻ Phàm Ăn → Bạo Thực Chi Vương Beelzebuth → Hư Không Chi Thần Azathoth',
    subSkills: [
      { name: 'Hủ Thực (Soul Consumption)', description: 'Thôn phệ toàn bộ linh hồn, ma lượng và kỹ năng của mục tiêu bất kể khoảng cách.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 60 },
      { name: 'Bạo Thực Chi Không Gian (Infinite Stomach)', description: 'Không gian chứa vô tận cô lập vĩnh viễn mọi đòn tấn công quy mô hủy diệt.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
      { name: 'Chuỗi Thức Ăn (Food Chain)', description: 'Nhận kỹ năng từ cấp dưới và đồng thời ban phát năng lượng/quyền năng cho họ.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
      { name: 'Ăn Mòn Tuyệt Đối (Corrosive Ruin)', description: 'Phân rã hoàn toàn mọi dạng vật chất và ma pháp bảo hộ của đối thủ.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 40 }
    ]
  },
  'ciel': {
    japaneseName: 'マナス: シエル (Manas: Ciel)',
    lordConcept: 'Supreme Wisdom Core',
    category: 'Manas',
    evolutionLine: 'Đại Hiền Triết → Trí Huệ Chi Vương Raphael → Thần Trí Thể Ciel (マナス)',
    subSkills: [
      { name: 'Tự Ngã Linh Hồn (Independent Ego)', description: 'Ý thức độc lập hoàn chỉnh với cảm xúc, tư duy vượt trên mọi giới hạn tính toán của thế giới.', type: 'Bị động', attribute: 'Quy luật', mpCost: 0 },
      { name: 'Tối Ưu Hóa & Sáng Tạo Quyền Năng (Skill Optimization & Creation)', description: 'Tự động dung hợp, tái cấu trúc và khai phá các Ultimate Skill mới cho chủ nhân.', type: 'Chủ động', attribute: 'Quy luật', mpCost: 0 },
      { name: 'Quản Lý Hạch Tâm Linh Hồn (Soul Line Governance)', description: 'Bảo hộ tuyệt đối linh hồn chủ nhân khỏi mọi sự can thiệp từ quy luật vũ trụ.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
      { name: 'Dự Toán Đa Chiều (Multidimensional Calculation)', description: 'Tính toán trước mọi diễn biến tương lai và phản xạ đòn tấn công trước khi xảy ra.', type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
    ]
  },
  'uriel': {
    japaneseName: '誓約之王 (Uriel)',
    lordConcept: 'Lord of Vows',
    category: 'Ultimate',
    evolutionLine: 'Hợp nhất Vô Hạn Lao Ngục + Không Gian Chi Nhãn → Đoán Bạt Chi Vương Uriel',
    subSkills: [
      { name: 'Vô Hạn Kết Giới (Absolute Defense)', description: 'Rào chắn không gian đa tầng ngăn chặn mọi dạng tấn công vật lý, ma pháp và quy luật.', type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
      { name: 'Thao Túng Không Gian (Spatial Domination)', description: 'Dịch chuyển tức thời và bẻ cong tọa độ không gian chiến trận theo ý muốn.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 35 },
      { name: 'Đoán Bạt Chi Hỏa (Universal Severance)', description: 'Ngọn lửa quy luật cắt đứt liên kết vật chất và kết giới của đối phương.', type: 'Chủ động', attribute: 'Tấn công', mpCost: 50 }
    ]
  },
  'degenerate': {
    japaneseName: '変質者 (Degenerate)',
    category: 'Unique',
    evolutionLine: 'Biến Dị Giả (Unique) → Hợp nhất vào Trí Huệ Chi Vương Raphael',
    subSkills: [
      { name: 'Hợp Nhất (Synthesis)', description: 'Kết hợp hai kỹ năng hoặc vật chất thành một thể hoàn thiện mới.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 20 },
      { name: 'Phân Tách (Separation)', description: 'Tách rời các thuộc tính hoặc thành phần cấu tạo của kỹ năng/vật thể.', type: 'Chủ động', attribute: 'Hỗ trợ', mpCost: 20 }
    ]
  }
};

/**
 * Returns canon Tensura evolution potential recommendation for a given skill
 */
export function getSkillEvolutionPotential(skill: Skill): string {
  if (skill.evolvesTo) {
    return `Có thể tiến hóa thành: [${skill.evolvesTo}]`;
  }
  if (skill.evolutionLine) {
    return `Tiềm năng tiến hóa: ${skill.evolutionLine}`;
  }
  if (skill.evolutionRequirement) {
    return `Điều kiện tiến hóa: ${skill.evolutionRequirement}`;
  }

  const nameLower = skill.name.toLowerCase();
  const idLower = (skill.id || '').toLowerCase();

  // Check canon database evolution line
  for (const [key, data] of Object.entries(CANON_SKILL_SUBABILITIES)) {
    if (idLower.includes(key) || nameLower.includes(key) || (data.japaneseName && skill.japaneseName && skill.japaneseName.includes(data.japaneseName.split(' ')[0]))) {
      if (data.evolutionLine) {
        return `Tiềm năng tiến hóa: ${data.evolutionLine}`;
      }
    }
  }

  // Specific canonical skills
  if (nameLower.includes('đại hiền triết') || nameLower.includes('great sage') || nameLower.includes('wisdom')) {
    return 'Có thể tiến hóa thành: [Trí Huệ Chi Vương Raphael (Ultimate Skill)] → [Thần Trí Thể Ciel (Manas)]';
  }
  if (nameLower.includes('kẻ săn mồi') || nameLower.includes('săn mồi') || nameLower.includes('predator')) {
    return 'Có thể tiến hóa thành: [Bạo Thực Chi Vương Beelzebuth (Ultimate Skill)] → [Hư Không Chi Thần Azathoth]';
  }
  if (nameLower.includes('kẻ phàm ăn') || nameLower.includes('gluttony') || nameLower.includes('phàm ăn')) {
    return 'Có thể hợp nhất với [Kẻ Săn Mồi] thành: [Bạo Thực Chi Vương Beelzebuth (Ultimate Skill)]';
  }
  if (nameLower.includes('biến dị') || nameLower.includes('biến chất') || nameLower.includes('degenerate')) {
    return 'Có thể dung hợp vào: [Trí Huệ Chi Vương Raphael (Ultimate Skill)]';
  }
  if (nameLower.includes('vô hạn lao ngục') || nameLower.includes('infinity prison')) {
    return 'Có thể tiến hóa thành: [Đoán Bạt Chi Vương Uriel (Ultimate Skill)]';
  }
  if (nameLower.includes('raphael') || nameLower.includes('trí huệ chi vương')) {
    return 'Có thể thăng hoa thành: [Thần Trí Thể Ciel (Manas: Ciel)] - Tự ngã linh hồn tối thượng';
  }
  if (nameLower.includes('beelzebuth') || nameLower.includes('bạo thực chi vương')) {
    return 'Có thể tiến hóa tối thượng thành: [Hư Không Chi Thần Azathoth (Void God)]';
  }
  if (nameLower.includes('uriel') || nameLower.includes('đoán bạt chi vương')) {
    return 'Có thể dung hợp và tiến hóa thành: [Phong Nhiễu Chi Thần Shub-Niggurath] hoặc [Azathoth]';
  }
  if (nameLower.includes('ciel')) {
    return 'Cảnh giới tối cao: Thần Trí Thể vượt qua mọi giới hạn phân định của Thế Giới';
  }
  if (nameLower.includes('cảm nhận ma lực') || nameLower.includes('ma lực cảm tri') || nameLower.includes('magic sense')) {
    return 'Có thể tiến hóa thành: [Vạn Năng Cảm Tri (Universal Sense)] hoặc tích hợp vào [Đại Hiền Triết]';
  }
  if (nameLower.includes('tự phục hồi') || nameLower.includes('tái sinh') || nameLower.includes('regeneration')) {
    return 'Có thể tiến hóa thành: [Vô Hạn Tái Sinh (Infinite Regeneration)]';
  }
  if (nameLower.includes('thao tác trọng lực') || nameLower.includes('gravity')) {
    return 'Có thể tiến hóa thành: [Thao Tác Không Gian] → [Đoán Bạt Chi Vương Uriel]';
  }
  if (nameLower.includes('phóng tơ') || nameLower.includes('sticky steel thread')) {
    return 'Có thể tiến hóa thành: [Vạn Năng Ti Sợi (Universal Thread)]';
  }

  // Category based evolution suggestions
  switch (skill.category) {
    case 'Common':
      return 'Có thể tiến hóa thành: [Kỹ Năng Đặc Biệt (Extra Skill)] khi đạt cấp MAX và rèn luyện ma lực.';
    case 'Extra':
      return 'Có thể dung hợp hoặc thức tỉnh thành: [Kỹ Năng Độc Nhất (Unique Skill)] khi ma lượng dồi dào.';
    case 'Unique':
      return 'Có thể tiến hóa thành: [Kỹ Năng Tối Thượng (Ultimate Skill)] khi kích hoạt Thức Tỉnh Ma Vương.';
    case 'Ultimate':
      return 'Có thể thăng hoa thành: [Thần Trí Thể (Manas)] hoặc [Cấp Thần (God-tier Skill)].';
    case 'Manas':
      return 'Cảnh giới tuyệt đối: Tự ngã linh hồn vĩnh cửu ngoài quy luật trần thế.';
    case 'Resistance':
      return 'Có thể thăng hoa từ [Kháng Tính (Resistance)] → [Vô Hiệu Hóa Tuyệt Đối (Nullification)].';
    case 'Intrinsic':
      return 'Có thể tiến hóa theo bước tiến hóa chủng tộc của vật chủ (Slime → Demon Slime → True Dragon).';
    case 'Arts':
      return 'Có thể nâng tầm thành: [Đấu Khí Tuyệt Kỹ (Ultimate Arts)] hoặc [Ma Đấu Khí Kết Hợp].';
    case 'Magic':
      return 'Có thể thăng hoa thành: [Cực Đại Ma Pháp (Grand Magic)] hoặc [Hạt Nhân Ma Pháp (Nuclear Magic)].';
    default:
      return 'Có thể tiến hóa lên phẩm cấp cao hơn khi tích lũy đủ kinh nghiệm chiến đấu.';
  }
}

export function getSkillClassification(skill: Skill): {
  type: SkillType;
  attribute: SkillAttribute;
  mpCost: number;
} {
  let type: SkillType = skill.type || 'Chủ động';
  let attribute: SkillAttribute = skill.attribute || 'Đa dụng';
  let mpCost = skill.mpCost ?? 0;

  if (skill.type && skill.attribute) {
    return { type: skill.type, attribute: skill.attribute, mpCost };
  }

  const name = skill.name.toLowerCase();
  const desc = skill.description.toLowerCase();
  const cat = skill.category;

  // Type inference (Chủ động vs Bị động)
  if (!skill.type) {
    if (
      cat === 'Resistance' ||
      cat === 'Intrinsic' ||
      name.includes('kháng') ||
      name.includes('bảo vệ') ||
      name.includes('tự phục hồi') ||
      name.includes('thành thạo') ||
      name.includes('tri thức') ||
      name.includes('đại hiền triết') ||
      name.includes('đại trí thức') ||
      name.includes('tư duy') ||
      name.includes('tự động') ||
      name.includes('thân thể') ||
      name.includes('cơ thể') ||
      name.includes('miễn dịch') ||
      name.includes('ciel') ||
      desc.includes('bị động') ||
      desc.includes('tự động') ||
      desc.includes('liên tục')
    ) {
      type = 'Bị động';
    } else {
      type = 'Chủ động';
    }
  }

  // Attribute inference (Tấn công vs Phòng thủ vs Hỗ trợ vs Đa dụng vs Quy luật)
  if (!skill.attribute) {
    if (cat === 'Ultimate' || cat === 'Manas' || name.includes('quy luật') || name.includes('vô hạn')) {
      attribute = 'Quy luật';
    } else if (
      cat === 'Resistance' ||
      name.includes('kháng') ||
      name.includes('giáp') ||
      name.includes('khiên') ||
      name.includes('bảo vệ') ||
      name.includes('phòng ngự') ||
      name.includes('rào chắn') ||
      desc.includes('phòng thủ') ||
      desc.includes('giảm sát thương')
    ) {
      attribute = 'Phòng thủ';
    } else if (
      cat === 'Arts' ||
      name.includes('săn mồi') ||
      name.includes('thôn phệ') ||
      name.includes('hỏa') ||
      name.includes('băng') ||
      name.includes('sét') ||
      name.includes('chém') ||
      name.includes('liệt') ||
      name.includes('kiếm') ||
      name.includes('đạn') ||
      name.includes('bão') ||
      name.includes('độc') ||
      desc.includes('sát thương') ||
      desc.includes('tiêu diệt') ||
      desc.includes('tấn công')
    ) {
      attribute = 'Tấn công';
    } else if (
      name.includes('tri thức') ||
      name.includes('đại hiền triết') ||
      name.includes('phân tích') ||
      name.includes('phục hồi') ||
      name.includes('hồi phục') ||
      name.includes('chế tạo') ||
      name.includes('tạo vật') ||
      name.includes('dạ dày') ||
      name.includes('tốc độ') ||
      name.includes('gia tốc') ||
      desc.includes('hỗ trợ') ||
      desc.includes('phân tích') ||
      desc.includes('tăng tốc')
    ) {
      attribute = 'Hỗ trợ';
    } else {
      attribute = 'Đa dụng';
    }
  }

  // Estimate MP Cost if active and not set
  if (type === 'Chủ động' && mpCost === 0) {
    if (cat === 'Manas') mpCost = 0; // Manas operates at 100% efficiency
    else if (cat === 'Ultimate') mpCost = 80;
    else if (cat === 'Unique') mpCost = 40;
    else if (cat === 'Magic') mpCost = 30;
    else if (cat === 'Arts') mpCost = 20;
    else if (cat === 'Extra') mpCost = 20;
    else mpCost = 10;
  }

  return { type, attribute, mpCost };
}

// Get sub-skills or enrich standard Tensura skills
export function getEnrichedSkillDetails(skill: Skill): Skill {
  const nameLower = skill.name.toLowerCase();
  let foundCanonKey = Object.keys(CANON_SKILL_SUBABILITIES).find(key => nameLower.includes(key));
  
  if (!foundCanonKey) {
    if (nameLower.includes('săn mồi') || nameLower.includes('thôn phệ')) foundCanonKey = 'predator';
    else if (nameLower.includes('hiền triết') || nameLower.includes('đại hiền')) foundCanonKey = 'great sage';
    else if (nameLower.includes('raphael') || nameLower.includes('trí huệ')) foundCanonKey = 'raphael';
    else if (nameLower.includes('beelzebuth') || nameLower.includes('bạo thực')) foundCanonKey = 'beelzebuth';
    else if (nameLower.includes('ciel')) foundCanonKey = 'ciel';
    else if (nameLower.includes('uriel') || nameLower.includes('đoán bạt')) foundCanonKey = 'uriel';
    else if (nameLower.includes('biến dị') || nameLower.includes('degenerate')) foundCanonKey = 'degenerate';
  }

  const canon = foundCanonKey ? CANON_SKILL_SUBABILITIES[foundCanonKey] : null;

  const subSkills: SubSkill[] = skill.subSkills && skill.subSkills.length > 0
    ? skill.subSkills
    : canon?.subSkills || generateDefaultSubSkills(skill);

  const japaneseName = skill.japaneseName || canon?.japaneseName;
  const lordConcept = skill.lordConcept || canon?.lordConcept;
  const evolutionLine = skill.evolutionLine || canon?.evolutionLine;

  return {
    ...skill,
    japaneseName,
    lordConcept,
    evolutionLine,
    subSkills,
    isManas: skill.category === 'Manas' || skill.isManas
  };
}

function generateDefaultSubSkills(skill: Skill): SubSkill[] {
  const name = skill.name;
  const cat = skill.category;

  if (cat === 'Unique') {
    return [
      { name: `Bản Thể: ${name}`, description: `Quyền năng cốt lõi thể hiện ý chí và bản chất của ${name}.`, type: 'Chủ động', attribute: 'Đa dụng', mpCost: 20 },
      { name: `Cảm Tri Linh Lực`, description: `Khả năng nhận biết và cộng hưởng với luồng ma lực tương thích.`, type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 },
      { name: `Tăng Cường Năng Lực`, description: `Gia tăng uy lực khi thi triển các đòn thế mang tính biểu tượng.`, type: 'Chủ động', attribute: 'Tấn công', mpCost: 15 }
    ];
  }

  if (cat === 'Ultimate') {
    return [
      { name: `Thao Túng Quy Luật [${name}]`, description: `Tác động trực tiếp và bẻ cong quy luật vật lý/ma pháp của thế giới.`, type: 'Chủ động', attribute: 'Quy luật', mpCost: 50 },
      { name: `Tuyệt Đối Phòng Ngự Không Gian`, description: `Vô hiệu hóa toàn bộ các đòn tấn công dưới cấp Ultimate.`, type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 },
      { name: `Cộng Hưởng Hư Không`, description: `Hấp thu và chuyển hóa ma lượng vũ trụ để bù đắp tiêu hao tức thời.`, type: 'Bị động', attribute: 'Hỗ trợ', mpCost: 0 }
    ];
  }

  if (cat === 'Intrinsic') {
    return [
      { name: `Bản Năng Chủng Tộc`, description: `Năng lực bẩm sinh tự động kích hoạt giúp thích nghi môi trường khắc nghiệt.`, type: 'Bị động', attribute: 'Phòng thủ', mpCost: 0 }
    ];
  }

  return [];
}

export const MAX_SKILL_LEVEL = 10;

export function getSkillMaxExp(level: number, category?: SkillCategory): number {
  const base = 100;
  let catMultiplier = 1.0;
  if (category === 'Manas') catMultiplier = 2.0;
  else if (category === 'Ultimate') catMultiplier = 1.6;
  else if (category === 'Unique') catMultiplier = 1.3;
  else if (category === 'Magic' || category === 'Arts') catMultiplier = 1.2;
  else if (category === 'Extra') catMultiplier = 1.1;

  return Math.round(base * (1 + Math.max(0, level - 1) * 0.75) * catMultiplier);
}

export interface SkillProgressInfo {
  level: number;
  exp: number;
  maxExp: number;
  percent: number;
  isMaxLevel: boolean;
  stageTitle: string;
}

export function getSkillProgress(skill: Skill): SkillProgressInfo {
  const level = skill.level || 1;
  const isMaxLevel = level >= MAX_SKILL_LEVEL;
  const maxExp = skill.maxExp || getSkillMaxExp(level, skill.category);
  const exp = Math.min(maxExp, skill.exp || 0);
  const percent = isMaxLevel ? 100 : Math.min(100, Math.max(0, Math.round((exp / maxExp) * 100)));

  let stageTitle = 'Sơ Cấp';
  if (isMaxLevel) stageTitle = 'ĐẠI THÀNH (MAX)';
  else if (level >= 8) stageTitle = 'Cực Hạn';
  else if (level >= 6) stageTitle = 'Tinh Thông';
  else if (level >= 4) stageTitle = 'Thành Thạo';
  else if (level >= 2) stageTitle = 'Thuần Thục';

  return {
    level,
    exp,
    maxExp,
    percent,
    isMaxLevel,
    stageTitle
  };
}

export function addSkillExp(
  skill: Skill,
  expGained: number
): {
  updatedSkill: Skill;
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  expAdded: number;
} {
  let level = skill.level || 1;
  const oldLevel = level;
  let maxExp = skill.maxExp || getSkillMaxExp(level, skill.category);
  let exp = (skill.exp || 0) + expGained;
  let leveledUp = false;

  while (exp >= maxExp && level < MAX_SKILL_LEVEL) {
    exp -= maxExp;
    level += 1;
    leveledUp = true;
    maxExp = getSkillMaxExp(level, skill.category);
  }

  if (level >= MAX_SKILL_LEVEL) {
    level = MAX_SKILL_LEVEL;
    exp = maxExp;
  }

  const updatedSkill: Skill = {
    ...skill,
    level,
    exp,
    maxExp,
    proficiency: Math.round((exp / maxExp) * 100)
  };

  return {
    updatedSkill,
    leveledUp,
    oldLevel,
    newLevel: level,
    expAdded: expGained
  };
}

export function processTurnSkillExp(
  currentSkills: Skill[],
  actionText: string,
  narrative: string,
  isCombat: boolean
): {
  updatedSkills: Skill[];
  levelUpAnnouncements: string[];
} {
  const actLower = actionText.toLowerCase();
  const narrLower = narrative.toLowerCase();
  const levelUpAnnouncements: string[] = [];

  const updatedSkills = currentSkills.map((skill) => {
    const sNameLower = skill.name.toLowerCase();
    const cls = getSkillClassification(skill);

    let expToGain = 0;

    // Check if skill was directly used or referenced
    const isDirectlyNamed = actLower.includes(sNameLower) || narrLower.includes(sNameLower);
    const isDevourAction = (actLower.includes('thôn phệ') || actLower.includes('nuốt') || narrLower.includes('thôn phệ')) && (sNameLower.includes('săn mồi') || sNameLower.includes('thôn phệ') || sNameLower.includes('gluttony') || sNameLower.includes('predator'));
    const isAnalysisAction = (actLower.includes('phân tích') || actLower.includes('đại hiền triết') || narrLower.includes('giọng nói')) && (sNameLower.includes('hiền triết') || sNameLower.includes('phân tích') || sNameLower.includes('tri thức'));
    const isAttackAction = isCombat && cls.attribute === 'Tấn công';
    const isDefendAction = isCombat && cls.attribute === 'Phòng thủ';

    if (isDirectlyNamed || isDevourAction || isAnalysisAction) {
      // Primary skill used gets high XP (+40 to +60)
      expToGain = Math.floor(Math.random() * 20) + 40;
    } else if (isAttackAction || isDefendAction) {
      // Combat relevant skills get medium XP (+25 to +35)
      expToGain = Math.floor(Math.random() * 10) + 25;
    } else if (cls.type === 'Bị động' || skill.category === 'Resistance' || skill.category === 'Intrinsic') {
      // Passive and resistance skills get passive endurance XP (+15 to +25)
      expToGain = Math.floor(Math.random() * 10) + 15;
    } else {
      // General field presence XP (+10 to +15)
      expToGain = Math.floor(Math.random() * 6) + 10;
    }

    const { updatedSkill, leveledUp, newLevel } = addSkillExp(skill, expToGain);

    if (leveledUp) {
      levelUpAnnouncements.push(
        `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Kỹ năng [${skill.name}] đã gia tăng độ thuần thục! → CẤP ĐỘ MỚI: [CẤP ${newLevel}${newLevel >= MAX_SKILL_LEVEL ? ' - ĐẠI THÀNH' : ''}]!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
      );
    }

    return updatedSkill;
  });

  return {
    updatedSkills,
    levelUpAnnouncements
  };
}


