import type { ReviewProgress } from '@/domain/entities/ReviewProgress';
import type { ProgressRepository } from '@/domain/repositories/ProgressRepository';

const createDefaultProgress = (wordId: string): ReviewProgress => ({
  wordId,
  status: 'new',
  correctCount: 0,
  wrongCount: 0,
  nextReviewDate: null,
  lastReviewedDate: null,
  favorite: false,
  masteryLevel: 0,
});

export class ToggleFavoriteWord {
  constructor(private readonly progressRepository: ProgressRepository) {}

  async execute(wordId: string): Promise<ReviewProgress> {
    const current = (await this.progressRepository.getByWordId(wordId)) ?? createDefaultProgress(wordId);
    const updated = {
      ...current,
      favorite: !current.favorite,
    };
    await this.progressRepository.save(updated);
    return updated;
  }
}
