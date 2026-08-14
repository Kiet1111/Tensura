import React, { useState } from 'react';
import { Skill, SkillCategory, SkillType, SkillAttribute, SubSkill } from '../types';
import { getSkillClassification, getEnrichedSkillDetails, TENSURA_CATEGORY_METADATA } from '../utils/skillUtils';
import { getSkillArchive } from '../utils/skillArchiveUtils';
import { SkillProgressBar } from './SkillProgressBar';
import {
  Sparkles,
  Shield,
  Zap,
  Award,
  BookOpen,
  Search,
  X,
  Swords,
  Wand2,
  SlidersHorizontal,
  Flame,
  Info,
  Layers,
  Radio,
  Archive,
  Compass,
  GitBranch,
  Dna,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  skills: Skill[];
  isOpen: boolean;
  onClose: () => void;
}

export const SkillLibraryModal: React.FC<Props> = ({ skills, isOpen, onClose }) => {
  const [modalTab, setModalTab] = useState<'library' | 'taxonomyGuide'>('library');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'All'>('All');
  const [selectedType, setSelectedType] = useState<SkillType | 'All'>('All');
  const [selectedAttribute, setSelectedAttribute] = useState<SkillAttribute | 'All'>('All');
  const [inspectingSkill, setInspectingSkill] = useState<Skill | null>(null);

  if (!isOpen) return null;

  const archivedSkills = getSkillArchive();
  const currentSkillNames = new Set((skills || []).map(s => s.name.trim().toLowerCase()));

  const combinedSkillsList = [
    ...(skills || []).map(s => ({ ...s, isFromArchive: false })),
    ...archivedSkills
      .filter(s => !currentSkillNames.has(s.name.trim().toLowerCase()))
      .map(s => ({ ...s, isFromArchive: true }))
  ];

  // Process & Enrich all skills with Tensura canon attributes and sub-skills
  const enrichedSkills = combinedSkillsList.map((rawSkill) => {
    const enriched = getEnrichedSkillDetails(rawSkill);
    const classification = getSkillClassification(enriched);
    return {
      ...enriched,
      type: classification.type,
      attribute: classification.attribute,
      mpCost: classification.mpCost,
      isFromArchive: rawSkill.isFromArchive,
    };
  });

  // Filter skills
  const filteredSkills = enrichedSkills.filter((skill) => {
    const matchesSearch =
      skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.japaneseName && skill.japaneseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (skill.lordConcept && skill.lordConcept.toLowerCase().includes(searchTerm.toLowerCase())) ||
      skill.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || skill.category === selectedCategory;
    const matchesType = selectedType === 'All' || skill.type === selectedType;
    const matchesAttribute = selectedAttribute === 'All' || skill.attribute === selectedAttribute;

    return matchesSearch && matchesCategory && matchesType && matchesAttribute;
  });

  // Summary counts
  const totalCount = skills.length;
  const activeCount = enrichedSkills.filter((s) => s.type === 'Chủ động').length;
  const passiveCount = enrichedSkills.filter((s) => s.type === 'Bị động').length;
  const offenseCount = enrichedSkills.filter((s) => s.attribute === 'Tấn công').length;
  const defenseCount = enrichedSkills.filter((s) => s.attribute === 'Phòng thủ').length;
  const supportCount = enrichedSkills.filter((s) => s.attribute === 'Hỗ trợ').length;

  const getCategoryBadgeStyle = (category: SkillCategory) => {
    const meta = TENSURA_CATEGORY_METADATA[category] || TENSURA_CATEGORY_METADATA.Common;
    return `${meta.themeColor.badge} border shadow-xs`;
  };

  const getCategoryIcon = (category: SkillCategory) => {
    switch (category) {
      case 'Manas':
        return <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />;
      case 'Ultimate':
        return <Award className="w-4 h-4 text-purple-400 animate-pulse" />;
      case 'Unique':
        return <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'Extra':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Arts':
        return <Swords className="w-4 h-4 text-orange-400" />;
      case 'Magic':
        return <Wand2 className="w-4 h-4 text-blue-400" />;
      case 'Intrinsic':
        return <Dna className="w-4 h-4 text-emerald-400" />;
      case 'Resistance':
        return <Shield className="w-4 h-4 text-teal-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBadge = (type: SkillType) => {
    if (type === 'Chủ động') {
      return (
        <span className="px-2 py-0.5 bg-amber-950/80 border border-amber-500/50 text-amber-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400 shrink-0" />
          Chủ Động
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-blue-950/80 border border-blue-500/50 text-blue-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
        <Shield className="w-3 h-3 text-blue-400 shrink-0" />
        Bị Động
      </span>
    );
  };

  const getAttributeBadge = (attr: SkillAttribute) => {
    switch (attr) {
      case 'Quy luật':
        return (
          <span className="px-2 py-0.5 bg-purple-950/80 border border-purple-400 text-purple-200 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
            Quy Luật
          </span>
        );
      case 'Tấn công':
        return (
          <span className="px-2 py-0.5 bg-rose-950/80 border border-rose-500/50 text-rose-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
            <Swords className="w-3 h-3 text-rose-400 shrink-0" />
            Tấn Công
          </span>
        );
      case 'Phòng thủ':
        return (
          <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
            <Shield className="w-3 h-3 text-emerald-400 shrink-0" />
            Phòng Thủ
          </span>
        );
      case 'Hỗ trợ':
        return (
          <span className="px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
            <Wand2 className="w-3 h-3 text-cyan-400 shrink-0" />
            Hỗ Trợ
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400 shrink-0" />
            Đa Dụng
          </span>
        );
    }
  };

  const allCategories: SkillCategory[] = [
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-5xl max-h-[94vh] bg-slate-950 border-2 border-cyan-500/40 rounded-sm shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden relative text-slate-200"
      >
        {/* Top Decorative Border Bar */}
        <div className="h-1 bg-gradient-to-r from-rose-500 via-purple-500 via-amber-400 via-cyan-400 to-emerald-400" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-500/40 rounded-sm text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  TỪ ĐIỂN & HỆ THỐNG KỸ NĂNG TENSURA
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
                  THỨ BẬC CHÂN LÝ // 9 HỆ THỐNG
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Hệ thống phân cấp kỹ năng chuẩn Tensei Shitara Slime Datta Ken: Cấp độ, Thần trí thể, Kháng tính, Võ kỹ & Ma pháp.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-sm transition-colors shrink-0 cursor-pointer"
            title="Đóng Thư Viện"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main View Tabs (Danh Sách Kỹ Năng vs Sơ Đồ Phân Cấp Tensura) */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 pt-2 gap-2 font-mono text-xs shrink-0">
          <button
            onClick={() => setModalTab('library')}
            className={`pb-2.5 px-3 font-bold uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              modalTab === 'library'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>KỸ NĂNG SỞ HỮU & TỪ ĐIỂN ({filteredSkills.length})</span>
          </button>

          <button
            onClick={() => setModalTab('taxonomyGuide')}
            className={`pb-2.5 px-3 font-bold uppercase transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              modalTab === 'taxonomyGuide'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>SƠ ĐỒ PHÂN CẤP THỨ BẬC TENSURA (9 PHÂN LOẠI)</span>
          </button>
        </div>

        {modalTab === 'taxonomyGuide' ? (
          /* ========================================================
             TENSURA TAXONOMY & HIERARCHY GUIDE
             ======================================================== */
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar bg-slate-950">
            {/* Introduction Banner */}
            <div className="p-4 bg-slate-900/90 border-l-4 border-amber-400 border-y border-r border-slate-800 space-y-2 rounded-xs">
              <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-sm">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>TRIẾT LÝ HỆ THỐNG NĂNG LỰC TENSURA (SLIME DATTA KEN)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Trong Tensura, để thấu hiểu toàn bộ thứ bậc, cần tách biệt rõ ràng giữa <strong>Thang cấp độ Skill chính</strong> (Common → Extra → Unique → Ultimate → Manas) và <strong>Các hệ năng lực độc lập</strong> (Intrinsic Skill, Resistance, Arts, Magic). Bên trong mỗi Skill cao cấp chứa tổ hợp: <em>Skill chính → Ability cốt lõi → Sub-skill con → Resistance bảo hộ</em>.
              </p>
            </div>

            {/* Part 1: Main Skill Tiers (Thang cấp độ Skill chính) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <h3 className="font-mono text-sm font-black text-cyan-300 uppercase tracking-wider">
                  I. THANG BẬC TIẾN HÓA KỸ NĂNG CHÍNH (TIER PROGRESSION)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(['Common', 'Extra', 'Unique', 'Ultimate', 'Manas'] as SkillCategory[]).map((cat) => {
                  const meta = TENSURA_CATEGORY_METADATA[cat];
                  return (
                    <div
                      key={cat}
                      className={`p-4 rounded-xs border ${meta.themeColor.border} ${meta.themeColor.bg} space-y-2.5 relative overflow-hidden`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border rounded-xs ${meta.themeColor.badge}`}>
                          {meta.badgeLabel}
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          BẬC {meta.tierOrder}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-sm font-black ${meta.themeColor.text}`}>
                          {meta.vietnameseTitle}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          {meta.japaneseTitle} ({meta.englishTitle})
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {meta.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">
                          ĐẶC TÍNH THEN CHỐT:
                        </span>
                        <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                          {meta.characteristics.map((char, i) => (
                            <li key={i}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Part 2: Special & Parallel Systems (Hệ Năng Lực Chuyên Biệt) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono text-sm font-black text-emerald-300 uppercase tracking-wider">
                  II. HỆ NĂNG LỰC CHUYÊN BIỆT & SONG SONG (SPECIAL POWER SYSTEMS)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(['Intrinsic', 'Resistance', 'Arts', 'Magic'] as SkillCategory[]).map((cat) => {
                  const meta = TENSURA_CATEGORY_METADATA[cat];
                  return (
                    <div
                      key={cat}
                      className={`p-4 rounded-xs border ${meta.themeColor.border} ${meta.themeColor.bg} space-y-2.5 relative`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border rounded-xs ${meta.themeColor.badge}`}>
                          {meta.badgeLabel}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-500/40 rounded-xs">
                          HỆ THỐNG ĐỘC LẬP
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-sm font-black ${meta.themeColor.text}`}>
                          {meta.vietnameseTitle}
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">
                          {meta.japaneseTitle} ({meta.englishTitle})
                        </p>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {meta.description}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-mono text-slate-400 font-bold block">
                          ĐẶC TÍNH:
                        </span>
                        <ul className="text-[11px] text-slate-300 space-y-0.5 list-disc list-inside">
                          {meta.characteristics.map((char, i) => (
                            <li key={i}>{char}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================
             SKILL LIBRARY & ARCHIVE LIST
             ======================================================== */
          <>
            {/* Quick Stats Bar */}
            <div className="bg-slate-900/40 border-b border-slate-800 px-4 py-2.5 grid grid-cols-2 sm:grid-cols-6 gap-2 font-mono text-xs shrink-0">
              <div className="bg-slate-950/80 border border-slate-800 p-2 text-center rounded-xs">
                <span className="text-[10px] text-slate-500 block uppercase">TỔNG KỸ NĂNG</span>
                <span className="font-extrabold text-cyan-400 text-sm">{totalCount}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2 text-center rounded-xs">
                <span className="text-[10px] text-slate-500 block uppercase">CHỦ ĐỘNG</span>
                <span className="font-extrabold text-amber-400 text-sm">{activeCount}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2 text-center rounded-xs">
                <span className="text-[10px] text-slate-500 block uppercase">BỊ ĐỘNG</span>
                <span className="font-extrabold text-blue-400 text-sm">{passiveCount}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2 text-center rounded-xs">
                <span className="text-[10px] text-slate-500 block uppercase">TẤN CÔNG</span>
                <span className="font-extrabold text-rose-400 text-sm">{offenseCount}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2 text-center rounded-xs">
                <span className="text-[10px] text-slate-500 block uppercase">PHÒNG THỦ</span>
                <span className="font-extrabold text-emerald-400 text-sm">{defenseCount}</span>
              </div>
              <div className="bg-slate-950/80 border border-slate-800 p-2 text-center rounded-xs">
                <span className="text-[10px] text-slate-500 block uppercase">HỖ TRỢ / QUY LUẬT</span>
                <span className="font-extrabold text-purple-400 text-sm">{supportCount}</span>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-3 sm:p-4 border-b border-slate-800 bg-slate-950 space-y-3 shrink-0">
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm theo tên, Kanji (捕食者, 智慧之王), Lord Concept (Lord of Gluttony) hoặc mô tả..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors rounded-xs"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>

              {/* Filter Dropdowns / Category Badges */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Phân Loại Tensura:</span>
                </div>

                {/* Category Filter */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xs overflow-x-auto max-w-full custom-scrollbar">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`px-2 py-1 text-[10px] font-bold uppercase transition-all rounded-xs whitespace-nowrap cursor-pointer ${
                      selectedCategory === 'All'
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    Tất cả (9 Hệ)
                  </button>
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-1 text-[10px] font-bold uppercase transition-all rounded-xs whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Classification Type Filter */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xs">
                  {(['All', 'Chủ động', 'Bị động'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-2 py-1 text-[10px] font-bold uppercase transition-all rounded-xs cursor-pointer ${
                        selectedType === t
                          ? 'bg-amber-950 text-amber-300 border border-amber-500/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {t === 'All' ? 'Tất cả' : t}
                    </button>
                  ))}
                </div>

                {/* Attribute Filter */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xs">
                  {(['All', 'Quy luật', 'Tấn công', 'Phòng thủ', 'Hỗ trợ', 'Đa dụng'] as const).map((attr) => (
                    <button
                      key={attr}
                      onClick={() => setSelectedAttribute(attr)}
                      className={`px-2 py-1 text-[10px] font-bold uppercase transition-all rounded-xs cursor-pointer ${
                        selectedAttribute === attr
                          ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {attr === 'All' ? 'Tất cả' : attr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill List Container */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3 custom-scrollbar min-h-[300px]">
              {filteredSkills.length === 0 ? (
                <div className="py-16 text-center space-y-3 border border-dashed border-slate-800 rounded-sm">
                  <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-sm text-slate-400 font-mono">
                    Không tìm thấy kỹ năng nào phù hợp với bộ lọc hiện tại.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                      setSelectedType('All');
                      setSelectedAttribute('All');
                    }}
                    className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-mono text-xs hover:bg-cyan-900 transition-colors cursor-pointer"
                  >
                    Xóa Bộ Lọc
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredSkills.map((skill, index) => {
                    const categoryBadgeClass = getCategoryBadgeStyle(skill.category);
                    const categoryIcon = getCategoryIcon(skill.category);

                    return (
                      <div
                        key={`${skill.id || 'skill'}_${skill.name}_${index}`}
                        onClick={() => setInspectingSkill(skill)}
                        className="p-3.5 bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-sm space-y-2.5 transition-all cursor-pointer group hover:bg-slate-900 relative overflow-hidden"
                      >
                        {/* Top Row: Icon, Name & Category */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-xs shrink-0 mt-0.5">
                              {categoryIcon}
                            </div>
                            <div>
                              <h3 className="font-black text-sm text-white group-hover:text-cyan-300 transition-colors">
                                {skill.name}
                              </h3>
                              {skill.japaneseName && (
                                <p className="text-[10px] font-mono text-slate-400">
                                  {skill.japaneseName} {skill.lordConcept ? `// [${skill.lordConcept}]` : ''}
                                </p>
                              )}
                              {skill.isFromArchive && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-purple-300 bg-purple-950/80 px-1.5 py-0.2 border border-purple-500/40 rounded-xs mt-1 font-bold">
                                  <Archive className="w-2.5 h-2.5 text-purple-400 shrink-0" />
                                  TỪ ĐIỂN KIẾP TRƯỚC
                                </span>
                              )}
                            </div>
                          </div>
                          <span
                            className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 border font-bold shrink-0 rounded-xs ${categoryBadgeClass}`}
                          >
                            {skill.category}
                          </span>
                        </div>

                        {/* Classifications Row */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
                          {getTypeBadge(skill.type!)}
                          {getAttributeBadge(skill.attribute!)}

                          {skill.subSkills && skill.subSkills.length > 0 && (
                            <span className="px-2 py-0.5 bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
                              <GitBranch className="w-3 h-3 text-indigo-400" />
                              {skill.subSkills.length} Sub-skills
                            </span>
                          )}

                          {/* MP Cost */}
                          {skill.type === 'Chủ động' ? (
                            <span className="px-2 py-0.5 bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold rounded-xs ml-auto">
                              MP: {skill.mpCost}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 font-mono text-[10px] rounded-xs ml-auto">
                              0 MP (Duy trì)
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                          {skill.description}
                        </p>

                        {/* Skill Progress & XP Bar */}
                        <div className="pt-1.5 border-t border-slate-800/80">
                          <SkillProgressBar skill={skill} compact={false} />
                        </div>

                        {/* Action Prompt */}
                        <div className="text-[10px] font-mono text-cyan-400/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-end gap-1 pt-0.5">
                          <Info className="w-3 h-3" />
                          <span>Mở Phân Tích Chi Tiết & Sub-skills →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Detail Inspection Modal Overlay */}
        <AnimatePresence>
          {inspectingSkill && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-slate-950 border-2 border-amber-400/80 p-5 rounded-sm shadow-2xl relative space-y-4 text-slate-200 font-sans"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-3">
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(inspectingSkill.category)}
                    <span className="font-extrabold text-amber-300 uppercase font-mono text-xs tracking-wider">
                      PHÂN TÍCH QUYỀN NĂNG CHUYÊN SÂU // [GIỌNG NÓI THẾ GIỚI]
                    </span>
                  </div>
                  <button
                    onClick={() => setInspectingSkill(null)}
                    className="text-slate-400 hover:text-amber-300 p-1 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Skill Box */}
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white">{inspectingSkill.name}</h3>
                      {inspectingSkill.japaneseName && (
                        <p className="text-xs font-mono text-amber-300/90 font-bold mt-0.5">
                          {inspectingSkill.japaneseName} {inspectingSkill.lordConcept ? `// [${inspectingSkill.lordConcept}]` : ''}
                        </p>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-1 border font-bold rounded-xs shrink-0 ${getCategoryBadgeStyle(
                        inspectingSkill.category
                      )}`}
                    >
                      {inspectingSkill.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {getTypeBadge(inspectingSkill.type!)}
                    {getAttributeBadge(inspectingSkill.attribute!)}
                    <span className="px-2.5 py-0.5 bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs font-bold rounded-xs">
                      {inspectingSkill.type === 'Chủ động' ? `MP Tiêu Hao: ${inspectingSkill.mpCost}` : 'Tiêu Hao: 0 MP (Duy trì)'}
                    </span>
                  </div>

                  {/* Original World Voice Description */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xs space-y-1.5">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">
                      MÔ TẢ BẢN CHẤT LINH HỒN & NĂNG LỰC:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {inspectingSkill.description}
                    </p>
                  </div>

                  {/* Sub-Skills Breakdown (Năng Lực Thành Phần / Ability Tree) */}
                  {inspectingSkill.subSkills && inspectingSkill.subSkills.length > 0 && (
                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/40 rounded-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-indigo-300 uppercase font-bold flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
                          CÁC NĂNG LỰC THÀNH PHẦN (SUB-SKILLS // ABILITIES):
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400 font-bold">
                          {inspectingSkill.subSkills.length} NĂNG LỰC
                        </span>
                      </div>

                      <div className="space-y-2">
                        {inspectingSkill.subSkills.map((sub, i) => (
                          <div
                            key={i}
                            className="p-2.5 bg-slate-950/80 border border-indigo-500/30 rounded-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-white flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                                {sub.name}
                              </span>
                              <div className="flex items-center gap-1 font-mono text-[9px]">
                                <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-cyan-300">
                                  {sub.type || 'Chủ động'}
                                </span>
                                {sub.mpCost !== undefined && (
                                  <span className="px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-amber-300">
                                    {sub.mpCost > 0 ? `${sub.mpCost} MP` : '0 MP'}
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                              {sub.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Evolution Line */}
                  {inspectingSkill.evolutionLine && (
                    <div className="p-3 bg-purple-950/40 border border-purple-500/40 rounded-xs space-y-1 font-mono text-xs">
                      <span className="text-[10px] text-purple-300 font-bold block uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        CHUỖI TIẾN HÓA KỸ NĂNG (EVOLUTION LINE):
                      </span>
                      <p className="text-[11px] text-purple-200 bg-slate-950/80 p-2 border border-purple-500/20 rounded-xs">
                        {inspectingSkill.evolutionLine}
                      </p>
                    </div>
                  )}

                  {/* Skill Mastery & XP Progress Box */}
                  <div className="p-3 bg-slate-900/90 border border-cyan-500/40 rounded-xs space-y-2">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                      TIẾN TRÌNH THUẦN THỤC & KINH NGHIỆM (SKILL XP):
                    </span>
                    <SkillProgressBar skill={inspectingSkill} compact={false} />
                  </div>
                </div>

                <button
                  onClick={() => setInspectingSkill(null)}
                  className="w-full py-2.5 bg-amber-950 border border-amber-500/60 text-amber-300 font-mono font-bold text-xs uppercase hover:bg-amber-900 transition-colors cursor-pointer rounded-xs"
                >
                  Hoàn Tất Phân Tích
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
          <span>Đang hiển thị {filteredSkills.length} / {enrichedSkills.length} kỹ năng ({skills.length} đã kích hoạt)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-colors rounded-xs cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </motion.div>
    </div>
  );
};

