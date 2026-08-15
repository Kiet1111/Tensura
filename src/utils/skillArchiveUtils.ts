import { Skill } from '../types';

export function getEnrichedSkillDetails(skill: Skill) {
  if (!skill) return null;
  return {
    ...skill,
    isMastered: (skill.exp || 0) >= (skill.maxExp || 100),
    progress: Math.floor(((skill.exp || 0) / (skill.maxExp || 100)) * 100)
  };
}

export function getSkillArchive(category?: string): Skill[] {
  return [];
}
