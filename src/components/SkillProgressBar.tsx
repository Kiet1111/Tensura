import React from 'react';
import { Skill } from '../types';
import { getSkillProgress } from '../utils/skillUtils';
import { Zap, Sparkles } from 'lucide-react';

interface Props {
  skill: Skill;
  compact?: boolean;
  showLabels?: boolean;
}

export const SkillProgressBar: React.FC<Props> = ({
  skill,
  compact = false,
  showLabels = true
}) => {
  const progress = getSkillProgress(skill);
  // Đảm bảo phần trăm nằm trong khoảng 0% - 100%
  const clampedPercent = Math.min(100, Math.max(0, progress.percent ?? 0));

  const getBarColor = () => {
    if (progress.isMaxLevel) {
      return 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse';
    }

    switch (skill.category) {
      case 'Manas':
        return 'bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-400 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      case 'Ultimate':
        return 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.4)]';
      case 'Unique':
        return 'bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400';
      case 'Arts':
        return 'bg-gradient-to-r from-orange-500 to-amber-500';
      case 'Magic':
        return 'bg-gradient-to-r from-blue-500 via-indigo-400 to-cyan-400';
      case 'Resistance':
      case 'Intrinsic':
        return 'bg-gradient-to-r from-emerald-500 to-teal-400';
      case 'Extra':
        return 'bg-gradient-to-r from-cyan-500 to-blue-400';
      default:
        return 'bg-gradient-to-r from-slate-400 to-cyan-400';
    }
  };

  if (compact) {
    return (
      <div className="w-full space-y-1 font-mono select-none">
        <div className="flex items-center justify-between text-[9px]">
          <span className="text-slate-400 font-bold flex items-center gap-1 min-w-0">
            <span
              className={`px-1 py-0.2 rounded-xs font-black shrink-0 ${
                progress.isMaxLevel
                  ? 'bg-amber-950 border border-amber-400 text-amber-300'
                  : 'bg-slate-900 border border-slate-700 text-cyan-300'
              }`}
            >
              LV.{progress.level}
            </span>
            <span className="text-slate-500 truncate max-w-[110px] sm:max-w-[160px]">
              {progress.stageTitle}
            </span>
          </span>
          <span className="text-slate-300 font-bold shrink-0 ml-1">
            {progress.isMaxLevel ? 'MAX' : `${progress.exp}/${progress.maxExp} XP`} ({clampedPercent}%)
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-[1px]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-1.5 font-mono select-none">
      {showLabels && (
        <div className="flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={`px-1.5 py-0.5 rounded-xs font-black uppercase tracking-wider text-[10px] border flex items-center gap-1 shrink-0 ${
                progress.isMaxLevel
                  ? 'bg-amber-950/90 border-amber-400 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                  : 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300'
              }`}
            >
              {progress.isMaxLevel ? (
                <>
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  LV.MAX
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3 text-cyan-400" />
                  LV.{progress.level}
                </>
              )}
            </span>
            <span className="text-[10px] text-slate-400 font-bold uppercase truncate">
              [{progress.stageTitle}]
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 font-bold shrink-0">
            <span className="text-slate-400">EXP:</span>
            <span className="text-cyan-300">
              {progress.isMaxLevel ? 'HOÀN TẤT' : `${progress.exp}/${progress.maxExp}`}
            </span>
            <span className="text-slate-500">({clampedPercent}%)</span>
          </div>
        </div>
      )}

      {/* Progress Bar Track */}
      <div className="h-2 w-full bg-slate-950 border border-slate-800 rounded-sm overflow-hidden p-[1.5px] relative">
        <div
          className={`h-full rounded-xs transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
};
