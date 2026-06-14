import { useEffect, useState } from 'react';
import { GetDashboardStats } from '@/application/use-cases/GetDashboardStats';
import { ProgressService } from '@/application/services/progress/ProgressService';
import { LocalProgressRepository } from '@/infrastructure/repositories/LocalProgressRepository';
import { LocalVocabularyRepository } from '@/infrastructure/repositories/LocalVocabularyRepository';
import type { UserStats } from '@/domain/entities/UserStats';
import { useAuthStore } from '@/stores/authStore';
import { Mascot } from '@/components/mascot/Mascot';
import { StatCard } from '@/components/ui/StatCard';

const dashboardStatsUseCase = new GetDashboardStats(new LocalVocabularyRepository(), new LocalProgressRepository(), new ProgressService());

export function ProfilePage() {
  const { userName } = useAuthStore();
  const [stats, setStats] = useState<UserStats | null>(null);
  useEffect(() => { void dashboardStatsUseCase.execute().then(setStats); }, []);
  return <div className="space-y-6 pt-6"><section className="soft-card flex flex-col items-center gap-5 p-8 text-center md:flex-row md:text-left"><Mascot type="dog" size="lg" /><div><p className="text-sm font-black uppercase tracking-[0.24em] text-muted">Profile</p><h2 className="mt-2 text-4xl font-black text-primary-dark">Hi, {userName}</h2><p className="mt-2 text-lg font-bold text-muted">Your learning summary and motivation live here.</p></div></section><section className="grid gap-4 md:grid-cols-3"><StatCard label="XP" value={stats?.xp ?? 0} icon="⚡" color="#F39A08" progress={70} /><StatCard label="Level" value={stats?.level ?? 1} icon="🌟" color="#7A4ED0" progress={45} /><StatCard label="Mastered" value={stats?.masteredWords ?? 0} icon="🏆" color="#4CAF50" progress={60} /></section></div>;
}
