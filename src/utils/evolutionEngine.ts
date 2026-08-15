import { 
  Character, 
  Skill, 
  EvolutionFactors, 
  EvolutionBranch, 
  RaceEvolutionConfig 
} from './types'; // Điều chỉnh path import theo cấu trúc dự án của bạn

/**
 * Hằng số khởi tạo mặc định - Được đóng băng để chống mutation
 */
export const INITIAL_EVOLUTION_FACTORS: Readonly<EvolutionFactors> = Object.freeze({
  devour: 0,
  wisdom: 0,
  protection: 0,
  combat: 0,
  magic: 0,
  soul: 0,
});

/**
 * Helper sinh ID duy nhất chống trùng lặp trong cùng 1 millisecond
 */
function generateUniqueId(prefix: string = 'skill'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${Date.now()}_${randomPart}`;
}

/**
 * Deep clone đối tượng EvolutionFactors
 */
export function createDefaultEvolutionFactors(): EvolutionFactors {
  return { ...INITIAL_EVOLUTION_FACTORS };
}

export class EvolutionEngine {
  /**
   * Cập nhật và cộng dồn điểm Evolution Factors cho nhân vật một cách an toàn
   */
  public static applyFactorGains(
    currentFactors: Partial<EvolutionFactors> | undefined,
    gains: Partial<EvolutionFactors>
  ): EvolutionFactors {
    const base = currentFactors 
      ? { ...INITIAL_EVOLUTION_FACTORS, ...currentFactors }
      : createDefaultEvolutionFactors();

    return {
      devour: Math.max(0, base.devour + (gains.devour || 0)),
      wisdom: Math.max(0, base.wisdom + (gains.wisdom || 0)),
      protection: Math.max(0, base.protection + (gains.protection || 0)),
      combat: Math.max(0, base.combat + (gains.combat || 0)),
      magic: Math.max(0, base.magic + (gains.magic || 0)),
      soul: Math.max(0, base.soul + (gains.soul || 0)),
    };
  }

  /**
   * Đánh giá trạng thái Dominant (Áp đảo) hay Balanced (Cân bằng) dựa trên điểm Factors
   */
  public static evaluateFactors(factors: EvolutionFactors): {
    state: 'Dominant' | 'Balanced';
    dominantFactor?: keyof EvolutionFactors;
    percentageMap: Record<keyof EvolutionFactors, number>;
  } {
    const keys = Object.keys(INITIAL_EVOLUTION_FACTORS) as (keyof EvolutionFactors)[];
    const totalPoints = keys.reduce((sum, key) => sum + (factors[key] || 0), 0);

    const percentageMap = {} as Record<keyof EvolutionFactors, number>;
    
    if (totalPoints === 0) {
      keys.forEach((key) => (percentageMap[key] = 0));
      return { state: 'Balanced', percentageMap };
    }

    let maxKey: keyof EvolutionFactors = 'devour';
    let maxVal = -1;
    let secondMaxVal = -1;

    keys.forEach((key) => {
      const val = factors[key] || 0;
      percentageMap[key] = Number(((val / totalPoints) * 100).toFixed(2));

      if (val > maxVal) {
        secondMaxVal = maxVal;
        maxVal = val;
        maxKey = key;
      } else if (val > secondMaxVal) {
        secondMaxVal = val;
      }
    });

    const diff = maxVal - Math.max(0, secondMaxVal);
    const dominantPercentage = percentageMap[maxKey];

    // Điều kiện Dominant: Chênh lệch >= 12 điểm và chiếm >= 28% tổng điểm
    const isDominant = diff >= 12 && dominantPercentage >= 28;

    return {
      state: isDominant ? 'Dominant' : 'Balanced',
      dominantFactor: isDominant ? maxKey : undefined,
      percentageMap,
    };
  }

  /**
   * Kiểm tra điều kiện tiến hóa chủng tộc dựa trên Turn, MP, Lãnh địa và Skill
   */
  public static checkRaceEvolutionEligibility(
    character: Character,
    config: RaceEvolutionConfig
  ): { eligible: boolean; reason?: string } {
    if (config.minTurn && (character.currentTurn || 0) < config.minTurn) {
      return { eligible: false, reason: `Chưa đủ số lượt tối thiểu (${config.minTurn})` };
    }

    if (config.minMp && (character.maxMp || 0) < config.minMp) {
      return { eligible: false, reason: `Ma lượng (MP) chưa đạt yêu cầu (${config.minMp})` };
    }

    if (config.minTerritoryLevel && (character.territoryLevel || 0) < config.minTerritoryLevel) {
      return { eligible: false, reason: `Cấp độ lãnh địa chưa đủ (${config.minTerritoryLevel})` };
    }

    if (config.requiredSkillCount && (character.skills?.length || 0) < config.requiredSkillCount) {
      return { eligible: false, reason: `Số lượng kỹ năng chưa đủ (${config.requiredSkillCount})` };
    }

    return { eligible: true };
  }

  /**
   * Áp dụng tiến hóa kỹ năng an toàn - Khắc phục hoàn toàn rủi ro mất skill
   */
  public static applySkillEvolutionBranch(
    character: Character,
    oldSkillId: string,
    newSkillData: Partial<Skill>
  ): Character {
    const currentSkills = character.skills ? [...character.skills] : [];
    const targetIndex = currentSkills.findIndex((s) => s.id === oldSkillId);

    const evolvedSkill: Skill = {
      id: generateUniqueId('ultimate'),
      name: newSkillData.name || 'Kỹ năng chưa đặt tên',
      type: newSkillData.type || 'Ultimate',
      description: newSkillData.description || '',
      power: newSkillData.power || 100,
      lordConcept: newSkillData.lordConcept,
      ...newSkillData,
    };

    let updatedSkills: Skill[];

    if (targetIndex !== -1) {
      // Thay thế chính xác tại vị trí kỹ năng cũ
      updatedSkills = [...currentSkills];
      updatedSkills[targetIndex] = evolvedSkill;
    } else {
      // Fallback an toàn: Thêm mới vào danh sách nếu không tìm thấy ID cũ
      console.warn(`[EvolutionEngine] Old skill ID '${oldSkillId}' not found. Appending evolved skill to list.`);
      updatedSkills = [...currentSkills, evolvedSkill];
    }

    return {
      ...character,
      skills: updatedSkills,
    };
  }

  /**
   * Nhận diện Skill Canon theo nguyên tác Tensura (Chính xác theo ID/Concept trước, Name sau)
   */
  public static isCanonUltimateSkill(skill: Partial<Skill>): boolean {
    if (!skill) return false;

    // 1. Kiểm tra theo ID hoặc Lord Concept định danh sẵn
    if (skill.lordConcept || (skill.id && skill.id.startsWith('canon_'))) {
      return true;
    }

    // 2. Tra cứu theo danh sách tên chuẩn (Exact Match & Normalized Case)
    const canonKeywords = [
      'raphael', 'beelzebuth', 'uriel', 'veldora', 'azathoth', 
      'yog-sothoth', 'shub-niggurath', 'ciel', 'metatron', 
      'michaels', 'satanel', 'belial', 'mammon', 'asmodeus'
    ];

    const normalizedName = (skill.name || '').toLowerCase().trim();
    
    return canonKeywords.some((keyword) => normalizedName.includes(keyword));
  }
}
