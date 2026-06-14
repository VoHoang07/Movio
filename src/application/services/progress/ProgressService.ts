import type { ReviewProgress } from '@/domain/entities/ReviewProgress';
import type { UserStats } from '@/domain/entities/UserStats';

export class ProgressService {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  calculate(totalWords: number, progressList: ReviewProgress[]): UserStats {
    const dueToday = progressList.filter((progress) => {
      if (!progress.nextReviewDate) {
        return progress.status === 'new';
      }
      return new Date(progress.nextReviewDate).getTime() <= this.nowProvider().getTime();
    }).length;

    const studiedWords = progressList.filter((item) => item.correctCount > 0 || item.wrongCount > 0).length;
    const learningWords = progressList.filter((item) => item.status === 'learning' || item.status === 'reviewing').length;
    const masteredWords = progressList.filter((item) => item.status === 'mastered').length;
    const xp = progressList.reduce((sum, item) => sum + item.correctCount * 10, 0);

    return {
      totalWords,
      studiedWords,
      learningWords,
      masteredWords,
      dueToday,
      streak: this.calculateStreak(progressList),
      xp,
      level: Math.max(1, Math.floor(xp / 100) + 1),
    };
  }

  private calculateStreak(progressList: ReviewProgress[]): number {
    const reviewedDays = new Set(
      progressList
        .map((item) => this.toUtcDateKey(item.lastReviewedDate))
        .filter((value): value is string => value !== null),
    );

    if (reviewedDays.size === 0) {
      return 0;
    }

    let streak = 0;
    let currentDateKey = this.toUtcDateKey(this.nowProvider().toISOString());

    if (!currentDateKey) {
      return 0;
    }

    if (!reviewedDays.has(currentDateKey)) {
      currentDateKey = this.shiftUtcDateKey(currentDateKey, -1);
      if (!reviewedDays.has(currentDateKey)) {
        return 0;
      }
    }

    while (reviewedDays.has(currentDateKey)) {
      streak += 1;
      currentDateKey = this.shiftUtcDateKey(currentDateKey, -1);
    }

    return streak;
  }

  private toUtcDateKey(value: string | null): string | null {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toISOString().slice(0, 10);
  }

  private shiftUtcDateKey(dateKey: string, dayOffset: number): string {
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + dayOffset);
    return date.toISOString().slice(0, 10);
  }
}
