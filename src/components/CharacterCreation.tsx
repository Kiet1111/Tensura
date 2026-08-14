import React, { useState } from 'react';
import { RaceType, CharacterStatus, Skill } from '../types';
import { Sparkles, Shield, Zap, Wand2, Compass, CheckCircle2, MapPin, Clock, Landmark, Swords, Mountain, Crown } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { getInitialTitles } from '../utils/titleData';
import { getSkillMaxExp } from '../utils/skillUtils';

interface Props {
  onCharacterCreated: (character: CharacterStatus, initialNarrative: string) => void;
}

export interface StartingLocation {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
  bonusHint: string;
}

export interface TimelineEra {
  id: string;
  name: string;
  periodName: string;
  shortDesc: string;
  fullDesc: string;
  icon: string;
}

const STARTING_LOCATIONS: StartingLocation[] = [
  {
    id: 'sealing_cave',
    name: 'Hang Động Phong Ấn (Sealing Cave)',
    shortDesc: 'Hang ma tinh u tối phong ấn Bạo Phong Rồng Veldora Tempest.',
    fullDesc: 'Linh hồn bạn tỉnh giấc giữa nguồn Ma Phong Tinh đậm đặc. Nơi Veldora Tempest bị giam cầm 300 năm. Đầy rẫy Cỏ Hipokute Thần Cấp và Quặng Ma Ngân.',
    icon: '🌋',
    bonusHint: '+50 MP Tối Đa, Khai Thác Quặng & Thảo Dược Dồi Dào'
  },
  {
    id: 'jura_forest',
    name: 'Đại Rừng Lớn Jura',
    shortDesc: 'Vùng đất hoang dã bạt ngàn của vô số bộ tộc ma vật.',
    fullDesc: 'Rừng rậm nguyên sinh bao la nối liền các quốc gia. Nơi trú ngụ của tộc Goblin, Ogre, Lizardman và hàng ngàn ma vật nguy hiểm.',
    icon: '🌲',
    bonusHint: '+30 HP Tối Đa, Tăng Tốc Độ Thu Phục Đồng Minh'
  },
  {
    id: 'tempest_border',
    name: 'Bờ Hồ Lãnh Địa Tempest',
    shortDesc: 'Địa điểm phong thủy lý tưởng khởi đầu xây dựng đại đô thị.',
    fullDesc: 'Vùng đất phù sa tươi tốt ven sông hồ Jura. Điểm xuất phát lý tưởng để dựng lều trại, mở rộng nông nghiệp và quy tụ nhân tài.',
    icon: '🏛️',
    bonusHint: '+15 Phòng Thủ Lãnh Địa, +10 Dân Số Khởi Đầu'
  },
  {
    id: 'dwargon_kingdom',
    name: 'Vương Quốc Dwarven Dwargon',
    shortDesc: 'Kinh đô ngầm rèn đúc vũ khí ma thuật thần cấp.',
    fullDesc: 'Đô thành ngầm huyền thoại nằm trong dãy núi Canaat. Nơi quy tụ các thợ rèn dwarf tài ba và thị trường thương mại tấp nập.',
    icon: '⚒️',
    bonusHint: 'Nhận Ngay 1 Vũ Khí Ma Ngân & Kỹ Năng Rèn Đúc'
  },
  {
    id: 'ruberios_holy',
    name: 'Thánh Quốc Ruberios',
    shortDesc: 'Lãnh địa thiêng liêng được bảo hộ bởi Giáo Hoàng & Luminous.',
    fullDesc: 'Thủ phủ Thánh Hội Tây Phương được canh phòng cẩn mật. Nơi Ma Vương Luminous Valentine che chở con người đằng sau bức màn bí mật.',
    icon: '🔮',
    bonusHint: '+30 Ma Lực, Kháng Ma Thuật Thánh Lực'
  },
  {
    id: 'eastern_empire',
    name: 'Đế Quốc Đông Phương',
    shortDesc: 'Cường quốc quân sự ma đạo trang bị công nghệ hiện đại.',
    fullDesc: 'Đế quốc quân sự rộng lớn phía Đông lục địa. Nơi sở hữu các binh đoàn Thiết Giáp Quân và công nghệ kết hợp Ma Thuật - Khoa Học.',
    icon: '🐉',
    bonusHint: '+20 Sức Tấn Công, Kháng Kỹ Năng Quân Sự'
  }
];

