import { StoryState, StoryMilestone, CharacterRelation } from '../types';

export const INITIAL_STORY_ARCS: ReadonlyArray<string> = Object.freeze([
  'Chương 1: Hang Động Phong Ấn & Long Vương Veldora',
  'Chương 2: Ngôi Làng Goblin & Bộ Tộc Nanh Sói',
  'Chương 3: Bối Cảnh Quỷ Nhân Kijin & Tai Họa Orc',
  'Chương 4: Phong Ấn Charybdis & Lãnh Địa Tempest',
  'Chương 5: Tiệc Trà Ma Vương (Walpurgis) & Thức Tỉnh',
  'Chương 6: Cuộc Xâm Lược Từ Đế Quốc Đông Phương',
]);

export const INITIAL_MILESTONES: ReadonlyArray<StoryMilestone> = Object.freeze([
  {
    id: 'm01',
    arc: 'Chương 1: Hang Động Phong Ấn & Long Vương Veldora',
    title: 'Thức Tỉnh Tại Hang Động Phong Ấn',
    canonOutcome: 'Tái sinh tại hang động ma lượng trù phú, khám phá phong ấn của Bão Bùng Long Veldora.',
    playerImpact: 'Bạn bắt đầu cuộc sống mới với tư cách là một Kẻ Chuyển Sinh, thu thập thảo dược quý và hấp thụ ma lượng ban đầu.',
    status: 'active',
    divergenceBonus: 0,
  },
  {
    id: 'm02',
    arc: 'Chương 2: Ngôi Làng Goblin & Bộ Tộc Nanh Sói',
    title: 'Tiếp Xúc Với Ngôi Làng Goblin & Nanh Sói',
    canonOutcome: 'Gặp gỡ bộ tộc Goblin yếu thế đang bị đàn sói Nanh Sói uy hiếp dưới chân Rừng Lớn Jura.',
    playerImpact: 'Khám phá hoặc viện trợ ngôi làng, đặt nền móng cho ảnh hưởng đầu tiên của bạn tại Rừng Jura.',
    status: 'locked',
    divergenceBonus: 0,
  },
  {
    id: 'm03',
    arc: 'Chương 3: Bối Cảnh Quỷ Nhân Kijin & Tai Họa Orc',
    title: 'Biến Cố Ogre & Quân Đoàn Orc Disaster',
    canonOutcome: 'Quân đoàn Orc 200,000 con quét qua rừng Jura dưới sự điều khiển của Orc Lord Geld.',
    playerImpact: 'Sát cánh cùng các chủng tộc quái vật đối đầu tai họa diệt vong hoặc tìm kiếm sức mạnh trong hỗn chiến.',
    status: 'locked',
    divergenceBonus: 0,
  },
  {
    id: 'm04',
    arc: 'Chương 4: Phong Ấn Charybdis & Lãnh Địa Tempest',
    title: 'Họa Bão Charybdis & Khẳng Định Vị Thế',
    canonOutcome: 'Quái thú khổng lồ Charybdis thức tỉnh từ bầu trời cùng bầy cá mập bay Megalodon.',
    playerImpact: 'Bảo vệ lãnh địa, giao lưu với Ma Vương Milim Nava và Vương quốc người lùn Dwargon.',
    status: 'locked',
    divergenceBonus: 0,
  },
  {
    id: 'm05',
    arc: 'Chương 5: Tiệc Trà Ma Vương (Walpurgis) & Thức Tỉnh',
    title: 'Đại Hội Ma Vương Walpurgis & Thức Tỉnh',
    canonOutcome: 'Hội nghị tối cao của Thập Đại Ma Vương bàn luận về trật tự thế giới và thanh trừng Clayman.',
    playerImpact: 'Vươn tới ngưỡng sức mạnh của Bát Tinh Ma Vương (Octagram) hoặc lập nên thế lực độc lập.',
    status: 'locked',
    divergenceBonus: 0,
  },
  {
    id: 'm06',
    arc: 'Chương 6: Cuộc Xâm Lược Từ Đế Quốc Đông Phương',
    title: 'Đại Chiến Đế Quốc Đông Phương',
    canonOutcome: 'Đại quân cơ giới hóa và các chiến binh ma pháp của Đế Quốc Đông Phương tấn công.',
    playerImpact: 'Chống trả cuộc xâm lăng bảo vệ nền hòa bình của toàn bộ đại lục rừng Jura.',
    status: 'locked',
    divergenceBonus: 0,
  },
]);

