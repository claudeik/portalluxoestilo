export type KeycloakRole = 'ADMIN' | 'GESTOR' | 'VENDEDOR';

export interface KeycloakUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: KeycloakRole;
  enabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
  temporaryPassword?: boolean;
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}
