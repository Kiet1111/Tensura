import React from 'react';
import { CharacterStatus } from '../types';
import { ChevronRight } from 'lucide-react';

interface Props {
  character: CharacterStatus;
  location: string;
  onOpenStatusModal: () => void;
  onOpenSkillLibrary: () => void;
}

export const MobileHUDBar: React.FC<Props> = ({
  character,
  onOpenStatusModal,
}) => {
  return (
    <div className="lg:hidden bg-slate-900/95 border-b border-cyan-500/30 px-3 py-1.5 backdrop-blur-md shrink-0">
      <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
        {/* Character Quick Info */}
        <div
          onClick={onOpenStatusModal}
          className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0"
        >
          <div className="w-6 h-6 bg-cyan-950 border border-cyan-400/80 rounded-xs flex items-center justify-center text-cyan-300 font-bold text-xs shrink-0 shadow-[0_0_6px_rgba(6,182,212,0.3)]">
            {character.race === 'Slime' ? '💧' : character.race === 'Kijin' ? '👹' : '⚔️'}
          </div>
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <span className="font-bold text-white truncate max-w-[130px] sm:max-w-[200px]">
              {character.name}
            </span>
            <span className="text-[9px] px-1 bg-cyan-950 border border-cyan-500/40 text-cyan-300 rounded-xs font-bold shrink-0">
              Lv.{character.level}
            </span>
            <span className="text-[10px] text-slate-400 truncate hidden sm:inline">
              EP: <strong className="text-purple-300">{character.ep || character.mana}</strong>
            </span>
          </div>
        </div>

        {/* Status button */}
        <button
          onClick={onOpenStatusModal}
          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 border border-cyan-500/40 text-cyan-300 font-bold rounded-xs text-[10px] flex items-center gap-0.5 uppercase tracking-wider shrink-0 cursor-pointer"
        >
          <span>BẢNG TRẠNG THÁI</span>
          <ChevronRight className="w-3 h-3 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};

