import React, { useState, useMemo } from 'react';
import { CharacterStatus, InventoryItem, SkillCategory, Skill } from '../types';
import {
  Heart,
  Zap,
  Wand2,
  Package,
  Sparkles,
  Shield,
  Leaf,
  Gem,
  Skull,
  FlaskConical,
  Swords,
  BookOpen,
  Layers,
  Award,
  Crown,
  CheckCircle2,
  Lock,
  ChevronRight,
  Search,
  X,
  Dna,
  GitBranch,
  ArrowUpDown,
  TrendingUp
} from 'lucide-react';
import { SkillLibraryModal } from './SkillLibraryModal';
import { SkillProgressBar } from './SkillProgressBar';
import { getSkillClassification, getEnrichedSkillDetails, getSkillEvolutionPotential, TENSURA_CATEGORY_METADATA } from '../utils/skillUtils';
import { getInitialTitles, calculateTotalTitleBonuses, getRarityBadgeStyle } from '../utils/titleData';
import { FACTOR_METADATA, INITIAL_EVOLUTION_FACTORS, evaluateFactorDominance, RACE_EVOLUTION_BRANCHES } from '../utils/evolutionEngine';

interface Props {
  character: CharacterStatus;
  isOpenModal?: boolean;
  onCloseModal?: () => void;
  onEquipTitle?: (titleId: string) => void;
}

const ASCENDING_TIER_ORDER: SkillCategory[] = [
  'Common',
  'Extra',
  'Unique',
  'Ultimate',
  'Manas',
  'Intrinsic',
  'Resistance',
  'Arts',
  'Magic'
];

const DESCENDING_TIER_ORDER: SkillCategory[] = [
  'Manas',
  'Ultimate',
  'Unique',
  'Extra',
  'Common',
  'Intrinsic',
  'Resistance',
  'Arts',
  'Magic'
];

