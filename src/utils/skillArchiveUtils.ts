// src/utils/skillArchiveUtils.ts

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: string;
  description: string;
  isArchived?: boolean; // Cờ đánh dấu đã lưu vào Từ điển hay chưa
}

export interface SkillArchiveResult {
  updatedSkills: Skill[];
  archivedSkills: Skill[];
  announcements: string[];
}

/**
 * Tự động quét và lưu trữ các kỹ năng đạt Cấp Tối Đa vào Từ Điển Kỹ Năng
 * mà KHÔNG reset nhân vật hay mất kỹ năng đang dùng.
 */
export function processAutoSkillArchiving(
  currentSkills: Skill[],
  existingArchive: Skill[] = []
): SkillArchiveResult {
  const updatedSkills: Skill[] = [];
  const newlyArchived: Skill[] = [];
  const announcements: string[] = [];

  const archiveMap = new Map<string, Skill>(existingArchive.map(s => [s.id, s]));

  currentSkills.forEach((skill) => {
    // Kiểm tra nếu kỹ năng đạt MAX LEVEL và chưa được lưu trong Từ Điển
    if (skill.level >= skill.maxLevel && !archiveMap.has(skill.id)) {
      const archivedSkill: Skill = {
        ...skill,
        isArchived: true
      };

      archiveMap.set(skill.id, archivedSkill);
      newlyArchived.push(archivedSkill);

      // Tạo thông báo hiển thị cho người chơi
      announcements.push(
        `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Kỹ năng [${skill.name}] đã đạt cấp tối đa (Lv.${skill.maxLevel})!\n✦ Tri thức đã được lưu trữ vào Từ Điển Kỹ Năng.\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
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
