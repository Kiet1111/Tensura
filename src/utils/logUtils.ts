import { GameLog, CombatLogEntry, CharacterStatus } from '../types';

export const exportLogsToText = (
  character: CharacterStatus | null,
  logs: GameLog[],
  combatLogs: CombatLogEntry[]
) => {
  const timestamp = new Date().toLocaleString('vi-VN');
  let text = `==================================================\n`;
  text += `TENSURA RPG - LỊCH SỬ NHẬT KÝ HÀNH TRÌNH\n`;
  text += `Nhân vật: ${character ? character.name : 'Vô danh'} [${character?.raceTitle || ''}]\n`;
  text += `Thời gian xuất: ${timestamp}\n`;
  text += `==================================================\n\n`;

  text += `I. DIỄN BIẾN THẾ GIỚI & CỐT TRUYỆN (${logs.length} nhật ký)\n`;
  text += `--------------------------------------------------\n`;

  logs.forEach((log, index) => {
    if (log.type === 'player_action') {
      text += `[${index + 1}] HÀNH ĐỘNG NGƯỜI CHƠI:\n`;
      text += `"${log.content}"\n\n`;
    } else if (log.type === 'world_voice') {
      text += `[${index + 1}] GIỌNG NÓI THẾ GIỚI:\n`;
      text += `${log.content}\n\n`;
    } else if (log.type === 'gm_narrative') {
      text += `[${index + 1}] DIỄN BIẾN (GAME MASTER):\n`;
      text += `${log.content}\n`;
      if (log.worldVoiceAnnouncements && log.worldVoiceAnnouncements.length > 0) {
        log.worldVoiceAnnouncements.forEach(wa => {
          text += `  -> GIỌNG NÓI THẾ GIỚI: ${wa}\n`;
        });
      }
      text += `\n`;
    } else {
      text += `[${index + 1}] THÔNG BÁO HỆ THỐNG:\n`;
      text += `${log.content}\n\n`;
    }
  });

  text += `\nII. NHẬT KÝ CHIẾN ĐẤU & KỸ NĂNG (${combatLogs.length} nhật ký)\n`;
  text += `--------------------------------------------------\n`;

  combatLogs.forEach((cLog, index) => {
    text += `[Turn ${cLog.turn}] ${cLog.timestamp || ''} - ${cLog.actionName}\n`;
    if (cLog.skillUsed) text += `  • Kỹ năng sử dụng: [${cLog.skillUsed}]\n`;
    if (cLog.damageDealt) text += `  • Sát thương gây ra: ${cLog.damageDealt} HP\n`;
    if (cLog.damageTaken) text += `  • Sát thương nhận vào: ${cLog.damageTaken} HP\n`;
    if (cLog.hpChange) text += `  • Hồi phục HP: +${cLog.hpChange} HP\n`;
    if (cLog.mpChange) text += `  • Biến động MP: ${cLog.mpChange > 0 ? '+' : ''}${cLog.mpChange} MP\n`;
    if (cLog.effect) text += `  • Hiệu ứng: ${cLog.effect}\n`;
    text += `\n`;
  });

  text += `==================================================\n`;
  text += `HẾT TỆP TRÍCH XUẤT NHẬT KÝ TENSURA RPG\n`;

  const filename = `tensura_rpg_logs_${Date.now()}.txt`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
