import type { Achievement } from '@/domain/entities/Achievement';
import type { UserStats } from '@/domain/entities/UserStats';

const achievementDefinitions = [
  { id: 'first-10-words', title: 'First 10 Words', description: 'Study your first 10 words.', predicate: (stats: UserStats) => stats.studiedWords >= 10 },
  { id: '100-correct', title: '100 Correct Answers', description: 'Earn 1000 XP through correct answers.', predicate: (stats: UserStats) => stats.xp >= 1000 },
  { id: '7-day-streak', title: '7 Day Streak', description: 'Practice for 7 days in a row.', predicate: (stats: UserStats) => stats.streak >= 7 },
  { id: '30-day-streak', title: '30 Day Streak', description: 'Practice for 30 days in a row.', predicate: (stats: UserStats) => stats.streak >= 30 },
] as const;

export class AchievementService {
  evaluate(stats: UserStats, existing: Achievement[], now: Date = new Date()): Achievement[] {
    const existingMap = new Map(existing.map((achievement) => [achievement.id, achievement]));

    return achievementDefinitions.map((definition) => {
      const previous = existingMap.get(definition.id);
      const unlocked = previous?.unlocked ?? definition.predicate(stats);

      return {
        id: definition.id,
        title: definition.title,
        description: definition.description,
        unlocked,
        unlockedAt: unlocked ? previous?.unlockedAt ?? now.toISOString() : null,
      } satisfies Achievement;
    });
  }
}
