import React from 'react';
import { CombatEnemy } from '../types';
import { Skull, Swords, Flame, Sparkles, Heart, Shield, Zap } from 'lucide-react';

interface Props {
  enemy: CombatEnemy;
  onAction: (actionText: string) => void;
}

export const CombatCard: React.FC<Props> = ({ enemy, onAction }) => {
  const maxHp = Math.max(1, enemy.maxHp);
  const safeHp = Math.max(0, enemy.hp);
  const hpPercent = Math.min(100, Math.max(0, Math.round((safeHp / maxHp) * 100)));
  const isDevourReady = enemy.isWeakened || safeHp <= 0;

  return (
    <div className="shrink-0 overflow-hidden bg-slate-900/95 border-2 border-rose-500/50 p-2.5 sm:p-3 rounded-xs space-y-2 text-slate-200 shadow-[0_0_15px_rgba(244,63,94,0.15)]">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 bg-rose-950/80 border border-rose-500/50 text-rose-400 shrink-0 rounded-xs">
            <Skull className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="min-w-0 truncate">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-1.5 truncate">
              <span className="truncate">{enemy.name}</span>
              <span className="text-[9px] px-1 py-0.5 bg-rose-950 border border-rose-500/50 text-rose-300 shrink-0 font-mono">
                LVL {enemy.level}
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-sans truncate">{enemy.description}</p>
          </div>
        </div>

        {enemy.isWeakened && (
          <span className="px-1.5 py-0.5 bg-amber-950/80 border border-amber-400/60 text-amber-300 text-[9px] font-mono font-bold uppercase tracking-wider animate-pulse flex items-center gap-1 shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" /> THÔN PHỆ ĐƯỢC!
          </span>
        )}
      </div>

      {/* Enemy HP Gauge & Stats */}
      <div className="space-y-1 font-mono text-[10px]">
        <div className="flex justify-between items-center font-bold">
          <span className="text-rose-400 flex items-center gap-1 uppercase tracking-wider">
            <Heart className="w-2.5 h-2.5 fill-rose-500/30 text-rose-400" /> HP ĐỊCH:
          </span>
          <span className="text-rose-300">
            {safeHp} / {maxHp} ({hpPercent}%)
          </span>
        </div>
        
        <div className="h-2 w-full bg-slate-950 border border-slate-800 p-[1px] rounded-xs">
          <div
            className={`h-full transition-all duration-300 rounded-xs ${
              isDevourReady ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>

        {/* Thông số bổ sung ATK/DEF nếu có */}
        {(enemy.atk !== undefined || enemy.def !== undefined) && (
          <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5 font-mono">
            <div className="flex items-center gap-2">
              {enemy.atk !== undefined && (
                <span className="flex items-center gap-0.5 text-rose-300">
                  <Zap className="w-2.5 h-2.5 text-amber-400" /> ATK: {enemy.atk}
                </span>
              )}
              {enemy.def !== undefined && (
                <span className="flex items-center gap-0.5 text-cyan-300">
                  <Shield className="w-2.5 h-2.5 text-cyan-400" /> DEF: {enemy.def}
                </span>
              )}
            </div>
            {enemy.skills && enemy.skills.length > 0 && (
              <span className="text-slate-400 truncate max-w-[150px]">
                Chiêu: <span className="text-amber-200">{enemy.skills[0]}</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Nút hành động Thôn phệ hoặc Tấn công */}
      {isDevourReady ? (
        <div className="p-1.5 bg-amber-950/30 border border-amber-500/40 text-center rounded-xs">
          <button
            onClick={() => onAction(`Kích hoạt Kỹ năng Độc nhất THÔN PHỆ ${enemy.name}`)}
            className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-[11px] uppercase tracking-widest transition-all shadow-[0_0_10px_rgba(245,158,11,0.4)] flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            THÔN PHỆ MA VẬT ({enemy.name.toUpperCase()})
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono uppercase">
          <button
            onClick={() => onAction(`Kích hoạt Kỹ năng Độc nhất tấn công ${enemy.name}`)}
            className="py-1.5 px-2 bg-slate-800 hover:bg-cyan-950 border border-slate-700 hover:border-cyan-400 text-cyan-300 font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
          >
            <Flame className="w-3 h-3 text-amber-400 shrink-0" />
            Skill Độc Nhất
          </button>

          <button
            onClick={() => onAction(`Tấn công vật lý bộc phát ma lực lên ${enemy.name}`)}
            className="py-1.5 px-2 bg-slate-800 hover:bg-rose-950 border border-slate-700 hover:border-rose-400 text-rose-300 font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
          >
            <Swords className="w-3 h-3 text-rose-400 shrink-0" />
            Vật Lý Cận Chiến
          </button>
        </div>
      )}
    </div>
  );
};
