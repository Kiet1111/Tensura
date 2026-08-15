import { Skill } from '../types';
import { CANON_SKILL_SUBABILITIES } from './skillUtils';

const SKILL_ARCHIVE_KEY = 'tensura_rpg_skill_archive_v2';

/**
 * Helper sinh Unique ID an toàn
 */
const generateSkillId = (prefix = 'archived'): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
};

/**
 * Thư viện kỹ năng mặc định (Chuẩn Tensura Canon)
 */
export const DEFAULT_TENSURA_ENCYCLOPEDIA: ReadonlyArray<Skill> = Object.freeze([
  // 1. Manas (マナス)
  {
    id: 'canon_manas_ciel',
    name: 'Thần Trí Thể Ciel (Manas: Ciel)',
    japaneseName: 'マナス: シエル',
    lordConcept: 'Supreme Wisdom Core',
    category: 'Manas',
    description: 'Thực thể ý thức linh hồn độc lập tối cao sinh ra từ sự tiến hóa của Trí Huệ Chi Vương Raphael. Sở hữu tự ngã hoàn chỉnh, tư duy cảm xúc và khả năng tối ưu hóa, dung hợp toàn bộ kỹ năng của Rimuru.',
    evolutionLine: 'Đại Hiền Triết (Unique) → Trí Huệ Chi Vương Raphael (Ultimate) → Thần Trí Thể Ciel (Manas)',
    acquiredAt: 1,
    level: 10,
    exp: 2000,
    maxExp: 2000,
    type: 'Bị động',
    attribute: 'Quy luật',
    isManas: true,
    subSkills: CANON_SKILL_SUBABILITIES?.['ciel']?.subSkills || []
  },

  // 2. Ultimate Skills (究極能力)
  {
    id: 'canon_ult_raphael',
    name: 'Trí Huệ Chi Vương (Raphael)',
    japaneseName: '智慧之王 (ラファエル)',
    lordConcept: 'Lord of Wisdom',
    category: 'Ultimate',
    description: 'Quy luật quản trị trí tuệ và chân lý thế giới. Cho phép gia tốc tư duy hàng triệu lần, phân tích vạn vật ở cấp độ hạ nguyên tử, tự động hóa chiến đấu và hợp nhất/phân tách kỹ năng.',
    evolutionLine: 'Đại Hiền Triết (Unique) → Trí Huệ Chi Vương Raphael (Ultimate) → Thần Trí Thể Ciel (Manas)',
    acquiredAt: 1,
    level: 10,
    exp: 1600,
    maxExp: 1600,
    type: 'Chủ động',
    attribute: 'Quy luật',
    subSkills: CANON_SKILL_SUBABILITIES?.['raphael']?.subSkills || []
  },
  {
    id: 'canon_ult_beelzebuth',
    name: 'Bạo Thực Chi Vương (Beelzebuth)',
    japaneseName: '暴食之王 (ベルゼビュート)',
    lordConcept: 'Lord of Gluttony',
    category: 'Ultimate',
    description: 'Quyền năng thôn phệ tối thượng vượt qua không gian và thời gian. Cho phép nuốt chửng linh hồn, ma lượng, kỹ năng và vận hành mạng lưới liên kết Chuỗi Thức Ăn với thuộc hạ.',
    evolutionLine: 'Săn Mồi (Unique) + Kẻ Phàm Ăn (Unique) → Bạo Thực Chi Vương Beelzebuth → Hư Không Chi Thần Azathoth',
    acquiredAt: 1,
    level: 9,
    exp: 1400,
    maxExp: 1600,
    type: 'Chủ động',
    attribute: 'Tấn công',
    subSkills: CANON_SKILL_SUBABILITIES?.['beelzebuth']?.subSkills || []
  },
  {
    id: 'canon_ult_uriel',
    name: 'Đoán Bạt Chi Vương (Uriel)',
    japaneseName: '誓約之王 (ウリエル)',
    lordConcept: 'Lord of Vows',
    category: 'Ultimate',
    description: 'Quyền năng bảo hộ và ước hẹn không gian. Thiết lập Vô Hạn Kết Giới tuyệt đối bất khả xâm phạm và bẻ cong tọa độ không gian chiến trường.',
    evolutionLine: 'Vô Hạn Lao Ngục (Unique) + Không Gian Thao Túng → Đoán Bạt Chi Vương Uriel',
    acquiredAt: 1,
    level: 8,
    exp: 1200,
    maxExp: 1600,
    type: 'Chủ động',
    attribute: 'Phòng thủ',
    subSkills: CANON_SKILL_SUBABILITIES?.['uriel']?.subSkills || []
  },

  // 3. Unique Skills (固有技能)
  {
    id: 'canon_uniq_predator',
    name: 'Kẻ Săn Mồi (Predator)',
    japaneseName: '捕食者 (プレデター)',
    category: 'Unique',
    description: 'Kỹ năng độc nhất gắn liền với bản chất nuốt chửng và phân tích. Chứa 5 năng lực con: Thôn Phệ, Dạ Dày, Mô Phỏng, Cô Lập và Phân Giải.',
    evolutionLine: 'Săn Mồi (Unique) → Bạo Thực Chi Vương Beelzebuth (Ultimate)',
    acquiredAt: 1,
    level: 7,
    exp: 800,
    maxExp: 1300,
    type: 'Chủ động',
    attribute: 'Tấn công',
    subSkills: CANON_SKILL_SUBABILITIES?.['predator']?.subSkills || []
  },
  {
    id: 'canon_uniq_great_sage',
    name: 'Đại Hiền Triết (Great Sage)',
    japaneseName: '大賢者 (グレートセージ)',
    category: 'Unique',
    description: 'Kỹ năng độc nhất phân tích thông tin và tư vấn chiến thuật. Cung cấp Gia Tốc Tư Duy, Phân Tích & Giám Định, Vận Hành Song Song, Hủy Bỏ Niệm Chú và Vạn Vật Chi Lý.',
    evolutionLine: 'Đại Hiền Triết (Unique) → Trí Huệ Chi Vương Raphael (Ultimate) → Manas: Ciel',
    acquiredAt: 1,
    level: 8,
    exp: 950,
    maxExp: 1300,
    type: 'Bị động',
    attribute: 'Hỗ trợ',
    subSkills: CANON_SKILL_SUBABILITIES?.['great sage']?.subSkills || []
  },
  {
    id: 'canon_uniq_degenerate',
    name: 'Biến Dị Giả (Degenerate)',
    japaneseName: '変質者 (デジェネレイト)',
    category: 'Unique',
    description: 'Kỹ năng độc nhất cho phép can thiệp vào cấu trúc năng lực: Hợp Nhất (Synthesis) và Phân Tách (Separation) các kỹ năng hoặc vật chất ma pháp.',
    evolutionLine: 'Biến Dị Giả (Unique) → Tích hợp vào Trí Huệ Chi Vương Raphael',
    acquiredAt: 1,
    level: 6,
    exp: 600,
    maxExp: 1300,
    type: 'Chủ động',
    attribute: 'Hỗ trợ',
    subSkills: CANON_SKILL_SUBABILITIES?.['degenerate']?.subSkills || []
  },

  // 4. Extra Skills (Extra Skill)
  {
    id: 'canon_extra_magic_sense',
    name: 'Ma Lực Cảm Tri (Magic Sense)',
    japaneseName: '魔力感知',
    category: 'Extra',
    description: 'Cảm nhận sự dao động của các hạt ma lượng (Magicules) trong không gian, mang lại tầm nhìn toàn cảnh 360 độ hoàn hảo không góc chết.',
    evolutionLine: 'Ma Lực Cảm Tri → Vạn Năng Cảm Tri (Ultimate Sub-skill)',
    acquiredAt: 1,
    level: 5,
    exp: 400,
    maxExp: 1100,
    type: 'Bị động',
    attribute: 'Hỗ trợ'
  },
  {
    id: 'canon_extra_water_blade',
    name: 'Thủy Trảm Đao (Water Blade)',
    japaneseName: '水刀',
    category: 'Extra',
    description: 'Nén áp suất dòng nước ở tốc độ siêu âm, tạo thành lưỡi đao chân không có khả năng chém đứt tảng đá lớn và giáp sắt ma vật.',
    evolutionLine: 'Thủy Đạn (Common) → Thủy Trảm Đao (Extra) → Thao Túng Thủy Lưu Tối Cương',
    acquiredAt: 1,
    level: 4,
    exp: 300,
    maxExp: 1100,
    type: 'Chủ động',
    attribute: 'Tấn công',
    mpCost: 15
  },
  {
    id: 'canon_extra_shadow_step',
    name: 'Hắc Ám Bộ (Shadow Step)',
    japaneseName: '影移動',
    category: 'Extra',
    description: 'Nhập thân vào bóng râm để di chuyển tức thời giữa các vùng bóng tối với tốc độ cực cao.',
    evolutionLine: 'Hắc Ám Bộ → Không Gian Di Chuyển (Spatial Transfer)',
    acquiredAt: 1,
    level: 4,
    exp: 350,
    maxExp: 1100,
    type: 'Chủ động',
    attribute: 'Hỗ trợ',
    mpCost: 20
  },

  // 5. Common Skills (通常技能)
  {
    id: 'canon_common_phys_boost',
    name: 'Cường Hóa Thể Chất',
    japaneseName: '身体強化',
    category: 'Common',
    description: 'Tập trung lượng nhỏ ma lực vào cơ bắp để tăng cường lực đấm, tốc độ chạy và sức bền cơ bản trong thời gian ngắn.',
    acquiredAt: 1,
    level: 3,
    exp: 150,
    maxExp: 1000,
    type: 'Chủ động',
    attribute: 'Hỗ trợ',
    mpCost: 5
  },
  {
    id: 'canon_common_water_propel',
    name: 'Thủy Áp Đẩy (Water Propulsion)',
    japaneseName: '水流推進',
    category: 'Common',
    description: 'Hút nước vào cơ thể và bắn ra với áp lực phản lực để lao đi nhanh chóng dưới nước hoặc trên mặt đất.',
    acquiredAt: 1,
    level: 2,
    exp: 100,
    maxExp: 1000,
    type: 'Chủ động',
    attribute: 'Đa dụng',
    mpCost: 5
  },

  // 6. Intrinsic Skills (Kỹ Năng Nội Tại)
  {
    id: 'canon_intrinsic_slime_absorb',
    name: 'Hấp Thụ, Hòa Tan & Tự Tái Tạo',
    japaneseName: '吸収・溶解・自己再生',
    category: 'Intrinsic',
    description: 'Năng lực nội tại bẩm sinh của chủng tộc Slime. Cho phép hòa tan vật chất hữu cơ, hấp thu dịch dinh dưỡng và tự phục hồi tế bào chất mà không cần nội tạng.',
    acquiredAt: 1,
    level: 6,
    exp: 500,
    maxExp: 1200,
    type: 'Bị động',
    attribute: 'Phòng thủ'
  },
  {
    id: 'canon_intrinsic_kijin_aura',
    name: 'Yêu Khí Uy Áp (Ogre / Kijin Power)',
    japaneseName: '鬼気・威圧',
    category: 'Intrinsic',
    description: 'Năng lực nội tại bẩm sinh của loài Kijin/Ogre. Phát ra luồng khí thế cuồn cuộn áp chế tinh thần kẻ địch yếu thế.',
    acquiredAt: 1,
    level: 5,
    exp: 420,
    maxExp: 1200,
    type: 'Chủ động',
    attribute: 'Tấn công',
    mpCost: 15
  },

  // 7. Resistance (Kháng Tính)
  {
    id: 'canon_res_thermal',
    name: 'Kháng Biến Đổi Nhiệt Độ (Thermal Fluctuation Resistance)',
    japaneseName: '熱変動耐性',
    category: 'Resistance',
    description: 'Giảm thiểu 70% sát thương nhận vào từ các đòn tấn công hệ Hỏa hoặc Băng giá cực độ.',
    evolutionLine: 'Kháng Nhiệt Độ → Miễn Nhiễm Biến Đổi Nhiệt Độ (Thermal Fluctuation Nullification)',
    acquiredAt: 1,
    level: 5,
    exp: 400,
    maxExp: 1000,
    type: 'Bị động',
    attribute: 'Phòng thủ'
  },
  {
    id: 'canon_res_physical',
    name: 'Kháng Công Kích Vật Lý',
    japaneseName: '物理攻撃耐性',
    category: 'Resistance',
    description: 'Cơ thể mềm dẻo hoặc cấu trúc ma lực giảm thiểu sát thương từ các đòn đánh chém, đập và đâm xuyên vật lý.',
    acquiredAt: 1,
    level: 6,
    exp: 550,
    maxExp: 1000,
    type: 'Bị động',
    attribute: 'Phòng thủ'
  },
  {
    id: 'canon_res_poison',
    name: 'Miễn Nhiễm Độc Tố (Poison Immunity)',
    japaneseName: '毒無効',
    category: 'Resistance',
    description: 'Vô hiệu hóa hoàn toàn mọi dạng chất độc, chướng khí, nọc độc ma vật và độc tố ăn mòn.',
    acquiredAt: 1,
    level: 10,
    exp: 1000,
    maxExp: 1000,
    type: 'Bị động',
    attribute: 'Phòng thủ'
  },

  // 8. Arts (Võ Kỹ / Kỹ Thuật)
  {
    id: 'canon_arts_battlewill',
    name: 'Đấu Khí Cường Hóa (Battlewill)',
    japaneseName: '闘気・武芸',
    category: 'Arts',
    description: 'Kỹ thuật điều khiển luồng năng lượng sinh mệnh (Khí/Aura) bao phủ quanh cơ thể hoặc vũ khí để xé toạc rào chắn ma pháp đối phương.',
    acquiredAt: 1,
    level: 4,
    exp: 300,
    maxExp: 1200,
    type: 'Chủ động',
    attribute: 'Tấn công',
    mpCost: 20
  },
  {
    id: 'canon_arts_ogre_slash',
    name: 'Quỷ Nha Trảm (Ogre Fang Slash)',
    japaneseName: '鬼牙一閃',
    category: 'Arts',
    description: 'Kiếm kỹ tối cao truyền thừa của quỷ tộc, tập trung toàn bộ trọng lực và đấu khí tung ra một nhát chém chớp nhoáng xé nát mục tiêu.',
    acquiredAt: 1,
    level: 5,
    exp: 400,
    maxExp: 1200,
    type: 'Chủ động',
    attribute: 'Tấn công',
    mpCost: 25
  },

  // 9. Magic (Ma Pháp)
  {
    id: 'canon_magic_flare_circle',
    name: 'Nguyên Tố Ma Pháp: Bão Lửa (Flare Circle)',
    japaneseName: '火炎魔術・烈火円',
    category: 'Magic',
    description: 'Sử dụng ma lượng cộng hưởng với quy tắc nguyên tố Hỏa, tạo ra vòng xoáy lửa thiêu rụi toàn bộ kẻ thù trong phạm vi bán kính 20 mét.',
    acquiredAt: 1,
    level: 4,
    exp: 350,
    maxExp: 1200,
    type: 'Chủ động',
    attribute: 'Tấn công',
    mpCost: 35
  },
  {
    id: 'canon_magic_teleport',
    name: 'Không Gian Ma Pháp: Dịch Chuyển (Spatial Transfer)',
    japaneseName: '空間魔法・転移',
    category: 'Magic',
    description: 'Mở cổng không gian liên kết giữa hai tọa độ đã ghi nhớ ma lực, cho phép vận chuyển người và hàng hóa tức thời.',
    acquiredAt: 1,
    level: 5,
    exp: 480,
    maxExp: 1200,
    type: 'Chủ động',
    attribute: 'Hỗ trợ',
    mpCost: 45
  }
]);

