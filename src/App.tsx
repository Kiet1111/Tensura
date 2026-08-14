import React, { useState, useEffect, useRef } from 'react';
import { CharacterStatus, GameLog, CombatEnemy, GameState, TurnResponse, Skill, InventoryItem, CombatLogEntry, CharacterTitle, StoryState, PendingEvolution, EvolutionBranch } from './types';
import { CharacterCreation } from './components/CharacterCreation';
import { StatusBoard } from './components/StatusBoard';
import { GameLogPanel } from './components/GameLogPanel';
import { CombatLogPanel } from './components/CombatLogPanel';
import { CombatCard } from './components/CombatCard';
import { SkillToastNotification, ToastItem } from './components/SkillToastNotification';
import { LowResourceWarningPopup } from './components/LowResourceWarningPopup';
import { MainStoryModal } from './components/MainStoryModal';
import { StoryBanner } from './components/StoryBanner';
import { EvolutionChoiceModal } from './components/EvolutionChoiceModal';
import { SkillLibraryModal } from './components/SkillLibraryModal';
import { MobileHUDBar } from './components/MobileHUDBar';
import { MobileQuickDock } from './components/MobileQuickDock';
import { useDeviceAdaptation } from './hooks/useDeviceAdaptation';
import { getInitialStoryState } from './utils/storyData';
import { getInitialTitles } from './utils/titleData';
import { saveSkillsToArchive } from './utils/skillArchiveUtils';
import { exportLogsToText } from './utils/logUtils';
import { processTurnSkillExp, getSkillMaxExp } from './utils/skillUtils';
import { soundManager } from './utils/audio';
import {
  calculateActionFactors,
  applyFactorGains,
  checkRaceEvolutionEligibility,
  resolveRaceEvolution,
  applyEvolutionBranch,
  checkSkillEvolutionEligibility,
  resolveSkillEvolution,
  applySkillEvolutionBranch,
  INITIAL_EVOLUTION_FACTORS
} from './utils/evolutionEngine';
import {
  Swords,
  Pickaxe,
  Home,
  Sparkles,
  Send,
  RefreshCw,
  Volume2,
  VolumeX,
  Compass,
  Shield,
  Heart,
  Zap,
  BookOpen,
  Activity,
  Scroll,
  GitBranch,
  LogOut,
  Archive,
  UserPlus,
  Dna
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'tensura_rpg_game_save_v1';

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.character) {
          if (Array.isArray(parsed.character.skills)) {
            const usedSkillIds = new Set<string>();
            parsed.character.skills = parsed.character.skills.map((s: any, idx: number) => {
              let skId = s.id || `skill_${idx}`;
              if (usedSkillIds.has(skId)) {
                skId = `skill_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
              }
              usedSkillIds.add(skId);
              return { ...s, id: skId };
            });
          }
          if (!parsed.character.titles || !Array.isArray(parsed.character.titles) || parsed.character.titles.length === 0) {
            parsed.character.titles = getInitialTitles();
          }
          if (!parsed.character.equippedTitleId) {
            const equipped = parsed.character.titles.find((t: any) => t.isEquipped);
            parsed.character.equippedTitleId = equipped ? equipped.id : 'title_veldora_sworn';
          }
        }
        return {
          ...parsed,
          combatLogs: parsed.combatLogs || [],
          storyState: parsed.storyState || getInitialStoryState()
        };
      } catch (e) {
        console.error("Failed to parse saved game:", e);
      }
    }
    return {
      character: null,
      logs: [],
      combatLogs: [],
      currentEnemy: null,
      suggestedActions: [
        "Đi săn ma vật ở Rừng Lớn Jura",
        "Khai thác Cỏ Hipokute và Quặng Ma Ngân",
        "Trở về nâng cấp Lãnh địa",
        "Kích hoạt Kỹ năng Độc nhất khảo sát xung quanh"
      ],
      location: "Hang Động Phong Ấn Sealing Cave",
      storyState: getInitialStoryState(),
      isCombatActive: false,
      isGameOver: false,
      isInitialized: false,
    };
  });

  const [customActionText, setCustomActionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showSkillLibraryModal, setShowSkillLibraryModal] = useState(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [logViewMode, setLogViewMode] = useState<'narrative' | 'combat' | 'both'>('narrative');
  const [skillToasts, setSkillToasts] = useState<ToastItem[]>([]);
  const [pendingEvolution, setPendingEvolution] = useState<PendingEvolution | null>(null);

  const actionSectionRef = useRef<HTMLDivElement>(null);
  const deviceInfo = useDeviceAdaptation();

  const handleScrollToActions = () => {
    if (actionSectionRef.current) {
      actionSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleDismissToast = (id: string) => {
    setSkillToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSelectEvolutionBranch = (branch: EvolutionBranch) => {
    if (!gameState.character) return;

    if (pendingEvolution?.type === 'skill') {
      const targetSkill = gameState.character.skills.find(
        s => (pendingEvolution.targetSkillName && s.name === pendingEvolution.targetSkillName) ||
             (branch.targetSkillPattern && s.name.toLowerCase().includes(branch.targetSkillPattern.toLowerCase()))
      ) || gameState.character.skills[0];

      const { updatedCharacter, worldVoiceAnnouncement } = applySkillEvolutionBranch(
        gameState.character,
        branch,
        targetSkill?.id
      );

      const evoLog: GameLog = {
        id: `log_evo_skill_${Date.now()}`,
        type: 'world_voice',
        content: `Thăng hoa kỹ năng thành công: **[${targetSkill?.name || 'Kỹ năng'}]** ➔ **[${branch.name}]**!`,
        worldVoiceAnnouncements: [worldVoiceAnnouncement],
        isMilestone: true,
        milestoneTitle: `Thăng Hoa Kỹ Năng: [${branch.name}]`
      };

      const evoCombatEntry: CombatLogEntry = {
        id: `combat_evo_skill_${Date.now()}`,
        turn: gameState.character.turn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        actionName: `Thăng Hoa Kỹ Năng: [${branch.name}]`,
        attacker: updatedCharacter.name,
        effect: `Kỹ năng [${targetSkill?.name}] thăng hoa thành [${branch.name}]!`,
        type: 'skill'
      };

      if (branch.newSkill) {
        const newToast: ToastItem = {
          id: `toast_skill_evo_${Date.now()}`,
          skill: branch.newSkill,
          timestamp: Date.now()
        };
        setSkillToasts(prev => [newToast, ...prev]);
      }

      setGameState(prev => ({
        ...prev,
        character: updatedCharacter,
        logs: [...prev.logs, evoLog],
        combatLogs: [...(prev.combatLogs || []), evoCombatEntry]
      }));

      setPendingEvolution(null);
      if (soundEnabled) {
        soundManager.playWorldVoiceChime();
        soundManager.playLevelUpSound();
      }
      return;
    }

    // Race Evolution
    const { updatedCharacter, worldVoiceAnnouncement } = applyEvolutionBranch(gameState.character, branch);

    const evoLog: GameLog = {
      id: `log_evo_branch_${Date.now()}`,
      type: 'world_voice',
      content: `Tiến hóa chủng tộc thành công: **${gameState.character.raceTitle}** ➔ **${branch.name}**!`,
      worldVoiceAnnouncements: [worldVoiceAnnouncement],
      isMilestone: true,
      milestoneTitle: `Tiến Hóa Chủng Tộc: [${branch.name}]`
    };

    const evoCombatEntry: CombatLogEntry = {
      id: `combat_evo_${Date.now()}`,
      turn: gameState.character.turn,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actionName: `Tiến Hóa Chủng Tộc: [${branch.name}]`,
      attacker: updatedCharacter.name,
      effect: `Chủng tộc chuyển biến thành [${branch.name}]. Thức tỉnh kỹ năng mới!`,
      type: 'system'
    };

    // Toasts for newly granted skills from evolution
    if (branch.grantedSkills && branch.grantedSkills.length > 0) {
      const newToasts: ToastItem[] = branch.grantedSkills.map((sk, idx) => ({
        id: `toast_evo_skill_${Date.now()}_${idx}`,
        skill: {
          id: `sk_evo_${Date.now()}_${idx}`,
          name: sk.name,
          category: sk.category,
          description: sk.description,
          acquiredAt: gameState.character.turn,
          level: 1,
          exp: 0,
          maxExp: getSkillMaxExp(1, sk.category),
          proficiency: 0
        },
        timestamp: Date.now() + idx * 250
      }));
      setSkillToasts(prev => [...newToasts, ...prev]);
    }

    setGameState(prev => ({
      ...prev,
      character: updatedCharacter,
      logs: [...prev.logs, evoLog],
      combatLogs: [...(prev.combatLogs || []), evoCombatEntry]
    }));

    setPendingEvolution(null);
    if (soundEnabled) {
      soundManager.playLevelUpSound();
    }
  };

  // Save progress to LocalStorage
  useEffect(() => {
    if (gameState.isInitialized) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gameState));
    }
  }, [gameState]);

  // Handle Character Creation
  const handleCharacterCreated = (character: CharacterStatus, initialNarrative: string) => {
    const initialLog: GameLog = {
      id: `log_${Date.now()}`,
      type: 'gm_narrative',
      content: initialNarrative,
      isMilestone: true,
      isStoryChange: true,
      storyTitle: 'Chương 1: Hang Động Phong Ấn & Long Vương Veldora',
      milestoneTitle: 'Thức Tỉnh Tại Hang Động Phong Ấn',
      worldVoiceAnnouncements: [
        `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Thức tỉnh Chủng tộc [${character.raceTitle}] và Kỹ năng Độc nhất [${character.skills[0].name}]!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
      ]
    };

    const initialCombatEntry: CombatLogEntry = {
      id: `combat_init_${Date.now()}`,
      turn: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      actionName: `Khởi tạo chuyển sinh: Chủng tộc [${character.raceTitle}]`,
      attacker: character.name,
      skillUsed: character.skills[0]?.name,
      effect: `Thức tỉnh [${character.skills[0]?.name}]`,
      type: 'skill'
    };

    setGameState({
      character,
      logs: [initialLog],
      combatLogs: [initialCombatEntry],
      currentEnemy: null,
      suggestedActions: [
        "Khảo sát khu vực Hang Động Phong Ấn",
        "Thu thập Cỏ Hipokute mọc trên vách đá",
        "Sử dụng Kỹ năng Độc nhất hấp thu Ma Lượng",
        "Tiến ra ngoài Rừng Lớn Jura"
      ],
      location: "Hang Động Phong Ấn Sealing Cave",
      isCombatActive: false,
      isGameOver: false,
      isInitialized: true
    });

    if (soundEnabled) {
      soundManager.playWorldVoiceChime();
    }

    // Trigger toasts for awakened initial skills
    if (character.skills && character.skills.length > 0) {
      const initialToasts: ToastItem[] = character.skills.map((sk, idx) => ({
        id: `toast_init_${sk.id || idx}_${Date.now()}`,
        skill: sk,
        timestamp: Date.now() + idx * 200
      }));
      setSkillToasts(initialToasts);
    }
  };

  const handleEquipTitle = (titleId: string) => {
    if (!gameState.character) return;
    const currentTitles = gameState.character.titles && gameState.character.titles.length > 0 
      ? gameState.character.titles 
      : getInitialTitles();
    const targetTitle = currentTitles.find(t => t.id === titleId);
    if (!targetTitle || !targetTitle.unlocked) return;

    const updatedTitles = currentTitles.map(t => ({
      ...t,
      isEquipped: t.id === titleId
    }));

    setGameState(prev => {
      if (!prev.character) return prev;
      return {
        ...prev,
        character: {
          ...prev.character,
          title: targetTitle.name,
          equippedTitleId: titleId,
          titles: updatedTitles
        }
      };
    });

    if (soundEnabled) {
      soundManager.playWorldVoiceChime();
    }
  };

  // Process Action Turn
  const handleAction = async (actionText: string) => {
    if (!gameState.character || isLoading || !actionText.trim()) return;

    const currentTurn = gameState.character.turn + 1;
    setIsLoading(true);

    // Add Player action log
    const playerLog: GameLog = {
      id: `log_player_${Date.now()}`,
      type: 'player_action',
      content: actionText.trim()
    };

    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, playerLog]
    }));

    setCustomActionText('');

    try {
      // API call to backend Gemini GM Server
      const res = await fetch('/api/game/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          character: gameState.character,
          action: actionText,
          currentEnemy: gameState.currentEnemy,
          location: gameState.location,
          storyState: gameState.storyState
        })
      });

      let turnData: TurnResponse;
      const contentType = res.headers.get('content-type');

      if (res.ok && contentType && contentType.includes('application/json')) {
        try {
          turnData = await res.json();
        } catch (jsonErr) {
          console.warn("Could not parse JSON response from /api/game/turn, using client fallback:", jsonErr);
          turnData = generateClientFallbackTurn(gameState.character, actionText, gameState.currentEnemy, gameState.location);
        }
      } else {
        console.warn(`Server returned status ${res.status} or non-JSON content. Using client fallback.`);
        turnData = generateClientFallbackTurn(gameState.character, actionText, gameState.currentEnemy, gameState.location);
      }

      // Play sound if World Voice announced something
      if (turnData.worldVoiceAnnouncements && turnData.worldVoiceAnnouncements.length > 0 && soundEnabled) {
        soundManager.playWorldVoiceChime();
      }

      if (turnData.isDevourSuccess && soundEnabled) {
        soundManager.playDevourSound();
      }

      // Collect newly acquired skills or resistances for Toast Notifications
      const newToasts: ToastItem[] = [];
      const currentSkills = gameState.character?.skills || [];

      if (turnData.newSkills) {
        turnData.newSkills.forEach((ns, idx) => {
          if (!currentSkills.some(s => s.name === ns.name)) {
            newToasts.push({
              id: `toast_new_${ns.id || Date.now()}_${idx}`,
              skill: ns,
              timestamp: Date.now() + idx * 150
            });
          }
        });
      }

      if (turnData.newResistances) {
        turnData.newResistances.forEach((nr, idx) => {
          if (!currentSkills.some(s => s.name === nr.name)) {
            newToasts.push({
              id: `toast_res_${nr.id || Date.now()}_${idx}`,
              skill: nr,
              timestamp: Date.now() + idx * 150
            });
          }
        });
      }

      if (newToasts.length > 0) {
        setSkillToasts(prev => [...prev, ...newToasts]);
      }

      // Calculate state updates
      setGameState(prev => {
        if (!prev.character) return prev;

        // Update skills
        let updatedSkills = [...prev.character.skills];
        if (turnData.newSkills) {
          turnData.newSkills.forEach((ns, idx) => {
            if (!updatedSkills.some(s => s.name === ns.name)) {
              const uniqueSkillId = ns.id && !updatedSkills.some(s => s.id === ns.id)
                ? ns.id
                : `skill_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
              updatedSkills.push({
                ...ns,
                id: uniqueSkillId,
                level: ns.level || 1,
                exp: ns.exp || 0,
                maxExp: ns.maxExp || getSkillMaxExp(1, ns.category),
                proficiency: ns.proficiency || 0
              });
            }
          });
        }
        if (turnData.newResistances) {
          turnData.newResistances.forEach((nr, idx) => {
            if (!updatedSkills.some(s => s.name === nr.name)) {
              const uniqueResId = nr.id && !updatedSkills.some(s => s.id === nr.id)
                ? nr.id
                : `res_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 6)}`;
              updatedSkills.push({
                ...nr,
                id: uniqueResId,
                level: nr.level || 1,
                exp: nr.exp || 0,
                maxExp: nr.maxExp || getSkillMaxExp(1, nr.category),
                proficiency: nr.proficiency || 0
              });
            }
          });
        }

        // Process XP progression for all skills used/exercised this turn
        const { updatedSkills: expUpdatedSkills, levelUpAnnouncements: skillLevelAnnouncements } = processTurnSkillExp(
          updatedSkills,
          actionText,
          turnData.narrative || '',
          !!turnData.combatEnemy || !!prev.currentEnemy
        );
        updatedSkills = expUpdatedSkills;

        // Update inventory
        let updatedInventory = [...prev.character.inventory];
        if (turnData.itemsGained) {
          turnData.itemsGained.forEach(item => {
            const existing = updatedInventory.find(i => i.name === item.name);
            if (existing) {
              existing.quantity += item.quantity;
            } else {
              updatedInventory.push(item);
            }
          });
        }

        // Update territory
        let updatedTerritory = { ...prev.character.territory };
        if (turnData.territoryChanges) {
          const tc = turnData.territoryChanges;
          if (tc.levelIncrease) updatedTerritory.level += tc.levelIncrease;
          if (tc.populationIncrease) updatedTerritory.population += tc.populationIncrease;
          if (tc.newBuildings) {
            tc.newBuildings.forEach(b => {
              if (!updatedTerritory.buildings.includes(b)) {
                updatedTerritory.buildings.push(b);
              }
            });
          }
        }

        const newHp = Math.min(
          prev.character.maxHp,
          Math.max(1, prev.character.hp + (turnData.hpChange || 0))
        );
        const newMp = Math.min(
          prev.character.maxMp + 20,
          Math.max(0, prev.character.mp + (turnData.mpChange || 0))
        );

        // Update storyState if turnData contains storyUpdate
        let updatedStoryState = { ...prev.storyState };
        if (turnData.storyUpdate) {
          const su = turnData.storyUpdate;
          if (su.currentArc) updatedStoryState.currentArc = su.currentArc;
          if (su.arcProgress !== undefined) updatedStoryState.arcProgress = su.arcProgress;
          if (su.divergenceTotal !== undefined) {
            updatedStoryState.divergenceRate = su.divergenceTotal;
          } else if (su.divergenceChange !== undefined) {
            updatedStoryState.divergenceRate = Math.min(100, Math.max(0, updatedStoryState.divergenceRate + su.divergenceChange));
          }
          if (su.variableTitle) updatedStoryState.variableTitle = su.variableTitle;

          // Relation updates
          if (su.relationChanges && su.relationChanges.length > 0) {
            let updatedRelations = [...updatedStoryState.relations];
            su.relationChanges.forEach(rc => {
              const idx = updatedRelations.findIndex(r => r.name.toLowerCase().includes(rc.name.toLowerCase()));
              if (idx !== -1) {
                const curr = updatedRelations[idx];
                const newAff = Math.min(100, Math.max(0, curr.affinity + (rc.affinityChange || 0)));
                updatedRelations[idx] = {
                  ...curr,
                  affinity: newAff,
                  status: (rc.newStatus as any) || curr.status,
                  notes: rc.notes || curr.notes
                };
              } else {
                updatedRelations.push({
                  name: rc.name,
                  title: 'Nhân vật Tensura',
                  affinity: Math.min(100, Math.max(0, 50 + (rc.affinityChange || 0))),
                  status: (rc.newStatus as any) || 'Tò mò',
                  notes: rc.notes || 'Thế lực mới ghi nhận sự hiện diện của bạn.'
                });
              }
            });
            updatedStoryState.relations = updatedRelations;
          }

          // Milestone updates
          if (su.milestoneUnlocked) {
            const mu = su.milestoneUnlocked;
            updatedStoryState.milestones = updatedStoryState.milestones.map(m => {
              if (m.id === mu.id || m.title.toLowerCase().includes(mu.title?.toLowerCase() || '')) {
                return {
                  ...m,
                  status: mu.status,
                  playerImpact: mu.playerImpact || m.playerImpact
                };
              }
              return m;
            });
          }

          // Log recent canon changes
          if (su.canonChangeDescription) {
            updatedStoryState.recentCanonChanges = [
              su.canonChangeDescription,
              ...updatedStoryState.recentCanonChanges
            ].slice(0, 25);
          }
        }

        let currentTitles = prev.character.titles && prev.character.titles.length > 0 
          ? [...prev.character.titles] 
          : getInitialTitles();
        let titleAnnouncements: string[] = [];

        currentTitles = currentTitles.map(t => {
          if (t.unlocked) return t;

          let shouldUnlock = false;
          if (t.id === 'title_endless_predator' && (updatedSkills.length >= 4 || updatedInventory.length >= 3)) {
            shouldUnlock = true;
          } else if (t.id === 'title_destroyer' && currentTurn >= 2) {
            shouldUnlock = true;
          } else if (t.id === 'title_jura_ruler' && updatedTerritory.level >= 2) {
            shouldUnlock = true;
          } else if (t.id === 'title_anomaly_variable' && updatedStoryState.divergenceRate >= 20) {
            shouldUnlock = true;
          } else if (t.id === 'title_demon_lord_awakened' && prev.character.evolutionStage >= 4) {
            shouldUnlock = true;
          }

          if (shouldUnlock) {
            titleAnnouncements.push(`░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận thành tựu... Mở khóa Danh Hiệu Mới: [${t.name}]!\n[Thưởng Ẩn]: ${t.bonus.description}\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`);
            return { ...t, unlocked: true, unlockedAtTurn: currentTurn };
          }
          return t;
        });

        // Calculate factor gains based on action text and narrative
        const factorGains = calculateActionFactors(actionText, turnData.narrative || '', turnData.isDevourSuccess);
        const currentFactors = prev.character.evolutionFactors || INITIAL_EVOLUTION_FACTORS;
        const updatedFactors = applyFactorGains(currentFactors, factorGains);

        let finalCharacter: CharacterStatus = {
          ...prev.character,
          hp: newHp,
          mp: newMp,
          skills: updatedSkills,
          inventory: updatedInventory,
          territory: updatedTerritory,
          turn: currentTurn,
          titles: currentTitles,
          evolutionFactors: updatedFactors,
          evolutionHistory: prev.character.evolutionHistory || [
            `Giai đoạn 1: Sơ sinh (${prev.character.raceTitle})`
          ]
        };

        // Check race evolution eligibility
        const raceEligibility = checkRaceEvolutionEligibility(finalCharacter);
        let evoAnnouncement: string | undefined = undefined;
        let pendingEvoToSet: PendingEvolution | null = null;

        if (raceEligibility.eligible && raceEligibility.branches.length > 0) {
          const resolution = resolveRaceEvolution(finalCharacter, raceEligibility.branches);

          if (resolution.isDominant && resolution.dominantBranch) {
            // SKEWED / DOMINANT: Automatically select the evolution path!
            const applied = applyEvolutionBranch(finalCharacter, resolution.dominantBranch);
            finalCharacter = applied.updatedCharacter;
            evoAnnouncement = applied.worldVoiceAnnouncement;

            // Trigger toast for dominant race evolution
            if (resolution.dominantBranch.grantedSkills) {
              const evoToasts: ToastItem[] = resolution.dominantBranch.grantedSkills.map((sk, idx) => ({
                id: `toast_evo_auto_${Date.now()}_${idx}`,
                skill: {
                  id: `sk_evo_auto_${Date.now()}_${idx}`,
                  name: sk.name,
                  category: sk.category,
                  description: sk.description,
                  acquiredAt: currentTurn,
                  level: 1,
                  exp: 0,
                  maxExp: getSkillMaxExp(1, sk.category),
                  proficiency: 0
                },
                timestamp: Date.now() + idx * 300
              }));
              setSkillToasts(prevToasts => [...evoToasts, ...prevToasts]);
            }

            if (soundEnabled) {
              soundManager.playLevelUpSound();
            }
          } else if (!resolution.isDominant && resolution.balancedBranches.length > 0) {
            // BALANCED: Trigger player choice modal!
            pendingEvoToSet = {
              id: `evo_pending_${Date.now()}`,
              type: 'race',
              currentTitle: finalCharacter.raceTitle,
              branches: resolution.balancedBranches,
              reason: raceEligibility.reason,
              triggeredBy: actionText,
              factorSnapshot: updatedFactors
            };

            if (soundEnabled) {
              soundManager.playWorldVoiceChime();
            }
          }
        }

        // Check Skill Evolution eligibility across all skills if no race evolution choice modal is waiting
        let skillEvoAnnouncements: string[] = [];
        if (!pendingEvoToSet) {
          for (const sk of finalCharacter.skills) {
            const skillEligibility = checkSkillEvolutionEligibility(finalCharacter, sk);
            if (skillEligibility.eligible && skillEligibility.branches.length > 0) {
              const resolution = resolveSkillEvolution(finalCharacter, sk, skillEligibility.branches);

              if (resolution.isDominant && resolution.dominantBranch) {
                // SKEWED / DOMINANT: Automatically evolve skill!
                const applied = applySkillEvolutionBranch(finalCharacter, resolution.dominantBranch, sk.id);
                finalCharacter = applied.updatedCharacter;
                skillEvoAnnouncements.push(applied.worldVoiceAnnouncement);

                if (resolution.dominantBranch.newSkill) {
                  const newToast: ToastItem = {
                    id: `toast_skill_evo_auto_${Date.now()}`,
                    skill: resolution.dominantBranch.newSkill,
                    timestamp: Date.now()
                  };
                  setSkillToasts(prevToasts => [newToast, ...prevToasts]);
                }

                if (soundEnabled) {
                  soundManager.playWorldVoiceChime();
                  soundManager.playLevelUpSound();
                }
              } else if (!resolution.isDominant && resolution.balancedBranches.length > 0) {
                // BALANCED: Trigger player choice modal for skill!
                pendingEvoToSet = {
                  id: `skill_evo_pending_${Date.now()}`,
                  type: 'skill',
                  currentTitle: sk.name,
                  targetSkillName: sk.name,
                  branches: resolution.balancedBranches,
                  reason: skillEligibility.reason,
                  triggeredBy: actionText,
                  factorSnapshot: updatedFactors
                };

                if (soundEnabled) {
                  soundManager.playWorldVoiceChime();
                }
                break; // Stop at first balanced skill to allow user choice
              }
            }
          }
        }

        if (pendingEvoToSet) {
          setPendingEvolution(pendingEvoToSet);
        }

        const combinedWVAnnouncements = [
          ...(turnData.worldVoiceAnnouncements || []),
          ...(evoAnnouncement ? [evoAnnouncement] : []),
          ...skillEvoAnnouncements,
          ...titleAnnouncements,
          ...skillLevelAnnouncements
        ];

        const isStoryMilestone = !!turnData.storyUpdate?.milestoneUnlocked || !!turnData.storyUpdate?.canonChangeDescription;
        const isEvolutionOrTitle = !!evoAnnouncement || skillEvoAnnouncements.length > 0 || titleAnnouncements.length > 0;
        const isMilestone = isStoryMilestone || isEvolutionOrTitle;
        const isStoryChange = !!turnData.storyUpdate?.canonChangeDescription || !!turnData.storyUpdate?.currentArc;
        const storyTitle = turnData.storyUpdate?.milestoneUnlocked?.title || (isStoryChange ? turnData.storyUpdate?.currentArc : undefined);

        const gmLog: GameLog = {
          id: `log_gm_${Date.now()}`,
          type: 'gm_narrative',
          content: turnData.narrative,
          worldVoiceAnnouncements: combinedWVAnnouncements.length > 0 ? combinedWVAnnouncements : undefined,
          isMilestone,
          isStoryChange,
          storyTitle,
          milestoneTitle: turnData.storyUpdate?.milestoneUnlocked?.title || (isEvolutionOrTitle ? 'Biến Cố Thức Tỉnh & Tiến Hóa' : undefined)
        };

        // Construct Combat Log Entry
        const now = new Date();
        const timestampStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        const actLower = actionText.toLowerCase();

        let entryType: CombatLogEntry['type'] = 'system';
        let skillNameUsed: string | undefined = undefined;
        let damageDealt: number | undefined = undefined;
        let damageTaken: number | undefined = undefined;
        let effectDescription: string | undefined = undefined;

        if (turnData.isDevourSuccess || actLower.includes('thôn phệ') || actLower.includes('nuốt')) {
          entryType = 'devour';
          effectDescription = turnData.newSkills && turnData.newSkills.length > 0
            ? `Nhận Kỹ năng [${turnData.newSkills[0].name}]`
            : 'Nuốt Chửng & Phân Tách Ma Lượng';
        } else if (actLower.includes('săn') || actLower.includes('tấn công') || actLower.includes('đánh')) {
          entryType = 'attack';
          damageDealt = Math.floor(Math.random() * 25) + 20;
          if (turnData.hpChange && turnData.hpChange < 0) {
            damageTaken = Math.abs(turnData.hpChange);
          }
        } else if (actLower.includes('kỹ năng') || actLower.includes('skill')) {
          entryType = 'skill';
          skillNameUsed = prev.character.skills[0]?.name || 'Kỹ năng Độc nhất';
          damageDealt = Math.floor(Math.random() * 35) + 25;
        } else if (actLower.includes('khai thác')) {
          entryType = 'gather';
          effectDescription = 'Khai thác Cỏ Hipokute & Ma Ngân';
        } else if (actLower.includes('lãnh địa') || actLower.includes('nâng cấp')) {
          entryType = 'territory';
          effectDescription = `Thôn tiến hóa Cấp ${updatedTerritory.level}`;
        }

        const newCombatEntry: CombatLogEntry = {
          id: `combat_${Date.now()}`,
          turn: currentTurn,
          timestamp: timestampStr,
          actionName: actionText.trim(),
          attacker: prev.character.name,
          target: prev.currentEnemy?.name,
          damageDealt,
          damageTaken,
          hpChange: turnData.hpChange && turnData.hpChange > 0 ? turnData.hpChange : undefined,
          mpChange: turnData.mpChange,
          skillUsed: skillNameUsed,
          effect: effectDescription,
          type: entryType
        };

        return {
          ...prev,
          character: finalCharacter,
          logs: [...prev.logs, gmLog],
          combatLogs: [...(prev.combatLogs || []), newCombatEntry],
          currentEnemy: turnData.combatEnemy !== undefined ? turnData.combatEnemy : prev.currentEnemy,
          suggestedActions: turnData.suggestedActions || prev.suggestedActions,
          location: turnData.locationUpdate || prev.location,
          storyState: updatedStoryState,
          isCombatActive: !!turnData.combatEnemy
        };
      });
    } catch (error) {
      console.error("Turn processing error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Open Reset & Character Creation Confirmation Modal
  const handleResetGame = () => {
    setShowResetConfirmModal(true);
  };

  const handleConfirmReset = () => {
    if (gameState.character && gameState.character.skills) {
      const result = saveSkillsToArchive(gameState.character.skills);
      setSkillToasts(prev => [
        ...prev,
        {
          id: `toast_archive_${Date.now()}`,
          skill: {
            id: 'archived_notice',
            name: `Đã Lưu ${result.addedCount} Kỹ Năng Về Từ Điển!`,
            category: 'Ultimate',
            description: `Tổng số kỹ năng lưu trữ vĩnh viễn trong Từ Điển Kỹ Năng: ${result.totalCount} kỹ năng.`,
            acquiredAt: 1
          },
          timestamp: Date.now()
        }
      ]);
    }

    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setGameState({
      character: null,
      logs: [],
      combatLogs: [],
      currentEnemy: null,
      suggestedActions: [],
      location: "Hang Động Phong Ấn Sealing Cave",
      storyState: getInitialStoryState(),
      isCombatActive: false,
      isGameOver: false,
      isInitialized: false
    });
    setShowResetConfirmModal(false);

    if (soundEnabled) {
      soundManager.playWorldVoiceChime();
    }
  };

  // Clear old narrative logs keeping the most recent ones
  const handleClearOldGameLogs = () => {
    setGameState(prev => {
      if (prev.logs.length <= 5) return prev;
      const kept = prev.logs.slice(-5);
      return { ...prev, logs: kept };
    });
    setSkillToasts(prev => [
      ...prev,
      {
        id: `toast_clear_gamelog_${Date.now()}`,
        skill: {
          id: 'log_notice',
          name: 'Đã Dọn Dẹp Nhật Ký Cốt Truyện!',
          category: 'Common',
          description: 'Hệ thống đã dọn dẹp các mục log cũ và giữ lại 5 lượt cốt truyện gần nhất.',
          acquiredAt: 1
        },
        timestamp: Date.now()
      }
    ]);
  };

  // Clear old combat logs keeping the most recent ones
  const handleClearOldCombatLogs = () => {
    setGameState(prev => {
      if (!prev.combatLogs || prev.combatLogs.length <= 8) return prev;
      const kept = prev.combatLogs.slice(-8);
      return { ...prev, combatLogs: kept };
    });
    setSkillToasts(prev => [
      ...prev,
      {
        id: `toast_clear_combatlog_${Date.now()}`,
        skill: {
          id: 'log_notice',
          name: 'Đã Dọn Dẹp Nhật Ký Chiến Đấu!',
          category: 'Common',
          description: 'Hệ thống đã dọn dẹp các lượt combat cũ và giữ lại 8 hiệp giao tranh gần nhất.',
          acquiredAt: 1
        },
        timestamp: Date.now()
      }
    ]);
  };

  // Export full game & combat logs to text file download
  const handleExportAllLogs = () => {
    if (!gameState.character) return;
    exportLogsToText(gameState.character, gameState.logs, gameState.combatLogs || []);
    setSkillToasts(prev => [
      ...prev,
      {
        id: `toast_export_log_${Date.now()}`,
        skill: {
          id: 'export_notice',
          name: 'Đã Xuất File Nhật Ký Hành Trình (.TXT)!',
          category: 'Extra',
          description: 'Tệp nhật ký Tensura đã được tải về thiết bị của bạn thành công.',
          acquiredAt: 1
        },
        timestamp: Date.now()
      }
    ]);
  };

  // Render Character Creation if not initialized
  if (!gameState.isInitialized || !gameState.character) {
    return (
      <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100 flex flex-col justify-center">
        <CharacterCreation onCharacterCreated={handleCharacterCreated} />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Header matching Geometric Balance */}
      <header className="h-11 sm:h-12 bg-slate-900 border-b border-cyan-500/30 flex items-center justify-between px-2.5 sm:px-4 md:px-6 shrink-0 z-30">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)] shrink-0 animate-pulse" />
          <h1 className="text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest text-cyan-100 uppercase font-mono truncate">
            SYSTEM: WORLD LANGUAGE
          </h1>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] md:text-xs font-mono text-cyan-400/70 shrink-0">
          <span className="hidden xl:inline">LATENCY: 0.002ms</span>

          {/* Quick Header Controls */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setShowStoryModal(true)}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-cyan-950/80 border border-cyan-400/80 hover:bg-cyan-900 text-cyan-300 text-[9px] sm:text-[10px] uppercase font-bold transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(6,182,212,0.2)] cursor-pointer rounded-xs"
            >
              <Compass className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">CỐT TRUYỆN</span>
              <span className="sm:hidden">SAGA</span>
            </button>

            <button
              onClick={() => setShowSkillLibraryModal(true)}
              title="Mở Thư Viện & Từ Điển Kỹ Năng Tensura"
              className="hidden sm:flex px-2 py-1 bg-purple-950/80 border border-purple-400/80 hover:bg-purple-900 text-purple-300 text-[10px] uppercase font-bold transition-all items-center gap-1 cursor-pointer rounded-xs"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>TỪ ĐIỂN SKILL</span>
            </button>

            <button
              onClick={() => setShowStatusModal(true)}
              className="lg:hidden px-2 py-0.5 sm:py-1 bg-slate-800 border border-slate-700 hover:border-cyan-400 text-cyan-300 text-[9px] sm:text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1 rounded-xs"
            >
              <BookOpen className="w-3 h-3" />
              <span>STATUS</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
              className="p-1 sm:p-1.5 bg-slate-800 border border-slate-700 hover:border-cyan-400 text-slate-300 transition-all rounded-xs cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3 h-3 text-cyan-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
            </button>

            <button
              onClick={handleResetGame}
              title="Lưu Kỹ Năng & Tạo Nhân Vật Mới"
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-rose-950/80 border border-rose-500/80 hover:bg-rose-900 text-rose-300 text-[9px] sm:text-[10px] font-mono font-bold transition-all flex items-center gap-1 shadow-[0_0_10px_rgba(244,63,94,0.2)] cursor-pointer rounded-xs"
            >
              <UserPlus className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="hidden md:inline">TẠO MỚI</span>
              <span className="md:hidden">RESET</span>
            </button>
          </div>
        </div>
      </header>

      {/* Top Mobile Status Ribbon (<lg screens) */}
      <MobileHUDBar
        character={gameState.character}
        location={gameState.location}
        onOpenStatusModal={() => setShowStatusModal(true)}
        onOpenSkillLibrary={() => setShowSkillLibraryModal(true)}
      />

      {/* Main Grid Content - Responsive multi-column layout strictly fit within viewport */}
      <main className="flex-1 min-h-0 max-w-7xl 2xl:max-w-[1750px] w-full mx-auto p-1.5 sm:p-2.5 md:p-3 pb-16 lg:pb-1.5 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-3 overflow-hidden">
        {/* Central Game Section (8 cols on desktop) */}
        <section className="lg:col-span-8 xl:col-span-8 h-full min-h-0 flex flex-col justify-between overflow-hidden gap-1.5 sm:gap-2">
          {/* Top Status & Controls Row */}
          <div className="shrink-0 space-y-1.5">
            {/* Current Location Bar */}
            <div className="bg-slate-900/60 border border-slate-800 px-2.5 py-1.5 flex items-center justify-between text-xs font-mono rounded-xs">
              <div className="flex items-center gap-2 text-slate-300 truncate">
                <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">VỊ TRÍ: <strong className="text-cyan-300 uppercase">{gameState.location}</strong></span>
              </div>
              <span className="text-cyan-500/80 shrink-0 font-bold text-[11px]">TURN #{gameState.character.turn}</span>
            </div>

            {/* Main Saga Story Banner */}
            {gameState.storyState && (
              <StoryBanner
                storyState={gameState.storyState}
                onOpenStoryModal={() => setShowStoryModal(true)}
              />
            )}

            {/* Combat Card if enemy present */}
            {gameState.currentEnemy && (
              <CombatCard enemy={gameState.currentEnemy} onAction={handleAction} />
            )}

            {/* Log Panel View Mode Switcher Header */}
            <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 px-2 py-1 font-mono text-xs rounded-xs">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setLogViewMode('narrative')}
                  className={`px-2 py-0.5 uppercase font-bold flex items-center gap-1 text-[11px] transition-colors rounded-xs cursor-pointer ${
                    logViewMode === 'narrative'
                      ? 'bg-cyan-950 border border-cyan-400 text-cyan-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Scroll className="w-3 h-3 text-cyan-400 shrink-0" />
                  <span>Dẫn Chuyện</span>
                </button>

                <button
                  onClick={() => setLogViewMode('combat')}
                  className={`px-2 py-0.5 uppercase font-bold flex items-center gap-1 text-[11px] transition-colors rounded-xs cursor-pointer ${
                    logViewMode === 'combat'
                      ? 'bg-rose-950 border border-rose-500 text-rose-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3 h-3 text-rose-400 shrink-0" />
                  <span>Chiến Đấu</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping ml-0.5" />
                </button>

                <button
                  onClick={() => setLogViewMode('both')}
                  className={`hidden md:flex items-center gap-1 px-2 py-0.5 uppercase font-bold text-[11px] transition-colors rounded-xs cursor-pointer ${
                    logViewMode === 'both'
                      ? 'bg-purple-950 border border-purple-400 text-purple-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Cả Hai</span>
                </button>
              </div>

              <span className="text-[9px] text-slate-500 hidden sm:inline font-mono">
                LOG_MODE: {logViewMode.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Log Panel Renderings Filling Remaining Height */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {logViewMode === 'narrative' && (
              <GameLogPanel
                logs={gameState.logs}
                onClearOldLogs={handleClearOldGameLogs}
                onExportLogs={handleExportAllLogs}
              />
            )}

            {logViewMode === 'combat' && (
              <CombatLogPanel
                combatLogs={gameState.combatLogs || []}
                onClearOldCombatLogs={handleClearOldCombatLogs}
                onExportCombatLogs={handleExportAllLogs}
              />
            )}

            {logViewMode === 'both' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full min-h-0 overflow-hidden">
                <GameLogPanel
                  logs={gameState.logs}
                  onClearOldLogs={handleClearOldGameLogs}
                  onExportLogs={handleExportAllLogs}
                />
                <CombatLogPanel
                  combatLogs={gameState.combatLogs || []}
                  onClearOldCombatLogs={handleClearOldCombatLogs}
                  onExportCombatLogs={handleExportAllLogs}
                />
              </div>
            )}
          </div>

          {/* Action Control Panel at Bottom */}
          <div ref={actionSectionRef} className="shrink-0 space-y-1.5 pt-1.5 border-t border-slate-800/80 bg-slate-950/90">
            {/* Game Master Suggested Actions */}
            <div className="space-y-1">
              <p className="text-[9px] font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> HÀNH ĐỘNG GỢI Ý TỪ SYSTEM:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {gameState.suggestedActions.map((act, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleAction(act)}
                    className="p-1.5 sm:p-2 bg-slate-800/40 border-l-2 border-slate-700 hover:border-cyan-400 hover:bg-slate-800 text-[11px] text-left text-white font-medium transition-all group flex items-center justify-between disabled:opacity-50 min-h-[38px] cursor-pointer rounded-xs"
                  >
                    <span className="line-clamp-1 truncate">❖ {act}</span>
                    <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-mono shrink-0 ml-1">→</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Grid 4 Quick Action Buttons matching Geometric Balance specification */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] font-bold uppercase font-mono">
              <button
                disabled={isLoading}
                onClick={() => handleAction("Khai thác tài nguyên Cỏ Hipokute và Quặng Ma Ngân")}
                className="bg-slate-800/90 border border-slate-700 font-bold py-1.5 hover:bg-cyan-900 transition-colors uppercase text-slate-200 hover:text-white hover:border-cyan-500/50 flex items-center justify-center gap-1 min-h-[38px] cursor-pointer rounded-xs"
              >
                <Pickaxe className="w-3 h-3 text-cyan-400" /> Khai Thác
              </button>

              <button
                disabled={isLoading}
                onClick={() => handleAction("Đi săn ma vật ở Rừng Lớn Jura")}
                className="bg-slate-800/90 border border-slate-700 font-bold py-1.5 hover:bg-red-900 transition-colors uppercase text-slate-200 hover:text-white hover:border-rose-500/50 flex items-center justify-center gap-1 min-h-[38px] cursor-pointer rounded-xs"
              >
                <Swords className="w-3 h-3 text-rose-400" /> Săn Ma Vật
              </button>

              <button
                disabled={isLoading}
                onClick={() => handleAction("Nâng cấp xây dựng Lãnh địa Tempest")}
                className="bg-slate-800/90 border border-slate-700 font-bold py-1.5 hover:bg-amber-900 transition-colors uppercase text-slate-200 hover:text-white hover:border-amber-500/50 flex items-center justify-center gap-1 min-h-[38px] cursor-pointer rounded-xs"
              >
                <Home className="w-3 h-3 text-amber-400" /> Lãnh Địa
              </button>

              <button
                disabled={isLoading}
                onClick={() => handleAction(`Sử dụng Kỹ năng Độc nhất [${gameState.character.skills[0].name}]`)}
                className="bg-cyan-600 border border-cyan-400 font-bold py-1.5 hover:bg-cyan-500 transition-colors uppercase text-slate-950 flex items-center justify-center gap-1 shadow-[0_0_8px_rgba(34,211,238,0.4)] min-h-[38px] cursor-pointer rounded-xs"
              >
                <Sparkles className="w-3 h-3 text-slate-950" /> Dùng Skill
              </button>
            </div>

            {/* Free Text Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAction(customActionText);
              }}
              className="flex items-center gap-1.5 pt-0.5"
            >
              <input
                type="text"
                disabled={isLoading}
                value={customActionText}
                onChange={(e) => setCustomActionText(e.target.value)}
                placeholder="Nhập hành động tự do (VD: Chế tạo trang bị, đối thoại, thám hiểm...)"
                className="flex-1 bg-slate-950 border border-slate-700 p-2 text-xs text-white focus:outline-none focus:border-cyan-500 rounded-xs font-sans placeholder-slate-500 disabled:opacity-50 min-h-[38px]"
              />
              <button
                type="submit"
                disabled={isLoading || !customActionText.trim()}
                className="px-3 sm:px-4 py-2 bg-cyan-600 border border-cyan-400 text-slate-950 font-bold text-xs uppercase font-mono hover:bg-cyan-500 disabled:opacity-50 flex items-center gap-1.5 transition-colors shadow-[0_0_8px_rgba(34,211,238,0.3)] min-h-[38px] shrink-0 cursor-pointer rounded-xs"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Gửi</span>
              </button>
            </form>
          </div>
        </section>

        {/* Status Board Sidebar Column (4 cols on desktop) */}
        <section className="hidden lg:flex lg:col-span-4 xl:col-span-4 h-full min-h-0 flex-col overflow-hidden">
          <StatusBoard character={gameState.character} onEquipTitle={handleEquipTitle} />
        </section>
      </main>

      {/* Footer matching Geometric Balance */}
      <footer className="hidden lg:flex h-6 bg-cyan-900/10 border-t border-slate-800/80 items-center px-4 shrink-0 z-30">
        <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="w-1/3 h-full bg-cyan-500" />
        </div>
        <span className="ml-4 text-[9px] font-mono text-cyan-500/60">
          CORE_SYSTEM_READY // NO_SCROLL_VIEWPORT_V2.0
        </span>
      </footer>

      {/* Mobile Quick Dock Bar (<lg screens) */}
      <MobileQuickDock
        logViewMode={logViewMode}
        onSelectLogMode={(mode) => setLogViewMode(mode)}
        onOpenStatusModal={() => setShowStatusModal(true)}
        onOpenStoryModal={() => setShowStoryModal(true)}
        onOpenSkillLibrary={() => setShowSkillLibraryModal(true)}
        onScrollToActions={handleScrollToActions}
        divergenceRate={gameState.storyState?.divergenceRate}
        isInCombat={!!gameState.currentEnemy}
      />

      {/* World Voice Skill Toast Notification */}
      <SkillToastNotification toasts={skillToasts} onDismiss={handleDismissToast} />

      {/* Low HP/MP Danger Alert Popup */}
      <LowResourceWarningPopup
        character={gameState.character}
        soundEnabled={soundEnabled}
        onUseRecoverySkill={() => handleAction("Sử dụng kỹ năng hấp thu Cỏ Hipokute hồi phục HP và MP cấp tốc")}
      />

      {/* Main Story Modal */}
      {gameState.storyState && (
        <MainStoryModal
          storyState={gameState.storyState}
          isOpen={showStoryModal}
          onClose={() => setShowStoryModal(false)}
        />
      )}

      {/* Tensura Skill Library Modal */}
      <SkillLibraryModal
        skills={gameState.character.skills}
        isOpen={showSkillLibraryModal}
        onClose={() => setShowSkillLibraryModal(false)}
      />

      {/* Dynamic Evolution Choice Modal (Triggered when multi-path factors are balanced) */}
      {pendingEvolution && (
        <EvolutionChoiceModal
          pendingEvolution={pendingEvolution}
          isOpen={!!pendingEvolution}
          onSelectBranch={handleSelectEvolutionBranch}
        />
      )}

      {/* Mobile Status Modal */}
      {showStatusModal && (
        <StatusBoard
          character={gameState.character}
          isOpenModal={true}
          onCloseModal={() => setShowStatusModal(false)}
          onEquipTitle={handleEquipTitle}
        />
      )}

      {/* Reset & New Character Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in font-sans">
          <div className="w-full max-w-md bg-slate-950 border-2 border-rose-500/80 p-5 rounded-xs shadow-[0_0_40px_rgba(244,63,94,0.25)] space-y-4 text-slate-200">
            <div className="flex items-center space-x-3 border-b border-rose-500/40 pb-3">
              <div className="p-2 bg-rose-950 border border-rose-500/50 rounded-xs text-rose-400">
                <LogOut className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-mono font-black text-sm text-white uppercase tracking-wider">
                  THOÁT GAME & TẠO NHÂN VẬT MỚI
                </h3>
                <p className="text-[11px] font-mono text-rose-400">
                  SYSTEM: REINCARNATION TERMINATION
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300 leading-relaxed">
                Bạn có chắc chắn muốn kết thúc hành trình của nhân vật{' '}
                <strong className="text-white font-mono">[{gameState.character.name}]</strong>?
              </p>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xs space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                  <Archive className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>TRÍCH XUẤT TỪ ĐIỂN KỸ NĂNG:</span>
                </div>
                <p className="text-slate-300 font-sans text-xs">
                  Toàn bộ <strong className="text-amber-300 font-mono">{gameState.character.skills.length} kỹ năng</strong> đã học sẽ được trích xuất và <strong className="text-emerald-400">LƯU VĨNH VIỄN</strong> vào <strong className="text-cyan-300">Thư Viện Từ Điển Kỹ Năng</strong>!
                </p>
                <p className="text-[10px] text-slate-400 italic">
                  * Các nhân vật tạo mới trong tương lai có thể tra cứu và kế thừa tri thức từ điển kiếp trước.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirmModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold transition-colors rounded-xs cursor-pointer"
              >
                HỦY BỎ
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 bg-rose-950 hover:bg-rose-900 border border-rose-500 text-rose-200 font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-1.5 rounded-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>XÁC NHẬN LƯU & TẠO MỚI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Client-side fallback turn generator if server endpoint returns non-JSON or HTML
function generateClientFallbackTurn(
  character: CharacterStatus,
  actionText: string,
  currentEnemy: CombatEnemy | null,
  location?: string
): TurnResponse {
  const actLower = actionText.toLowerCase();
  let narrative = `Bạn thực hiện hành động: "${actionText}". Sóng ma lực cuộn trào trong không gian, chuyển hóa theo ý chí của bạn.`;
  let worldVoiceAnnouncements: string[] = [
    `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Hoàn tất hành động [${actionText.slice(0, 25)}...].\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
  ];
  let hpChange = 10;
  let mpChange = 10;
  let isDevourSuccess = false;
  let storyUpdate: TurnResponse['storyUpdate'] = undefined;

  if (actLower.includes('thôn phệ') || actLower.includes('nuốt')) {
    isDevourSuccess = true;
    narrative = `Bạn kích hoạt cơ chế Thôn Phệ! Quá trình phân tích thuộc tính và hấp thụ ma lực vào Dạ Dày đã diễn ra thành công.`;
    worldVoiceAnnouncements = [
      `░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░\n[GIỌNG NÓI THẾ GIỚI]: Đã xác nhận... Thôn Phệ hoàn tất! Gia tăng trữ lượng Ma Lượng!\n░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`
    ];
  }

  if (actLower.includes('veldora') || actLower.includes('rimuru') || actLower.includes('goblin') || actLower.includes('orc') || actLower.includes('cốt truyện')) {
    storyUpdate = {
      divergenceChange: 5,
      canonChangeDescription: `Can thiệp cốt truyện Tensura thông qua hành động "${actionText.slice(0, 30)}...".`,
      relationChanges: [
        { name: 'Veldora Tempest', affinityChange: 5, notes: 'Sự can thiệp của biến số khiến Veldora hết sức hiếu kỳ.' },
        { name: 'Rimuru Tempest', affinityChange: 5, notes: 'Rimuru cảm nhận được một luồng ma lực khác biệt trong dòng sự kiện.' }
      ]
    };
  }

  return {
    narrative,
    worldVoiceAnnouncements,
    hpChange,
    mpChange,
    suggestedActions: [
      "Tương tác với Long Vương Veldora",
      "Khảo sát khu vực Hang Động Phong Ấn",
      "Khai thác quặng Ma Ngân & Cỏ Hipokute",
      "Phát triển và mở rộng Lãnh địa Tempest"
    ],
    isDevourSuccess,
    locationUpdate: location || "Hang Động Phong Ấn",
    storyUpdate
  };
}

