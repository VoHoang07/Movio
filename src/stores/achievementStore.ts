import { create } from 'zustand';
import type { Achievement } from '@/domain/entities/Achievement';
import { AchievementService } from '@/application/services/achievements/AchievementService';
import { GetDashboardStats } from '@/application/use-cases/GetDashboardStats';
import { ProgressService } from '@/application/services/progress/ProgressService';
import { LocalProgressRepository } from '@/infrastructure/repositories/LocalProgressRepository';
import { LocalVocabularyRepository } from '@/infrastructure/repositories/LocalVocabularyRepository';

const vocabularyRepository = new LocalVocabularyRepository();
const progressRepository = new LocalProgressRepository();
const progressService = new ProgressService();
const getDashboardStats = new GetDashboardStats(vocabularyRepository, progressRepository, progressService);
const achievementService = new AchievementService();

interface AchievementState {
  achievements: Achievement[];
  load: () => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set, get) => ({
  achievements: [],
  load: async () => {
    const stats = await getDashboardStats.execute();
    const achievements = achievementService.evaluate(stats, get().achievements);
    set({ achievements });
  },
}));
