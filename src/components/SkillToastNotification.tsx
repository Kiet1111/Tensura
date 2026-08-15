import React, { useEffect } from 'react';
import { Skill, SkillCategory } from '../types';
import {
  Sparkles,
  Shield,
  Zap,
  X,
  Radio,
  Award,
  Swords,
  Wand2,
  Dna,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastItem {
  id: string;
  skill: Skill;
  timestamp: number;
}

interface Props {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

// Sub-component quản lý đếm ngược độc lập cho từng Toast
const SkillToastCard: React.FC<{
  toast: ToastItem;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const { id, skill } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, 6000);

    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const getCategoryBadgeStyle = (category: SkillCategory) => {
    switch (category) {
      case 'Manas':
        return 'bg-rose-950 border-rose-400 text-rose-300 shadow-rose-500/30';
      case 'Ultimate':
        return 'bg-purple-950 border-purple-400 text-purple-300 shadow-purple-500/30';
      case 'Unique':
        return 'bg-amber-950 border-amber-400 text-amber-300 shadow-amber-500/30';
      case 'Extra':
        return 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-cyan-500/20';
      case 'Intrinsic':
        return 'bg-emerald-950 border-emerald-400 text-emerald-300 shadow-emerald-500/20';
      case 'Resistance':
        return 'bg-teal-950 border-teal-400 text-teal-300 shadow-teal-500/20';
      case 'Arts':
        return 'bg-orange-950 border-orange-400 text-orange-300 shadow-orange-500/20';
      case 'Magic':
        return 'bg-blue-950 border-blue-400 text-blue-300 shadow-blue-500/20';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-300';
    }
  };

  const getCategoryIcon = (category: SkillCategory) => {
    switch (category) {
      case 'Manas':
        return <Sparkles className="w-4 h-4 text-rose-400 animate-pulse" />;
      case 'Ultimate':
        return <Award className="w-4 h-4 text-purple-400 animate-pulse" />;
      case 'Unique':
        return <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />;
      case 'Extra':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'Intrinsic':
        return <Dna className="w-4 h-4 text-emerald-400" />;
      case 'Resistance':
        return <Shield className="w-4 h-4 text-teal-400" />;
      case 'Arts':
        return <Swords className="w-4 h-4 text-orange-400" />;
      case 'Magic':
        return <Wand2 className="w-4 h-4 text-blue-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="pointer-events-auto bg-slate-950/95 border-2 border-amber-400/80 rounded-xs shadow-2xl p-3.5 font-mono text-xs relative overflow-hidden backdrop-blur-md group hover:border-amber-300 transition-all select-none"
      style={{
        boxShadow: '0 0 25px rgba(251, 191, 36, 0.25), inset 0 0 15px rgba(251, 191, 36, 0.08)'
      }}
    >
      {/* Voice of the World Header */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-2 mb-2">
        <div className="flex items-center space-x-1.5">
          <Radio className="w-4 h-4 text-amber-400 animate-ping shrink-0" />
          <span className="font-extrabold text-amber-300 uppercase tracking-widest text-[11px] drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">
            [GIỌNG NÓI THẾ GIỚI]
          </span>
        </div>
        <button
          onClick={() => onDismiss(id)}
          className="text-slate-400 hover:text-amber-300 p-0.5 rounded transition-colors cursor-pointer"
          title="Đóng thông báo"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Subtitle Announcement */}
      <div className="text-[10px] text-cyan-400/90 uppercase font-bold mb-2 flex items-center gap-1">
        <span>✦ ĐÃ XÁC NHẬN... THỨC TỈNH KỸ NĂNG MỚI!</span>
      </div>

      {/* Skill Details Card */}
      <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xs space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="font-black text-amber-200 text-sm tracking-wide flex items-center gap-1.5">
              {getCategoryIcon(skill.category)}
              {skill.name}
            </span>
            {skill.japaneseName && (
              <span className="text-[10px] text-amber-400/80 block font-mono font-bold mt-0.5">
                {skill.japaneseName} {skill.lordConcept ? `// [${skill.lordConcept}]` : ''}
              </span>
            )}
          </div>

          <span
            className={`px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider border shadow-sm shrink-0 rounded-xs ${getCategoryBadgeStyle(
              skill.category
            )}`}
          >
            {skill.category}
          </span>
        </div>

        <p className="text-[11px] text-slate-300 font-sans leading-relaxed pt-1.5 border-t border-slate-800/80">
          {skill.description}
        </p>
      </div>

      {/* Animated 6-Second Countdown Progress Bar */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 6, ease: 'linear' }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-rose-400"
      />
    </motion.div>
  );
};

export const SkillToastNotification: React.FC<Props> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <SkillToastCard key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};
