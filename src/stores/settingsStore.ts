import { create } from 'zustand';
import type { UserSettings } from '@/domain/repositories/SettingsRepository';
import { LocalSettingsRepository } from '@/infrastructure/repositories/LocalSettingsRepository';

const settingsRepository = new LocalSettingsRepository();

interface SettingsState extends UserSettings {
  load: () => Promise<void>;
  update: (settings: Partial<UserSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  soundEnabled: true,
  autoplayPronunciation: true,
  dailyGoal: 10,
  load: async () => {
    const settings = await settingsRepository.get();
    set(settings);
  },
  update: async (settings) => {
    const next = { ...get(), ...settings };
    await settingsRepository.save({
      soundEnabled: next.soundEnabled,
      autoplayPronunciation: next.autoplayPronunciation,
      dailyGoal: next.dailyGoal,
    });
    set(settings);
  },
}));