/**
 * Lấy danh sách kho kỹ năng (Kết hợp LocalStorage và Default Encyclopedia)
 */
export function getSkillArchive(): Skill[] {
  if (typeof window === 'undefined') {
    return [...DEFAULT_TENSURA_ENCYCLOPEDIA];
  }
  
  try {
    const raw = localStorage.getItem(SKILL_ARCHIVE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[SkillArchive] Lỗi đọc kho kỹ năng từ localStorage:', e);
  }

  return [...DEFAULT_TENSURA_ENCYCLOPEDIA];
}

/**
 * Lưu/Cập nhật kỹ năng mới vào kho lưu trữ (Upsert logic - chống ghi đè lỗi)
 */
export function saveSkillsToArchive(newSkills: Skill[]): { addedCount: number; updatedCount: number; totalCount: number } {
  if (typeof window === 'undefined' || !Array.isArray(newSkills) || newSkills.length === 0) {
    const current = getSkillArchive();
    return { addedCount: 0, updatedCount: 0, totalCount: current.length };
  }

  const existing = getSkillArchive();
  const skillMap = new Map<string, Skill>();

  // Map danh sách cũ theo Key chuẩn hóa (ID hoặc Name)
  existing.forEach((skill) => {
    const key = skill.id || skill.name.trim().toLowerCase();
    skillMap.set(key, skill);
  });

  let addedCount = 0;
  let updatedCount = 0;

  newSkills.forEach((skill) => {
    if (!skill || !skill.name) return;

    const normalizedName = skill.name.trim().toLowerCase();
    const key = skill.id || normalizedName;

    const existingSkill = skillMap.get(key) || Array.from(skillMap.values()).find(s => s.name.trim().toLowerCase() === normalizedName);

    if (existingSkill) {
      // Upsert: Cập nhật nếu phiên bản mới có Level hoặc EXP cao hơn
      const isHigherLevel = (skill.level || 1) > (existingSkill.level || 1);
      const isHigherExp = (skill.exp || 0) > (existingSkill.exp || 0);

      if (isHigherLevel || isHigherExp || skill.description !== existingSkill.description) {
        skillMap.set(existingSkill.id || key, {
          ...existingSkill,
          ...skill,
          id: existingSkill.id || skill.id || generateSkillId()
        });
        updatedCount++;
      }
    } else {
      // Thêm mới
      const newId = skill.id || generateSkillId();
      const newSkillEntry: Skill = {
        ...skill,
        id: newId
      };
      skillMap.set(newId, newSkillEntry);
      addedCount++;
    }
  });

  const updatedList = Array.from(skillMap.values());

  try {
    localStorage.setItem(SKILL_ARCHIVE_KEY, JSON.stringify(updatedList));
  } catch (e) {
    console.error('[SkillArchive] Lỗi khi lưu kho kỹ năng vào localStorage (Storage Full):', e);
  }

  return {
    addedCount,
    updatedCount,
    totalCount: updatedList.length
  };
}

/**
 * Xóa sạch kho kỹ năng lưu trữ cá nhân (Khôi phục về mặc định)
 */
export function clearSkillArchive(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SKILL_ARCHIVE_KEY);
  } catch (e) {
    console.error('[SkillArchive] Lỗi khi xóa kho kỹ năng:', e);
  }
}
