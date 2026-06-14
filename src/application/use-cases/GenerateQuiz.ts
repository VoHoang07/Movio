import { QuizService, type QuizQuestion } from '@/application/services/quiz/QuizService';
import type { VocabularyRepository } from '@/domain/repositories/VocabularyRepository';

export class GenerateQuiz {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly quizService: QuizService,
  ) {}

  async execute(): Promise<QuizQuestion | null> {
    const words = await this.vocabularyRepository.getAll();
    return this.quizService.generate(words);
  }
}
