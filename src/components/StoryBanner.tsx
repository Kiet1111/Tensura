import React from 'react';
import { StoryState } from '../types';
import { BookOpen, ChevronRight, Compass } from 'lucide-react';

interface Props {
  storyState: StoryState;
  onOpenStoryModal: () => void;
}

export const StoryBanner: React.FC<Props> = ({ storyState, onOpenStoryModal }) => {
  // Safe navigation đề phòng milestones chưa khởi tạo hoặc rỗng
  const milestones = storyState?.milestones || [];
  const activeMilestone = milestones.find(m => m.status === 'active') || milestones[0];

  return (
    <div className="shrink-0 bg-slate-900/90 border border-cyan-500/40 rounded-xs p-2 shadow-sm font-sans flex items-center justify-between gap-2 overflow-hidden">
      {/* Thông tin Arc & Milestone */}
      <div className="flex items-center gap-2 min-w-0">
        <div className="p-1 bg-cyan-950 border border-cyan-500/60 rounded-xs text-cyan-400 shrink-0">
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex items-center gap-2 min-w-0 truncate">
          <span className="text-[9px] font-mono font-black text-cyan-300 uppercase tracking-widest bg-cyan-950 px-1 py-0.5 border border-cyan-500/40 shrink-0">
            HÀNH TRÌNH
          </span>
          <span className="text-xs font-bold text-white font-mono uppercase tracking-wider truncate">
            {storyState?.currentArc || 'Chưa rõ'}
          </span>
          {activeMilestone && (
            <span className="hidden md:inline text-[11px] text-slate-400 truncate">
              — <strong className="text-cyan-300 font-mono font-normal">[{activeMilestone.title}]</strong>
            </span>
          )}
        </div>
      </div>

      {/* Nút xem chi tiết */}
      <button
        type="button"
        onClick={onOpenStoryModal}
        aria-label="Xem chi tiết cốt truyện"
        className="px-2 sm:px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-400/80 text-cyan-300 text-[10px] font-mono font-bold uppercase rounded-xs transition-all flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
        title="Xem chi tiết các chương cốt truyện & mối quan hệ nhân vật"
      >
        <BookOpen className="w-3 h-3 text-cyan-400" />
        <span className="hidden sm:inline">CỐT TRUYỆN</span>
        <ChevronRight className="w-3 h-3 text-cyan-400" />
      </button>
    </div>
  );
};
