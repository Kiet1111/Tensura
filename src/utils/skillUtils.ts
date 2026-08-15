// src/utils/skillUtils.ts
import { Skill } from './skillArchiveUtils';
import { processAutoSkillArchiving } from './skillArchiveUtils';

/**
 * Tăng kinh nghiệm / cấp độ cho kỹ năng và tự động lưu vào Từ Điển nếu MAX
 */
export function addSkillExp(
  skills: Skill[],
  archive: Skill[],
  skillId: string,
  expAmount: number
) {
  const updatedSkills = skills.map((skill) => {
    if (skill.id === skillId) {
      const newLevel = Math.min(skill.level + expAmount, skill.maxLevel);
      return { ...skill, level: newLevel };
    }
    return skill;
  });

  // Chạy cơ chế kiểm tra tự động gửi vào Từ Điển Kỹ Năng
  const archiveCheck = processAutoSkillArchiving(updatedSkills, archive);

  return {
    skills: archiveCheck.updatedSkills,
    archive: archiveCheck.archivedSkills,
    announcements: archiveCheck.announcements
  };
}
