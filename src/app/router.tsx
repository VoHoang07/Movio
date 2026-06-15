import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppShell } from '@/app/layouts/AppShell';
import { HomePage } from '@/presentation/pages/HomePage';
import { DashboardPage } from '@/presentation/pages/DashboardPage';
import { VocabularyPage } from '@/presentation/pages/VocabularyPage';
import { LearnPage } from '@/presentation/pages/LearnPage';
import { QuizPage } from '@/presentation/pages/QuizPage';
import { ReviewPage } from '@/presentation/pages/ReviewPage';
import { ProfilePage } from '@/presentation/pages/ProfilePage';
import { SettingsPage } from '@/presentation/pages/SettingsPage';

export const appRoutes = [
  '/',
  '/dashboard',
  '/vocabulary',
  '/learn',
  '/quiz',
  '/review',
  '/profile',
  '/settings',
] as const;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'vocabulary', element: <VocabularyPage /> },
      { path: 'learn', element: <LearnPage /> },
      { path: 'quiz', element: <QuizPage /> },
      { path: 'review', element: <ReviewPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
