import { describe, expect, it } from 'vitest';
import { VocabularyQueryService } from '@/application/services/vocabulary/VocabularyQueryService';
import type { VocabularyWord } from '@/domain/entities/VocabularyWord';
import type { ReviewProgress } from '@/domain/entities/ReviewProgress';

const words: VocabularyWord[] = [
  {
    id: 'walk',
    word: 'walk',
    meaning: 'đi bộ',
    pronunciation: '/wɔːk/',
    example: 'I walk to school.',
    category: 'movement',
    emoji: '🚶',
    difficulty: 'easy',
  },
  {
    id: 'grab',
    word: 'grab',
    meaning: 'nắm lấy',
    pronunciation: '/ɡræb/',
    example: 'Grab the bag.',
    category: 'hand-actions',
    emoji: '✋',
    difficulty: 'medium',
  },
  {
    id: 'blink',
    word: 'blink',
    meaning: 'chớp mắt',
    pronunciation: '/blɪŋk/',
    example: 'Blink slowly.',
    category: 'head-actions',
    emoji: '😉',
    difficulty: 'easy',
  },
  {
    id: 'attack',
    word: 'attack',
    meaning: 'tấn công',
    pronunciation: '/əˈtæk/',
    example: 'Attack quickly.',
    category: 'game-actions',
    emoji: '⚔️',
    difficulty: 'hard',
  },
];

const progress: ReviewProgress[] = [
  {
    wordId: 'walk',
    status: 'learning',
    correctCount: 1,
    wrongCount: 0,
    lastReviewedDate: null,
    nextReviewDate: null,
    favorite: true,
    masteryLevel: 1,
  },
];

describe('VocabularyQueryService', () => {
  it('filters by search, category, and favorite, then sorts alphabetically', () => {
    const service = new VocabularyQueryService();

    const result = service.query(words, progress, {
      search: 'w',
      category: 'movement',
      favoritesOnly: true,
      sortBy: 'alphabetical',
    });

    expect(result).toHaveLength(1);
    expect(result[0].word).toBe('walk');
    expect(result[0].favorite).toBe(true);
  });

  it('matches search terms case-insensitively and trims surrounding whitespace', () => {
    const service = new VocabularyQueryService();

    const result = service.query(words, progress, {
      search: '  CHỚP  ',
      category: 'all',
      favoritesOnly: false,
      sortBy: 'alphabetical',
    });

    expect(result.map((item) => item.word)).toEqual(['blink']);
  });

  it('returns default progress metadata for words without saved progress', () => {
    const service = new VocabularyQueryService();

    const result = service.query(words, progress, {
      search: 'grab',
      category: 'all',
      favoritesOnly: false,
      sortBy: 'alphabetical',
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      word: 'grab',
      favorite: false,
      progressStatus: 'new',
      masteryLevel: 0,
    });
  });

  it('returns an empty list when favorites only is enabled and no matches are favorited', () => {
    const service = new VocabularyQueryService();

    const result = service.query(words, progress, {
      search: 'grab',
      category: 'all',
      favoritesOnly: true,
      sortBy: 'alphabetical',
    });

    expect(result).toEqual([]);
  });

  it('sorts difficult words with hard before medium before easy, then alphabetically within the same difficulty', () => {
    const service = new VocabularyQueryService();

    const result = service.query(words, progress, {
      search: '',
      category: 'all',
      favoritesOnly: false,
      sortBy: 'difficulty',
    });

    expect(result.map((item) => item.word)).toEqual(['attack', 'grab', 'blink', 'walk']);
  });

  it('sorts by category and then alphabetically within the same category', () => {
    const service = new VocabularyQueryService();

    const result = service.query(
      [
        ...words,
        {
          id: 'catch',
          word: 'catch',
          meaning: 'bắt lấy',
          pronunciation: '/kætʃ/',
          example: 'Catch the ball.',
          category: 'hand-actions',
          emoji: '🥎',
          difficulty: 'easy',
        },
      ],
      progress,
      {
        search: '',
        category: 'all',
        favoritesOnly: false,
        sortBy: 'category',
      },
    );

    expect(result.map((item) => `${item.category}:${item.word}`)).toEqual([
      'game-actions:attack',
      'hand-actions:catch',
      'hand-actions:grab',
      'head-actions:blink',
      'movement:walk',
    ]);
  });

  it('returns an empty list when the word list is empty', () => {
    const service = new VocabularyQueryService();

    const result = service.query([], progress, {
      search: '',
      category: 'all',
      favoritesOnly: false,
      sortBy: 'alphabetical',
    });

    expect(result).toEqual([]);
  });

  it('ignores progress records that do not belong to any returned word', () => {
    const service = new VocabularyQueryService();

    const result = service.query([words[0]], [
      ...progress,
      {
        wordId: 'missing-word',
        status: 'mastered',
        correctCount: 5,
        wrongCount: 0,
        lastReviewedDate: '2025-01-01T00:00:00.000Z',
        nextReviewDate: '2025-01-31T00:00:00.000Z',
        favorite: true,
        masteryLevel: 5,
      },
    ], {
      search: '',
      category: 'all',
      favoritesOnly: false,
      sortBy: 'alphabetical',
    });

    expect(result).toHaveLength(1);
    expect(result[0].word).toBe('walk');
  });
  });
