import { SpacedRepetitionService } from '@/application/services/review/SpacedRepetitionService';
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

export class SubmitFlashcardReview {
  constructor(
    private readonly progressRepository: ProgressRepository,
    private readonly repetitionService: SpacedRepetitionService,
  ) {}

  async execute(wordId: string, isCorrect: boolean): Promise<ReviewProgress> {
    const current = (await this.progressRepository.getByWordId(wordId)) ?? createDefaultProgress(wordId);
    const updated = this.repetitionService.review(current, isCorrect);
    await this.progressRepository.save(updated);
    return updated;
  }
}
