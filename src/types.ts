// src/types.ts

export type RaceType =
  | 'Slime'
  | 'Demon'        // Ác ma
  | 'Elemental'    // Tinh linh
  | 'Angel'        // Thiên sứ
  | 'Ogre'         // Ogre
  | 'Goblin'       // Goblin
  | 'Orc'          // Orc
  | 'Direwolf'     // Ma lang
  | 'Lizardman'    // Lizardman
  | 'Treant'       // Mộc tinh
  | 'Beastman'     // Thú nhân tộc
  | 'HighElf'      // Tinh linh nhân
  | 'Merfolk'      // Thủy tộc
  | 'Insectar'     // Côn trùng tộc
  | 'Vampire'      // Huyết tộc
  | 'Giant';       // Giant

export interface RaceInfo {
  id: RaceType;
  name: string;
  category: string;
  description: string;
  baseStats: {
    hp: number;
    mp: number;
    atk: number;
    def: number;
    magic: number;
  };
  traits: string[];
  evolutionPaths: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  maxLevel: number;
  category: string;
  description: string;
  isArchived?: boolean;
}

export interface SkillArchiveResult {
  updatedSkills: Skill[];
  archivedSkills: Skill[];
  announcements: string[];
}
