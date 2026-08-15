import { Skill } from '../types';

// Hàm này lấy danh sách lưu trữ kỹ năng
export function getSkillArchive(category: string): Skill[] {
  // Logic lấy dữ liệu kỹ năng theo category
  // Bạn có thể tùy chỉnh danh sách trả về ở đây
  return []; 
}

export function getEnrichedSkillDetails(skill: Skill) {
  return {
    ...skill,
    isMastered: (skill.exp || 0) >= (skill.maxExp || 100),
    progress: Math.floor(((skill.exp || 0) / (skill.maxExp || 100)) * 100)
  };
}
