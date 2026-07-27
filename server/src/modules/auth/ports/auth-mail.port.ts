export interface AuthMailPort {
  sendPasswordReset(email: string, rawToken: string): Promise<void>;
}

export const AUTH_MAIL_PORT = Symbol('AUTH_MAIL_PORT');
