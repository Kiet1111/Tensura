// Mở rộng RaceType linh hoạt cho các cấp tiến hóa về sau
export type RaceType = 'Slime' | 'Human' | 'Kijin' | 'Dragonewt' | (string & {});

// Tensura Core Skill Tiers & Distinct Power Systems
export type SkillCategory = 
  | 'Common'      // 通常技能 - Kỹ năng thông thường cơ bản
  | 'Extra'       // Extra Skill - Kỹ năng đặc biệt chuyên môn hóa
  | 'Unique'      // 固有技能 - Kỹ năng độc nhất
  | 'Ultimate'    // 究極能力 - Kỹ năng tối thượng
  | 'Manas'       // マナス - Thần trí thể / Ý thức linh hồn
  | 'Intrinsic'   // 固有能力 / 種族固有 - Kỹ năng nội tại bẩm sinh
  | 'Resistance'  // 耐性 - Kháng tính
  | 'Arts'        // 武芸 / アーツ - Võ kỹ, đấu khí
  | 'Magic';      // 魔法 - Hệ thống ma pháp

export type SkillType = 'Chủ động' | 'Bị động';

export type SkillAttribute = 'Tấn công' | 'Phòng thủ' | 'Hỗ trợ' | 'Đa dụng' | 'Quy luật';

export interface SubSkill {
  id?: string;
  name: string;
  japaneseName?: string;
  description: string;
  type?: SkillType;
  attribute?: SkillAttribute;
  mpCost?: number;
}

export interface Skill {
  id: string;
  name: string;
  japaneseName?: string;
  lordConcept?: string;      // E.g., "Lord of Wisdom", "God of Void"
  category: SkillCategory;
  description: string;
  acquiredAt?: number;
  type?: SkillType;
  attribute?: SkillAttribute;
  mpCost?: number;
  cooldown?: number;
  level?: number;
  exp?: number;
  maxExp?: number;
  proficiency?: number;
  subSkills?: SubSkill[];
  evolutionLine?: string;
  evolvesTo?: string;
  evolutionRequirement?: string;
  isManas?: boolean;
  isFromArchive?: boolean;
}

export type TitleRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Ultimate';

export interface TitleStatBonus {
  hpBonus?: number;
  mpBonus?: number;
  atkBonus?: number;
  defBonus?: number;
  magicBonus?: number;
  description: string;
}

export interface CharacterTitle {
  id: string;
  name: string;
  category?: string;
  rarity: TitleRarity;
  description: string;
  unlocked: boolean;
  isEquipped?: boolean;
  unlockedAtTurn?: number;
  bonus: TitleStatBonus;
  requirementHint: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
  type: 'Herb' | 'Ore' | 'MonsterPart' | 'Consumable' | 'Equipment' | 'Special';
}

export interface Territory {
  name: string;
  level: number;
  levelTitle: string;
  population: number;
  buildings: string[];
  defense: number;
  prosperity: number;
}

export interface EvolutionFactors {
  devour: number;     // Bạo Thực / Thôn Phệ
  wisdom: number;     // Trí Tuệ / Phân Tích
  protection: number; // Bảo Hộ / Minh Ước
  combat: number;     // Võ Kỹ / Đấu Khí
  magic: number;      // Ma Pháp / Nguyên Tố
  soul: number;       // Thần Tính / Tự Ngã
}

export interface EvolutionBranch {
  id: string;
  name: string;
  japaneseName?: string;
  stage: number;
  factorFocus: keyof EvolutionFactors | 'balanced';
  factorFocusTitle: string;
  description: string;
  lore: string;
  icon: string;
  statBonuses?: {
    maxHp?: number;
    maxMp?: number;
    atk?: number;
    def?: number;
    magic?: number;
  };
  grantedSkills: Skill[];
  requiredFactors?: Partial<EvolutionFactors>;
  targetSkillPattern?: string;
  newSkill?: Skill;
  absorbedSkillNames?: string[];
  lordConcept?: string;
  skillCategory?: SkillCategory;
}

export interface PendingEvolution {
  id: string;
  type: 'race' | 'skill';
  targetSkillId?: string;
  targetSkillName?: string;
  currentTitle: string;
  branches: EvolutionBranch[];
  reason: string;
  triggeredBy: string;
  factorSnapshot: EvolutionFactors;
}

