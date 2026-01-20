import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  uid: string;
  _id: string;
  id: string;
  email: string;
  name?: string;
};

type UserState = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: 'teamsync-user',
    },
  ),
);