export const INITIAL_RELATIONS: ReadonlyArray<CharacterRelation> = Object.freeze([
  {
    name: 'Rimuru Tempest',
    title: 'Lãnh Tụ Liên Minh Quái Vật Tempest (Slime)',
    affinity: 50,
    status: 'Đồng minh',
    notes: 'Kẻ chuyển sinh đồng hương, luôn cởi mở và sẵn sàng hợp tác cùng nhau xây dựng thế giới.',
  },
  {
    name: 'Veldora Tempest',
    title: 'Bão Bùng Long (Long Tộc Tối Cao)',
    affinity: 40,
    status: 'Tò mò',
    notes: 'Hào hứng trước ma lượng và kỹ năng độc nhất của một kẻ chuyển sinh mới đến.',
  },
  {
    name: 'Milim Nava',
    title: 'Cổ Đại Ma Vương (Kẻ Hủy Diệt)',
    affinity: 35,
    status: 'Trung lập',
    notes: 'Rất hứng thú với những kẻ có thực lực mạnh và có đồ ăn ngon hoặc trò chơi thú vị.',
  },
  {
    name: 'Benimaru & Shion',
    title: 'Quỷ Nhân Kijin (Chiến Tướng Tempest)',
    affinity: 45,
    status: 'Thân thiết',
    notes: 'Tôn trọng ý chí chiến đấu và tinh thần trách nhiệm với lãnh thổ.',
  },
  {
    name: 'Hinata Sakaguchi',
    title: 'Thánh Kỵ Sĩ Trưởng Thánh Quốc Ruberios',
    affinity: 20,
    status: 'Nghi vấn',
    notes: 'Cảnh giác và theo dõi sát sao mọi cá nhân sở hữu lượng ma lượng lớn tại Jura.',
  },
  {
    name: 'Clayman',
    title: 'Ma Vương Rối (Chủ Mưu Sau Màn)',
    affinity: 10,
    status: 'Đối đầu',
    notes: 'Xem bạn như một chướng ngại vật tiềm tàng cản trở kế hoạch thôn tính của hắn.',
  },
]);

/**
 * Khởi tạo trạng thái cốt truyện mới (Deep Clone chống ghi đè tham chiếu)
 */
export function getInitialStoryState(): StoryState {
  return {
    currentArc: INITIAL_STORY_ARCS[0],
    arcProgress: 10,
    divergenceRate: 0,
    variableTitle: 'Kẻ Chuyển Sinh Đến Từ Thế Giới Khác',
    milestones: INITIAL_MILESTONES.map((m) => ({ ...m })),
    relations: INITIAL_RELATIONS.map((r) => ({ ...r })),
    recentCanonChanges: [
      'Bạn vừa chuyển sinh đến Thế Giới Tensura tại Hang Động Phong Ấn.',
      'Bắt đầu hành trình khám phá Rừng Lớn Jura và xây dựng vị thế của riêng bạn.',
    ],
  };
}

/**
 * Lấy thông tin đánh giá tiến độ chương truyện với biên giới giá trị an toàn
 */
export function getStoryProgressInfo(arcProgress: number): {
  title: string;
  badgeColor: string;
  description: string;
} {
  const safeProgress = Math.max(0, Math.min(100, arcProgress));

  if (safeProgress >= 80) {
    return {
      title: 'GIAI ĐOẠN ĐỈNH CAO CHƯƠNG',
      badgeColor: 'bg-rose-950 border-rose-500 text-rose-300 shadow-rose-500/30',
      description: 'Chương truyện đang bước vào giai đoạn quyết định với những biến cố lớn nhất.',
    };
  }
  if (safeProgress >= 50) {
    return {
      title: 'DIỄN BIẾN CAO TRÀO',
      badgeColor: 'bg-purple-950 border-purple-400 text-purple-300 shadow-purple-500/30',
      description: 'Cốt truyện đang diễn ra sôi nổi với nhiều cuộc gặp gỡ và thử thách quan trọng.',
    };
  }
  if (safeProgress >= 25) {
    return {
      title: 'MỞ RỘNG HÀNH TRÌNH',
      badgeColor: 'bg-amber-950 border-amber-400 text-amber-300 shadow-amber-500/20',
      description: 'Từng bước khám phá bối cảnh thế giới và thiết lập mối quan hệ với các nhân vật.',
    };
  }
  return {
    title: 'KHỞI ĐẦU HÀNH TRÌNH',
    badgeColor: 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-cyan-500/20',
    description: 'Bắt đầu bước chân vào thế giới Tensura với tư cách là một Kẻ Chuyển Sinh.',
  };
}
