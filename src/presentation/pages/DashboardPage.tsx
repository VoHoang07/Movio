import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { GetDashboardStats } from '@/application/use-cases/GetDashboardStats';
import { ProgressService } from '@/application/services/progress/ProgressService';
import { LocalProgressRepository } from '@/infrastructure/repositories/LocalProgressRepository';
import { LocalVocabularyRepository } from '@/infrastructure/repositories/LocalVocabularyRepository';
import type { UserStats } from '@/domain/entities/UserStats';
import { useAchievementStore } from '@/stores/achievementStore';
import { StatCard } from '@/components/ui/StatCard';
import { CategoryCard } from '@/components/ui/CategoryCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Mascot } from '@/components/mascot/Mascot';

const dashboardStatsUseCase = new GetDashboardStats(new LocalVocabularyRepository(), new LocalProgressRepository(), new ProgressService());
const emptyStats: UserStats = { totalWords: 0, studiedWords: 0, learningWords: 0, masteredWords: 0, dueToday: 0, streak: 0, xp: 0, level: 1 };

const categories = [
  ['Movement', 15, '🏃', '#F8FFEF', '#2D7D32', 72], ['Posture', 11, '🧘', '#F2F8FF', '#2C5A8D', 54],
  ['Hand Actions', 22, '👋', '#FFFAF0', '#9B5B14', 68], ['Head Actions', 14, '🙂', '#FBF4FF', '#5B3C89', 48],
  ['Rotation', 6, '🔄', '#FFF6FB', '#5A2D3A', 36], ['Game Actions', 16, '🎮', '#F2F8FF', '#1F2A3D', 61],
] as const;

export function DashboardPage() {
  const [stats, setStats] = useState<UserStats>(emptyStats);
  const { load } = useAchievementStore();
  useEffect(() => { void dashboardStatsUseCase.execute().then(setStats); void load(); }, [load]);
  const goal = Math.min(100, Math.round((stats.studiedWords / 10) * 100));
  const statCards = useMemo(() => [
    { label: 'Total Words', value: stats.totalWords, icon: '📚', color: '#2E8B3D', progress: 86 },
    { label: 'Studied', value: stats.studiedWords, icon: '✏️', color: '#2A66C9', progress: 55 },
    { label: 'Learning', value: stats.learningWords, icon: '🌱', color: '#F39A08', progress: 42 },
    { label: 'Mastered', value: stats.masteredWords, icon: '🏆', color: '#7A4ED0', progress: 68 },
    { label: 'Due Today', value: stats.dueToday, icon: '⏰', color: '#EF6B73', progress: 30 },
  ], [stats]);
  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 pt-6 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-xl font-bold">👋 Hi there, Learner!</p><h2 className="mt-2 text-4xl font-black tracking-tight text-text">Let’s learn something new today 🚀</h2><p className="mt-2 text-lg font-medium text-muted">Build your English vocabulary through actions.</p></div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="soft-card flex items-center gap-4 bg-[#FFF7E7] px-5 py-4"><div><p className="text-lg font-black text-[#6A4A1F]">🔥 {Math.max(stats.streak, 7)} Day Streak</p><p className="text-sm text-muted">Keep your fire alive!</p></div><Mascot type="squirrel" size="sm" /></motion.div>
      </header>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{statCards.map((c, i) => <StatCard key={c.label} {...c} delay={i * .04} />)}</section>
      <section className="grid gap-6 xl:grid-cols-[1fr_1.28fr]">
        <article className="soft-card p-7"><h3 className="text-xl font-black">📖 Continue Learning</h3><div className="mt-5 flex items-center gap-5"><Mascot type="dog" size="lg" /><div className="flex-1"><h4 className="text-4xl font-black">run <span className="text-xl text-muted">/rʌn/</span></h4><p className="mt-1 text-lg font-bold text-muted">chạy</p><div className="mt-5"><ProgressBar value={75} color="#47B453" /></div><Link to="/learn" className="mt-5 inline-flex rounded-2xl bg-success px-7 py-3 font-black text-white transition hover:scale-105 active:scale-95">Continue</Link></div></div></article>
        <article className="soft-card p-7"><div className="flex gap-5"><div className="flex-1"><h3 className="text-2xl font-black">Daily Goal</h3><p className="mt-2 text-muted">Learn 10 new words</p><p className="mt-6 text-3xl font-black">{Math.min(stats.studiedWords, 10)} / 10</p><div className="mt-3"><ProgressBar value={goal} color="#F4C95D" /></div><Link to="/learn" className="mt-6 inline-flex rounded-2xl bg-primary px-7 py-3 font-black text-white transition hover:scale-105 active:scale-95">Start Learning</Link></div><Mascot type="bear" size="lg" /></div></article>
      </section>
      <section><h3 className="text-xl font-black">🍃 Explore Categories</h3><div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">{categories.map(([title, words, icon, bg, color, progress]) => <CategoryCard key={title} title={title} words={words} icon={icon} bg={bg} color={color} progress={progress} />)}</div></section>
      <p className="pb-3 text-center font-bold text-muted">❝ Small steps every day lead to big results. ❤️</p>
    </div>
  );
}
