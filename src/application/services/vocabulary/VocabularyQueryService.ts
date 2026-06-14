import type { ReviewProgress } from '@/domain/entities/ReviewProgress';
import type { VocabularyWord } from '@/domain/entities/VocabularyWord';
import type { Category } from '@/domain/types/Category';

export interface VocabularyListItem extends VocabularyWord {
  favorite: boolean;
  progressStatus: ReviewProgress['status'];
  masteryLevel: number;
}

export interface VocabularyQuery {
  search: string;
  category: Category | 'all';
  favoritesOnly: boolean;
  sortBy: 'alphabetical' | 'difficulty' | 'category';
}

const difficultyRank = {
  hard: 0,
  medium: 1,
  easy: 2,
} as const;

export class VocabularyQueryService {
  query(words: VocabularyWord[], progress: ReviewProgress[], filters: VocabularyQuery): VocabularyListItem[] {
    const progressMap = new Map(progress.map((item) => [item.wordId, item]));
    const searchTerm = filters.search.trim().toLowerCase();

    return words
      .map((word) => {
        const itemProgress = progressMap.get(word.id);
        return {
          ...word,
          favorite: itemProgress?.favorite ?? false,
          progressStatus: itemProgress?.status ?? 'new',
          masteryLevel: itemProgress?.masteryLevel ?? 0,
        } satisfies VocabularyListItem;
      })
      .filter((word) => {
        const matchesSearch =
          searchTerm.length === 0 ||
          word.word.toLowerCase().includes(searchTerm) ||
          word.meaning.toLowerCase().includes(searchTerm);
        const matchesCategory = filters.category === 'all' || word.category === filters.category;
        const matchesFavorite = !filters.favoritesOnly || word.favorite;

        return matchesSearch && matchesCategory && matchesFavorite;
      })
      .sort((left, right) => {
        switch (filters.sortBy) {
          case 'difficulty':
            return difficultyRank[left.difficulty] - difficultyRank[right.difficulty] || left.word.localeCompare(right.word);
          case 'category':
            return left.category.localeCompare(right.category) || left.word.localeCompare(right.word);
          case 'alphabetical':
          default:
            return left.word.localeCompare(right.word);
        }
      });
  }
}