export const StatusBoard: React.FC<Props> = ({ character, isOpenModal, onCloseModal, onEquipTitle }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'evolution' | 'titles' | 'inventory' | 'territory'>('skills');
  const [titleFilter, setTitleFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [skillSearchTerm, setSkillSearchTerm] = useState('');
  const [skillTypeFilter, setSkillTypeFilter] = useState<'All' | 'Chủ động' | 'Bị động'>('All');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState<SkillCategory | 'All'>('All');
  const [tierSortDirection, setTierSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSkillLibraryOpen, setIsSkillLibraryOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<InventoryItem | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Safe Fallbacks tránh crash app khi dữ liệu bị undefined
  const characterSkills = character?.skills || [];
  const characterInventory = character?.inventory || [];
  const characterTitles = (character?.titles && character.titles.length > 0) ? character.titles : getInitialTitles();
  const territory = character?.territory || { name: 'Chưa rõ', level: 1, levelTitle: 'Lãnh địa sơ khai', population: 0, buildings: [] };

  const titleTotals = calculateTotalTitleBonuses(characterTitles);

  const filteredSkills = characterSkills.filter(rawSkill => {
    const skill = getEnrichedSkillDetails(rawSkill);
    const cls = getSkillClassification(skill);
    const matchesSearch =
      skill.name.toLowerCase().includes(skillSearchTerm.toLowerCase()) ||
      (skill.japaneseName && skill.japaneseName.toLowerCase().includes(skillSearchTerm.toLowerCase())) ||
      (skill.lordConcept && skill.lordConcept.toLowerCase().includes(skillSearchTerm.toLowerCase())) ||
      skill.description.toLowerCase().includes(skillSearchTerm.toLowerCase()) ||
      skill.category.toLowerCase().includes(skillSearchTerm.toLowerCase());
    const matchesType = skillTypeFilter === 'All' || cls.type === skillTypeFilter;
    const matchesCategory = skillCategoryFilter === 'All' || skill.category === skillCategoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  // Group filtered skills by hierarchical Tensura tiers
  const groupedSkills = useMemo(() => {
    const tierList = tierSortDirection === 'asc' ? ASCENDING_TIER_ORDER : DESCENDING_TIER_ORDER;
    const groups: { category: SkillCategory; skills: Skill[] }[] = [];
    for (const cat of tierList) {
      const list = filteredSkills.filter(s => s.category === cat);
      if (list.length > 0) {
        groups.push({ category: cat, skills: list });
      }
    }
    return groups;
  }, [filteredSkills, tierSortDirection]);

  // Count skills per category in the full character repertoire
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<SkillCategory, number>> = {};
    for (const s of characterSkills) {
      counts[s.category] = (counts[s.category] || 0) + 1;
    }
    return counts;
  }, [characterSkills]);

  const filteredTitles = characterTitles.filter(t => {
    if (titleFilter === 'unlocked') return t.unlocked;
    if (titleFilter === 'locked') return !t.unlocked;
    return true;
  });

  const handleItemMouseEnter = (item: InventoryItem, e: React.MouseEvent) => {
    setHoveredItem(item);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: rect.left, y: rect.top });
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
    setTooltipPos(null);
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'Herb':
        return '🌿 Thảo Dược';
      case 'Ore':
        return '💎 Quặng & Kim Loại';
      case 'Monster Part':
        return '💀 Mẫu Ma Vật';
      case 'Consumable':
        return '🧪 Dược Phẩm Dùng';
      case 'Equipment':
        return '⚔️ Trang Bị Vượt Trội';
      case 'Special':
        return '✨ Vật Phẩm Đặc Biệt';
      default:
        return '📦 Vật Phẩm';
    }
  };

  const getItemUsageHint = (item: InventoryItem) => {
    const typeLower = (item.type || '').toLowerCase();
    const nameLower = (item.name || '').toLowerCase();

    if (typeLower.includes('herb') || nameLower.includes('cỏ') || nameLower.includes('thảo') || nameLower.includes('hipokute')) {
      return 'Dùng làm dược liệu chế tạo Thuốc Hồi Phục Hoàn Toàn (Full Potion) hoặc chữa trị vết thương.';
    }
    if (typeLower.includes('ore') || nameLower.includes('quặng') || nameLower.includes('ngân') || nameLower.includes('đá')) {
      return 'Dùng làm nguyên liệu đúc Vũ Khí Ma Ngân (Magisteel) hoặc mở rộng công trình Lãnh Địa.';
    }
    if (typeLower.includes('monster') || nameLower.includes('quái') || nameLower.includes('lõi') || nameLower.includes('vảy') || nameLower.includes('sừng')) {
      return 'Dùng kỹ năng Thôn Phệ (Predator) để phân tích cấu trúc ma lực hoặc làm nguyên liệu chế tác.';
    }
    if (typeLower.includes('consumable') || nameLower.includes('thuốc') || nameLower.includes('dược') || nameLower.includes('bình')) {
      return 'Sử dụng trực tiếp trong giao tranh hoặc nghỉ ngơi để phục hồi HP/MP khẩn cấp.';
    }
    if (typeLower.includes('equipment') || nameLower.includes('kiếm') || nameLower.includes('giáp') || nameLower.includes('trang bị')) {
      return 'Gia tăng sức mạnh tấn công, khả năng chống chịu và ngưỡng ma lực của bản thân.';
    }
    if (typeLower.includes('special') || nameLower.includes('ấn') || nameLower.includes('chìa') || nameLower.includes('mảnh')) {
      return 'Vật phẩm nhiệm vụ cốt truyện hoặc chìa khóa mở ra bí mật mới trong thế giới Tensura.';
    }
    return 'Vật phẩm ma pháp cất giữ trong túi đồ, có thể sử dụng khi cần thiết.';
  };

  const getCategoryHeaderStyle = (category: SkillCategory) => {
    switch (category) {
      case 'Manas':
        return {
          border: 'border-rose-500/60',
          headerBg: 'bg-gradient-to-r from-rose-950/80 via-purple-950/60 to-slate-950/90',
          title: 'THẦN TRÍ THỂ // マナス (MANAS)',
          rank: 'TỰ NGÃ LINH HỒN',
          text: 'text-rose-300',
          badge: 'bg-rose-950 border-rose-400 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.4)]',
          icon: <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />
        };
      case 'Ultimate':
        return {
          border: 'border-purple-500/60',
          headerBg: 'bg-gradient-to-r from-purple-950/80 via-indigo-950/50 to-slate-950/90',
          title: 'KỸ NĂNG TỐI THƯỢNG // 究極能力 (ULTIMATE SKILL)',
          rank: 'BẬC 4',
          text: 'text-purple-300',
          badge: 'bg-purple-950 border-purple-400 text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.3)]',
          icon: <Award className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />
        };
      case 'Unique':
        return {
          border: 'border-amber-500/60',
          headerBg: 'bg-gradient-to-r from-amber-950/80 via-slate-950/60 to-slate-950/90',
          title: 'KỸ NĂNG ĐỘC NHẤT // 固有技能 (UNIQUE SKILL)',
          rank: 'BẬC 3',
          text: 'text-amber-300',
          badge: 'bg-amber-950 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.25)]',
          icon: <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        };
      case 'Extra':
        return {
          border: 'border-cyan-500/60',
          headerBg: 'bg-gradient-to-r from-cyan-950/70 via-slate-950/60 to-slate-950/90',
          title: 'KỸ NĂNG ĐẶC BIỆT // 特殊技能 (EXTRA SKILL)',
          rank: 'BẬC 2',
          text: 'text-cyan-300',
          badge: 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.2)]',
          icon: <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        };
      case 'Common':
        return {
          border: 'border-slate-700/80',
          headerBg: 'bg-gradient-to-r from-slate-900 via-slate-950 to-slate-950',
          title: 'KỸ NĂNG THÔNG THƯỜNG // 通常技能 (COMMON SKILL)',
          rank: 'BẬC 1',
          text: 'text-slate-300',
          badge: 'bg-slate-900 border-slate-700 text-slate-300',
          icon: <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        };
      case 'Intrinsic':
        return {
          border: 'border-emerald-500/60',
          headerBg: 'bg-gradient-to-r from-emerald-950/70 via-slate-950/60 to-slate-950/90',
          title: 'KỸ NĂNG NỘI TẠI // 種族固有 (INTRINSIC SKILL)',
          rank: 'CHỦNG TỘC',
          text: 'text-emerald-300',
          badge: 'bg-emerald-950 border-emerald-400 text-emerald-300',
          icon: <Dna className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        };
      case 'Resistance':
        return {
          border: 'border-teal-500/60',
          headerBg: 'bg-gradient-to-r from-teal-950/70 via-slate-950/60 to-slate-950/90',
          title: 'KHÁNG TÍNH & MIỄN NHIỄM // 耐性 (RESISTANCE)',
          rank: 'PHÒNG HỘ',
          text: 'text-teal-300',
          badge: 'bg-teal-950 border-teal-400 text-teal-300',
          icon: <Shield className="w-3.5 h-3.5 text-teal-400 shrink-0" />
        };
      case 'Arts':
        return {
          border: 'border-orange-500/60',
          headerBg: 'bg-gradient-to-r from-orange-950/70 via-slate-950/60 to-slate-950/90',
          title: 'VÕ KỸ & ĐẤU KHÍ // 武芸 (ARTS)',
          rank: 'VÕ THUẬT',
          text: 'text-orange-300',
          badge: 'bg-orange-950 border-orange-400 text-orange-200',
          icon: <Swords className="w-3.5 h-3.5 text-orange-400 shrink-0" />
        };
      case 'Magic':
        return {
          border: 'border-blue-500/60',
          headerBg: 'bg-gradient-to-r from-blue-950/70 via-slate-950/60 to-slate-950/90',
          title: 'HỆ THỐNG MA PHÁP // 魔法 (MAGIC)',
          rank: 'MA PHÁP',
          text: 'text-blue-300',
          badge: 'bg-blue-950 border-blue-400 text-blue-300',
          icon: <Wand2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        };
      default:
        return {
          border: 'border-slate-700',
          headerBg: 'bg-slate-950',
          title: 'KỸ NĂNG',
          rank: 'KHÁC',
          text: 'text-slate-300',
          badge: 'bg-slate-900 border-slate-700 text-slate-300',
          icon: <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        };
    }
  };

  const getCategoryBadge = (cat: SkillCategory) => {
    switch (cat) {
      case 'Manas':
        return 'border-rose-400 bg-rose-950/40 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]';
      case 'Ultimate':
        return 'border-purple-400 bg-purple-950/40 text-purple-200 shadow-[0_0_8px_rgba(168,85,247,0.25)]';
      case 'Unique':
        return 'border-amber-400 bg-amber-950/40 text-amber-300';
      case 'Arts':
        return 'border-orange-400 bg-orange-950/40 text-orange-300';
      case 'Magic':
        return 'border-blue-400 bg-blue-950/40 text-blue-300';
      case 'Intrinsic':
        return 'border-emerald-400 bg-emerald-950/40 text-emerald-300';
      case 'Resistance':
        return 'border-teal-400 bg-teal-950/40 text-teal-300';
      case 'Extra':
        return 'border-cyan-400 bg-cyan-950/40 text-cyan-300';
      case 'Common':
      default:
        return 'border-slate-600 bg-slate-800/60 text-slate-300';
    }
  };

  const getItemIcon = (item: InventoryItem) => {
    const typeLower = (item.type || '').toLowerCase();
    const nameLower = (item.name || '').toLowerCase();

    if (typeLower.includes('herb') || nameLower.includes('cỏ') || nameLower.includes('thảo') || nameLower.includes('lá')) {
      return <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (typeLower.includes('ore') || nameLower.includes('quặng') || nameLower.includes('đá') || nameLower.includes('ngân') || nameLower.includes('kim loại')) {
      return <Gem className="w-4 h-4 text-cyan-400 shrink-0" />;
    }
    if (typeLower.includes('monster') || typeLower.includes('part') || nameLower.includes('quái') || nameLower.includes('vảy') || nameLower.includes('răng') || nameLower.includes('sừng') || nameLower.includes('lõi') || nameLower.includes('da')) {
      return <Skull className="w-4 h-4 text-rose-400 shrink-0" />;
    }
    if (typeLower.includes('consumable') || typeLower.includes('potion') || nameLower.includes('thuốc') || nameLower.includes('dược') || nameLower.includes('bình')) {
      return <FlaskConical className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (typeLower.includes('equipment') || typeLower.includes('weapon') || nameLower.includes('kiếm') || nameLower.includes('giáp') || nameLower.includes('khiên') || nameLower.includes('cung') || nameLower.includes('gậy')) {
      return <Swords className="w-4 h-4 text-purple-400 shrink-0" />;
    }
    if (typeLower.includes('special') || nameLower.includes('mảnh') || nameLower.includes('chìa') || nameLower.includes('ấn') || nameLower.includes('chỉ dẫn')) {
      return <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />;
    }

    return <Package className="w-4 h-4 text-slate-400 shrink-0" />;
  };

  const hpPercent = Math.min(100, Math.max(0, Math.round((character.hp / (character.maxHp || 1)) * 100)));
  const mpPercent = Math.min(100, Math.max(0, Math.round((character.mp / (character.maxMp || 1)) * 100)));

  const content = (
    <div className="h-full flex flex-col bg-slate-900/85 border border-cyan-500/25 p-3 rounded-sm shadow-2xl text-slate-200 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-slate-800 pb-2 space-y-1">
        <h2 className="text-center text-[10px] font-bold text-cyan-400 tracking-widest uppercase font-mono flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
          STATUS WINDOW
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
        </h2>

        <div className="flex items-center justify-between pt-1">
          <div className="min-w-0 truncate">
            <h3 className="text-base font-bold text-white tracking-wide truncate">{character.name}</h3>
            <p className="text-[10px] font-mono text-cyan-400/80 truncate">
              {character.raceTitle} // {character.title}
            </p>
          </div>
          <div className="text-right font-mono text-[9px] text-slate-400 shrink-0">
            <span className="px-1.5 py-0.5 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 uppercase font-bold">
              STAGE 0{character.evolutionStage}
            </span>
            <p className="mt-0.5">TURN #{character.turn}</p>
          </div>
        </div>
      </div>

      {/* HP & MP Gauges */}
      <div className="shrink-0 space-y-1.5 py-1.5">
        {/* HP Bar */}
        <div>
          <div className="flex justify-between text-[9px] font-mono mb-0.5 text-slate-300">
            <span className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider">
              <Heart className="w-2.5 h-2.5 fill-emerald-500/30 text-emerald-400" /> HP
            </span>
            <span>{character.hp} / {character.maxHp}</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 border border-slate-800 p-0.2">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_6px_rgba(16,185,129,0.5)]"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* MP Bar */}
        <div>
          <div className="flex justify-between text-[9px] font-mono mb-0.5 text-slate-300">
            <span className="flex items-center gap-1 text-cyan-400 font-bold uppercase tracking-wider">
              <Zap className="w-2.5 h-2.5 fill-cyan-500/30 text-cyan-400" /> MP / MAGICULE
            </span>
            <span>{character.mp} / {character.maxMp}</span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 border border-slate-800 p-0.2">
            <div
              className="bg-cyan-500 h-full transition-all duration-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
              style={{ width: `${mpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="shrink-0 flex border-b border-slate-800 gap-1 font-mono text-[10px] overflow-x-auto custom-scrollbar pb-1">
        <button
          onClick={() => setActiveTab('skills')}
          className={`py-1 px-1.5 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'skills'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          KỸ NĂNG ({characterSkills.length})
        </button>

        <button
          onClick={() => setActiveTab('evolution')}
          className={`py-1 px-1.5 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
            activeTab === 'evolution'
              ? 'border-rose-400 text-rose-300 bg-rose-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Dna className="w-3 h-3 text-rose-400" />
          <span>TIẾN HÓA</span>
        </button>

        <button
          onClick={() => setActiveTab('titles')}
          className={`py-1 px-1.5 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap flex items-center gap-1 cursor-pointer ${
            activeTab === 'titles'
              ? 'border-amber-400 text-amber-300 bg-amber-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-3 h-3 text-amber-400" />
          <span>DANH HIỆU ({titleTotals.unlockedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-1 px-1.5 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'inventory'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          TÚI ĐỒ ({characterInventory.length})
        </button>

        <button
          onClick={() => setActiveTab('territory')}
          className={`py-1 px-1.5 font-bold tracking-wider uppercase transition-all border-b-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'territory'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          LÃNH ĐỊA
        </button>
      </div>

      {/* Tab Content duy nhất một khung cuộn dọc */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 pt-2 space-y-3">
        {activeTab === 'skills' && (
          <div className="space-y-2.5">
            {/* Skill Library Trigger Banner */}
            <button
              onClick={() => setIsSkillLibraryOpen(true)}
              className="w-full py-2 px-3 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono text-xs font-bold uppercase tracking-wider rounded-sm flex items-center justify-between transition-all group shadow-[0_0_12px_rgba(6,182,212,0.15)] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>THƯ VIỆN KỸ NĂNG CHI TIẾT</span>
              </div>
              <span className="text-[10px] bg-cyan-900/90 border border-cyan-400/60 px-1.5 py-0.5 rounded-sm font-black">
                {characterSkills.length} KỸ NĂNG
              </span>
            </button>

            {/* Quick Search & Tensura Tier / Type Filter Toolbar */}
            <div className="space-y-2 p-2.5 bg-slate-950/70 border border-slate-800 rounded-sm">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={skillSearchTerm}
                  onChange={(e) => setSkillSearchTerm(e.target.value)}
                  placeholder="Tìm theo tên, Kanji (捕食者, 智慧之王), Lord Concept..."
                  className="w-full pl-8 pr-7 py-1.5 bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors rounded-sm"
                />
                {skillSearchTerm && (
                  <button
                    onClick={() => setSkillSearchTerm('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs font-mono cursor-pointer"
                    title="Xóa tìm kiếm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Tensura Hierarchy Tier Filter Pills */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                  <span className="font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>THỨ BẬC TENSURA:</span>
                  </span>
                  <button
                    onClick={() => setTierSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center gap-1 text-[9px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/30 px-1.5 py-0.5 rounded-sm transition-colors cursor-pointer"
                    title="Chuyển đổi hướng sắp xếp thứ bậc kỹ năng"
                  >
                    <ArrowUpDown className="w-2.5 h-2.5" />
                    <span>{tierSortDirection === 'asc' ? 'Common → Manas (Tăng dần)' : 'Manas → Common (Cao cấp trước)'}</span>
                  </button>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 font-mono text-[10px]">
                  <button
                    onClick={() => setSkillCategoryFilter('All')}
                    className={`px-2 py-0.5 font-bold uppercase transition-all rounded-sm whitespace-nowrap cursor-pointer ${
                      skillCategoryFilter === 'All'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Tất cả ({characterSkills.length})
                  </button>
                  {(tierSortDirection === 'asc' ? ASCENDING_TIER_ORDER : DESCENDING_TIER_ORDER).filter(cat => (categoryCounts[cat] || 0) > 0).map((cat) => {
                    const meta = TENSURA_CATEGORY_METADATA[cat];
                    const count = categoryCounts[cat] || 0;
                    const isSelected = skillCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSkillCategoryFilter(cat)}
                        className={`px-2 py-0.5 font-bold uppercase transition-all rounded-sm whitespace-nowrap cursor-pointer flex items-center gap-1 border ${
                          isSelected
                            ? `${meta.themeColor.badge} border-cyan-400 shadow-sm`
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800 hover:bg-slate-900'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-[9px] opacity-75 font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Type Filter Buttons (Chủ động / Bị động) */}
              <div className="flex items-center justify-between font-mono text-[10px] pt-1.5 border-t border-slate-800/70">
                <div className="flex items-center gap-1">
                  <span className="text-slate-400 font-bold mr-0.5">Loại:</span>
                  {(['All', 'Chủ động', 'Bị động'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSkillTypeFilter(t)}
                      className={`px-2 py-0.5 font-bold uppercase transition-all rounded-sm cursor-pointer ${
                        skillTypeFilter === t
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800 hover:bg-slate-900'
                      }`}
                    >
                      {t === 'All' ? 'Tất cả' : t === 'Chủ động' ? '⚡ Chủ động' : '🛡️ Bị động'}
                    </button>
                  ))}
                </div>
                <span className="text-slate-500 font-mono text-[10px]">
                  Hiển thị: {filteredSkills.length}/{characterSkills.length}
                </span>
              </div>
            </div>

            {/* Hierarchical Grouped Skills List */}
            <div className="space-y-3.5">
              {groupedSkills.length === 0 ? (
                <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-sm text-center space-y-1 font-mono">
                  <p className="text-xs text-slate-400">Không tìm thấy kỹ năng phù hợp trong phân cấp Tensura.</p>
                  <p className="text-[10px] text-slate-600">Thử thay đổi từ khóa hoặc bộ lọc phân cấp / loại kỹ năng.</p>
                </div>
              ) : (
                groupedSkills.map((group) => {
                  const headerInfo = getCategoryHeaderStyle(group.category);
                  return (
                    <div
                      key={group.category}
                      className={`border ${headerInfo.border} bg-slate-950/90 rounded-sm overflow-hidden shadow-sm`}
                    >
                      {/* Tier Group Header */}
                      <div className={`px-2.5 py-1.5 ${headerInfo.headerBg} border-b ${headerInfo.border} flex items-center justify-between`}>
                        <div className="flex items-center gap-1.5 min-w-0">
                          {headerInfo.icon}
                          <div className="truncate">
                            <span className={`font-mono font-black text-xs uppercase tracking-wider ${headerInfo.text}`}>
                              {headerInfo.title}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono text-[9px] shrink-0">
                          <span className={`px-1.5 py-0.2 rounded-sm font-bold border ${headerInfo.badge}`}>
                            {headerInfo.rank}
                          </span>
                          <span className="px-1.5 py-0.2 bg-slate-900/90 border border-slate-700 text-slate-300 font-bold rounded-sm">
                            {group.skills.length}
                          </span>
                        </div>
                      </div>

                      {/* Skills within this Tier */}
                      <div className="p-2 space-y-2">
                        {group.skills.map((rawSkill, index) => {
                          const skill = getEnrichedSkillDetails(rawSkill);
                          const cls = getSkillClassification(skill);
                          const evolutionHint = getSkillEvolutionPotential(skill);
                          return (
                            <div
                              key={`${skill.id || 'skill'}_${group.category}_${index}_${skill.name}`}
                              onClick={() => setIsSkillLibraryOpen(true)}
                              title={evolutionHint ? `${skill.name} • ${evolutionHint}` : skill.name}
                              className={`p-2.5 bg-slate-900/80 border-l-2 ${getCategoryBadge(
                                skill.category
                              )} border-y border-r border-slate-800 space-y-1.5 cursor-pointer hover:border-slate-700 transition-colors group rounded-sm`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex flex-col">
                                  <span className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                                    {skill.category === 'Manas' && <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse shrink-0" />}
                                    {skill.category === 'Ultimate' && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse shrink-0" />}
                                    {skill.category === 'Unique' && <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />}
                                    [{skill.name}]
                                  </span>
                                  {skill.japaneseName && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                      {skill.japaneseName} {skill.lordConcept ? `// [${skill.lordConcept}]` : ''}
                                    </span>
                                  )}
                                </div>
                                <span className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 border rounded-sm font-bold shrink-0 ${getCategoryBadge(skill.category)}`}>
                                  {skill.category}
                                </span>
                              </div>

                              {/* Classification & Attribute Badges */}
                              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                                <span className={`px-1.5 py-0.2 rounded-sm font-bold border ${
                                  cls.type === 'Chủ động'
                                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                                    : 'bg-blue-950/60 border-blue-500/40 text-blue-300'
                                }`}>
                                  {cls.type === 'Chủ động' ? '⚡ Chủ Động' : '🛡️ Bị Động'}
                                </span>

                                <span className={`px-1.5 py-0.2 rounded-sm font-bold border ${
                                  cls.attribute === 'Quy luật'
                                    ? 'bg-purple-950/60 border-purple-400 text-purple-300'
                                    : cls.attribute === 'Tấn công'
                                    ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                                    : cls.attribute === 'Phòng thủ'
                                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                                    : cls.attribute === 'Hỗ trợ'
                                    ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300'
                                    : 'bg-slate-900 border-slate-700 text-slate-300'
                                }`}>
                                  {cls.attribute}
                                </span>

                                {skill.subSkills && skill.subSkills.length > 0 && (
                                  <span className="px-1.5 py-0.2 rounded-sm font-bold border bg-indigo-950/60 border-indigo-400 text-indigo-300 flex items-center gap-1">
                                    <GitBranch className="w-2.5 h-2.5 text-indigo-400" />
                                    {skill.subSkills.length} Sub-skills
                                  </span>
                                )}

                                {cls.type === 'Chủ động' && (
                                  <span className="px-1.5 py-0.2 rounded-sm font-bold border bg-cyan-950/50 border-cyan-500/30 text-cyan-300 ml-auto">
                                    {cls.mpCost > 0 ? `${cls.mpCost} MP` : '0 MP'}
                                  </span>
                                )}
                              </div>

                              <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">{skill.description}</p>

                              {/* Evolution Potential Recommendation Box */}
                              {evolutionHint && (
                                <div className="p-1.5 bg-gradient-to-r from-cyan-950/50 via-slate-950/80 to-slate-950/60 border border-cyan-500/30 rounded-sm flex items-start gap-1.5 font-mono text-[10px] text-cyan-300">
                                  <TrendingUp className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                                  <div className="leading-snug">
                                    <span className="font-bold text-cyan-200 uppercase tracking-wider">Tiềm Năng Tiến Hóa: </span>
                                    <span className="text-cyan-300 font-sans">{evolutionHint.replace(/^Tiềm năng tiến hóa:\s*/i, '').replace(/^Có thể tiến hóa thành:\s*/i, '')}</span>
                                  </div>
                                </div>
                              )}

                              {/* Skill XP Progress Bar */}
                              <div className="pt-1 border-t border-slate-900">
                                <SkillProgressBar skill={skill} compact={true} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'evolution' && (() => {
          const currentFactors = character.evolutionFactors || INITIAL_EVOLUTION_FACTORS;
          const factorEval = evaluateFactorDominance(currentFactors);
          const totalFactorScore = Object.values(currentFactors).map(Number).reduce((a, b) => a + b, 0) || 1;
          const nextStage = (character.evolutionStage || 1) + 1;
          const nextBranches = RACE_EVOLUTION_BRANCHES[character.race]?.[nextStage] || [];

          return (
            <div className="space-y-4 font-mono">
              {/* Dynamic Evolution Mechanism Banner */}
              <div className="p-3 bg-gradient-to-r from-rose-950/40 via-purple-950/40 to-slate-950 border border-rose-500/50 rounded-sm space-y-2 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
                <div className="flex items-center justify-between border-b border-rose-500/30 pb-1.5 text-xs">
                  <div className="flex items-center gap-2 font-bold text-rose-300">
                    <Dna className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>HỆ THỐNG TIẾN HÓA THÍCH ỨNG (DYNAMIC EVOLUTION)</span>
                  </div>
                  <span className="text-[10px] bg-rose-950 border border-rose-400/60 px-2 py-0.5 text-rose-200 font-bold uppercase rounded-sm">
                    GIAI ĐOẠN 0{character.evolutionStage || 1}
                  </span>
                </div>

                <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                  Tiến hóa Chủng tộc & Kỹ năng trong Tensura không cố định. Hệ thống tự động ghi nhận mọi hành động thực tế (Săn bắn, Nuốt chửng, Phân tích, Bảo vệ lãnh địa, Thi triển ma pháp).
                </p>

                {/* Dominance vs Balance Status Alert */}
                <div className={`p-2 rounded-sm border text-[11px] font-mono flex items-start gap-2 ${
                  factorEval.isDominant
                    ? 'bg-rose-950/60 border-rose-500/70 text-rose-200'
                    : 'bg-cyan-950/60 border-cyan-500/70 text-cyan-200'
                }`}>
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase tracking-wider block">
                      {factorEval.isDominant
                        ? `⚡ THIÊN HƯỚNG ÁP ĐẢO: [${FACTOR_METADATA[factorEval.dominantKey].name}]`
                        : '✨ TRẠNG THÁI CÂN BẰNG ĐA HƯỚNG (ĐA SỐ MỆNH)'}
                    </span>
                    <p className="font-sans text-[11px] text-slate-300">
                      {factorEval.isDominant
                        ? `Yếu tố [${FACTOR_METADATA[factorEval.dominantKey].shortName}] đang dẫn đầu vượt trội (+${factorEval.leadMargin}đ, ${factorEval.topFactor.percentage}%). Giọng Nói Thế Giới sẽ tự động đột biến theo hướng này khi đủ ma lượng!`
                        : 'Các yếu tố hành động phát triển đồng đều. Khi tiến hóa, Giọng Nói Thế Giới sẽ trao cho bạn quyền tự quyết định nhánh tiến hóa mong muốn!'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 6 Evolution Factor Gauges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>ĐIỂM TÍCH LŨY YẾU TỐ TIẾN HÓA:</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Tổng điểm: {totalFactorScore}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(currentFactors) as (keyof typeof currentFactors)[]).map((key) => {
                    const meta = FACTOR_METADATA[key];
                    const score = currentFactors[key] || 0;
                    const pct = Math.round((score / totalFactorScore) * 100);
                    const isLeading = factorEval.dominantKey === key;

                    return (
                      <div
                        key={key}
                        className={`p-2.5 bg-slate-950 border rounded-sm space-y-1.5 ${
                          isLeading ? 'border-amber-400/80 bg-slate-900/80 shadow-[0_0_10px_rgba(251,191,36,0.15)]' : meta.borderColor
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-bold text-slate-200">
                            <span>{meta.icon}</span>
                            <span>{meta.name}</span>
                          </div>
                          <span className={`font-mono font-bold ${meta.color}`}>
                            {score}đ ({pct}%)
                          </span>
                        </div>

                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
                          <div
                            className={`h-full transition-all duration-300 ${
                              isLeading ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${Math.min(100, pct * 2.5)}%` }}
                          />
                        </div>

                        <p className="text-[10px] font-sans text-slate-400 line-clamp-1">
                          {meta.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Evolution Branches Preview */}
              {nextBranches.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <span className="flex items-center gap-1.5">
                      <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                      <span>CÁC NHÁNH TIẾN HÓA CHỦNG TỘC (GIAI ĐOẠN {nextStage}):</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{nextBranches.length} Nhánh</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {nextBranches.map((branch) => (
                      <div
                        key={branch.id}
                        className="p-2.5 bg-slate-950/90 border border-slate-800 hover:border-cyan-500/60 rounded-sm space-y-1.5 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg p-1 bg-slate-900 border border-slate-800 rounded-sm">
                              {branch.icon}
                            </span>
                            <div>
                              <div className="font-bold text-xs text-slate-200">
                                {branch.name}
                              </div>
                              <div className="text-[10px] text-cyan-400 font-mono">
                                {branch.factorFocusTitle}
                              </div>
                            </div>
                          </div>

                          <div className="text-[10px] font-mono text-emerald-400 text-right">
                            +{branch.statBonuses.maxHp} HP | +{branch.statBonuses.maxMp} MP
                          </div>
                        </div>

                        <p className="text-[11px] font-sans text-slate-400">
                          {branch.description}
                        </p>

                        {branch.grantedSkills && branch.grantedSkills.length > 0 && (
                          <div className="text-[10px] text-amber-300 flex items-center gap-1 flex-wrap">
                            <span>Thức tỉnh:</span>
                            {branch.grantedSkills.map((s, i) => (
                              <strong key={typeof s === 'string' ? s : s.name || i} className="text-cyan-300 font-mono">
                                [{typeof s === 'string' ? s : s.name}]
                              </strong>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Evolution Potential Section */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>TIỀM NĂNG THĂNG HOA KỸ NĂNG (SKILL EVOLUTION):</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Thích ứng theo hành động</span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {characterSkills.map((rawSkill) => {
                    const skill = getEnrichedSkillDetails(rawSkill);
                    const hint = getSkillEvolutionPotential(skill);
                    const isMaxLevel = (skill.level || 1) >= 10;
                    return (
                      <div
                        key={skill.id || skill.name}
                        className={`p-2.5 bg-slate-950/90 border rounded-sm space-y-1.5 transition-colors ${
                          isMaxLevel ? 'border-purple-500/70 shadow-[0_0_10px_rgba(168,85,247,0.15)]' : 'border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white font-mono">[{skill.name}]</span>
                            <span className={`text-[9px] px-1 py-0.2 rounded-sm font-mono uppercase font-bold ${getCategoryBadge(skill.category)}`}>
                              {skill.category}
                            </span>
                          </div>
                          <div className="text-[10px] font-mono text-cyan-400">
                            Cấp {skill.level || 1}/10 {isMaxLevel && <span className="text-amber-400 font-bold">(ĐỦ ĐIỀU KIỆN TIẾN HÓA)</span>}
                          </div>
                        </div>

                        {hint && (
                          <p className="text-[11px] text-cyan-300 font-sans leading-snug">
                            {hint}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Evolution History if any */}
              {character.evolutionHistory && character.evolutionHistory.length > 0 && (
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-sm space-y-1.5 text-xs font-mono">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">
                    📜 LỊCH SỬ THĂNG HOA CHỦNG TỘC:
                  </span>
                  <ul className="space-y-1 text-[11px] text-slate-300">
                    {character.evolutionHistory.map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-cyan-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })()}

        {activeTab === 'titles' && (
          <div className="space-y-3 font-mono">
            {/* Total Bonus Stats Banner */}
            <div className="p-2.5 bg-amber-950/40 border border-amber-500/50 rounded-sm space-y-2 shadow-[0_0_15px_rgba(245,158,11,0.12)]">
              <div className="flex items-center justify-between border-b border-amber-500/30 pb-1 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>CHỈ SỐ THƯỞNG ẨN TỪ DANH HIỆU</span>
                </div>
                <span className="text-[10px] bg-amber-900/80 px-1.5 py-0.2 border border-amber-400/50 text-amber-200 font-bold">
                  {titleTotals.unlockedCount} / {titleTotals.totalCount} ĐÃ MỞ
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] pt-0.5">
                <div className="bg-slate-950/80 border border-slate-800 p-1.5 rounded-sm flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">💚 HP Thưởng:</span>
                  <span className="font-bold text-emerald-400">+{titleTotals.hpBonus}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-1.5 rounded-sm flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">⚡ MP Thưởng:</span>
                  <span className="font-bold text-cyan-400">+{titleTotals.mpBonus}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-1.5 rounded-sm flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">⚔️ Tấn Công:</span>
                  <span className="font-bold text-rose-400">+{titleTotals.atkBonus}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-1.5 rounded-sm flex items-center justify-between">
                  <span className="text-slate-400 text-[10px]">🛡️ Chống Chịu:</span>
                  <span className="font-bold text-amber-300">+{titleTotals.defBonus}</span>
                </div>
                <div className="bg-slate-950/80 border border-slate-800 p-1.5 rounded-sm flex items-center justify-between col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[10px]">✨ Ma Lực:</span>
                  <span className="font-bold text-purple-300">+{titleTotals.magicBonus}</span>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-1.5 text-[10px]">
              <button
                onClick={() => setTitleFilter('all')}
                className={`px-2 py-0.5 border rounded-sm font-bold transition-all ${
                  titleFilter === 'all'
                    ? 'bg-amber-950 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                TẤT CẢ ({titleTotals.totalCount})
              </button>
              <button
                onClick={() => setTitleFilter('unlocked')}
                className={`px-2 py-0.5 border rounded-sm font-bold transition-all ${
                  titleFilter === 'unlocked'
                    ? 'bg-emerald-950 border-emerald-400 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ĐÃ MỞ ({titleTotals.unlockedCount})
              </button>
              <button
                onClick={() => setTitleFilter('locked')}
                className={`px-2 py-0.5 border rounded-sm font-bold transition-all ${
                  titleFilter === 'locked'
                    ? 'bg-rose-950 border-rose-400 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                CHƯA MỞ ({titleTotals.totalCount - titleTotals.unlockedCount})
              </button>
            </div>

            {/* Titles List */}
            <div className="space-y-2">
              {filteredTitles.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">Không tìm thấy danh hiệu tương ứng.</p>
              ) : (
                filteredTitles.map(title => {
                  const isEquipped = (character.equippedTitleId === title.id) || (character.title === title.name);
                  return (
                    <div
                      key={title.id}
                      className={`p-2.5 rounded-sm border transition-all space-y-1.5 ${
                        title.unlocked
                          ? isEquipped
                            ? 'bg-amber-950/30 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.15)]'
                            : 'bg-slate-950/90 border-slate-800 hover:border-slate-700'
                          : 'bg-slate-950/40 border-slate-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <Award className={`w-4 h-4 shrink-0 ${title.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                          <span className={`font-bold text-xs ${title.unlocked ? 'text-white' : 'text-slate-400'}`}>
                            {title.name}
                          </span>
                          {isEquipped && (
                            <span className="px-1.5 py-0.2 bg-amber-950 border border-amber-400 text-amber-300 text-[9px] font-black uppercase rounded-sm">
                              👑 ĐANG TRANG BỊ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {title.category && (
                            <span className="text-[9px] px-1.5 py-0.2 bg-slate-900 border border-slate-800 text-slate-400">
                              {title.category}
                            </span>
                          )}
                          <span className={`text-[9px] px-1.5 py-0.2 font-bold uppercase rounded-sm border ${getRarityBadgeStyle(title.rarity)}`}>
                            {title.rarity}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-300 font-sans leading-relaxed italic">
                        "{title.description}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
                        {/* Stat Bonus Badges */}
                        <div className="flex flex-wrap items-center gap-1 text-[10px]">
                          <span className="text-amber-400 font-bold mr-1">THƯỞNG:</span>
                          {title.bonus.hpBonus && <span className="px-1.5 py-0.2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-bold">+{title.bonus.hpBonus} HP</span>}
                          {title.bonus.mpBonus && <span className="px-1.5 py-0.2 bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold">+{title.bonus.mpBonus} MP</span>}
                          {title.bonus.atkBonus && <span className="px-1.5 py-0.2 bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold">+{title.bonus.atkBonus} ATK</span>}
                          {title.bonus.defBonus && <span className="px-1.5 py-0.2 bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">+{title.bonus.defBonus} DEF</span>}
                          {title.bonus.magicBonus && <span className="px-1.5 py-0.2 bg-purple-950/60 border border-purple-500/40 text-purple-300 font-bold">+{title.bonus.magicBonus} Ma Lực</span>}
                        </div>

                        {/* Action / Lock status */}
                        <div>
                          {title.unlocked ? (
                            isEquipped ? (
                              <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-amber-400" /> Đã Kích Hoạt
                              </span>
                            ) : (
                              <button
                                onClick={() => onEquipTitle?.(title.id)}
                                className="px-2 py-0.5 bg-amber-950 hover:bg-amber-900 border border-amber-400/80 text-amber-300 text-[10px] font-bold uppercase rounded-sm transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <span>TRANG BỊ</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            )
                          ) : (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 italic">
                              <Lock className="w-3 h-3 text-slate-600" /> {title.requirementHint}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-3 font-mono">
            {characterInventory.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Túi đồ rỗng.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {characterInventory.map(item => (
                  <div
                    key={item.id}
                    onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                    onMouseLeave={handleItemMouseLeave}
                    className="flex items-center justify-between p-2.5 bg-slate-950 border border-slate-800 text-xs hover:border-cyan-500/60 hover:bg-slate-900/80 transition-all rounded-sm cursor-pointer group relative"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Item Icon with glow on hover */}
                      <div className="p-2 bg-slate-900 border border-slate-800 group-hover:border-cyan-400 group-hover:bg-cyan-950/40 rounded-sm shrink-0 flex items-center justify-center transition-all shadow-sm">
                        {getItemIcon(item)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">{item.name}</p>
                          <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.2 bg-slate-900 border border-slate-800 text-cyan-400/80 rounded-sm">
                            {item.type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] shrink-0 ml-2 shadow-sm">
                      x{item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Live Item Usage Banner */}
            {hoveredItem ? (
              <div className="p-2.5 bg-slate-950 border border-cyan-500/60 rounded-sm text-[11px] font-mono space-y-1 animate-fade-in shadow-[0_0_15px_rgba(34,211,238,0.15)]">
                <div className="flex items-center justify-between text-cyan-300 font-bold text-xs border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1.5">
                    {getItemIcon(hoveredItem)}
                    <span>{hoveredItem.name}</span>
                  </span>
                  <span className="text-[10px] text-amber-300 font-normal px-1.5 py-0.2 bg-amber-950 border border-amber-500/40 rounded-sm">
                    {getItemTypeLabel(hoveredItem.type)}
                  </span>
                </div>
                <p className="text-slate-300 font-sans text-xs pt-0.5 leading-relaxed">
                  {hoveredItem.description || 'Chưa có thông tin mô tả chi tiết.'}
                </p>
                <div className="text-[10px] text-amber-400/90 pt-1 border-t border-slate-900 flex items-start gap-1">
                  <span className="font-bold shrink-0">💡 CÔNG DỤNG:</span>
                  <span className="text-slate-200 font-sans">{getItemUsageHint(hoveredItem)}</span>
                </div>
              </div>
            ) : (
              <div className="p-2 bg-slate-950/60 border border-slate-800/80 rounded-sm text-[10px] text-slate-500 font-mono text-center">
                💬 Di chuột vào biểu tượng/vật phẩm để xem mô tả công dụng chi tiết.
              </div>
            )}
          </div>
        )}

        {activeTab === 'territory' && (
          <div className="p-3 bg-slate-950 border border-slate-800 space-y-2.5 text-xs font-mono rounded-sm">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500 uppercase">Tên Lãnh Địa:</span>
              <span className="font-bold text-cyan-300">{territory.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500 uppercase">Cấp Lãnh Địa:</span>
              <span className="font-bold text-amber-300">Cấp {territory.level} - {territory.levelTitle}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <span className="text-slate-500 uppercase">Dân Số:</span>
              <span className="font-bold text-emerald-400">{territory.population} Cư dân</span>
            </div>
            <div>
              <span className="text-slate-500 uppercase block mb-1 text-[10px]">Công Trình:</span>
              <div className="flex flex-wrap gap-1">
                {(territory.buildings || []).map((b, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 text-[10px] rounded-sm">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <SkillLibraryModal
        skills={characterSkills}
        isOpen={isSkillLibraryOpen}
        onClose={() => setIsSkillLibraryOpen(false)}
      />

      {/* Floating Detailed Tooltip on Icon Hover */}
      {hoveredItem && tooltipPos && (
        <div
          style={{
            top: Math.max(10, tooltipPos.y - 130),
            left: Math.min(
              typeof window !== 'undefined' ? window.innerWidth - 270 : 300,
              Math.max(10, tooltipPos.x + 10)
            ),
          }}
          className="fixed z-50 w-64 p-3 bg-slate-950/95 border-2 border-cyan-400/80 rounded-sm shadow-[0_0_25px_rgba(0,0,0,0.95)] backdrop-blur-md pointer-events-none text-xs font-sans animate-fade-in space-y-2"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <div className="flex items-center gap-2 font-mono font-bold text-cyan-300">
              <div className="p-1.5 bg-cyan-950 border border-cyan-500/50 rounded-sm">
                {getItemIcon(hoveredItem)}
              </div>
              <span className="truncate max-w-[130px]">{hoveredItem.name}</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-950 border border-amber-500/40 text-amber-300 rounded-sm shrink-0 font-bold">
              {getItemTypeLabel(hoveredItem.type)}
            </span>
          </div>

          <div className="space-y-1.5">
            <div>
              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold block mb-0.5">
                [MÔ TẢ VẬT PHẨM]:
              </span>
              <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                {hoveredItem.description || 'Vật phẩm ma pháp chưa ghi nhận thông tin.'}
              </p>
            </div>

            <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-sm text-[10px] font-mono text-cyan-300">
              <span className="font-bold text-amber-300 block mb-0.5">💡 CÔNG DỤNG & GỢI Ý:</span>
              <span className="text-slate-300 font-sans block leading-normal">
                {getItemUsageHint(hoveredItem)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-800/80">
              <span>SỐ LƯỢNG HIỆN CÓ:</span>
              <span className="text-emerald-400 font-bold text-xs font-mono">x{hoveredItem.quantity}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-sans">
        <div className="w-full max-w-2xl max-h-[92vh] flex flex-col bg-slate-950 border-2 border-cyan-500/50 rounded-sm shadow-[0_0_40px_rgba(6,182,212,0.2)] overflow-hidden relative">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-cyan-500/30 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-black text-white uppercase tracking-wider">
                BẢNG TRẠNG THÁI & HỆ THỐNG NĂNG LỰC
              </span>
            </div>
            <button
              onClick={onCloseModal}
              className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-sm border border-slate-700 font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              [ĐÓNG X]
            </button>
          </div>
          <div className="overflow-hidden flex-1 p-2 sm:p-4">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
