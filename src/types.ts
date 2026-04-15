export type Category = 'Internet' | 'Combo' | 'Móvil';

export interface Promotion {
  id: string;
  titulo: string;
  megas: string | number;
  precio: number;
  imagen_url: string;
  destacado: boolean;
  categoria: Category;
  features?: string[];
}

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}
