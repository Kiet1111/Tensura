import React, { useEffect, useRef, useState } from 'react';
import { CombatLogEntry } from '../types';
import { Swords, Sparkles, Zap, Heart, Activity, Filter, ArrowDown, ChevronRight, Trash2, Download, Check } from 'lucide-react';

interface Props {
  combatLogs: CombatLogEntry[];
  onClearOldCombatLogs?: () => void;
  onExportCombatLogs?: () => void;
}

export const CombatLogPanel: React.FC<Props> = ({
  combatLogs,
  onClearOldCombatLogs,
  onExportCombatLogs
}) => {
  const [filter, setFilter] = useState<'all' | 'combat' | 'skill' | 'devour'>('all');
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const scrollToBottom = (smooth = true) => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  useEffect(() => {
    if (isAutoScroll) {
      scrollToBottom(true);
    }
  }, [combatLogs, isAutoScroll]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 60;

    if (!isNearBottom) {
      setShowScrollBottomBtn(true);
    } else {
      setShowScrollBottomBtn(false);
      setIsAutoScroll(true);
    }
  };

  const filteredLogs = combatLogs.filter(log => {
    if (filter === 'combat') return log.type === 'attack' || log.damageDealt || log.damageTaken;
    if (filter === 'skill') return log.type === 'skill' || log.skillUsed;
    if (filter === 'devour') return log.type === 'devour';
    return true;
  });

  return (
    <div className="h-full flex flex-col bg-slate-900/90 border border-rose-500/30 p-2.5 sm:p-3 rounded-sm shadow-xl font-mono text-xs overflow-hidden relative">
      {/* Panel Header */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <h3 className="font-bold text-white uppercase tracking-wider text-xs">
            NHẬT KÝ CHIẾN ĐẤU REAL-TIME
          </h3>
          <span className="text-[9px] text-cyan-400/80 bg-slate-950 px-1.5 py-0.5 border border-slate-800 rounded-xs">
            {combatLogs.length} LOGS
          </span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          {/* Auto-scroll toggle */}
          <button
            onClick={() => {
              const next = !isAutoScroll;
              setIsAutoScroll(next);
              if (next) scrollToBottom(true);
            }}
            className={`px-1.5 py-0.5 border transition-all flex items-center gap-1 rounded-xs cursor-pointer ${
              isAutoScroll
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Tự động cuộn xuống khi có dữ liệu chiến đấu mới"
          >
            <ArrowDown className={`w-2.5 h-2.5 ${isAutoScroll ? 'text-rose-400 animate-bounce-short' : ''}`} />
            <span>AUTO</span>
          </button>

          {/* Export Log */}
          {onExportCombatLogs && (
            <button
              onClick={onExportCombatLogs}
              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-rose-500/60 text-rose-300 transition-all flex items-center gap-1 rounded-xs cursor-pointer"
              title="Lưu nhật ký chiến đấu ra tệp (.txt)"
            >
              <Download className="w-2.5 h-2.5 text-rose-400" />
              <span className="hidden sm:inline">LƯU</span>
            </button>
          )}

          {/* Clear Old Combat Logs */}
          {onClearOldCombatLogs && combatLogs.length > 5 && (
            confirmClear ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onClearOldCombatLogs();
                    setConfirmClear(false);
                  }}
                  className="px-1.5 py-0.5 bg-rose-950 border border-rose-500 text-rose-300 font-bold hover:bg-rose-900 transition-all flex items-center gap-0.5 rounded-xs cursor-pointer text-[9px]"
                  title="Xác nhận giữ lại 5 log chiến đấu mới nhất"
                >
                  <Check className="w-2.5 h-2.5" />
                  <span>XÓA</span>
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-1 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-xs cursor-pointer text-[9px]"
                >
                  HỦY
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                className="px-1.5 py-0.5 bg-slate-950 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/60 text-slate-400 hover:text-rose-300 transition-all flex items-center gap-1 rounded-xs cursor-pointer"
                title="Dọn dẹp log chiến đấu cũ, giữ lại 5 log mới nhất"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">DỌN</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Quick Filter Bar */}
      <div className="shrink-0 flex items-center justify-between gap-1 border-b border-slate-800/80 py-1.5 text-[10px]">
        <span className="text-slate-500 uppercase flex items-center gap-1 font-bold">
          <Filter className="w-2.5 h-2.5 text-slate-400" /> LỌC:
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-1.5 py-0.5 uppercase transition-colors rounded-xs cursor-pointer ${
              filter === 'all'
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 font-bold'
                : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            TẤT CẢ
          </button>
          <button
            onClick={() => setFilter('combat')}
            className={`px-1.5 py-0.5 uppercase transition-colors rounded-xs cursor-pointer ${
              filter === 'combat'
                ? 'bg-rose-950 border border-rose-500 text-rose-300 font-bold'
                : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            SÁT THƯƠNG
          </button>
          <button
            onClick={() => setFilter('skill')}
            className={`px-1.5 py-0.5 uppercase transition-colors rounded-xs cursor-pointer ${
              filter === 'skill'
                ? 'bg-amber-950 border border-amber-500 text-amber-300 font-bold'
                : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            SKILL
          </button>
          <button
            onClick={() => setFilter('devour')}
            className={`px-1.5 py-0.5 uppercase transition-colors rounded-xs cursor-pointer ${
              filter === 'devour'
                ? 'bg-purple-950 border border-purple-400 text-purple-300 font-bold'
                : 'bg-slate-800/60 border border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            THÔN PHỆ
          </button>
        </div>
      </div>

      {/* Combat Log Stream with internal scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 custom-scrollbar touch-scroll"
      >
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-slate-500 italic text-[11px]">
            Chưa có dữ liệu chiến đấu. Hãy đi săn ma vật hoặc kích hoạt kỹ năng!
          </div>
        ) : (
          filteredLogs.map((entry) => {
            const isDevour = entry.type === 'devour';
            const isSkill = entry.type === 'skill';
            const isAttack = entry.type === 'attack';

            return (
              <div
                key={entry.id}
                className={`p-2.5 rounded-sm border transition-all ${
                  isDevour
                    ? 'bg-purple-950/20 border-purple-500/40'
                    : isAttack
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : isSkill
                    ? 'bg-cyan-950/20 border-cyan-500/30'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                {/* Entry Header */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 border-b border-slate-800/60 pb-1">
                  <span className="flex items-center gap-1 font-bold uppercase text-slate-300">
                    <span className="text-cyan-400">TURN #{entry.turn}</span>
                    <span>•</span>
                    <span>{entry.timestamp || '00:00'}</span>
                  </span>
                  <span className="uppercase font-bold tracking-wider px-1.5 py-0.2 bg-slate-900 border border-slate-700 text-slate-300">
                    {entry.type}
                  </span>
                </div>

                {/* Entry Action */}
                <p className="text-white font-semibold text-xs leading-relaxed mb-1.5 flex items-start gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{entry.actionName}</span>
                </p>

                {/* Metrics badging */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px]">
                  {entry.skillUsed && (
                    <span className="px-1.5 py-0.5 bg-amber-950/80 border border-amber-500/50 text-amber-300 flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3 text-amber-400" /> [{entry.skillUsed}]
                    </span>
                  )}

                  {entry.damageDealt !== undefined && entry.damageDealt > 0 && (
                    <span className="px-1.5 py-0.5 bg-rose-950 border border-rose-500/60 text-rose-300 font-bold flex items-center gap-1">
                      <Swords className="w-3 h-3 text-rose-400" /> ĐIỂM SÁT THƯƠNG: -{entry.damageDealt} HP
                    </span>
                  )}

                  {entry.damageTaken !== undefined && entry.damageTaken > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-950 border border-red-500/80 text-red-400 font-bold flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400" /> BỊ THƯƠNG: -{entry.damageTaken} HP
                    </span>
                  )}

                  {entry.hpChange !== undefined && entry.hpChange > 0 && (
                    <span className="px-1.5 py-0.5 bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-bold flex items-center gap-1">
                      <Heart className="w-3 h-3 text-emerald-400" /> HỒI PHỤC: +{entry.hpChange} HP
                    </span>
                  )}

                  {entry.mpChange !== undefined && entry.mpChange !== 0 && (
                    <span className={`px-1.5 py-0.5 border font-bold flex items-center gap-1 ${
                      entry.mpChange > 0
                        ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}>
                      <Zap className="w-3 h-3 text-cyan-400" /> MA LƯỢNG: {entry.mpChange > 0 ? `+${entry.mpChange}` : entry.mpChange} MP
                    </span>
                  )}

                  {entry.effect && (
                    <span className="px-1.5 py-0.5 bg-purple-950 border border-purple-500/60 text-purple-300 font-bold">
                      ✦ {entry.effect}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Floating Scroll to Bottom Button if user scrolled up */}
      {showScrollBottomBtn && (
        <button
          onClick={() => {
            setIsAutoScroll(true);
            scrollToBottom(true);
          }}
          className="absolute bottom-4 right-6 z-20 px-3 py-1.5 bg-rose-950 border border-rose-400 text-rose-300 font-mono text-xs font-bold rounded-full shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-1.5 animate-bounce-short cursor-pointer hover:bg-rose-900 transition-all"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>CUỘN XUỐNG MỚI NHẤT</span>
        </button>
      )}
    </div>
  );
};
