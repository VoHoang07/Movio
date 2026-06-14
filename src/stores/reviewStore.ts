import { create } from 'zustand';
import { GetDueReviews } from '@/application/use-cases/GetDueReviews';
import { GenerateQuiz } from '@/application/use-cases/GenerateQuiz';
import { SubmitFlashcardReview } from '@/application/use-cases/SubmitFlashcardReview';
import { SubmitQuizAnswer } from '@/application/use-cases/SubmitQuizAnswer';
import { QuizService, type QuizQuestion } from '@/application/services/quiz/QuizService';
import { SpacedRepetitionService } from '@/application/services/review/SpacedRepetitionService';
import { LocalProgressRepository } from '@/infrastructure/repositories/LocalProgressRepository';
import { LocalVocabularyRepository } from '@/infrastructure/repositories/LocalVocabularyRepository';

const vocabularyRepository = new LocalVocabularyRepository();
const progressRepository = new LocalProgressRepository();
const repetitionService = new SpacedRepetitionService();
const quizService = new QuizService();
const submitFlashcardReview = new SubmitFlashcardReview(progressRepository, repetitionService);
const generateQuiz = new GenerateQuiz(vocabularyRepository, quizService);
const submitQuizAnswer = new SubmitQuizAnswer(quizService, submitFlashcardReview);
const getDueReviews = new GetDueReviews(vocabularyRepository, progressRepository, repetitionService);

interface ReviewItem {
  wordId: string;
  word: string;
  meaning: string;
  emoji: string;
}

interface ReviewState {
  dueItems: ReviewItem[];
  quizQuestion: QuizQuestion | null;
  loading: boolean;
  loadDueReviews: () => Promise<void>;
  submitReview: (wordId: string, isCorrect: boolean) => Promise<void>;
  loadQuizQuestion: () => Promise<void>;
  answerQuiz: (answerId: string) => Promise<boolean>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  dueItems: [],
  quizQuestion: null,
  loading: false,
  loadDueReviews: async () => {
    set({ loading: true });
    const dueItems = await getDueReviews.execute();
    set({ dueItems, loading: false });
  },
  submitReview: async (wordId, isCorrect) => {
    await submitFlashcardReview.execute(wordId, isCorrect);
    const dueItems = await getDueReviews.execute();
    set({ dueItems });
  },
  loadQuizQuestion: async () => {
    const quizQuestion = await generateQuiz.execute();
    set({ quizQuestion });
  },
  answerQuiz: async (answerId) => {
    const question = get().quizQuestion;
    if (!question) {
      return false;
    }
    const result = await submitQuizAnswer.execute(question, answerId);
    const quizQuestion = await generateQuiz.execute();
    set({ quizQuestion });
    return result.correct;
  },
}));
