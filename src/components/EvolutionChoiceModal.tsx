import React, { useState, useEffect } from 'react';
import { EvolutionBranch, PendingEvolution } from '../types';
import { FACTOR_METADATA } from '../utils/evolutionEngine';
import { Sparkles, Crown, Shield, Zap, Swords, Heart, Check, ArrowRight, Dna, Activity } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  pendingEvolution: PendingEvolution;
  isOpen: boolean;
  onSelectBranch: (branch: EvolutionBranch) => void;
}

export const EvolutionChoiceModal: React.FC<Props> = ({
  pendingEvolution,
  isOpen,
  onSelectBranch
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    pendingEvolution?.branches[0]?.id || ''
  );

  // Cập nhật selectedBranchId mỗi khi pendingEvolution thay đổi
  useEffect(() => {
    if (pendingEvolution?.branches?.[0]) {
      setSelectedBranchId(pendingEvolution.branches[0].id);
    }
  }, [pendingEvolution]);

  if (!isOpen || !pendingEvolution) return null;

  const selectedBranch =
    pendingEvolution.branches.find(b => b.id === selectedBranchId) || pendingEvolution.branches[0];

  const handleConfirm = () => {
    if (selectedBranch) {
      soundManager.playWorldVoiceChime();
      soundManager.playLevelUpSound();
      onSelectBranch(selectedBranch);
    }
  };

  const totalFactors =
    Object.values(pendingEvolution.factorSnapshot || {})
      .map(Number)
      .reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/90 backdrop-blur-md animate-fade-in font-sans overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-4xl bg-slate-950 border-2 border-cyan-400/80 shadow-[0_0_50px_rgba(6,182,212,0.35)] rounded-xs overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* World Voice Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border-b border-cyan-500/40 p-4 md:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-950 border border-cyan-400 rounded-xs flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              {pendingEvolution.type === 'skill' ? (
                <Sparkles className="w-6 h-6 animate-pulse text-amber-400" />
              ) : (
                <Dna className="w-6 h-6 animate-pulse text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest px-2 py-0.5 bg-cyan-950/90 border border-cyan-500 text-cyan-300 uppercase rounded-xs">
                  WORLD VOICE // GIỌNG NÓI THẾ GIỚI
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 border border-amber-500/40 px-1.5 py-0.5 rounded-xs">
                  {pendingEvolution.type === 'skill' ? 'TIẾN HÓA KỸ NĂNG' : 'ĐA NHÁNH CÂN BẰNG'}
                </span>
              </div>
              <h2 className="text-base md:text-lg font-black text-white font-mono uppercase tracking-wider mt-1">
                {pendingEvolution.type === 'skill'
                  ? `LỰA CHỌN THĂNG HOA KỸ NĂNG: [${pendingEvolution.currentTitle}]`
                  : 'LỰA CHỌN SỐ MỆNH TIẾN HÓA CHỦNG TỘC'}
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end text-[11px] font-mono text-cyan-400">
            <span>
              {pendingEvolution.type === 'skill'
                ? `TARGET: [${pendingEvolution.currentTitle}]`
                : `STAGE: GIAI ĐOẠN ${pendingEvolution.branches[0]?.stage || 2}`}
            </span>
            <span className="text-slate-400">STATUS: TRANSCENDENCE READY</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
          {/* World Voice Announcement Message */}
          <div className="p-3 bg-cyan-950/40 border-l-4 border-cyan-400 border-y border-r border-cyan-500/20 font-mono text-xs text-cyan-200 space-y-1 rounded-xs">
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>[GIỌNG NÓI THẾ GIỚI PHÁT LỆNH]:</span>
            </div>
            <p className="font-sans leading-relaxed text-slate-300">
              {pendingEvolution.reason}
            </p>
          </div>

          {/* Factor Breakdown Section */}
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xs space-y-2.5 font-mono">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>CHỈ SỐ YẾU TỐ HÀNH ĐỘNG TÍCH LŨY:</span>
              </div>
              <span className="text-[10px] text-slate-400">Tổng điểm: {totalFactors}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {(Object.keys(pendingEvolution.factorSnapshot || {}) as (keyof typeof pendingEvolution.factorSnapshot)[]).map((key) => {
                const meta = FACTOR_METADATA[key] || {
                  icon: '✦',
                  shortName: key,
                  color: 'text-cyan-400',
                  borderColor: 'border-cyan-500/40'
                };
                const score = pendingEvolution.factorSnapshot[key] || 0;
                const pct = Math.round((score / totalFactors) * 100);
                return (
                  <div
                    key={key}
                    className={`p-2 bg-slate-950/80 border ${meta.borderColor} rounded-xs space-y-1 flex flex-col justify-between`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="flex items-center gap-1">
                        <span>{meta.icon}</span>
                        <span className="font-bold text-slate-200">{meta.shortName}</span>
                      </span>
                      <span className={`font-mono font-bold ${meta.color}`}>{score}đ</span>
                    </div>

                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyan-400"
                        style={{ width: `${Math.min(100, pct * 2.5)}%` }}
                      />
                    </div>

                    <div className="text-[9px] text-slate-400 font-mono text-right">{pct}%</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Branch Choices Grid */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>CHỌN 1 TRONG CÁC NHÁNH TIẾN HÓA CÂN BẰNG SAU ĐÂY:</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {pendingEvolution.branches.map((branch) => {
                const isSelected = branch.id === selectedBranchId;
                return (
                  <div
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      soundManager.playActionBeep();
                    }}
                    className={`p-4 rounded-xs border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/90 via-slate-900 to-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    {/* Active Selected Marker */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-cyan-500 text-slate-950 font-mono text-[9px] font-black uppercase rounded-xs flex items-center gap-1 shadow-sm">
                        <Check className="w-2.5 h-2.5" /> ĐÃ CHỌN
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex items-start gap-2.5">
                        <div className="text-2xl p-2 bg-slate-950 border border-slate-700 rounded-xs shrink-0">
                          {branch.icon}
                        </div>
                        <div>
                          <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                            {branch.factorFocusTitle}
                          </div>
                          <h3 className="font-bold text-sm text-white font-mono leading-tight">
                            {branch.name}
                          </h3>
                          {branch.japaneseName && (
                            <span className="text-[10px] text-slate-400 font-mono block">
                              {branch.japaneseName}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {branch.description}
                      </p>

                      <p className="text-[11px] text-slate-400 italic bg-slate-950/60 p-2 border border-slate-800 rounded-xs font-sans">
                        "{branch.lore}"
                      </p>
                    </div>

                    {/* Stat Bonuses & Granted / Evolved Skills */}
                    <div className="pt-2 border-t border-slate-800 space-y-2 font-mono text-xs">
                      {/* Hiển thị đầy đủ HP, MP, ATK, DEF, MAGIC */}
                      <div className="flex flex-wrap items-center gap-2.5 text-[11px]">
                        {branch.statBonuses.maxHp !== undefined && (
                          <span className="flex items-center gap-1 text-rose-400 font-bold">
                            <Heart className="w-3 h-3 text-rose-500" />
                            <span>+{branch.statBonuses.maxHp} HP</span>
                          </span>
                        )}
                        {branch.statBonuses.maxMp !== undefined && (
                          <span className="flex items-center gap-1 text-cyan-400 font-bold">
                            <Zap className="w-3 h-3 text-cyan-400" />
                            <span>+{branch.statBonuses.maxMp} MP</span>
                          </span>
                        )}
                        {branch.statBonuses.atk !== undefined && (
                          <span className="flex items-center gap-1 text-amber-300 font-bold">
                            <Swords className="w-3 h-3 text-amber-400" />
                            <span>+{branch.statBonuses.atk} ATK</span>
                          </span>
                        )}
                        {branch.statBonuses.def !== undefined && (
                          <span className="flex items-center gap-1 text-slate-300 font-bold">
                            <Shield className="w-3 h-3 text-slate-400" />
                            <span>+{branch.statBonuses.def} DEF</span>
                          </span>
                        )}
                        {branch.statBonuses.magic !== undefined && (
                          <span className="flex items-center gap-1 text-purple-300 font-bold">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            <span>+{branch.statBonuses.magic} MAG</span>
                          </span>
                        )}
                        {branch.skillCategory && (
                          <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-purple-950 border border-purple-400 text-purple-300 rounded-xs uppercase font-bold">
                            {branch.skillCategory} SKILL
                          </span>
                        )}
                      </div>

                      {/* Evolved Sub-skills preview */}
                      {branch.newSkill?.subSkills && branch.newSkill.subSkills.length > 0 && (
                        <div className="p-2.5 bg-slate-950/90 border border-purple-500/30 rounded-xs space-y-1.5">
                          <span className="text-[10px] font-bold text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            QUYỀN NĂNG THỨC TỈNH (SUB-SKILLS):
                          </span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {branch.newSkill.subSkills.map((sub) => (
                              <div key={sub.name} className="text-[11px] bg-slate-900/80 p-1.5 border border-slate-800 rounded-xs">
                                <div className="flex items-center justify-between">
                                  <strong className="text-cyan-300 font-mono text-[11px]">{sub.name}</strong>
                                  <div className="flex items-center gap-1 text-[9px] font-mono">
                                    <span className="px-1 bg-slate-800 text-slate-300">{sub.type}</span>
                                    {sub.mpCost > 0 && <span className="text-cyan-400">{sub.mpCost} MP</span>}
                                  </div>
                                </div>
                                <span className="text-slate-400 text-[10px] font-sans block mt-0.5 leading-snug">
                                  {sub.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Granted Skills preview for Race Evolution */}
                      {branch.grantedSkills && branch.grantedSkills.length > 0 && (
                        <div className="p-2 bg-slate-950/90 border border-slate-800 rounded-xs space-y-1">
                          <span className="text-[10px] font-bold text-amber-300 block">
                            KỸ NĂNG MỚI ĐƯỢC THỨC TỈNH:
                          </span>
                          {branch.grantedSkills.map((sk) => (
                            <div key={sk.name} className="text-[11px] text-slate-200">
                              <strong className="text-cyan-300">[{sk.name}]</strong>
                              <span className="text-slate-400 text-[10px] font-sans block mt-0.5">
                                {sk.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 border-t border-cyan-500/30 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 font-mono">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Đang chọn: <strong className="text-cyan-300">{selectedBranch?.name}</strong>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2 rounded-xs cursor-pointer"
          >
            <span>
              {pendingEvolution.type === 'skill'
                ? 'XÁC NHẬN THĂNG HOA KỸ NĂNG'
                : 'XÁC NHẬN TIẾN HÓA CHỦNG TỘC'}
            </span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
