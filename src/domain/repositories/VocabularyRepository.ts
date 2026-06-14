import type { VocabularyWord } from '@/domain/entities/VocabularyWord';

export interface VocabularyRepository {
  getAll(): Promise<VocabularyWord[]>;
  getById(id: string): Promise<VocabularyWord | null>;
}
