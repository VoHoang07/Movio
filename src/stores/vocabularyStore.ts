import { create } from 'zustand';
import { VocabularyQueryService, type VocabularyListItem, type VocabularyQuery } from '@/application/services/vocabulary/VocabularyQueryService';
import { GetVocabularyList } from '@/application/use-cases/GetVocabularyList';
import { ToggleFavoriteWord } from '@/application/use-cases/ToggleFavoriteWord';
import { LocalProgressRepository } from '@/infrastructure/repositories/LocalProgressRepository';
import { LocalVocabularyRepository } from '@/infrastructure/repositories/LocalVocabularyRepository';

const vocabularyRepository = new LocalVocabularyRepository();
const progressRepository = new LocalProgressRepository();
const queryService = new VocabularyQueryService();
const getVocabularyList = new GetVocabularyList(vocabularyRepository, progressRepository, queryService);
const toggleFavoriteWord = new ToggleFavoriteWord(progressRepository);

const defaultQuery: VocabularyQuery = {
  search: '',
  category: 'all',
  favoritesOnly: false,
  sortBy: 'alphabetical',
};

interface VocabularyState {
  items: VocabularyListItem[];
  filters: VocabularyQuery;
  loading: boolean;
  load: () => Promise<void>;
  setFilters: (filters: Partial<VocabularyQuery>) => Promise<void>;
  toggleFavorite: (wordId: string) => Promise<void>;
}

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
  items: [],
  filters: defaultQuery,
  loading: false,
  load: async () => {
    set({ loading: true });
    const items = await getVocabularyList.execute(get().filters);
    set({ items, loading: false });
  },
  setFilters: async (filters) => {
    const nextFilters = { ...get().filters, ...filters };
    set({ filters: nextFilters });
    const items = await getVocabularyList.execute(nextFilters);
    set({ items });
  },
  toggleFavorite: async (wordId) => {
    await toggleFavoriteWord.execute(wordId);
    const items = await getVocabularyList.execute(get().filters);
    set({ items });
  },
}));
