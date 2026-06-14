import { describe, expect, it } from 'vitest';
import { ProgressService } from '@/application/services/progress/ProgressService';
import type { ReviewProgress } from '@/domain/entities/ReviewProgress';

const createProgress = (overrides: Partial<ReviewProgress> = {}): ReviewProgress => ({
  wordId: 'walk',
  status: 'learning',
  correctCount: 1,
  wrongCount: 0,
  nextReviewDate: null,
  lastReviewedDate: null,
  favorite: false,
  masteryLevel: 1,
  ...overrides,
});

describe('ProgressService', () => {
  it('returns a streak of 0 when neither today nor yesterday has a review', () => {
    const service = new ProgressService(() => new Date('2025-01-10T12:00:00.000Z'));

    const stats = service.calculate(100, [
      createProgress({ wordId: 'run', lastReviewedDate: '2025-01-08T23:59:59.000Z' }),
    ]);

    expect(stats.streak).toBe(0);
  });

  it('counts a streak from yesterday when there is no review today', () => {
    const service = new ProgressService(() => new Date('2025-01-10T12:00:00.000Z'));

    const stats = service.calculate(100, [
      createProgress({ wordId: 'run', lastReviewedDate: '2025-01-09T09:30:00.000Z' }),
      createProgress({ wordId: 'jump', lastReviewedDate: '2025-01-08T18:45:00.000Z' }),
    ]);

    expect(stats.streak).toBe(2);
  });

  it('normalizes reviewed days in UTC when calculating streaks', () => {
    const service = new ProgressService(() => new Date('2025-01-10T03:00:00.000Z'));

    const stats = service.calculate(100, [
      createProgress({ wordId: 'run', lastReviewedDate: '2025-01-10T00:30:00-05:00' }),
      createProgress({ wordId: 'jump', lastReviewedDate: '2025-01-09T23:30:00.000Z' }),
    ]);

    expect(stats.streak).toBe(2);
  });

  it('ignores invalid review dates when calculating streaks', () => {
    const service = new ProgressService(() => new Date('2025-01-10T12:00:00.000Z'));

    const stats = service.calculate(100, [
      createProgress({ wordId: 'broken', lastReviewedDate: 'not-a-date' }),
      createProgress({ wordId: 'run', lastReviewedDate: '2025-01-10T09:00:00.000Z' }),
    ]);

    expect(stats.streak).toBe(1);
  });

  it('does not count invalid next review dates as due today', () => {
    const service = new ProgressService(() => new Date('2025-01-10T12:00:00.000Z'));

    const stats = service.calculate(100, [
      createProgress({ wordId: 'broken', status: 'learning', nextReviewDate: 'not-a-date' }),
      createProgress({ wordId: 'new-word', status: 'new', nextReviewDate: null }),
    ]);

    expect(stats.dueToday).toBe(1);
  });
  });
