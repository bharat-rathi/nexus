import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { User, AuthResponse } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>; // Mock login for now
  logout: () => void;
}

const API_URL = 'http://localhost:3000/api/v1';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string) => {
        try {
          const response = await axios.post<AuthResponse>(`${API_URL}/auth/dev-login`, { email });
          set({ 
            user: response.data.user, 
            token: response.data.token, 
            isAuthenticated: true 
          });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'nexus-auth',
    }
  )
);
