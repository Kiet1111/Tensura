import { CharacterTitle } from '../types';

export const INITIAL_TITLES: ReadonlyArray<CharacterTitle> = Object.freeze([
  {
    id: 'title_reincarnated',
    name: 'Kẻ Tái Sinh Nhập Thế',
    category: 'Thế Giới Khác',
    rarity: 'Rare',
    description: 'Linh hồn vượt qua khoảng trống hư vô để tái sinh tại thế giới ma pháp Tensura, sở hữu cấu trúc ma lực khác biệt.',
    unlocked: true,
    isEquipped: false,
    unlockedAtTurn: 1,
    bonus: {
      hpBonus: 50,
      mpBonus: 50,
      magicBonus: 10,
      description: '+50 HP Tối Đa, +50 MP Tối Đa, +10 Mật Độ Ma Lực'
    },
    requirementHint: 'Tái sinh thành công vào thế giới Tensura.'
  },
  {
    id: 'title_veldora_sworn',
    name: 'Bạn Đồng Hành của Veldora',
    category: 'Cốt Truyện',
    rarity: 'Legendary',
    description: 'Bản thể nhận được sự công nhận, kết nghĩa huynh đệ và mang tên họ Tempest cùng bão rồng Veldora Tempest.',
    unlocked: true,
    isEquipped: true,
    unlockedAtTurn: 1,
    bonus: {
      hpBonus: 150,
      mpBonus: 200,
      atkBonus: 25,
      defBonus: 15,
      magicBonus: 30,
      description: '+150 HP, +200 MP, +25 Tấn Công, +15 Chống Chịu, +30 Ma Lực'
    },
    requirementHint: 'Tương tác & giao kết Linh Hồn cùng Long Vương Veldora.'
  },
  {
    id: 'title_destroyer',
    name: 'Kẻ Hủy Diệt',
    category: 'Chiến Đấu',
    rarity: 'Epic',
    description: 'Danh xưng gieo rắc nỗi khiếp sợ lên hàng trăm ma vật tàn bạo. Mỗi đòn đánh mang theo sát thương tàn phá diện rộng.',
    unlocked: true,
    isEquipped: false,
    unlockedAtTurn: 2,
    bonus: {
      hpBonus: 100,
      atkBonus: 35,
      defBonus: 10,
      description: '+100 HP Tối Đa, +35 Sức Tấn Công, +10 Chống Chịu'
    },
    requirementHint: 'Tiêu diệt ma vật hung tợn trong các trận giao tranh nảy lửa.'
  },
  {
    id: 'title_endless_predator',
    name: 'Kẻ Thôn Phệ Vô Tận',
    category: 'Kỹ Năng Độc Nhất',
    rarity: 'Epic',
    description: 'Thôn phệ và phân tích cấu trúc vật chất, ma vật & quặng Ma Ngân để chuyển hóa thành sức mạnh bản thể.',
    unlocked: false,
    bonus: {
      hpBonus: 120,
      mpBonus: 80,
      defBonus: 20,
      magicBonus: 15,
      description: '+120 HP, +80 MP, +20 Khả Năng Chống Chịu'
    },
    requirementHint: 'Thôn phệ thành công 5 loại ma vật hoặc thuộc tính ma pháp khác nhau.'
  },
  {
    id: 'title_jura_ruler',
    name: 'Chúa Tể Dãy Rừng Jura',
    category: 'Lãnh Địa',
    rarity: 'Legendary',
    description: 'Nguyện làm chiếc khiên che chở và ngọn cờ dẫn dắt liên minh Goblin, Dwarf, Lizardman, Ogre quy phục dưới Lãnh Địa.',
    unlocked: false,
    bonus: {
      hpBonus: 250,
      mpBonus: 150,
      atkBonus: 20,
      defBonus: 30,
      description: '+250 HP, +150 MP, +20 Tấn Công, +30 Chống Chịu Lãnh Địa'
    },
    requirementHint: 'Nâng cấp Lãnh địa Tempest đạt Cấp 3 và thu phục các tộc nhân Jura.'
  },
  {
    id: 'title_anomaly_variable',
    name: 'Biến Số Định Mệnh',
    category: 'Thần Thoại',
    rarity: 'Ultimate',
    description: 'Sự tồn tại ngoài luồng nằm ngoài ghi chép của Tiếng Nói Thế Giới, làm chệch hướng toàn bộ mạch sự kiện Tensura vốn có.',
    unlocked: false,
    bonus: {
      hpBonus: 300,
      mpBonus: 300,
      atkBonus: 40,
      defBonus: 25,
      magicBonus: 50,
      description: '+300 HP, +300 MP, +40 Tấn Công, +25 Chống Chịu, +50 Ma Lực'
    },
    requirementHint: 'Đạt Tỷ Lệ Lệch Cốt Truyện (Divergence Rate) từ 25% trở lên.'
  },
  {
    id: 'title_demon_lord_awakened',
    name: 'Ma Vương Thức Tỉnh',
    category: 'Ma Vương',
    rarity: 'Ultimate',
    description: 'Hấp thu đủ lượng ma lực và linh hồn để bước vào nghi lễ Harvest Festival, tiến hóa thành Ma Vương Chân Chính (True Demon Lord).',
    unlocked: false,
    bonus: {
      hpBonus: 500,
      mpBonus: 500,
      atkBonus: 60,
      defBonus: 40,
      magicBonus: 80,
      description: '+500 HP, +500 MP, +60 Tấn Công, +40 Chống Chịu, +80 Ma Lực'
    },
    requirementHint: 'Đạt Giai Đoạn Tiến Hóa 4 (True Demon Lord Harvest Festival).'
  }
]);

