import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  announcements: string[];
}

export const WorldVoiceBanner: React.FC<Props> = ({ announcements }) => {
  if (!announcements || announcements.length === 0) return null;

  // Lọc ký tự thừa trước khi render
  const cleanAnnouncement = (rawText: string) =>
    rawText
      .replace(/░/g, '')
      .replace(/\[GIỌNG NÓI THẾ GIỚI\]:/g, '')
      .trim();

  return (
    <div className="space-y-3 my-4" role="status" aria-live="polite">
      {announcements.map((text, idx) => {
        const cleanedText = cleanAnnouncement(text);
        if (!cleanedText) return null;

        return (
          <motion.div
            key={`${idx}-${cleanedText}`}
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative overflow-hidden bg-cyan-950/40 border border-cyan-400/60 p-4 rounded-sm text-center shadow-[0_0_20px_rgba(34,211,238,0.25)] animate-world-voice-shake"
          >
            <div className="relative z-10 font-mono space-y-1">
              <p className="text-cyan-500 text-[10px] opacity-60 tracking-widest select-none overflow-hidden whitespace-nowrap">
                ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
              </p>

              <div className="flex items-center justify-center gap-2 text-cyan-300 font-bold tracking-widest text-xs uppercase my-1">
                <Sparkles className="w-4 h-4 text-cyan-300 animate-spin shrink-0" />
                <span className="text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                  [GIỌNG NÓI THẾ GIỚI]
                </span>
              </div>

              <p className="text-white text-xs md:text-sm my-1 uppercase font-bold tracking-wider leading-relaxed">
                {cleanedText}
              </p>

              <p className="text-cyan-500 text-[10px] opacity-60 tracking-widest select-none overflow-hidden whitespace-nowrap">
                ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
