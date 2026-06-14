import { describe, expect, it } from 'vitest';
import { SpacedRepetitionService } from '@/application/services/review/SpacedRepetitionService';
import type { ReviewProgress } from '@/domain/entities/ReviewProgress';

const baseProgress: ReviewProgress = {
  wordId: 'walk',
  status: 'new',
  correctCount: 0,
  wrongCount: 0,
  lastReviewedDate: null,
  nextReviewDate: null,
  favorite: false,
  masteryLevel: 0,
};

describe('SpacedRepetitionService', () => {
  it('schedules tomorrow after a wrong answer', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    const result = service.review(baseProgress, false);

    expect(result.wrongCount).toBe(1);
    expect(result.correctCount).toBe(0);
    expect(result.status).toBe('learning');
    expect(result.masteryLevel).toBe(0);
    expect(result.lastReviewedDate).toBe('2025-01-01T10:00:00.000Z');
    expect(result.nextReviewDate).toBe('2025-01-02T10:00:00.000Z');
  });

  it('resets correct streak after a wrong answer but preserves unrelated fields', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-10T10:00:00.000Z'));
    const progress: ReviewProgress = {
      ...baseProgress,
      status: 'reviewing',
      correctCount: 3,
      wrongCount: 1,
      favorite: true,
      masteryLevel: 3,
      nextReviewDate: '2025-01-20T10:00:00.000Z',
      lastReviewedDate: '2025-01-09T10:00:00.000Z',
    };

    const result = service.review(progress, false);

    expect(result.correctCount).toBe(0);
    expect(result.wrongCount).toBe(2);
    expect(result.status).toBe('learning');
    expect(result.masteryLevel).toBe(0);
    expect(result.favorite).toBe(true);
    expect(result.nextReviewDate).toBe('2025-01-11T10:00:00.000Z');
  });

  it('uses escalating intervals and marks mastered on the fifth correct answer', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    const first = service.review(baseProgress, true);
    const second = service.review(first, true);
    const third = service.review(second, true);
    const fourth = service.review(third, true);
    const fifth = service.review(fourth, true);

    expect(first.nextReviewDate).toBe('2025-01-02T10:00:00.000Z');
    expect(second.nextReviewDate).toBe('2025-01-04T10:00:00.000Z');
    expect(third.nextReviewDate).toBe('2025-01-08T10:00:00.000Z');
    expect(fourth.nextReviewDate).toBe('2025-01-15T10:00:00.000Z');
    expect(fifth.nextReviewDate).toBe('2025-01-31T10:00:00.000Z');
    expect(fifth.status).toBe('mastered');
    expect(fifth.masteryLevel).toBe(5);
  });

  it('keeps mastered words capped at mastery level 5 on further correct answers', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-02-01T10:00:00.000Z'));
    const mastered: ReviewProgress = {
      ...baseProgress,
      status: 'mastered',
      correctCount: 5,
      masteryLevel: 5,
    };

    const result = service.review(mastered, true);

    expect(result.correctCount).toBe(6);
    expect(result.masteryLevel).toBe(5);
    expect(result.status).toBe('mastered');
    expect(result.nextReviewDate).toBe('2025-03-03T10:00:00.000Z');
  });

  it('treats new words without a review date as due', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    expect(service.isDue(baseProgress)).toBe(true);
  });

  it('does not treat non-new words without a review date as due', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    expect(
      service.isDue({
        ...baseProgress,
        status: 'learning',
      }),
    ).toBe(false);
  });

  it('treats review dates equal to the comparison date as due', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    expect(
      service.isDue({
        ...baseProgress,
        status: 'learning',
        nextReviewDate: '2025-01-03T12:00:00.000Z',
      }, new Date('2025-01-03T12:00:00.000Z')),
    ).toBe(true);
  });

  it('does not treat future review dates as due', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    expect(
      service.isDue({
        ...baseProgress,
        status: 'learning',
        nextReviewDate: '2025-01-03T12:00:00.000Z',
      }, new Date('2025-01-03T11:59:59.000Z')),
    ).toBe(false);
  });

  it('treats invalid review dates as not due', () => {
    const service = new SpacedRepetitionService(() => new Date('2025-01-01T10:00:00.000Z'));

    expect(
      service.isDue({
        ...baseProgress,
        status: 'learning',
        nextReviewDate: 'not-a-date',
      }),
    ).toBe(false);
  });
  });
