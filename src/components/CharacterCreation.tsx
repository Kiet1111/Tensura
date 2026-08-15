// src/components/CharacterCreation.tsx
import React, { useState } from 'react';
import { GAME_RACES } from '../utils/raceData';
import { RaceType } from '../types';

interface CharacterCreationProps {
  onSelectRace: (selectedRace: RaceType) => void;
}

export const CharacterCreation: React.FC<CharacterCreationProps> = ({ onSelectRace }) => {
  const [selected, setSelected] = useState<RaceType>('Slime');
  const raceList = Object.values(GAME_RACES);

  return (
    <div className="p-4 bg-slate-900 border border-cyan-900/50 rounded-xl space-y-4 max-w-4xl mx-auto">
      <h2 className="text-lg font-bold text-cyan-400 text-center uppercase tracking-wide">
        Chọn Chủng Tộc Khởi Đầu (15 Chủng Tộc)
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
        {raceList.map((race) => (
          <button
            key={race.id}
            onClick={() => setSelected(race.id)}
            className={`p-2 rounded-lg text-xs font-semibold border transition text-left flex flex-col justify-between ${
              selected === race.id
                ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="truncate font-bold text-slate-200">{race.name.split(' ')[0]}</span>
            <span className="text-[10px] opacity-75">{race.category}</span>
          </button>
        ))}
      </div>

      {GAME_RACES[selected] && (
        <div className="p-3 bg-slate-950/90 rounded-lg border border-slate-800 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-amber-300">{GAME_RACES[selected].name}</h3>
            <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px]">
              {GAME_RACES[selected].category}
            </span>
          </div>

          <p className="text-slate-300 italic">{GAME_RACES[selected].description}</p>

          <div className="grid grid-cols-5 gap-1 py-1 text-center bg-slate-900/60 rounded">
            <div><span className="text-slate-500 block text-[10px]">HP</span><b className="text-emerald-400">{GAME_RACES[selected].baseStats.hp}</b></div>
            <div><span className="text-slate-500 block text-[10px]">MP</span><b className="text-cyan-400">{GAME_RACES[selected].baseStats.mp}</b></div>
            <div><span className="text-slate-500 block text-[10px]">ATK</span><b className="text-red-400">{GAME_RACES[selected].baseStats.atk}</b></div>
            <div><span className="text-slate-500 block text-[10px]">DEF</span><b className="text-blue-400">{GAME_RACES[selected].baseStats.def}</b></div>
            <div><span className="text-slate-500 block text-[10px]">MAGIC</span><b className="text-purple-400">{GAME_RACES[selected].baseStats.magic}</b></div>
          </div>

          <div className="flex justify-between text-[11px] pt-1 border-t border-slate-800/60">
            <div><span className="text-slate-400">Đặc tính: </span><span className="text-cyan-300">{GAME_RACES[selected].traits.join(', ')}</span></div>
            <div><span className="text-slate-400">Tiến Hóa: </span><span className="text-purple-300">{GAME_RACES[selected].evolutionPaths.join(' ➔ ')}</span></div>
          </div>
        </div>
      )}

      <button
        onClick={() => onSelectRace(selected)}
        className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-bold text-xs rounded-lg shadow-lg"
      >
        XÁC NHẬN CHỌN CHỦNG TỘC
      </button>
    </div>
  );
};
