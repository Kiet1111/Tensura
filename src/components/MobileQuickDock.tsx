import React from 'react';
import { Scroll, Swords, BookOpen, Compass, Activity, Sparkles, GitFork } from 'lucide-react';

interface Props {
  logViewMode: 'narrative' | 'combat' | 'both';
  onSelectLogMode: (mode: 'narrative' | 'combat') => void;
  onOpenStatusModal: () => void;
  onOpenStoryModal: () => void;
  onOpenSkillLibrary?: () => void;
  onScrollToActions: () => void;
  divergenceRate?: number;
  isInCombat?: boolean;
}

export const MobileQuickDock: React.FC<Props> = ({
  logViewMode,
  onSelectLogMode,
  onOpenStatusModal,
  onOpenStoryModal,
  onOpenSkillLibrary,
  onScrollToActions,
  divergenceRate,
  isInCombat = false,
}) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-cyan-500/40 backdrop-blur-md pb-safe px-2 py-1.5 shadow-[0_-5px_25px_rgba(0,0,0,0.85)] select-none">
      <div className="grid grid-cols-5 gap-1 text-center font-mono">
        
        {/* Nút 1: Chuyển đổi Nhật ký / Combat Log */}
        <button
          onClick={() => {
            const nextMode = logViewMode === 'combat' ? 'narrative' : 'combat';
            onSelectLogMode(nextMode);
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xs transition-all cursor-pointer ${
            logViewMode === 'combat'
              ? 'bg-rose-950/80 border border-rose-500/80 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'bg-slate-900/80 border border-slate-800 text-cyan-300 hover:border-cyan-500/50'
          }`}
          title="Chuyển đổi Chế độ Nhật ký / Log Chiến đấu"
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

        {/* Nút 2: Nhảy nhanh tới Bảng Hành động / Chiến đấu */}
        <button
          onClick={onScrollToActions}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xs transition-all cursor-pointer ${
            isInCombat
              ? 'bg-rose-950 border border-rose-500 text-rose-200 animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.5)]'
              : 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 hover:bg-cyan-900/60'
          }`}
          title="Cuộn nhanh xuống khu vực ra lệnh / kỹ năng"
        >
          <Swords className={`w-4 h-4 ${isInCombat ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            {isInCombat ? 'ĐẤU NGAY!' : 'HÀNH ĐỘNG'}
          </span>
        </button>

        {/* Nút 3: Bảng Trạng thái Nhân vật */}
        <button
          onClick={onOpenStatusModal}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 text-slate-200 rounded-xs transition-all cursor-pointer"
          title="Mở Bảng Trạng thái Chi tiết"
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            STATUS
          </span>
        </button>

        {/* Nút 4: Thư viện Kỹ năng (Skill Library) */}
        <button
          onClick={onOpenSkillLibrary}
          disabled={!onOpenSkillLibrary}
          className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xs transition-all ${
            onOpenSkillLibrary
              ? 'bg-purple-950/40 border border-purple-500/40 hover:border-purple-400 text-purple-300 cursor-pointer'
              : 'bg-slate-900/40 border border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
          title="Mở Thư viện Kỹ năng & Khai thác"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            KỸ NĂNG
          </span>
        </button>

        {/* Nút 5: Cốt truyện Tensura Saga (Có hiển thị Tỷ lệ Biến động) */}
        <button
          onClick={onOpenStoryModal}
          className="flex flex-col items-center justify-center py-1.5 px-0.5 bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 rounded-xs transition-all cursor-pointer relative"
          title="Mở Bảng Biên niên sử Cốt truyện Tensura"
        >
          {divergenceRate !== undefined && divergenceRate > 0 && (
            <span 
              className="absolute -top-1 -right-1 px-1 py-0.2 bg-amber-500 text-slate-950 text-[8px] font-black rounded-xs shadow-sm flex items-center gap-0.5"
              title={`Tỷ lệ biến động cốt truyện so với nguyên tác: ${divergenceRate}%`}
            >
              <GitFork className="w-2 h-2" />
              {divergenceRate}%
            </span>
          )}
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-[9px] font-bold mt-0.5 tracking-tighter truncate w-full">
            SAGA
          </span>
        </button>

      </div>
    </div>
  );
};