export interface CharacterStatus {
  name: string;
  title: string;
  race: RaceType;
  raceTitle: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  // Bổ sung thuộc tính chiến đấu tương thích với TitleStatBonus
  atk?: number;
  def?: number;
  magic?: number;
  skills: Skill[];
  inventory: InventoryItem[];
  territory: Territory;
  turn: number;
  evolutionStage: number;
  titles?: CharacterTitle[];
  equippedTitleId?: string;
  startLocation?: string;
  timelineEra?: string;
  evolutionFactors?: EvolutionFactors;
  evolutionHistory?: string[];
}

export type LogType = 'gm_narrative' | 'world_voice' | 'player_action' | 'combat_log' | 'system_notice';

export interface GameLog {
  id: string;
  type: LogType;
  content: string;
  timestamp?: string;
  worldVoiceSkills?: string[];
  worldVoiceResistances?: string[];
  worldVoiceAnnouncements?: string[];
  isMilestone?: boolean;
  isStoryChange?: boolean;
  storyTitle?: string;
  milestoneTitle?: string;
}

export interface CombatEnemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  atk?: number;
  def?: number;
  level: number;
  description: string;
  skills: string[];
  isWeakened: boolean;
  dropItems: string[];
}

export interface CombatLogEntry {
  id: string;
  turn: number;
  timestamp: string;
  actionName: string;
  attacker: string;
  target?: string;
  damageDealt?: number;
  damageTaken?: number;
  hpChange?: number;
  mpChange?: number;
  skillUsed?: string;
  effect?: string;
  type: 'attack' | 'skill' | 'devour' | 'defense' | 'gather' | 'territory' | 'system';
}

export interface StoryMilestone {
  id: string;
  arc: string;
  title: string;
  canonOutcome: string;
  playerImpact: string;
  status: 'locked' | 'active' | 'completed' | 'altered';
  divergenceBonus: number;
}

export interface CharacterRelation {
  name: string;
  title: string;
  affinity: number;
  status: 'Đồng minh' | 'Thân thiết' | 'Tò mò' | 'Trung lập' | 'Nghi vấn' | 'Đối đầu' | 'Bí mật';
  notes: string;
}

export interface StoryState {
  currentArc: string;
  arcProgress: number;
  divergenceRate: number;
  variableTitle: string;
  milestones: StoryMilestone[];
  relations: CharacterRelation[];
  recentCanonChanges: string[];
}

export interface StoryUpdate {
  currentArc?: string;
  arcProgress?: number;
  divergenceChange?: number;
  divergenceTotal?: number;
  variableTitle?: string;
  milestoneUnlocked?: {
    id: string;
    arc?: string;
    title?: string;
    status: 'completed' | 'altered';
    playerImpact: string;
  };
  relationChanges?: {
    name: string;
    affinityChange: number;
    newStatus?: 'Đồng minh' | 'Thân thiết' | 'Tò mò' | 'Trung lập' | 'Nghi vấn' | 'Đối đầu' | 'Bí mật';
    notes?: string;
  }[];
  canonChangeDescription?: string;
}

export interface GameState {
  character: CharacterStatus | null;
  logs: GameLog[];
  combatLogs: CombatLogEntry[];
  currentEnemy: CombatEnemy | null;
  suggestedActions: string[];
  location: string;
  storyState: StoryState;
  pendingEvolution?: PendingEvolution | null; // Đã bổ sung
  isCombatActive: boolean;
  isGameOver: boolean;
  isInitialized: boolean;
}

export interface TurnResponse {
  narrative: string;
  worldVoiceAnnouncements: string[];
  newSkills?: Skill[];
  newResistances?: Skill[];
  hpChange?: number;
  mpChange?: number;
  itemsGained?: InventoryItem[];
  itemsUsed?: string[];
  territoryChanges?: {
    levelIncrease?: number;
    newBuildings?: string[];
    populationIncrease?: number;
    prosperityChange?: number;
  };
  combatEnemy?: CombatEnemy | null;
  locationUpdate?: string;
  suggestedActions: string[];
  isDevourSuccess?: boolean;
  pendingEvolution?: PendingEvolution | null; // Đã bổ sung
  storyUpdate?: StoryUpdate;
}
