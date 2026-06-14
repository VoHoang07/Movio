import { create } from 'zustand';

interface AuthState {
  userName: string;
  setUserName: (userName: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userName: 'Learner',
  setUserName: (userName) => set({ userName }),
}));
