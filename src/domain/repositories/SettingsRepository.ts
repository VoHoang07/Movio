export interface UserSettings {
  soundEnabled: boolean;
  autoplayPronunciation: boolean;
  dailyGoal: number;
}

export interface SettingsRepository {
  get(): Promise<UserSettings>;
  save(settings: UserSettings): Promise<void>;
}
