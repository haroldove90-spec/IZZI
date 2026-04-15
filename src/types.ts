export interface Promotion {
  id: string;
  title: string;
  megas: number;
  channels: number;
  price: number;
  isPopular?: boolean;
  features: string[];
}

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
