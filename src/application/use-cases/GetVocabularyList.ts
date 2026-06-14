import { VocabularyQueryService, type VocabularyListItem, type VocabularyQuery } from '@/application/services/vocabulary/VocabularyQueryService';
import type { ProgressRepository } from '@/domain/repositories/ProgressRepository';
import type { VocabularyRepository } from '@/domain/repositories/VocabularyRepository';

export class GetVocabularyList {
  constructor(
    private readonly vocabularyRepository: VocabularyRepository,
    private readonly progressRepository: ProgressRepository,
    private readonly queryService: VocabularyQueryService,
  ) {}

  async execute(query: VocabularyQuery): Promise<VocabularyListItem[]> {
    const [words, progress] = await Promise.all([
      this.vocabularyRepository.getAll(),
      this.progressRepository.getAll(),
    ]);

    return this.queryService.query(words, progress, query);
  }
}
