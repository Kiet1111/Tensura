import { GameLog, CombatLogEntry, CharacterStatus } from '../types';

/**
 * Định dạng dòng tiêu đề nhân vật an toàn
 */
const formatCharacterHeader = (character: CharacterStatus | null): string => {
  if (!character) return 'Nhân vật: Vô danh';
  const title = character.raceTitle?.trim() ? ` [${character.raceTitle.trim()}]` : '';
  return `Nhân vật: ${character.name || 'Vô danh'}${title}`;
};

/**
 * Xuất dữ liệu nhật ký ra tệp văn bản .txt và tự động kích hoạt tải xuống
 */
export const exportLogsToText = (
  character: CharacterStatus | null,
  logs: GameLog[] = [],
  combatLogs: CombatLogEntry[] = []
): void => {
  const safeLogs = Array.isArray(logs) ? logs : [];
  const safeCombatLogs = Array.isArray(combatLogs) ? combatLogs : [];
  
  const timestamp = new Date().toLocaleString('vi-VN');
  const lines: string[] = [];

  // Header section
  lines.push('==================================================');
  lines.push('TENSURA RPG - LỊCH SỬ NHẬT KÝ HÀNH TRÌNH');
  lines.push(formatCharacterHeader(character));
  lines.push(`Thời gian xuất: ${timestamp}`);
  lines.push('==================================================\n');

  // Section 1: World & Story Logs
  lines.push(`I. DIỄN BIẾN THẾ GIỚI & CỐT TRUYỆN (${safeLogs.length} nhật ký)`);
  lines.push('--------------------------------------------------');

  safeLogs.forEach((log, index) => {
    const idxStr = `[${index + 1}]`;
    switch (log.type) {
      case 'player_action':
        lines.push(`${idxStr} HÀNH ĐỘNG NGƯỜI CHƠI:`);
        lines.push(`"${log.content || ''}"\n`);
        break;

      case 'world_voice':
        lines.push(`${idxStr} GIỌNG NÓI THẾ GIỚI:`);
        lines.push(`${log.content || ''}\n`);
        break;

      case 'gm_narrative':
        lines.push(`${idxStr} DIỄN BIẾN (GAME MASTER):`);
        lines.push(`${log.content || ''}`);
        if (Array.isArray(log.worldVoiceAnnouncements) && log.worldVoiceAnnouncements.length > 0) {
          log.worldVoiceAnnouncements.forEach((wa) => {
            lines.push(`  -> GIỌNG NÓI THẾ GIỚI: ${wa}`);
          });
        }
        lines.push(''); // Thêm dòng trống tạo khoảng cách
        break;

      default:
        lines.push(`${idxStr} THÔNG BÁO HỆ THỐNG:`);
        lines.push(`${log.content || ''}\n`);
        break;
    }
  });

  // Section 2: Combat & Skill Logs
  lines.push(`\nII. NHẬT KÝ CHIẾN ĐẤU & KỸ NĂNG (${safeCombatLogs.length} nhật ký)`);
  lines.push('--------------------------------------------------');

  safeCombatLogs.forEach((cLog) => {
    const timeStr = cLog.timestamp ? ` ${cLog.timestamp}` : '';
    lines.push(`[Turn ${cLog.turn || 0}]${timeStr} - ${cLog.actionName || 'Hành động'}`);

    if (cLog.skillUsed) lines.push(`  • Kỹ năng sử dụng: [${cLog.skillUsed}]`);
    if (typeof cLog.damageDealt === 'number' && cLog.damageDealt > 0) {
      lines.push(`  • Sát thương gây ra: ${cLog.damageDealt} HP`);
    }
    if (typeof cLog.damageTaken === 'number' && cLog.damageTaken > 0) {
      lines.push(`  • Sát thương nhận vào: ${cLog.damageTaken} HP`);
    }
    if (typeof cLog.hpChange === 'number' && cLog.hpChange > 0) {
      lines.push(`  • Hồi phục HP: +${cLog.hpChange} HP`);
    }
    if (typeof cLog.mpChange === 'number' && cLog.mpChange !== 0) {
      const prefix = cLog.mpChange > 0 ? '+' : '';
      lines.push(`  • Biến động MP: ${prefix}${cLog.mpChange} MP`);
    }
    if (cLog.effect) lines.push(`  • Hiệu ứng: ${cLog.effect}`);
    
    lines.push(''); // Dòng trống ngăn cách các turn
  });

  lines.push('==================================================');
  lines.push('HẾT TỆP TRÍCH XUẤT NHẬT KÝ TENSURA RPG');

  // Trigger Download Safe Pattern
  const textOutput = lines.join('\n');
  const filename = `tensura_rpg_logs_${Date.now()}.txt`;
  const blob = new Blob([textOutput], { type: 'text/plain;charset=utf-8' });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  document.body.appendChild(a);
  a.click();

  // Đặt timeout giải phóng bộ nhớ để tránh bị chặn download trên trình duyệt di động
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
