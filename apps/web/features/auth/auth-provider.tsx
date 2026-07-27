'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SafeAuthUser } from '@project-genesis/types';
import { createApiClient } from '@/lib/api-client';
import { AuthContext, type AuthStatus } from './auth-context';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const apiClient = useMemo(() => createApiClient(), []);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<SafeAuthUser | null>(null);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await apiClient.auth.refresh();
      apiClient.setAccessToken(tokens.accessToken);
      const profile = await apiClient.auth.me();
      setUser(profile);
      setStatus('authenticated');
      return true;
    } catch {
      apiClient.setAccessToken(null);
      setUser(null);
      setStatus('unauthenticated');
      return false;
    }
  }, [apiClient]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiClient.auth.login({ email, password });
      apiClient.setAccessToken(result.accessToken);
      setUser(result.user);
      setStatus('authenticated');
    },
    [apiClient],
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const result = await apiClient.auth.register({ name, email, password });
      apiClient.setAccessToken(result.accessToken);
      setUser(result.user);
      setStatus('authenticated');
    },
    [apiClient],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.auth.logout();
    } finally {
      apiClient.setAccessToken(null);
      setUser(null);
      setStatus('unauthenticated');
      router.push('/login');
    }
  }, [apiClient, router]);

  const value = useMemo(
    () => ({
      status,
      user,
      login,
      register,
      logout,
      refreshSession,
    }),
    [status, user, login, register, logout, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
