import { z } from 'zod';
import type { ReviewProgress } from '@/domain/entities/ReviewProgress';
import type { ProgressRepository } from '@/domain/repositories/ProgressRepository';
import { browserStorage } from '@/infrastructure/storage/browserStorage';

const STORAGE_KEY = 'movio.progress';

const reviewProgressSchema = z.object({
  wordId: z.string().min(1),
  status: z.enum(['new', 'learning', 'reviewing', 'mastered']),
  correctCount: z.number().int().min(0),
  wrongCount: z.number().int().min(0),
  nextReviewDate: z.string().datetime().nullable(),
  lastReviewedDate: z.string().datetime().nullable(),
  favorite: z.boolean(),
  masteryLevel: z.number().int().min(0).max(5),
});

const reviewProgressListSchema = z.array(reviewProgressSchema);

export class LocalProgressRepository implements ProgressRepository {
  async getAll(): Promise<ReviewProgress[]> {
    const rawProgressList = browserStorage.getItem<unknown>(STORAGE_KEY, []);
    const parsed = reviewProgressListSchema.safeParse(rawProgressList);

    if (parsed.success) {
      return parsed.data;
    }

    browserStorage.removeItem(STORAGE_KEY);
    return [];
  }

  async getByWordId(wordId: string): Promise<ReviewProgress | null> {
    const progressList = await this.getAll();
    return progressList.find((item) => item.wordId === wordId) ?? null;
  }

  async save(progress: ReviewProgress): Promise<void> {
    const progressList = await this.getAll();
    const next = [...progressList.filter((item) => item.wordId !== progress.wordId), progress];
    browserStorage.setItem(STORAGE_KEY, next);
  }

  async saveMany(progressList: ReviewProgress[]): Promise<void> {
    browserStorage.setItem(STORAGE_KEY, progressList);
  }

  async reset(): Promise<void> {
    browserStorage.removeItem(STORAGE_KEY);
  }
}
