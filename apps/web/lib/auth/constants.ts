export const REFRESH_COOKIE_NAME = 'refresh_token';

export const AUTH_ROUTES = {
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
} as const;

export const PROTECTED_ROUTES = {
  account: '/account',
} as const;
