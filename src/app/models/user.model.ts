export type UserRole = 'agent' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
}