/**
 * Khởi tạo danh sách danh hiệu mới (Deep Clone chống ghi đè tham chiếu)
 */
export function getInitialTitles(): CharacterTitle[] {
  return INITIAL_TITLES.map((t) => ({
    ...t,
    bonus: { ...t.bonus }
  }));
}

export interface TitleBonusSummary {
  hpBonus: number;
  mpBonus: number;
  atkBonus: number;
  defBonus: number;
  magicBonus: number;
  unlockedCount: number;
  totalCount: number;
}

/**
 * Tính tổng chỉ số cộng dồn từ toàn bộ danh hiệu đã mở khóa (Active Passive)
 */
export function calculateTotalTitleBonuses(titles: CharacterTitle[] = []): TitleBonusSummary {
  const safeTitles = titles || [];
  const totals: TitleBonusSummary = {
    hpBonus: 0,
    mpBonus: 0,
    atkBonus: 0,
    defBonus: 0,
    magicBonus: 0,
    unlockedCount: 0,
    totalCount: safeTitles.length
  };

  safeTitles.forEach((t) => {
    if (t.unlocked) {
      totals.unlockedCount++;
      if (t.bonus.hpBonus) totals.hpBonus += t.bonus.hpBonus;
      if (t.bonus.mpBonus) totals.mpBonus += t.bonus.mpBonus;
      if (t.bonus.atkBonus) totals.atkBonus += t.bonus.atkBonus;
      if (t.bonus.defBonus) totals.defBonus += t.bonus.defBonus;
      if (t.bonus.magicBonus) totals.magicBonus += t.bonus.magicBonus;
    }
  });

  return totals;
}

/**
 * Tính chỉ số của riêng các danh hiệu đang được TRANG BỊ (Equipped)
 */
export function calculateEquippedTitleBonuses(titles: CharacterTitle[] = []): TitleBonusSummary {
  const safeTitles = titles || [];
  const totals: TitleBonusSummary = {
    hpBonus: 0,
    mpBonus: 0,
    atkBonus: 0,
    defBonus: 0,
    magicBonus: 0,
    unlockedCount: 0,
    totalCount: safeTitles.length
  };

  safeTitles.forEach((t) => {
    if (t.unlocked && t.isEquipped) {
      totals.unlockedCount++;
      if (t.bonus.hpBonus) totals.hpBonus += t.bonus.hpBonus;
      if (t.bonus.mpBonus) totals.mpBonus += t.bonus.mpBonus;
      if (t.bonus.atkBonus) totals.atkBonus += t.bonus.atkBonus;
      if (t.bonus.defBonus) totals.defBonus += t.bonus.defBonus;
      if (t.bonus.magicBonus) totals.magicBonus += t.bonus.magicBonus;
    }
  });

  return totals;
}

/**
 * Trả về style CSS Badge tương ứng với phẩm cấp danh hiệu
 */
export function getRarityBadgeStyle(rarity: CharacterTitle['rarity']): string {
  switch (rarity) {
    case 'Ultimate':
      return 'border-purple-500/80 bg-purple-950/60 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.35)]';
    case 'Legendary':
      return 'border-amber-500/80 bg-amber-950/60 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
    case 'Epic':
      return 'border-cyan-500/80 bg-cyan-950/60 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]';
    case 'Rare':
      return 'border-emerald-500/80 bg-emerald-950/60 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
    default:
      return 'border-slate-700 bg-slate-900 text-slate-300';
  }
}

/**
 * Kiểm tra và tự động mở khóa các Danh Hiệu mới dựa trên chỉ số Game Engine
 */
export function checkAndUnlockTitles(
  currentTitles: CharacterTitle[],
  gameState: {
    turnCount: number;
    divergenceRate: number;
    evolutionStage: number;
    territoryLevel?: number;
    absorbedCount?: number;
  }
): {
  updatedTitles: CharacterTitle[];
  newUnlockedTitles: CharacterTitle[];
  announcements: string[];
} {
  const newUnlockedTitles: CharacterTitle[] = [];
  const announcements: string[] = [];

  const updatedTitles = currentTitles.map((title) => {
    if (title.unlocked) return title;

    let shouldUnlock = false;

    if (title.id === 'title_anomaly_variable' && gameState.divergenceRate >= 25) {
      shouldUnlock = true;
    } else if (title.id === 'title_demon_lord_awakened' && gameState.evolutionStage >= 4) {
      shouldUnlock = true;
    } else if (title.id === 'title_jura_ruler' && (gameState.territoryLevel || 0) >= 3) {
      shouldUnlock = true;
    } else if (title.id === 'title_endless_predator' && (gameState.absorbedCount || 0) >= 5) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      const unlockedTitle: CharacterTitle = {
        ...title,
        unlocked: true,
        unlockedAtTurn: gameState.turnCount
      };
      newUnlockedTitles.push(unlockedTitle);
      announcements.push(
        `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Nhận được Danh Hiệu Mới: [${title.name}] (${title.rarity})!\nChỉ số nhận thêm: ${title.bonus.description}\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
      );
      return unlockedTitle;
    }

    return title;
  });

  return {
    updatedTitles,
    newUnlockedTitles,
    announcements
  };
}
