import type { VocabularyWord } from '@/domain/entities/VocabularyWord';

export interface QuizQuestion {
  prompt: VocabularyWord;
  options: VocabularyWord[];
  correctAnswerId: string;
}

export class QuizService {
  constructor(private readonly random: () => number = () => Math.random()) {}

  generate(words: VocabularyWord[]): QuizQuestion | null {
    if (words.length < 4) {
      return null;
    }

    const shuffledWords = this.shuffle(words);
    const [prompt, ...rest] = shuffledWords;
    const distractors = rest.slice(0, 3);
    const options = this.shuffle([...distractors, prompt]);

    return {
      prompt,
      options,
      correctAnswerId: prompt.id,
    };
  }

  isCorrect(question: QuizQuestion, answerId: string): boolean {
    return question.correctAnswerId === answerId;
  }

  private shuffle<T>(items: T[]): T[] {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(this.random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }

    return result;
  }
}
