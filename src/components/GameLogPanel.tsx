import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GameLog } from '../types';
import { WorldVoiceBanner } from './WorldVoiceBanner';
import {
  Sparkles,
  User,
  AlertCircle,
  ArrowDown,
  Trash2,
  Download,
  Scroll,
  Check,
  Filter,
  Star,
  BookOpen,
  Volume2,
  Eye,
  EyeOff
} from 'lucide-react';

interface Props {
  logs: GameLog[];
  onClearOldLogs?: () => void;
  onExportLogs?: () => void;
}

export type LogFilterMode = 'all' | 'milestones_only' | 'gm_narrative' | 'world_voice';

// Set từ khóa để tra cứu O(1) hiệu năng cao
const KEYWORD_SETS = new Set([
  'thức tỉnh', 'tiến hóa', 'thăng hoa', 'mở khóa', 'danh hiệu',
  'cốt truyện', 'chương ', 'cột mốc', 'veldora', 'rimuru',
  'chân ma vương', 'ma vương', 'quân đoàn', 'thảm họa orc',
  'walpurgis', 'long vương'
]);

const WV_KEYWORD_SETS = new Set([
  'thức tỉnh', 'tiến hóa', 'danh hiệu', 'thành tựu', 'tối thượng',
  'ultimate', 'manas', 'thăng hoa', 'chủng tộc'
]);

// Helper kiểm tra xem Log có phải là Cột mốc hoặc Sự kiện quan trọng hay không
export const isLogMilestoneOrKeyStory = (log: GameLog): boolean => {
  if (!log) return false;
  if (log.isMilestone || log.isStoryChange) return true;
  if (log.storyTitle || log.milestoneTitle) return true;

  const contentLower = (log.content || '').toLowerCase();
  for (const kw of KEYWORD_SETS) {
    if (contentLower.includes(kw)) return true;
  }

  if (log.worldVoiceAnnouncements && log.worldVoiceAnnouncements.length > 0) {
    for (const ann of log.worldVoiceAnnouncements) {
      const annLower = ann.toLowerCase();
      for (const wvk of WV_KEYWORD_SETS) {
        if (annLower.includes(wvk)) return true;
      }
    }
  }

  return false;
};

