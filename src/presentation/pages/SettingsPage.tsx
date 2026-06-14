import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { LocalProgressRepository } from '@/infrastructure/repositories/LocalProgressRepository';
import { useVocabularyStore } from '@/stores/vocabularyStore';
import { useReviewStore } from '@/stores/reviewStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { Mascot } from '@/components/mascot/Mascot';

const progressRepository = new LocalProgressRepository();

export function SettingsPage() {
  const { soundEnabled, autoplayPronunciation, dailyGoal, load, update } = useSettingsStore();
  const reloadVocabulary = useVocabularyStore((state) => state.load); const reloadReviews = useReviewStore((state) => state.loadDueReviews); const reloadAchievements = useAchievementStore((state) => state.load);
  const [isResetting, setIsResetting] = useState(false);
  useEffect(() => { void load(); }, [load]);
  const handleResetProgress = async () => { setIsResetting(true); try { await progressRepository.reset(); await Promise.all([reloadVocabulary(), reloadReviews(), reloadAchievements()]); } finally { setIsResetting(false); } };
  return <div className="space-y-6 pt-6"><section className="soft-card flex items-center gap-5 p-7"><Mascot type="bear" size="md" /><div><h2 className="text-4xl font-black text-primary-dark">⚙️ Cozy Settings</h2><p className="mt-2 text-lg font-bold text-muted">Customize your study experience.</p></div></section><section className="soft-card space-y-5 p-7"><label className="flex items-center justify-between gap-4 rounded-[22px] bg-background p-4"><span><span className="block text-lg font-black">Sound effects</span><span className="text-sm font-bold text-muted">Enable listening support while learning.</span></span><input type="checkbox" checked={soundEnabled} onChange={(e) => void update({ soundEnabled: e.target.checked })} /></label><label className="flex items-center justify-between gap-4 rounded-[22px] bg-background p-4"><span><span className="block text-lg font-black">Autoplay pronunciation</span><span className="text-sm font-bold text-muted">Automatically read words when cards appear.</span></span><input type="checkbox" checked={autoplayPronunciation} onChange={(e) => void update({ autoplayPronunciation: e.target.checked })} /></label><label className="block rounded-[22px] bg-background p-4"><span className="block text-lg font-black">Daily goal</span><input type="number" min={1} value={dailyGoal} onChange={(e) => void update({ dailyGoal: Number(e.target.value) || 1 })} className="mt-3 rounded-2xl border border-primary/10 bg-white px-4 py-3 outline-none" /></label><button type="button" onClick={() => void handleResetProgress()} disabled={isResetting} className="rounded-2xl bg-error px-6 py-3 font-black text-white transition hover:scale-105 disabled:opacity-60">{isResetting ? 'Resetting...' : 'Reset progress'}</button></section></div>;
}
