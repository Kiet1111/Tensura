// src/App.tsx
import React, { useState } from 'react';
import { AppLayout } from './components/AppLayout';
import { SkillLibraryModal } from './components/SkillLibraryModal';
import { WorldVoiceBanner } from './components/WorldVoiceBanner';
import { Skill, processAutoSkillArchiving } from './utils/skillArchiveUtils';

export default function App() {
  // 1. Quản lý danh sách Kỹ năng nhân vật & Từ Điển Kỹ Năng
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 'skill_water_blade',
      name: 'Thủy Thao Sát Sương Phến',
      level: 9,
      maxLevel: 10,
      category: 'Ma Pháp',
      description: 'Nén áp suất nước tạo thành lưỡi dao sắc bén.'
    }
  ]);

  const [archive, setArchive] = useState<Skill[]>([]);
  const [worldVoiceLogs, setWorldVoiceLogs] = useState<string[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  // 2. Hàm giả lập rèn luyện kỹ năng (Khi nâng cấp đạt Max)
  const handleTrainSkill = (skillId: string) => {
    const nextSkills = skills.map(s => {
      if (s.id === skillId) {
        return { ...s, level: Math.min(s.level + 1, s.maxLevel) };
      }
      return s;
    });

    // Gọi cơ chế tự động gửi vào Từ Điển mà KHÔNG reset nhân vật
    const result = processAutoSkillArchiving(nextSkills, archive);

    setSkills(result.updatedSkills);
    setArchive(result.archivedSkills);

    // Nếu có thông báo mới (đạt MAX) -> Đưa vào Giọng Nói Thế Giới
    if (result.announcements.length > 0) {
      setWorldVoiceLogs(prev => [...result.announcements, ...prev]);
    }
  };

  return (
    <AppLayout
      statusContent={
        <div className="space-y-4">
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="w-full py-2 px-4 bg-purple-900/50 hover:bg-purple-800/60 border border-purple-500/50 rounded-lg text-purple-200 font-semibold text-xs flex justify-between items-center"
          >
            <span>📚 Từ Điển Kỹ Năng</span>
            <span className="px-2 py-0.5 bg-purple-950 rounded text-purple-300">
              {archive.length} Đã Lưu
            </span>
          </button>
        </div>
      }
      storyContent={
        <div className="space-y-4">
          {/* Banner Giọng Nói Thế Giới hiển thị thông báo "Tri thức đã được lưu trữ" */}
          {worldVoiceLogs.length > 0 && (
            <WorldVoiceBanner message={worldVoiceLogs[0]} />
          )}

          {/* Bảng nâng cấp kỹ năng thử nghiệm */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-cyan-300">Kỹ Năng Đang Sở Hữu</h3>
            {skills.map(skill => (
              <div key={skill.id} className="flex justify-between items-center p-2 bg-slate-950 rounded border border-slate-800">
                <div>
                  <p className="text-xs font-semibold text-slate-200">{skill.name}</p>
                  <p className="text-[11px] text-slate-400">Cấp: {skill.level} / {skill.maxLevel}</p>
                </div>
                <button
                  onClick={() => handleTrainSkill(skill.id)}
                  disabled={skill.level >= skill.maxLevel}
                  className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-800 text-white text-xs rounded transition"
                >
                  {skill.level >= skill.maxLevel ? 'Đã Max (Đã Lưu)' : 'Rèn Luyện +1 Lv'}
                </button>
              </div>
            ))}
          </div>

          {/* Modal Xem Từ Điển Kỹ Năng */}
          {isLibraryOpen && (
            <SkillLibraryModal
              archivedSkills={archive}
              onClose={() => setIsLibraryOpen(false)}
            />
          )}
        </div>
      }
    />
  );
}
