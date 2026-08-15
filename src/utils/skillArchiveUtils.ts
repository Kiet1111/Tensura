// src/utils/skillArchiveUtils.ts
import { Skill, SkillArchiveResult } from '../types';

export function processAutoSkillArchiving(
  currentSkills: Skill[],
  existingArchive: Skill[] = []
): SkillArchiveResult {
  const updatedSkills: Skill[] = [];
  const newlyArchived: Skill[] = [];
  const announcements: string[] = [];

  const archiveMap = new Map<string, Skill>(existingArchive.map(s => [s.id, s]));

  currentSkills.forEach((skill) => {
    if (skill.level >= skill.maxLevel && !archiveMap.has(skill.id)) {
      const archivedSkill: Skill = {
        ...skill,
        isArchived: true
      };

      archiveMap.set(skill.id, archivedSkill);
      newlyArchived.push(archivedSkill);

      announcements.push(
        `[GIỌNG NÓI THẾ GIỚI]: Kỹ năng [${skill.name}] đã đạt cấp tối đa (Lv.${skill.maxLevel})! Tri thức đã được lưu trữ vào Từ Điển Kỹ Năng.`
      );

      updatedSkills.push({ ...skill, isArchived: true });
    } else {
      updatedSkills.push(skill);
    }
  });

  return {
    updatedSkills,
    archivedSkills: Array.from(archiveMap.values()),
    announcements
  };
}
