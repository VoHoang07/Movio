import { NavLink, Outlet } from 'react-router-dom';
import { FloatingLeaves } from '@/components/mascot/FloatingLeaves';
import { Mascot } from '@/components/mascot/Mascot';

const navigationItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏡' },
  { to: '/vocabulary', label: 'Vocabulary', icon: '📚' },
  { to: '/learn', label: 'Learn', icon: '✨' },
  { to: '/quiz', label: 'Quiz', icon: '🎯' },
  { to: '/review', label: 'Review', icon: '🌱' },
  { to: '/dashboard', label: 'Achievements', icon: '🏆' },
  { to: '/profile', label: 'Profile', icon: '🐾' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export function Sidebar() {
  return (
    <aside className="sidebar-panel fixed bottom-3 left-3 right-3 z-40 rounded-[28px] p-2 shadow-soft lg:sticky lg:left-auto lg:right-auto lg:top-5 lg:h-[calc(100vh-40px)] lg:w-[260px] lg:shrink-0 lg:p-4">
      <div className="hidden lg:block">
        <h1 className="text-[34px] font-black leading-none text-[#7a3f12]">Movio</h1>
        <p className="mt-3 text-[15px] font-semibold text-muted">Learn actions naturally</p>
      </div>
      <nav className="grid grid-cols-4 gap-1 lg:mt-9 lg:grid-cols-1 lg:gap-2">
        {navigationItems.map((item) => (
          <NavLink
            key={`${item.to}-${item.label}`}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center justify-center gap-2 rounded-2xl px-2 py-3 text-xs font-extrabold transition hover:-translate-y-0.5 lg:justify-start lg:px-4 lg:text-[15px] ${
                isActive && item.label !== 'Achievements'
                  ? 'bg-[#EDF9D9] text-[#1F8D3F] shadow-[inset_0_0_0_1px_rgba(111,143,78,.12)]'
                  : 'text-text hover:bg-white/70'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span className="hidden sm:inline lg:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 hidden rounded-[28px] bg-accent-purple/70 p-4 lg:block">
        <Mascot type="dog" size="sm" />
        <p className="mt-2 font-extrabold text-[#3a2f45]">Keep going! 💪</p>
        <p className="mt-1 text-sm text-muted">You’re doing great! Let’s learn one more action.</p>
        <button className="mt-4 rounded-2xl bg-primary px-4 py-2 text-sm font-bold text-white">Let’s go</button>
      </div>
      <div className="mt-auto hidden justify-center pt-7 lg:flex">
        <div className="rounded-full bg-[#f0ede5] p-1 text-xl"><span className="rounded-full bg-white px-4 py-2">☀️</span><span className="px-4 py-2">🌙</span></div>
      </div>
    </aside>
  );
}

export function AppShell() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="landscape-bg" />
      <FloatingLeaves />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1536px] gap-6 px-4 py-5 pb-28 lg:px-5 lg:pb-5">
        <Sidebar />
        <main className="min-w-0 flex-1 lg:pl-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