const TIMELINE_ERAS: TimelineEra[] = [
  {
    id: 'era_veldora',
    name: 'Kỷ Nguyên Long Vương Veldora',
    periodName: 'Năm Rimuru Giáng Thế',
    shortDesc: 'Veldora vẫn bị phong ấn. Thời điểm bắt đầu huyền thoại Tensura.',
    fullDesc: 'Thế giới chưa biết đến sự tồn tại của Liên Minh Tempest. Rừng Jura chìm trong thế cân bằng mong manh giữa các chủng tộc.',
    icon: '⏳'
  },
  {
    id: 'era_orclord',
    name: 'Kỷ Nguyên Tai Họa Orc Lord',
    periodName: 'Trước Đại Chiến 20 vạn quân Orc',
    shortDesc: 'Tộc Orc xâm lược dưới sự giật dây của quỷ nhân Gelmud.',
    fullDesc: '200,000 quân Orc mang theo kỹ năng "Kẻ Hát Nuốt" rầm rộ càn quét Rừng Jura. Lãnh địa lâm vào tình thế báo động đỏ.',
    icon: '⚔️'
  },
  {
    id: 'era_walpurgis',
    name: 'Kỷ Nguyên Tiệc Trà Walpurgis',
    periodName: 'Đại Hội Ma Vương Octagram',
    shortDesc: 'Các Ma Vương Chân Chính quy tụ. Cạnh tranh quyền lực bá chủ.',
    fullDesc: 'Clayman kích động chiến tranh. Các Ma Vương hội tụ tại tiệc trà Walpurgis để định đoạt số phận của các quốc gia.',
    icon: '🍵'
  },
  {
    id: 'era_empire_war',
    name: 'Kỷ Nguyên Xâm Lược Đông Phương',
    periodName: 'Đại Chiến Đế Quốc Quân',
    shortDesc: 'Đế Quốc Đông Phương phát động tổng tấn công Tempest.',
    fullDesc: 'Trận đại chiến quy mô nhất lịch sử bùng nổ. Hàng triệu quân sĩ Thiết Giáp Đông Phương vượt ranh giới nhắm vào Rừng Jura.',
    icon: '💥'
  }
];

const RACES: {
  id: RaceType;
  title: string;
  description: string;
  icon: string;
  statsBonus: string;
  innateSkill: string;
}[] = [
  {
    id: 'Slime',
    title: 'Slime (Ma Vật Tầng Thấp)',
    description: 'Tiềm năng vô hạn thông qua Nuốt Chửng & Phân Tách.',
    icon: '💧',
    statsBonus: 'Kháng Vật Lý +80%, Hồi HP, Dạ Dày Thôn Phệ',
    innateSkill: 'Tái Tạo Tế Bào & Biến Hình Dạng Nhầy',
  },
  {
    id: 'Kijin',
    title: 'Kijin (Quỷ Nhân)',
    description: 'Sức mạnh vật lý và ma thuật cân bằng vượt trội.',
    icon: '👹',
    statsBonus: 'Kiếm Thuật +50%, Kháng Nhiệt Độ +60%',
    innateSkill: 'Bá Khí Quỷ Nhân & Hỏa Hồn Hóa',
  },
  {
    id: 'Dragonewt',
    title: 'Dragonewt (Long Nhân)',
    description: 'Khả năng phòng ngự và bay lượn vượt trội.',
    icon: '🐉',
    statsBonus: 'Giáp Vảy Rồng +50%, Bay Lượn, Long Khí',
    innateSkill: 'Khí Áp Long Nhân & Vảy Long Băng/Hỏa',
  },
  {
    id: 'Human',
    title: 'Con Người (Duyệt Kính Tử)',
    description: 'Tốc độ phát triển kỹ năng nhanh chóng, học vấn vô hạn.',
    icon: '⚔️',
    statsBonus: 'Học Kỹ Năng +50%, Tối đa MP +100',
    innateSkill: 'Lĩnh Hội Tinh Thần & Ma Thuật Nguyên Tố',
  }
];

