import { SpacedRepetitionService } from '@/application/services/review/SpacedRepetitionService';
import type { ReviewProgress } from '@/domain/entities/ReviewProgress';
import type { ProgressRepository } from '@/domain/repositories/ProgressRepository';
import type { VocabularyRepository } from '@/domain/repositories/VocabularyRepository';

export class GetDueReviews {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly repetitionService: SpacedRepetitionService,
  ) {}

  async execute(): Promise<Array<{ wordId: string; word: string; meaning: string; emoji: string; progress: ReviewProgress }>> {
    const [words, progressList] = await Promise.all([
      this.vocabularyRepository.getAll(),
      this.progressRepository.getAll(),
    ]);

    const wordsMap = new Map(words.map((word) => [word.id, word]));

    return progressList
      .filter((progress) => this.repetitionService.isDue(progress))
      .map((progress) => {
        const word = wordsMap.get(progress.wordId);
        if (!word) {
          return null;
        }

        return {
          wordId: word.id,
          word: word.word,
          meaning: word.meaning,
          emoji: word.emoji,
          progress,
        };
      })
      .filter((item): item is { wordId: string; word: string; meaning: string; emoji: string; progress: ReviewProgress } => item !== null);
  }
}