export const GameLogPanel: React.FC<Props> = ({ logs = [], onClearOldLogs, onExportLogs }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Filter state
  const [filterMode, setFilterMode] = useState<LogFilterMode>('all');
  const [hideRoutineNotices, setHideRoutineNotices] = useState(false);

  const scrollToBottom = (smooth = true) => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  // Tính toán số lượng cho từng thể loại
  const milestoneCount = useMemo(() => {
    return logs.filter(isLogMilestoneOrKeyStory).length;
  }, [logs]);

  const narrativeCount = useMemo(() => {
    return logs.filter(l => l.type === 'gm_narrative').length;
  }, [logs]);

  const worldVoiceCount = useMemo(() => {
    return logs.filter(l => l.type === 'world_voice' || (l.worldVoiceAnnouncements && l.worldVoiceAnnouncements.length > 0)).length;
  }, [logs]);

  // Bộ lọc Logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (hideRoutineNotices && log.type === 'system_notice') {
        return false;
      }

      switch (filterMode) {
        case 'milestones_only':
          return isLogMilestoneOrKeyStory(log);
        case 'gm_narrative':
          return log.type === 'gm_narrative';
        case 'world_voice':
          return log.type === 'world_voice' || (log.worldVoiceAnnouncements && log.worldVoiceAnnouncements.length > 0);
        case 'all':
        default:
          return true;
      }
    });
  }, [logs, filterMode, hideRoutineNotices]);

  // Tự động cuộn xuống khi nhật ký có tin mới
  useEffect(() => {
    if (isAutoScroll) {
      scrollToBottom(true);
    }
  }, [filteredLogs, isAutoScroll]);

  // Kiểm tra thao tác cuộn thủ công của người dùng
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 80;

    if (!isNearBottom) {
      setShowScrollBottomBtn(true);
    } else {
      setShowScrollBottomBtn(false);
      setIsAutoScroll(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900/85 border border-slate-800 p-2.5 sm:p-3 rounded-sm shadow-md overflow-hidden relative">
      {/* Log Header Toolbar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800 pb-2 mb-2">
        <div className="flex items-center space-x-2">
          <Scroll className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className="font-mono font-bold text-xs text-white uppercase tracking-wider">
            DIỄN BIẾN THẾ GIỚI (GAME MASTER)
          </h3>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-950 border border-slate-800 text-cyan-400 rounded-xs">
            {filteredLogs.length}/{logs.length} LOGS
          </span>
        </div>

        {/* Controls: Auto-scroll, Export Log, Clear Old Logs */}
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
                ? 'bg-cyan-950/80 border-cyan-500/60 text-cyan-300 font-bold'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Tự động cuộn xuống khi có diễn biến mới"
          >
            <ArrowDown className={`w-2.5 h-2.5 ${isAutoScroll ? 'text-cyan-400 animate-bounce' : ''}`} />
            <span>AUTO</span>
          </button>

          {/* Export Log */}
          {onExportLogs && (
            <button
              onClick={onExportLogs}
              className="px-1.5 py-0.5 bg-slate-950 hover:bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-cyan-300 transition-all flex items-center gap-1 rounded-xs cursor-pointer"
              title="Xuất lịch sử nhật ký ra tệp văn bản (.txt)"
            >
              <Download className="w-2.5 h-2.5 text-cyan-400" />
              <span className="hidden sm:inline">LƯU</span>
            </button>
          )}

          {/* Clear Old Logs */}
          {onClearOldLogs && logs.length > 5 && (
            confirmClear ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    onClearOldLogs();
                    setConfirmClear(false);
                  }}
                  className="px-1.5 py-0.5 bg-rose-950 border border-rose-500 text-rose-300 font-bold hover:bg-rose-900 transition-all flex items-center gap-0.5 rounded-xs cursor-pointer text-[9px]"
                  title="Xác nhận giữ lại 5 log mới nhất"
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
                title="Xóa nhật ký cũ, chỉ giữ lại 5 log mới nhất"
              >
                <Trash2 className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">DỌN</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-1.5 bg-slate-950/90 border border-slate-800/90 p-1 rounded-xs mb-2 text-[10px] font-mono">
        <div className="flex flex-wrap items-center gap-1">
          {/* Tất cả */}
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2 py-1 rounded-xs transition-all flex items-center gap-1 cursor-pointer font-bold ${
              filterMode === 'all'
                ? 'bg-cyan-950 border border-cyan-500/70 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Filter className="w-3 h-3 text-cyan-400" />
            <span>TẤT CẢ ({logs.length})</span>
          </button>

          {/* Cột mốc quan trọng */}
          <button
            onClick={() => setFilterMode('milestones_only')}
            className={`px-2 py-1 rounded-xs transition-all flex items-center gap-1 cursor-pointer font-bold ${
              filterMode === 'milestones_only'
                ? 'bg-amber-950 border border-amber-400/80 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-amber-300 hover:bg-slate-800/50'
            }`}
            title="Chỉ hiển thị các cột mốc quan trọng, tiến hóa, thức tỉnh và cốt truyện chính"
          >
            <Star className={`w-3 h-3 ${filterMode === 'milestones_only' ? 'text-amber-400 fill-amber-400/30' : 'text-amber-400/80'}`} />
            <span>MỐC & CỐT TRUYỆN</span>
            {milestoneCount > 0 && (
              <span className={`px-1 py-0.2 rounded-xs text-[9px] font-mono ${
                filterMode === 'milestones_only'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
              }`}>
                {milestoneCount}
              </span>
            )}
          </button>

          {/* Dẫn truyện GM */}
          <button
            onClick={() => setFilterMode('gm_narrative')}
            className={`px-2 py-1 rounded-xs transition-all flex items-center gap-1 cursor-pointer font-bold ${
              filterMode === 'gm_narrative'
                ? 'bg-blue-950 border border-blue-500/70 text-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.25)]'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-blue-300 hover:bg-slate-800/50'
            }`}
            title="Chỉ hiển thị lời dẫn truyện của Game Master"
          >
            <BookOpen className="w-3 h-3 text-blue-400" />
            <span>DẪN CHUYỆN ({narrativeCount})</span>
          </button>

          {/* World Voice */}
          <button
            onClick={() => setFilterMode('world_voice')}
            className={`px-2 py-1 rounded-xs transition-all flex items-center gap-1 cursor-pointer font-bold ${
              filterMode === 'world_voice'
                ? 'bg-cyan-950 border border-cyan-400/80 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-cyan-300 hover:bg-slate-800/50'
            }`}
            title="Chỉ hiển thị các thông cáo Giọng Nói Thế Giới"
          >
            <Volume2 className="w-3 h-3 text-cyan-400" />
            <span>WORLD VOICE ({worldVoiceCount})</span>
          </button>
        </div>

        {/* Ẩn / Hiện thông báo hệ thống thông thường */}
        <button
          onClick={() => setHideRoutineNotices(prev => !prev)}
          className={`px-2 py-1 rounded-xs border transition-all flex items-center gap-1 cursor-pointer ml-auto ${
            hideRoutineNotices
              ? 'bg-purple-950/80 border-purple-500/60 text-purple-200 font-bold'
              : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:text-slate-300'
          }`}
          title="Ẩn bớt các dòng thông báo hệ thống thông thường"
        >
          {hideRoutineNotices ? (
            <>
              <EyeOff className="w-3 h-3 text-purple-400" />
              <span>ĐÃ ẨN TB THƯỜNG</span>
            </>
          ) : (
            <>
              <Eye className="w-3 h-3 text-slate-400" />
              <span>ẨN TB THƯỜNG</span>
            </>
          )}
        </button>
      </div>

      {/* Log Feed Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1.5 custom-scrollbar touch-scroll"
      >
        {filteredLogs.length === 0 ? (
          <div className="h-full min-h-[160px] flex flex-col items-center justify-center p-6 text-center bg-slate-950/40 border border-dashed border-slate-800 rounded-sm space-y-2">
            <Star className="w-8 h-8 text-slate-600 animate-pulse" />
            <p className="text-xs font-mono text-slate-400 max-w-sm">
              {filterMode === 'milestones_only'
                ? 'Chưa có mốc sự kiện quan trọng nào khớp với bộ lọc hiện tại. Hãy thực hiện thêm các hành động lớn để mở khóa!'
                : 'Không có nhật ký nào phù hợp với bộ lọc đã chọn.'}
            </p>
            <button
              onClick={() => {
                setFilterMode('all');
                setHideRoutineNotices(false);
              }}
              className="mt-2 px-3 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-bold rounded-xs transition-colors cursor-pointer"
            >
              Hiển thị Tất Cả Nhật Ký
            </button>
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isMilestone = isLogMilestoneOrKeyStory(log);

            if (log.type === 'player_action') {
              return (
                <div key={log.id} className="flex justify-end my-2">
                  <div className="max-w-[85%] bg-slate-800/50 border-l-2 border-cyan-400 border-y border-r border-slate-800 p-3 rounded-sm shadow-md">
                    <div className="flex items-center justify-between gap-1.5 text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider mb-1">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-cyan-400" /> [ACTION_EXECUTED]
                      </span>
                      {log.timestamp && (
                        <span className="text-slate-500 text-[9px]">{log.timestamp}</span>
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-white font-medium leading-relaxed">
                      "{log.content}"
                    </p>
                  </div>
                </div>
              );
            }

            if (log.type === 'world_voice') {
              return (
                <div key={log.id} className="space-y-1">
                  {isMilestone && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-amber-400 px-1 uppercase">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400/40" />
                      <span>{log.milestoneTitle || 'CỘT MỐC TIẾN HÓA & THỨC TỈNH'}</span>
                    </div>
                  )}
                  <WorldVoiceBanner announcements={[log.content]} />
                </div>
              );
            }

            if (log.type === 'gm_narrative') {
              return (
                <div
                  key={log.id}
                  className={`border rounded-sm shadow-md space-y-3 transition-all ${
                    isMilestone
                      ? 'bg-slate-900/95 border-amber-500/60 p-4 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                      : 'bg-slate-900/90 border-slate-800 p-4'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      {isMilestone ? (
                        <>
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                            {log.milestoneTitle ? `MỐC CỐT TRUYỆN: ${log.milestoneTitle}` : 'GAME MASTER // CỘT MỐC CỐT TRUYỆN'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                            GAME MASTER // DIỄN BIẾN THẾ GIỚI
                          </span>
                        </>
                      )}
                    </div>
                    {isMilestone ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-950 border border-amber-500/40 text-amber-300 font-bold rounded-xs uppercase">
                        {log.storyTitle || 'MILESTONE'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-500">SYSTEM_LOG</span>
                    )}
                  </div>

                  <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2 font-normal">
                    {log.content}
                  </div>

                  {log.worldVoiceAnnouncements && log.worldVoiceAnnouncements.length > 0 && (
                    <WorldVoiceBanner announcements={log.worldVoiceAnnouncements} />
                  )}
                </div>
              );
            }

            return (
              <div key={log.id} className="p-2.5 bg-slate-950 border border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-2 rounded-sm">
                <AlertCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{log.content}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Floating Button: Cuộn xuống dưới cùng */}
      {showScrollBottomBtn && (
        <button
          onClick={() => {
            setIsAutoScroll(true);
            scrollToBottom(true);
          }}
          className="absolute bottom-4 right-6 z-20 px-3 py-1.5 bg-cyan-950 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold rounded-full shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5 animate-bounce cursor-pointer hover:bg-cyan-900 transition-all"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>CUỘN XUỐNG MỚI NHẤT</span>
        </button>
      )}
    </div>
  );
};
