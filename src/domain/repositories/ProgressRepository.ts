import type { ReviewProgress } from '@/domain/entities/ReviewProgress';

export interface ProgressRepository {
  getAll(): Promise<ReviewProgress[]>;
  getByWordId(wordId: string): Promise<ReviewProgress | null>;
  save(progress: ReviewProgress): Promise<void>;
  saveMany(progress: ReviewProgress[]): Promise<void>;
  reset(): Promise<void>;
}
