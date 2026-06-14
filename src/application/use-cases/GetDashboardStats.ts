import type { UserStats } from '@/domain/entities/UserStats';
import type { ProgressRepository } from '@/domain/repositories/ProgressRepository';
import type { VocabularyRepository } from '@/domain/repositories/VocabularyRepository';
import { ProgressService } from '@/application/services/progress/ProgressService';

export class GetDashboardStats {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly progressService: ProgressService,
  ) {}

  async execute(): Promise<UserStats> {
    const [words, progress] = await Promise.all([
      this.vocabularyRepository.getAll(),
      this.progressRepository.getAll(),
    ]);

    return this.progressService.calculate(words.length, progress);
  }
}
