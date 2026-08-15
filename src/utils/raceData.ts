// src/utils/raceData.ts
import { RaceInfo, RaceType } from '../types';

export const GAME_RACES: Record<RaceType, RaceInfo> = {
  Slime: {
    id: 'Slime',
    name: 'Slime (Ma Vật Dạng Nhầy)',
    category: 'Ma Vật Vô Tính',
    description: 'Chủng tộc đặc biệt có khả năng chống chịu vật lý cao và hấp thụ vật chất linh hoạt.',
    baseStats: { hp: 200, mp: 300, atk: 15, def: 25, magic: 40 },
    traits: ['Kháng Sát Thương Vật Lý', 'Hấp Thụ & Phân Giải'],
    evolutionPaths: ['Demon Slime', 'Ultimate Slime']
  },
  Demon: {
    id: 'Demon',
    name: 'Ác Ma (Demon)',
    category: 'Tinh Linh Thể',
    description: 'Tồn tại từ thế giới cao cấp, sở hữu lượng ma lực khổng lồ và ma pháp vượt trội.',
    baseStats: { hp: 150, mp: 600, atk: 30, def: 15, magic: 80 },
    traits: ['Bất Tử Thể Ma Pháp', 'Ma Pháp Cổ Đại'],
    evolutionPaths: ['Arch Demon', 'Demon Peer', 'Devil Lord']
  },
  Elemental: {
    id: 'Elemental',
    name: 'Tinh Linh (Elemental)',
    category: 'Tinh Linh Thể',
    description: 'Đại diện cho sức mạnh nguyên tố tự nhiên, chuyển hóa linh hoạt giữa ma pháp và tự nhiên.',
    baseStats: { hp: 120, mp: 550, atk: 10, def: 15, magic: 75 },
    traits: ['Thâm Nhập Nguyên Tố', 'Cộng Hưởng Tự Nhiên'],
    evolutionPaths: ['Greater Elemental', 'Elemental Lord']
  },
  Angel: {
    id: 'Angel',
    name: 'Thiên Sứ (Angel)',
    category: 'Tinh Linh Thể Tinh Thiết',
    description: 'Sinh vật mang năng lượng thần thánh, sở hữu khả năng phòng thủ ma pháp và thanh tẩy mạnh mẽ.',
    baseStats: { hp: 250, mp: 450, atk: 25, def: 35, magic: 60 },
    traits: ['Thần Thần Uy Áp', 'Thanh Tẩy Ma Lực'],
    evolutionPaths: ['Seraphim', 'God Angel']
  },
  Ogre: {
    id: 'Ogre',
    name: 'Ogre (Đại Quỷ Tộc)',
    category: 'Bán Nhân Ma Vật',
    description: 'Chủng tộc chiến binh mạnh mẽ với thể lực vượt trội và khả năng sử dụng khí.',
    baseStats: { hp: 350, mp: 150, atk: 50, def: 30, magic: 20 },
    traits: ['Đô Tộc Chiến Ý', 'Kiếm Khí Cương Thể'],
    evolutionPaths: ['Kijin (Quỷ Nhân)', 'Fair Oni']
  },
  Goblin: {
    id: 'Goblin',
    name: 'Goblin (Cấu Ma Tộc)',
    category: 'Bán Nhân Ma Vật',
    description: 'Tuy yếu ớt ở cấp độ đầu nhưng có tiềm năng tiến hóa thành các chỉ huy kiệt xuất.',
    baseStats: { hp: 100, mp: 80, atk: 12, def: 10, magic: 10 },
    traits: ['Linh Hoạt Nhanh Nhẹn', 'Sinh Tồn Rừng Rậm'],
    evolutionPaths: ['Hobgoblin', 'Ogre', 'Goblin King']
  },
  Orc: {
    id: 'Orc',
    name: 'Orc (Trư Nhân Tộc)',
    category: 'Bán Nhân Ma Vật',
    description: 'Nổi tiếng với sức bền bỉ kiên cường và sức mạnh cơ bắp dẻo dai.',
    baseStats: { hp: 400, mp: 100, atk: 35, def: 40, magic: 10 },
    traits: ['Bền Bỉ Vô Song', 'Cuồng Nổ Thể Lực'],
    evolutionPaths: ['High Orc', 'Orc Disaster']
  },
  Direwolf: {
    id: 'Direwolf',
    name: 'Ma Lang (Direwolf)',
    category: 'Ma Thú Tộc',
    description: 'Loài sói ma thuật săn mồi theo đàn với tốc độ di chuyển và phản xạ cực cao.',
    baseStats: { hp: 180, mp: 120, atk: 40, def: 18, magic: 25 },
    traits: ['Tốc Độ Sấm Sét', 'Giao Thức Bầy Đàn'],
    evolutionPaths: ['Tempest Star Wolf', 'Fenrir']
  },
  Lizardman: {
    id: 'Lizardman',
    name: 'Lizardman (Thằn Lằn Nhân Tộc)',
    category: 'Thủy Lục Ma Vật',
    description: 'Chiến binh bò sát sở hữu lớp vảy rồng cứng cáp và khả năng tác chiến dưới nước.',
    baseStats: { hp: 280, mp: 160, atk: 30, def: 45, magic: 25 },
    traits: ['Vảy Long Thể', 'Bơi Lội Bức Tốc'],
    evolutionPaths: ['Dragonewt (Long Nhân)', 'Dragon Lord']
  },
  Treant: {
    id: 'Treant',
    name: 'Mộc Tinh (Treant)',
    category: 'Thực Vật Tinh Linh',
    description: 'Hộ vệ tự nhiên có lượng HP khổng lồ cùng khả năng phục hồi và thao túng cây cỏ.',
    baseStats: { hp: 500, mp: 300, atk: 20, def: 50, magic: 35 },
    traits: ['Hồi Phục Tự Nhiên', 'Thôi Miên Mộc Rừng'],
    evolutionPaths: ['Dryad', 'Treant King']
  },
  Beastman: {
    id: 'Beastman',
    name: 'Thú Nhân Tộc (Beastman)',
    category: 'Bán Nhân Tộc',
    description: 'Sở hữu khả năng "Hóa Thú" tăng cường toàn bộ chỉ số thể chất lên gấp nhiều lần.',
    baseStats: { hp: 300, mp: 140, atk: 45, def: 25, magic: 15 },
    traits: ['Hóa Thú Cuồng Thể', 'Trực Giác Thú Tính'],
    evolutionPaths: ['Beast Royal', 'Divine Beast']
  },
  HighElf: {
    id: 'HighElf',
    name: 'Tinh Linh Nhân (High Elf)',
    category: 'Bán Nhân Tộc Cao Cấp',
    description: 'Chủng tộc trường thọ tinh thông tinh linh ma pháp và có giác quan ma lực nhạy bén.',
    baseStats: { hp: 160, mp: 500, atk: 20, def: 20, magic: 70 },
    traits: ['Mắt Thần Tinh Linh', 'Linh Khí Ma Pháp'],
    evolutionPaths: ['Spirit King Avatar', 'High Ancestor']
  },
  Merfolk: {
    id: 'Merfolk',
    name: 'Thủy Tộc (Merfolk)',
    category: 'Thủy Sinh Tộc',
    description: 'Chúa tể biển sâu với khả năng điều khiển dòng nước và chiến đấu vượt trội dưới nước.',
    baseStats: { hp: 220, mp: 400, atk: 25, def: 25, magic: 60 },
    traits: ['Thủy Long Chi Phối', 'Hơi Thở Đại Dương'],
    evolutionPaths: ['Mermaid Queen', 'Leviathan Master']
  },
  Insectar: {
    id: 'Insectar',
    name: 'Côn Trùng Tộc (Insectar)',
    category: 'Ngoại Giới Ma Vật',
    description: 'Sở hữu giáp vỏ siêu cứng cùng tốc độ tấn công và khả năng tiến hóa biến thái.',
    baseStats: { hp: 260, mp: 200, atk: 48, def: 48, magic: 30 },
    traits: ['Giáp Côn Trùng Vô Hoại', 'Tiến Hóa Biến Thái'],
    evolutionPaths: ['Insect Kaiser', 'Insect Emperor']
  },
  Vampire: {
    id: 'Vampire',
    name: 'Huyết Tộc (Vampire)',
    category: 'Bất Tử Ma Tộc',
    description: 'Kẻ thống trị bóng đêm có khả năng hút máu phục hồi sinh lực và thao túng máu.',
    baseStats: { hp: 240, mp: 480, atk: 35, def: 30, magic: 65 },
    traits: ['Hút Máu Tái Sinh', 'Thao Túng Huyết Ma'],
    evolutionPaths: ['Vampire Noble', 'Vampire Demon Lord']
  },
  Giant: {
    id: 'Giant',
    name: 'Khổng Lồ Tộc (Giant)',
    category: 'Cổ Đại Tộc',
    description: 'Những gã khổng lồ cổ đại với thể chất đè bẹp mọi đối thủ và kháng ma pháp tự nhiên.',
    baseStats: { hp: 600, mp: 80, atk: 55, def: 45, magic: 10 },
    traits: ['Thần Lực Cổ Đại', 'Kháng Ma Pháp Tự Nhiên'],
    evolutionPaths: ['Titan', 'Ancient Giant God']
  }
};
