import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KeycloakUser, KeycloakRole } from './keycloak.types';

const INITIAL_USERS: KeycloakUser[] = [
  {
    id: 'kc-usr-01',
    username: 'admin@portalluxoestilo.com.br',
    email: 'admin@portalluxoestilo.com.br',
    firstName: 'Cláudio',
    lastName: 'Ikeda',
    role: 'ADMIN',
    enabled: true,
    createdAt: '2026-10-10T10:00:00Z',
    lastLoginAt: 'Hoje, 20:30',
    temporaryPassword: false,
  },
  {
    id: 'kc-usr-02',
    username: 'marina.ferraz@portalluxoestilo.com.br',
    email: 'marina.ferraz@portalluxoestilo.com.br',
    firstName: 'Marina',
    lastName: 'Ferraz',
    role: 'GESTOR',
    enabled: true,
    createdAt: '2026-10-11T14:20:00Z',
    lastLoginAt: 'Ontem, 18:45',
    temporaryPassword: false,
  },
  {
    id: 'kc-usr-03',
    username: 'lucas.mendes@portalluxoestilo.com.br',
    email: 'lucas.mendes@portalluxoestilo.com.br',
    firstName: 'Lucas',
    lastName: 'Mendes',
    role: 'VENDEDOR',
    enabled: true,
    createdAt: '2026-10-12T09:15:00Z',
    lastLoginAt: 'Hoje, 14:10',
    temporaryPassword: true,
  },
];

interface KeycloakState {
  currentUser: KeycloakUser;
  users: KeycloakUser[];

  // Actions
  loginAsUser: (userId: string) => void;
  createUser: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: KeycloakRole;
    temporaryPassword?: boolean;
    initialPassword?: string;
  }) => KeycloakUser;
  updateUserRole: (userId: string, newRole: KeycloakRole) => void;
  resetUserPassword: (userId: string, newPassword: string, temporary?: boolean) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => void;

  // RBAC Checks
  isAdmin: () => boolean;
  isGestor: () => boolean;
  isVendedor: () => boolean;
}

export const useKeycloakStore = create<KeycloakState>()(
  persist(
    (set, get) => ({
      currentUser: INITIAL_USERS[0],
      users: INITIAL_USERS,

      loginAsUser: (userId) => {
        const found = get().users.find((u) => u.id === userId);
        if (found) {
          set({ currentUser: found });
        }
      },

      createUser: (userData) => {
        const newUser: KeycloakUser = {
          id: `kc-usr-${Date.now()}`,
          username: userData.email,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          enabled: true,
          createdAt: new Date().toISOString(),
          lastLoginAt: 'Pendente 1º Acesso',
          temporaryPassword: userData.temporaryPassword ?? true,
        };
        set((state) => ({ users: [newUser, ...state.users] }));
        return newUser;
      },

      updateUserRole: (userId, newRole) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
          currentUser:
            state.currentUser.id === userId ? { ...state.currentUser, role: newRole } : state.currentUser,
        }));
      },

      resetUserPassword: (userId, _newPassword, temporary = true) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, temporaryPassword: temporary } : u
          ),
        }));
      },

      toggleUserStatus: (userId) => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, enabled: !u.enabled } : u
          ),
        }));
      },

      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
        }));
      },

      isAdmin: () => get().currentUser.role === 'ADMIN',
      isGestor: () => get().currentUser.role === 'GESTOR' || get().currentUser.role === 'ADMIN',
      isVendedor: () => true, // Todos podem atuar como vendedor
    }),
    {
      name: 'portal_keycloak_session_v1',
    }
  )
);
