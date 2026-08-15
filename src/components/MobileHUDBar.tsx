import React from 'react';
import { CharacterStatus } from '../types';
import { ChevronRight, MapPin, Zap, Heart, BookOpen } from 'lucide-react';

interface Props {
  character: CharacterStatus | null;
  location?: string;
  onOpenStatusModal: () => void;
  onOpenSkillLibrary?: () => void;
}

// Helper tự động nhận diện Icon chủng tộc Tensura
const getRaceIcon = (race: string = '') => {
  const raceLower = race.toLowerCase();
  if (raceLower.includes('slime')) return '💧';
  if (raceLower.includes('kijin') || raceLower.includes('ogre')) return '👹';
  if (raceLower.includes('dragon') || raceLower.includes('long')) return '🐉';
  if (raceLower.includes('demon') || raceLower.includes('quỷ')) return '👿';
  if (raceLower.includes('goblin') || raceLower.includes('hobgoblin')) return '👺';
  if (raceLower.includes('elf')) return '🧝';
  if (raceLower.includes('lizardman')) return '🦎';
  return '⚔️';
};

export const MobileHUDBar: React.FC<Props> = ({
  character,
  location,
  onOpenStatusModal,
  onOpenSkillLibrary,
}) => {
  if (!character) return null;

  const hpRatio = character.maxHp > 0 ? Math.min(1, Math.max(0, character.hp / character.maxHp)) : 1;
  const mpRatio = character.maxMp > 0 ? Math.min(1, Math.max(0, character.mp / character.maxMp)) : 1;

  return (
    <div className="lg:hidden bg-slate-900/95 border-b border-cyan-500/30 px-2.5 py-1.5 backdrop-blur-md shrink-0 select-none shadow-md">
      <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
        
        {/* Left: Character Info & Mini Resource Bars */}
        <div
          onClick={onOpenStatusModal}
          className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0"
          title="Mở Bảng Trạng Thái"
        >
          {/* Race Avatar Badge */}
          <div className="w-7 h-7 bg-cyan-950 border border-cyan-400/80 rounded-xs flex items-center justify-center text-xs shrink-0 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
            {getRaceIcon(character.race)}
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            {/* Name + Level + Location */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-white truncate max-w-[100px] sm:max-w-[160px] text-xs group-hover:text-cyan-300 transition-colors">
                {character.name}
              </span>
              <span className="text-[9px] px-1 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded-xs font-bold shrink-0">
                Lv.{character.level}
              </span>
              {location && (
                <span className="text-[9px] text-slate-400 flex items-center gap-0.5 truncate hidden sm:flex">
                  <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                  <span className="truncate max-w-[90px]">{location}</span>
                </span>
              )}
            </div>

            {/* Quick Mini Resource Bars (HP & MP) */}
            <div className="flex items-center gap-2 text-[9px]">
              {/* Mini HP Bar */}
              <div className="flex items-center gap-1 flex-1 max-w-[85px]">
                <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400/30 shrink-0" />
                <div className="w-full h-1 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${hpRatio * 100}%` }}
                  />
                </div>
              </div>

              {/* Mini MP Bar */}
              <div className="flex items-center gap-1 flex-1 max-w-[85px]">
                <Zap className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400/30 shrink-0" />
                <div className="w-full h-1 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${mpRatio * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Quick Access to Skill Library */}
          {onOpenSkillLibrary && (
            <button
              onClick={onOpenSkillLibrary}
              className="px-2 py-1 bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-300 font-bold rounded-xs text-[10px] flex items-center gap-1 uppercase tracking-wider cursor-pointer transition-colors"
              title="Mở Thư Viện Kỹ Năng"
            >
              <BookOpen className="w-3 h-3 text-purple-400" />
              <span className="hidden sm:inline">KỸ NĂNG</span>
            </button>
          )}

          {/* Quick Access to Status Modal */}
          <button
            onClick={onOpenStatusModal}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-bold rounded-xs text-[10px] flex items-center gap-0.5 uppercase tracking-wider cursor-pointer transition-colors"
          >
            <span>STATUS</span>
            <ChevronRight className="w-3 h-3 text-cyan-400" />
          </button>
        </div>

      </div>
    </div>
  );
};
