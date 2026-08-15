import React from 'react';
import { Skill } from '../types';
import { getSkillProgress } from '../utils/skillUtils';
import { Zap, Sparkles } from 'lucide-react';

interface SkillProgressBarProps {
  skill: Skill;
}

export const SkillProgressBar: React.FC<SkillProgressBarProps> = ({ skill }) => {
  const progress = getSkillProgress(skill);

  return (
    <div className="w-full bg-gray-800 rounded-lg p-3 border border-gray-700">
      <div className="flex justify-between items-center mb-1">
        <span className="font-bold text-cyan-400 flex items-center gap-1">
          <Zap className="w-4 h-4" />
          {skill.name}
        </span>
        <span className="text-xs text-gray-400">
          Lv.{skill.level || 1} ({skill.exp || 0}/{skill.maxExp || 100})
        </span>
      </div>
      <div className="w-full bg-gray-900 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-cyan-500 h-2.5 rounded-full transition-all duration-300 flex items-center justify-end pr-1"
          style={{ width: `${progress}%` }}
        >
          {progress >= 100 && <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />}
        </div>
      </div>
    </div>
  );
};
