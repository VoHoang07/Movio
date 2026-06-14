import type { ReviewProgress } from '@/domain/entities/ReviewProgress';
import type { ReviewSchedule } from '@/domain/value-objects/ReviewSchedule';

const intervals = [1, 3, 7, 14, 30];

export class SpacedRepetitionService {
  constructor(private readonly nowProvider: () => Date = () => new Date()) {}

  review(progress: ReviewProgress, isCorrect: boolean): ReviewProgress {
    const now = this.nowProvider();

    if (!isCorrect) {
      const schedule = this.createSchedule(1, 'learning', 0, now);
      return {
        ...progress,
        correctCount: 0,
        wrongCount: progress.wrongCount + 1,
        status: schedule.status,
        masteryLevel: schedule.masteryLevel,
        lastReviewedDate: now.toISOString(),
        nextReviewDate: schedule.nextReviewDate,
      };
    }

    const correctCount = progress.correctCount + 1;
    const masteryLevel = Math.min(correctCount, 5);
    const status = masteryLevel >= 5 ? 'mastered' : masteryLevel >= 2 ? 'reviewing' : 'learning';
    const intervalDays = intervals[masteryLevel - 1] ?? intervals[intervals.length - 1];
    const schedule = this.createSchedule(intervalDays, status, masteryLevel, now);

    return {
      ...progress,
      correctCount,
      status: schedule.status,
      masteryLevel: schedule.masteryLevel,
      lastReviewedDate: now.toISOString(),
      nextReviewDate: schedule.nextReviewDate,
    };
  }

  isDue(progress: ReviewProgress, compareDate: Date = this.nowProvider()): boolean {
    if (!progress.nextReviewDate) {
      return progress.status === 'new';
    }

    return new Date(progress.nextReviewDate).getTime() <= compareDate.getTime();
  }

  private createSchedule(intervalDays: number, status: ReviewProgress['status'], masteryLevel: number, now: Date): ReviewSchedule {
    const next = new Date(now);
    next.setUTCDate(next.getUTCDate() + intervalDays);

    return {
      intervalDays,
      status,
      masteryLevel,
      nextReviewDate: next.toISOString(),
    };
  }
}
