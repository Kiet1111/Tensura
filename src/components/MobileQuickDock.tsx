import React from 'react';
import { Scroll, Swords, BookOpen, Compass, Activity } from 'lucide-react';

interface Props {
  logViewMode: 'narrative' | 'combat' | 'both';
  onSelectLogMode: (mode: 'narrative' | 'combat') => void;
  onOpenStatusModal: () => void;
  onOpenStoryModal: () => void;
  onOpenSkillLibrary: () => void;
  onScrollToActions: () => void;
  divergenceRate?: number;
  isInCombat?: boolean;
}

export const MobileQuickDock: React.FC<Props> = ({
  logViewMode,
  onSelectLogMode,
  onOpenStatusModal,
  onOpenStoryModal,
  onScrollToActions,
  isInCombat = false,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-cyan-500/40 backdrop-blur-md pb-safe px-3 py-1.5 shadow-[0_-5px_25px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
        {/* Button 1: Game Log / Combat Log Switcher */}
        <button
          onClick={() => {
            const nextMode = logViewMode === 'combat' ? 'narrative' : 'combat';
            onSelectLogMode(nextMode);
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xs transition-all cursor-pointer ${
            logViewMode === 'combat'
              ? 'bg-rose-950/80 border border-rose-500/80 text-rose-300'
              : 'bg-slate-900/80 border border-slate-800 text-cyan-300 hover:border-cyan-500/50'
          }`}
        >
          {logViewMode === 'combat' ? (
            <Activity className="w-4 h-4 text-rose-400 animate-pulse" />
          ) : (
            <Scroll className="w-4 h-4 text-cyan-400" />
          )}
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            {logViewMode === 'combat' ? 'LOG ĐẤU' : 'NHẬT KÝ'}
          </span>
        </button>

        {/* Button 2: Quick Jump to Actions */}
        <button
          onClick={onScrollToActions}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xs transition-all cursor-pointer ${
            isInCombat
              ? 'bg-rose-900/60 border border-rose-500 text-white animate-pulse'
              : 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 hover:bg-cyan-900/60'
          }`}
        >
          <Swords className="w-4 h-4 text-amber-400" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            {isInCombat ? 'CHIẾN ĐẤU!' : 'HÀNH ĐỘNG'}
          </span>
        </button>

        {/* Button 3: Status Board Modal */}
        <button
          onClick={onOpenStatusModal}
          className="flex flex-col items-center justify-center py-1.5 px-1 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-200 rounded-xs transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            TRẠNG THÁI
          </span>
        </button>

        {/* Button 4: Tensura Story Saga */}
        <button
          onClick={onOpenStoryModal}
          className="flex flex-col items-center justify-center py-1.5 px-1 bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 rounded-xs transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            CỐT TRUYỆN
          </span>
        </button>
      </div>
    </div>
  );
};

