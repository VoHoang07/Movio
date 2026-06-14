import type { VocabularyWord } from '@/domain/entities/VocabularyWord';
import type { VocabularyRepository } from '@/domain/repositories/VocabularyRepository';
import { vocabularySeed } from '@/infrastructure/data/vocabulary.seed';

export class LocalVocabularyRepository implements VocabularyRepository {
  async getAll(): Promise<VocabularyWord[]> {
    return vocabularySeed;
  }

  async getById(id: string): Promise<VocabularyWord | null> {
    return vocabularySeed.find((word) => word.id === id) ?? null;
  }
}
