import type { SettingsRepository, UserSettings } from '@/domain/repositories/SettingsRepository';
import { browserStorage } from '@/infrastructure/storage/browserStorage';

const STORAGE_KEY = 'movio.settings';

const defaultSettings: UserSettings = {
  soundEnabled: true,
  autoplayPronunciation: true,
  dailyGoal: 10,
};

export class LocalSettingsRepository implements SettingsRepository {
  async get(): Promise<UserSettings> {
    return browserStorage.getItem<UserSettings>(STORAGE_KEY, defaultSettings);
  }

  async save(settings: UserSettings): Promise<void> {
    browserStorage.setItem(STORAGE_KEY, settings);
  }
}
