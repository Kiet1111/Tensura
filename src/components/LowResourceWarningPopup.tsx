import React, { useState, useEffect, useRef } from 'react';
import { CharacterStatus } from '../types';
import { AlertTriangle, Heart, Zap, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface Props {
  character: CharacterStatus | null;
  soundEnabled: boolean;
  onUseRecoverySkill?: () => void;
}

export const LowResourceWarningPopup: React.FC<Props> = ({
  character,
  soundEnabled,
  onUseRecoverySkill
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const prevLowStateRef = useRef<{ hpLow: boolean; mpLow: boolean }>({
    hpLow: false,
    mpLow: false
  });

  if (!character) return null;

  const hpRatio = character.maxHp > 0 ? character.hp / character.maxHp : 1;
  const mpRatio = character.maxMp > 0 ? character.mp / character.maxMp : 1;

  const isHpLow = hpRatio <= 0.20 && character.hp > 0;
  const isMpLow = mpRatio <= 0.20 && character.mp < character.maxMp;

  // Tự động kích hoạt thông báo & phát âm thanh chỉ khi TRẠNG THÁI NGUY CẤP MỚI XẢY RA
  useEffect(() => {
    const prev = prevLowStateRef.current;
    const newlyHpLow = isHpLow && !prev.hpLow;
    const newlyMpLow = isMpLow && !prev.mpLow;

    if (newlyHpLow || newlyMpLow) {
      setIsDismissed(false); // Mở lại popup nếu có nguy cơ mới xuất hiện
      if (soundEnabled) {
        soundManager.playDangerWarningSound();
      }
    }

    // Cập nhật ref để theo dõi trạng thái trước đó
    prevLowStateRef.current = { hpLow: isHpLow, mpLow: isMpLow };
  }, [isHpLow, isMpLow, soundEnabled]);

  // Reset trạng thái dismissed khi nhân vật đã phục hồi hoàn toàn trên 20%
  useEffect(() => {
    if (!isHpLow && !isMpLow) {
      setIsDismissed(false);
    }
  }, [isHpLow, isMpLow]);

  // Nếu không nguy cấp hoặc người chơi đã chủ động bấm đóng -> Không hiển thị
  if ((!isHpLow && !isMpLow) || isDismissed) return null;

  const hpPercent = Math.round(hpRatio * 100);
  const mpPercent = Math.round(mpRatio * 100);

  return (
    <div className="fixed bottom-20 right-4 sm:right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-96 font-sans transition-all animate-fade-in">
      <div className="bg-slate-950/95 border-2 border-rose-500/90 rounded-xs shadow-[0_0_30px_rgba(244,63,94,0.4)] p-4 text-slate-100 backdrop-blur-md relative overflow-hidden space-y-3">
        {/* Animated warning background pulse */}
        <div className="absolute inset-0 bg-rose-950/20 animate-pulse pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-rose-500/40 pb-2.5 relative z-10">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-rose-950 border border-rose-500/80 rounded-xs text-rose-400 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-black text-rose-300 uppercase tracking-widest flex items-center gap-1.5">
                CẢNH BÁO NGUY HIỂM!
              </h4>
              <p className="text-[10px] font-mono text-slate-400">
                [GIỌNG NÓI THẾ GIỚI]: TRẠNG THÁI NGUY CẤP
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xs transition-colors cursor-pointer"
            title="Đóng cảnh báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Items */}
        <div className="space-y-2 relative z-10 text-xs">
          {isHpLow && (
            <div className="p-2 bg-rose-950/60 border border-rose-500/50 rounded-xs space-y-1">
              <div className="flex items-center justify-between font-mono font-bold">
                <span className="text-rose-300 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/40 animate-ping" />
                  SINH LỰC (HP) NGUY CẤP:
                </span>
                <span className="text-rose-200">
                  {Math.max(0, Math.floor(character.hp))}/{character.maxHp} ({hpPercent}%)
                </span>
              </div>
              <p className="text-[11px] text-rose-200/90 leading-tight">
                Sinh lực đã giảm xuống dưới 20%! Nhân vật có nguy cơ diệt vong nếu tiếp tục chịu sát thương.
              </p>
            </div>
          )}

          {isMpLow && (
            <div className="p-2 bg-amber-950/60 border border-amber-500/50 rounded-xs space-y-1">
              <div className="flex items-center justify-between font-mono font-bold">
                <span className="text-amber-300 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40 animate-pulse" />
                  MA LỰC (MP) CẠN KIỆT:
                </span>
                <span className="text-amber-200">
                  {Math.max(0, Math.floor(character.mp))}/{character.maxMp} ({mpPercent}%)
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-tight">
                Nguồn Ma Lực còn dưới 20%! Hạn chế thi triển các kỹ năng tiêu hao lớn.
              </p>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-1 relative z-10 font-mono text-[11px]">
          <span className="text-[10px] text-slate-400 italic">
            * Khuyên dùng: Dùng thảo dược hoặc kỹ năng phục hồi.
          </span>
          {onUseRecoverySkill && (
            <button
              onClick={() => {
                onUseRecoverySkill();
                setIsDismissed(true);
              }}
              className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-500 text-cyan-300 font-bold rounded-xs flex items-center gap-1 transition-all cursor-pointer shadow-[0_0_10px_rgba(34,211,238,0.2)]"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>HỒI PHỤC NGAY</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
