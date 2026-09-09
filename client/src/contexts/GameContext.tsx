import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { levelFromXp, titleForLevel } from "@/lib/game-data";

type PlayerState = {
  xp: number;
  completed: string[];
  achievements: string[];
  hintsUsed: number;
  recentActivity: string[];
};

type GameContextValue = {
  player: PlayerState;
  level: number;
  levelTitle: string;
  completeMission: (missionId: string, xp: number, achievementId: string) => boolean;
  useHint: () => void;
  resetDemo: () => void;
};

const initialPlayer: PlayerState = {
  xp: 1420,
  completed: [],
  achievements: [],
  hintsUsed: 0,
  recentActivity: ["Agent profile activated", "Mission Control access granted"],
};

const GameContext = createContext<GameContextValue | null>(null);
const STORAGE_KEY = "cyber-society-demo-progress-v1";

export function GameProvider({ children }: { children: ReactNode }) {
  const [player, setPlayer] = useState<PlayerState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? { ...initialPlayer, ...JSON.parse(stored) } : initialPlayer;
    } catch {
      return initialPlayer;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  const completeMission = (missionId: string, xp: number, achievementId: string) => {
    if (player.completed.includes(missionId)) return false;
    setPlayer((current) => ({
      ...current,
      xp: current.xp + xp,
      completed: [...current.completed, missionId],
      achievements: Array.from(new Set([...current.achievements, achievementId])),
      recentActivity: [`Completed ${missionId.replaceAll("-", " ")}`, `Unlocked ${achievementId.replaceAll("-", " ")}`, ...current.recentActivity].slice(0, 5),
    }));
    return true;
  };

  const useHint = () => {
    setPlayer((current) => ({
      ...current,
      hintsUsed: current.hintsUsed + 1,
      achievements: Array.from(new Set([...current.achievements, "curious-mind"])),
    }));
  };

  const resetDemo = () => {
    setPlayer(initialPlayer);
  };

  const value = useMemo(() => {
    const level = levelFromXp(player.xp);
    return { player, level, levelTitle: titleForLevel(level), completeMission, useHint, resetDemo };
  }, [player]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
