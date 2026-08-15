import { Skill, SkillCategory } from '../types';

export const TENSURA_CATEGORY_METADATA: Record<SkillCategory, { name: string; color: string }> = {
  [SkillCategory.COMMON]: { name: 'Kỹ năng Thường', color: 'bg-gray-600' },
  [SkillCategory.EXTRA]: { name: 'Kỹ năng Tác Biệt', color: 'bg-green-600' },
  [SkillCategory.UNIQUE]: { name: 'Kỹ năng Độc Nhất', color: 'bg-purple-600' },
  [SkillCategory.ULTIMATE]: { name: 'Kỹ năng Tối Thượng', color: 'bg-amber-600' },
  [SkillCategory.ORIGIN]: { name: 'Kỹ năng Nguyên Thủy', color: 'bg-red-600' },
};

export function getSkillClassification(skill: Skill): string {
  if (!skill) return 'Chưa xác định';
  return TENSURA_CATEGORY_METADATA[skill.category]?.name || 'Kỹ năng';
}

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
