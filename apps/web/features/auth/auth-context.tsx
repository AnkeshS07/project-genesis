'use client';

import { createContext } from 'react';
import type { SafeAuthUser } from '@project-genesis/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  readonly status: AuthStatus;
  readonly user: SafeAuthUser | null;
  readonly login: (email: string, password: string) => Promise<void>;
  readonly register: (name: string, email: string, password: string) => Promise<void>;
  readonly logout: () => Promise<void>;
  readonly refreshSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
