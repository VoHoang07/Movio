import type { Category } from '@/domain/types/Category';
import type { Difficulty } from '@/domain/types/Difficulty';

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string;
  example: string;
  category: Category;
  emoji: string;
  imageUrl?: string;
  gifUrl?: string;
  difficulty: Difficulty;
}