const PRESET_UNIQUE_SKILLS = [
  {
    name: 'Kẻ Săn Mồi (Predator)',
    desc: 'Nuốt chửng mục tiêu vào Dạ Dày, phân tích thuộc tính và sao chép toàn bộ kỹ năng của đối phương.'
  },
  {
    name: 'Đại Tri Thức (Great Sage)',
    desc: 'Nâng cao tốc độ tư duy gấp 1000 lần, phân tích vạn vật và tự động hỗ trợ thi triển ma thuật tối ưu.'
  },
  {
    name: 'Hỏa Long Vương (Flame Emperor)',
    desc: 'Thao túng ngọn lửa địa ngục thiêu rụi ma vật, chuyển hóa nhiệt lượng thành Ma Lượng vô hạn.'
  },
  {
    name: 'Thôn Phệ Thời Không (Gluttonous Space)',
    desc: 'Tạo vùng không gian hút sạch năng lượng, ma lực và chiêu thức tấn công của kẻ thù.'
  },
  {
    name: 'Tạo Vật Giả (Master Craftsman)',
    desc: 'Biến đổi cấu trúc nguyên liệu, chế tạo vũ khí, dược liệu thần cấp và công trình ma thuật siêu việt.'
  }
];

export const CharacterCreation: React.FC<Props> = ({ onCharacterCreated }) => {
  const [selectedRace, setSelectedRace] = useState<RaceType>('Slime');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('sealing_cave');
  const [selectedEraId, setSelectedEraId] = useState<string>('era_veldora');
  const [name, setName] = useState<string>('Rimuru');
  const [territoryName, setTerritoryName] = useState<string>('Lãnh Địa Tempest');
  const [skillName, setSkillName] = useState<string>('Kẻ Săn Mồi (Predator)');
  const [skillDesc, setSkillDesc] = useState<string>(
    'Nuốt chửng mục tiêu vào Dạ Dày, phân tích thuộc tính và sao chép toàn bộ kỹ năng của đối phương.'
  );

  const handleSelectPreset = (preset: typeof PRESET_UNIQUE_SKILLS[0]) => {
    setSkillName(preset.name);
    setSkillDesc(preset.desc);
    soundManager.playWorldVoiceChime();
  };

  const handleStartGame = () => {
    soundManager.playLevelUpSound();

    const selectedRaceObj = RACES.find(r => r.id === selectedRace)!;
    const selectedLocObj = STARTING_LOCATIONS.find(l => l.id === selectedLocationId) || STARTING_LOCATIONS[0];
    const selectedEraObj = TIMELINE_ERAS.find(e => e.id === selectedEraId) || TIMELINE_ERAS[0];

    // Starting bonuses based on location
    let extraHp = 0;
    let extraMp = 0;
    if (selectedLocObj.id === 'sealing_cave') extraMp += 50;
    if (selectedLocObj.id === 'jura_forest') extraHp += 30;
    if (selectedLocObj.id === 'ruberios_holy') extraMp += 30;

    const initialUniqueSkill: Skill = {
      id: `unique_${Date.now()}`,
      name: skillName || 'Kỹ năng Độc nhất Vô Danh',
      category: 'Unique',
      description: skillDesc || 'Chưa có mô tả sức mạnh.',
      acquiredAt: 1,
      level: 1,
      exp: 0,
      maxExp: getSkillMaxExp(1, 'Unique'),
      proficiency: 0
    };

    const initialInnateSkill: Skill = {
      id: `innate_${Date.now()}`,
      name: selectedRaceObj.innateSkill,
      category: 'Extra',
      description: `Kỹ năng bẩm sinh của chủng tộc ${selectedRaceObj.title}`,
      acquiredAt: 1,
      level: 1,
      exp: 0,
      maxExp: getSkillMaxExp(1, 'Extra'),
      proficiency: 0
    };

    const initialResistance: Skill = {
      id: `res_${Date.now()}`,
      name: selectedRace === 'Slime' ? 'Kháng Biến Dạng & Kháng Vật Lý' : 'Kháng Ma Thuật Sơ Cấp',
      category: 'Resistance',
      description: 'Giảm thiểu sát thương nhận vào từ thuộc tính tương ứng.',
      acquiredAt: 1,
      level: 1,
      exp: 0,
      maxExp: getSkillMaxExp(1, 'Resistance'),
      proficiency: 0
    };

    const character: CharacterStatus = {
      name: name.trim() || 'Người Chuyển Sinh Vô Danh',
      title: 'Kẻ Được Chọn Của Thế Giới',
      race: selectedRace,
      raceTitle: selectedRaceObj.title,
      hp: (selectedRace === 'Slime' ? 120 : selectedRace === 'Kijin' ? 150 : 130) + extraHp,
      maxHp: (selectedRace === 'Slime' ? 120 : selectedRace === 'Kijin' ? 150 : 130) + extraHp,
      mp: (selectedRace === 'Slime' ? 200 : selectedRace === 'Human' ? 250 : 180) + extraMp,
      maxMp: (selectedRace === 'Slime' ? 200 : selectedRace === 'Human' ? 250 : 180) + extraMp,
      skills: [initialUniqueSkill, initialInnateSkill, initialResistance],
      inventory: [
        {
          id: 'item_start_1',
          name: 'Cỏ Hipokute Thần Cấp',
          quantity: 5,
          description: 'Thảo dược tinh khiết chứa nguồn ma lực hồi phục HP/MP dồi dào.',
          type: 'Herb'
        },
        {
          id: 'item_start_2',
          name: 'Quặng Ma Ngân Sơ Cấp',
          quantity: 3,
          description: 'Quặng kim loại Ma Ngân dùng để chế tạo trang bị hoặc rèn lều trại.',
          type: 'Ore'
        }
      ],
      territory: {
        name: territoryName.trim() || 'Lãnh Địa Hoang Dã',
        level: 1,
        levelTitle: 'Lều Trại Khai Khai Hoang Jura',
        population: 5,
        buildings: ['Lều Trại Trung Tâm', 'Khu Lưu Trữ Thảo Dược'],
        defense: 20,
        prosperity: 15
      },
      turn: 1,
      evolutionStage: 1,
      titles: getInitialTitles(),
      equippedTitleId: 'title_veldora_sworn',
      startLocation: selectedLocObj.name,
      timelineEra: selectedEraObj.name,
      evolutionFactors: {
        devour: selectedRace === 'Slime' ? 16 : 10,
        wisdom: skillName.toLowerCase().includes('đại tri thức') || skillName.toLowerCase().includes('great sage') ? 18 : 12,
        protection: 10,
        combat: selectedRace === 'Kijin' || selectedRace === 'Dragonewt' ? 16 : 10,
        magic: selectedRace === 'Human' || selectedLocObj.id === 'sealing_cave' ? 15 : 11,
        soul: 6
      },
      evolutionHistory: [
        `Giai đoạn 1: Sơ sinh / Chuyển sinh ban đầu (${selectedRaceObj.title})`
      ]
    };

    const initialNarrative = `
Chào mừng **${character.name}** đã chuyển sinh đến thế giới ma thuật **Tensura**!

[MỐC THỜI GIAN]: **${selectedEraObj.name} (${selectedEraObj.periodName})**
[NƠI XUẤT HIỆN]: **${selectedLocObj.name}**

Thế giới rung chuyển khi linh hồn của bạn thức tỉnh tại **${selectedLocObj.name}**. Nguồn ma lượng dồi dào bao bọc lấy cơ thể hoàn toàn mới của một sinh linh **${character.raceTitle}**.
${selectedLocObj.fullDesc}

[BỐI CẢNH KỶ NGUYÊN]: ${selectedEraObj.fullDesc}

Trong vô thức, bạn cảm nhận được nguồn sức mạnh tiềm ẩn vô song — Kỹ năng Độc nhất **[${character.skills[0].name}]** đang sục sôi trong linh hồn! Phía trước bạn là con đường huyền thoại mới...

Hành trình chinh phục Ma Vương và xây dựng **${character.territory.name}** chính thức bắt đầu!
`;

    onCharacterCreated(character, initialNarrative);
  };

  return (
    <div className="h-full max-h-full flex flex-col p-2 sm:p-4 max-w-5xl mx-auto overflow-hidden text-slate-200">
      {/* System HUD Header */}
      <div className="shrink-0 bg-slate-900 border-b border-cyan-500/30 p-2.5 sm:p-3 flex items-center justify-between gap-2 mb-2 rounded-xs">
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)] animate-pulse shrink-0" />
          <h1 className="text-xs sm:text-sm font-bold tracking-widest text-cyan-100 uppercase font-mono truncate">
            SYSTEM: REINCARNATION PROTOCOL
          </h1>
        </div>
        <div className="flex space-x-3 text-[10px] font-mono text-cyan-400/70 shrink-0">
          <span className="hidden sm:inline">LATENCY: 0.002ms</span>
          <span>BUFFER: ACTIVE</span>
        </div>
      </div>

      {/* Scrollable Setup Steps Body */}
      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3.5 pr-1.5 pb-2">
        {/* Row 1: Race & Unique Skill */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Step 1: Race Selection (col 6) */}
          <div className="md:col-span-6 bg-slate-900/50 border border-slate-800 p-3 flex flex-col rounded-xs">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono mb-2 border-b border-slate-800 pb-1.5">
              1. Chọn Chủng Tộc
            </h2>
            <div className="space-y-2 flex-1">
              {RACES.map(race => (
                <div
                  key={race.id}
                  onClick={() => {
                    setSelectedRace(race.id);
                    soundManager.playWorldVoiceChime();
                  }}
                  className={`group cursor-pointer p-2.5 border-l-2 transition-all rounded-xs ${
                    selectedRace === race.id
                      ? 'border-cyan-400 bg-cyan-950/30 text-cyan-300'
                      : 'border-slate-700 bg-slate-800/40 hover:border-cyan-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{race.icon}</span> {race.title}
                    </p>
                    {selectedRace === race.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{race.description}</p>
                  <p className="text-[9px] text-cyan-400/80 mt-0.5 font-mono">{race.statsBonus}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Unique Skill Customizer (col 6) */}
          <div className="md:col-span-6 bg-slate-900/50 border border-slate-800 p-3 flex flex-col space-y-2.5 rounded-xs">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono border-b border-slate-800 pb-1.5">
              2. Thiết kế Kỹ năng Độc nhất
            </h2>

            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Gợi ý Mẫu Kỹ Năng:</span>
              <div className="flex flex-wrap gap-1">
                {PRESET_UNIQUE_SKILLS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-1.5 py-0.5 text-[9px] font-mono bg-slate-800 border border-slate-700 hover:border-cyan-400 text-cyan-300 transition-colors uppercase cursor-pointer rounded-xs"
                  >
                    + {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-0.5 flex-1">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Tên Kỹ Năng:
                </label>
                <input
                  type="text"
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  placeholder="Tên kỹ năng..."
                  className="w-full bg-slate-950 border border-slate-700 p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 rounded-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                  Mô Tả Sức Mạnh:
                </label>
                <textarea
                  rows={2}
                  value={skillDesc}
                  onChange={e => setSkillDesc(e.target.value)}
                  placeholder="Mô tả sức mạnh..."
                  className="w-full bg-slate-950 border border-slate-700 p-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none rounded-xs font-sans leading-relaxed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Starting Location & Timeline Era */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Step 3: Starting Location (col 6) */}
          <div className="md:col-span-6 bg-slate-900/50 border border-slate-800 p-3 flex flex-col space-y-2 rounded-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                3. Chọn Nơi Xuất Hiện
              </h2>
              <span className="text-[9px] font-mono text-amber-400/80">LOCATION</span>
            </div>

            <div className="grid grid-cols-1 gap-2 flex-1">
              {STARTING_LOCATIONS.map(loc => (
                <div
                  key={loc.id}
                  onClick={() => {
                    setSelectedLocationId(loc.id);
                    soundManager.playWorldVoiceChime();
                  }}
                  className={`p-2 border rounded-xs cursor-pointer transition-all ${
                    selectedLocationId === loc.id
                      ? 'border-amber-400 bg-amber-950/40 text-amber-200'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm">{loc.icon}</span>
                      <span className="font-bold text-xs text-white truncate">{loc.name}</span>
                    </div>
                    {selectedLocationId === loc.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{loc.shortDesc}</p>
                  <p className="text-[9px] font-mono text-amber-400/90 mt-0.5">✦ {loc.bonusHint}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Timeline Era (col 6) */}
          <div className="md:col-span-6 bg-slate-900/50 border border-slate-800 p-3 flex flex-col space-y-2 rounded-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400" />
                4. Chọn Mốc Thời Gian (Kỷ Nguyên)
              </h2>
              <span className="text-[9px] font-mono text-purple-400/80">TIMELINE</span>
            </div>

            <div className="grid grid-cols-1 gap-2 flex-1">
              {TIMELINE_ERAS.map(era => (
                <div
                  key={era.id}
                  onClick={() => {
                    setSelectedEraId(era.id);
                    soundManager.playWorldVoiceChime();
                  }}
                  className={`p-2 border rounded-xs cursor-pointer transition-all ${
                    selectedEraId === era.id
                      ? 'border-purple-400 bg-purple-950/40 text-purple-200'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm">{era.icon}</span>
                      <div className="min-w-0 truncate">
                        <span className="font-bold text-xs text-white truncate block">{era.name}</span>
                        <span className="text-[9px] font-mono text-purple-300/80">{era.periodName}</span>
                      </div>
                    </div>
                    {selectedEraId === era.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{era.shortDesc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 5: Identity & Territory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/50 border border-slate-800 p-3 rounded-xs">
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Tên Nhân Vật:
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tên nhân vật..."
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs text-white focus:outline-none focus:border-cyan-500 rounded-xs font-mono"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
              Tên Lãnh Địa:
            </label>
            <input
              type="text"
              value={territoryName}
              onChange={e => setTerritoryName(e.target.value)}
              placeholder="Tên lãnh địa..."
              className="w-full bg-slate-950 border border-slate-700 p-2 text-xs text-white focus:outline-none focus:border-cyan-500 rounded-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* Start Button */}
      <div className="shrink-0 pt-2 border-t border-slate-800">
        <button
          onClick={handleStartGame}
          className="w-full bg-cyan-600 border border-cyan-400 text-xs font-bold py-2.5 sm:py-3 hover:bg-cyan-500 transition-colors uppercase text-slate-950 tracking-widest shadow-[0_0_12px_rgba(34,211,238,0.4)] font-mono flex items-center justify-center gap-2 cursor-pointer rounded-xs"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          KÍCH HOẠT CHUYỂN SINH TENSURA
        </button>
      </div>
    </div>
  );
};

