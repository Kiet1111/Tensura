import { Skill } from '../types';

export function getSkillProgress(skill: Skill): number {
  if (!skill) return 0;
  const currentExp = skill.exp || 0;
  const maxExp = skill.maxExp || 100;
  return Math.min(100, Math.max(0, Math.floor((currentExp / maxExp) * 100)));
}

export function canEvolveSkill(skill: Skill): boolean {
  if (!skill) return false;
  return (skill.exp || 0) >= (skill.maxExp || 100) && !!skill.evolutionTarget;
}
