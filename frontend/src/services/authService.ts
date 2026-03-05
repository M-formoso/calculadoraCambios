import api from './api';
import { LoginCredentials, TokenResponse, User } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return {
      id: response.data.id,
      email: response.data.email,
      nombre: response.data.nombre,
      activo: response.data.activo,
      ultimoAcceso: response.data.ultimo_acceso,
      createdAt: response.data.created_at,
    };
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('access_token');
  },
};
