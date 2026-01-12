import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@/type';
import { create } from 'zustand'

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  setAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true,
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  fetchAuthenticatedUser: async () => {
    try {
      set({ isLoading: true });
      const user = await getCurrentUser();
      if (user) set({ user: user as unknown as User, isAuthenticated: true });
      else set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.log('Error fetching authenticated user:', error);
      set({ isAuthenticated: false, user: null })
    } finally {
      set({ isLoading: false });
    }
  },
}))

export default useAuthStore;
