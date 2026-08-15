import React, { useState, useEffect } from 'react';
import { StoryState, StoryMilestone, CharacterRelation } from '../types';
import {
  Compass,
  Sparkles,
  Users,
  X,
  BookOpen,
  CheckCircle2,
  Lock,
  Flame,
  History,
  Info,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  storyState: StoryState;
  isOpen: boolean;
  onClose: () => void;
}

export const MainStoryModal: React.FC<Props> = ({ storyState, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'relations' | 'impact_log'>('timeline');

  // Lắng nghe sự kiện phím ESC để đóng Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Phòng thủ dữ liệu undefined/null
  const milestones = storyState?.milestones || [];
  const relations = storyState?.relations || [];
  const recentCanonChanges = storyState?.recentCanonChanges || [];
  const currentArc = storyState?.currentArc || 'Khởi Đầu Hành Trình';

  const getStatusBadge = (status: StoryMilestone['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 bg-emerald-950 border border-emerald-500/60 text-emerald-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ĐÃ HOÀN THÀNH
          </span>
        );
      case 'active':
        return (
          <span className="px-2 py-0.5 bg-cyan-950 border border-cyan-400/80 text-cyan-300 font-mono text-[10px] font-bold rounded-xs flex items-center gap-1 animate-pulse">
            <Flame className="w-3 h-3 text-cyan-400" />
            ĐANG TIẾN HÀNH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 text-slate-500 font-mono text-[10px] flex items-center gap-1">
            <Lock className="w-3 h-3" />
            CHƯA MỞ
          </span>
        );
    }
  };

  const getAffinityBadge = (relation: CharacterRelation) => {
    const val = relation.affinity;
    if (val >= 80) return 'text-emerald-400 border-emerald-500/50 bg-emerald-950/80';
    if (val >= 50) return 'text-cyan-300 border-cyan-500/50 bg-cyan-950/80';
    if (val >= 30) return 'text-amber-300 border-amber-500/50 bg-amber-950/80';
    return 'text-rose-400 border-rose-500/50 bg-rose-950/80';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md font-sans"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()} // Chống đóng modal khi bấm vào nội dung bên trong
            className="w-full max-w-5xl max-h-[92vh] bg-slate-950 border-2 border-cyan-500/60 rounded-sm shadow-[0_0_60px_rgba(6,182,212,0.15)] flex flex-col overflow-hidden relative text-slate-200"
          >
            {/* Top Glowing Border */}
            <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 shrink-0" />

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-cyan-950 border border-cyan-500/50 rounded-sm text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                  <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-white uppercase tracking-wider font-mono flex items-center gap-2">
                      BIÊN NIÊN SỬ: HÀNH TRÌNH CHUYỂN SINH TENSURA
                    </h2>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold uppercase tracking-wider">
                      TENSURA CHRONICLES
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Khám phá thế giới Tensura Slime, tương tác cùng Rimuru, Veldora, các Quỷ Nhân và Ma Vương.
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-sm transition-colors shrink-0 cursor-pointer"
                title="Đóng Bảng Cốt Truyện (ESC)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Arc Header Banner */}
            <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between gap-2 font-mono text-xs shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold uppercase">CHƯƠNG HIỆN TẠI:</span>
                <strong className="text-white text-sm">{currentArc}</strong>
              </div>
              <span className="text-[11px] px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold rounded-xs">
                KẺ CHUYỂN SINH
              </span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950 font-mono text-xs shrink-0">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`flex-1 py-3 px-4 font-bold uppercase transition-all flex items-center justify-center gap-2 border-r border-slate-800 cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'bg-slate-900 text-cyan-300 border-b-2 border-b-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Mốc Cốt Truyện ({milestones.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('relations')}
                className={`flex-1 py-3 px-4 font-bold uppercase transition-all flex items-center justify-center gap-2 border-r border-slate-800 cursor-pointer ${
                  activeTab === 'relations'
                    ? 'bg-slate-900 text-cyan-300 border-b-2 border-b-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Quan Hệ Nhân Vật ({relations.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('impact_log')}
                className={`flex-1 py-3 px-4 font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'impact_log'
                    ? 'bg-slate-900 text-cyan-300 border-b-2 border-b-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <History className="w-4 h-4 text-cyan-400" />
                <span>Nhật Ký Hành Trình ({recentCanonChanges.length})</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              {activeTab === 'timeline' && (
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xs flex items-center gap-2.5 text-xs text-cyan-200 font-sans">
                    <Info className="w-5 h-5 text-cyan-400 shrink-0" />
                    <span>
                      Các mốc sự kiện lớn của thế giới Tensura. Hành động, chiến đấu và tương tác của bạn sẽ ghi dấu ấn vào biên niên sử này.
                    </span>
                  </div>

                  {milestones.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-sm font-mono text-xs text-slate-400">
                      Chưa có cột mốc cốt truyện nào được ghi nhận.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {milestones.map((m, idx) => (
                        <div
                          key={m.id || idx}
                          className={`p-4 border rounded-sm space-y-2.5 transition-all relative ${
                            m.status === 'active'
                              ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                              : m.status === 'completed'
                              ? 'bg-slate-900/60 border-emerald-500/40'
                              : 'bg-slate-950/60 border-slate-800 opacity-60'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-black text-cyan-400 px-2 py-0.5 bg-cyan-950 border border-cyan-500/40 rounded-xs">
                                {idx + 1}. {m.arc}
                              </span>
                              <h3 className="font-extrabold text-sm text-white">{m.title}</h3>
                            </div>
                            <div>{getStatusBadge(m.status)}</div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                            {/* Canon Outcome */}
                            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xs space-y-1">
                              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                                [BỐI CẢNH NGUYÊN TÁC]:
                              </span>
                              <p className="text-slate-300 font-sans leading-relaxed">{m.canonOutcome}</p>
                            </div>

                            {/* Player Impact */}
                            <div className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xs space-y-1">
                              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">
                                [HÀNH TRÌNH CỦA BẠN]:
                              </span>
                              <p className="text-cyan-200 font-sans leading-relaxed font-semibold">{m.playerImpact}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'relations' && (
                relations.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-sm space-y-2">
                    <UserCheck className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="font-mono text-xs text-slate-400">
                      Bạn chưa thiết lập mối quan hệ với nhân vật quan trọng nào trong thế giới này.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relations.map((rel, idx) => (
                      <div
                        key={`${rel.name}_${idx}`}
                        className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-sm space-y-3 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-black text-sm text-white">{rel.name}</h3>
                            <span className="text-[11px] text-slate-400 font-mono">{rel.title}</span>
                          </div>

                          <span
                            className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase border rounded-xs ${getAffinityBadge(
                              rel
                            )}`}
                          >
                            {rel.status}
                          </span>
                        </div>

                        {/* Affinity meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>Mức Độ Quan Hệ & Thiện Cảm</span>
                            <span className="font-bold text-cyan-300">{rel.affinity}/100</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-950 border border-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(100, Math.max(0, rel.affinity))}%` }}
                            />
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 bg-slate-950 p-2.5 border border-slate-800/80 rounded-xs font-sans leading-relaxed">
                          {rel.notes}
                        </p>
                      </div>
                    ))}
                  </div>
                )
              )}

              {activeTab === 'impact_log' && (
                <div className="space-y-2.5">
                  <div className="text-xs font-mono text-slate-400 mb-2">
                    Biên niên sử các sự kiện và dấu ấn bạn đã tạo ra trên thế giới Tensura:
                  </div>

                  {recentCanonChanges.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-sm font-mono text-xs text-slate-400">
                      Chưa có biến động hoặc tác động lịch sử nào ghi nhận.
                    </div>
                  ) : (
                    recentCanonChanges.map((change, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-900 border-l-2 border-l-cyan-400 border-y border-r border-slate-800 font-sans text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                      >
                        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{change}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
              <span>Hành Trình Tensura RPG // [WORLD SYSTEM]</span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold transition-colors rounded-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
