export interface LoginCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  activo: boolean;
  ultimoAcceso: string | null;
  createdAt: string;
}
