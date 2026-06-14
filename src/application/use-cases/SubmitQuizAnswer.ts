import { QuizService, type QuizQuestion } from '@/application/services/quiz/QuizService';
import { SubmitFlashcardReview } from '@/application/use-cases/SubmitFlashcardReview';

export class SubmitQuizAnswer {
  constructor(
    private readonly quizService: QuizService,
    private readonly submitFlashcardReview: SubmitFlashcardReview,
  ) {}

  async execute(question: QuizQuestion, answerId: string): Promise<{ correct: boolean }> {
    const correct = this.quizService.isCorrect(question, answerId);
    await this.submitFlashcardReview.execute(question.prompt.id, correct);
    return { correct };
  }
}
