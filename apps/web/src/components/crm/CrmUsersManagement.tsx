import React, { useState } from 'react';
import {
  ShieldCheck,
  UserPlus,
  KeyRound,
  Lock,
  User,
  CheckCircle2,
  AlertTriangle,
  Search,
  Copy,
  Check,
  X,
  UserX,
  RefreshCw,
} from 'lucide-react';
import { useKeycloakStore } from '../../lib/keycloak/keycloak.store';
import { KeycloakRole, KeycloakUser } from '../../lib/keycloak/keycloak.types';

export function CrmUsersManagement() {
  const {
    currentUser,
    users,
    loginAsUser,
    createUser,
    updateUserRole,
    resetUserPassword,
    toggleUserStatus,
    deleteUser,
    isAdmin,
  } = useKeycloakStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | KeycloakRole>('ALL');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState<KeycloakUser | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: KeycloakRole) => {
    switch (role) {
      case 'ADMIN':
        return { label: 'Administrador Geral', bg: '#fef3c7', color: '#b45309', border: '#fcd34d' };
      case 'GESTOR':
        return { label: 'Gestor de Vendas', bg: '#f3e8ff', color: '#7e22ce', border: '#d8b4fe' };
      case 'VENDEDOR':
      default:
        return { label: 'Concierge / Vendedor', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner: Active User & RBAC Switcher */}
      <div
        className="crm-card"
        style={{
          padding: '20px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          borderLeft: '4px solid #C9A961',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#0A0908',
              border: '1px solid #C9A961',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A961',
            }}
          >
            <ShieldCheck size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: getRoleBadge(currentUser.role).bg,
                  color: getRoleBadge(currentUser.role).color,
                  border: `1px solid ${getRoleBadge(currentUser.role).border}`,
                }}
              >
                {getRoleBadge(currentUser.role).label}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--crm-text-secondary)', margin: 0 }}>
              Sessão Keycloak OIDC ativa · {currentUser.email}
            </p>
          </div>
        </div>

        {/* Quick Simulator Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--crm-text-secondary)', fontWeight: 500 }}>
            Simular Sessão:
          </span>
          <select
            value={currentUser.id}
            onChange={(e) => loginAsUser(e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid var(--crm-border-color)',
              backgroundColor: 'var(--crm-bg-color)',
              color: 'var(--crm-text-primary)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.firstName} ({u.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Title & Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            Administração de Usuários & Senhas
          </h1>
          <p style={{ color: 'var(--crm-text-secondary)', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Controle de acessos baseado em papéis (Keycloak RBAC) e onboarding de equipe
          </p>
        </div>

        {isAdmin() && (
          <button
            className="crm-btn-primary"
            onClick={() => setShowOnboardingModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <UserPlus size={16} />
            <span>Onboarding Novo Usuário</span>
          </button>
        )}
      </div>

      {/* Filter & Search Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className={`crm-toggle-btn ${roleFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setRoleFilter('ALL')}
            style={{ padding: '6px 12px', borderRadius: '6px' }}
          >
            Todos ({users.length})
          </button>
          <button
            className={`crm-toggle-btn ${roleFilter === 'ADMIN' ? 'active' : ''}`}
            onClick={() => setRoleFilter('ADMIN')}
            style={{ padding: '6px 12px', borderRadius: '6px' }}
          >
            Admins
          </button>
          <button
            className={`crm-toggle-btn ${roleFilter === 'GESTOR' ? 'active' : ''}`}
            onClick={() => setRoleFilter('GESTOR')}
            style={{ padding: '6px 12px', borderRadius: '6px' }}
          >
            Gestores
          </button>
          <button
            className={`crm-toggle-btn ${roleFilter === 'VENDEDOR' ? 'active' : ''}`}
            onClick={() => setRoleFilter('VENDEDOR')}
            style={{ padding: '6px 12px', borderRadius: '6px' }}
          >
            Vendedores
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nome ou email..."
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: '1px solid var(--crm-border-color)',
              fontSize: '0.85rem',
              backgroundColor: 'var(--crm-card-bg)',
              color: 'var(--crm-text-primary)',
              minWidth: '220px',
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="crm-list-view" style={{ overflowX: 'auto' }}>
        <div
          className="crm-list-header"
          style={{
            display: 'grid',
            gridTemplateColumns: '2.5fr 1.8fr 1.2fr 1.5fr 1.8fr',
            minWidth: '850px',
          }}
        >
          <div>Colaborador</div>
          <div>Permissão / Role</div>
          <div>Status</div>
          <div>Último Acesso</div>
          <div style={{ textAlign: 'right' }}>Ações de Administrador</div>
        </div>

        <div>
          {filteredUsers.map((user) => {
            const badge = getRoleBadge(user.role);

            return (
              <div
                key={user.id}
                className="crm-list-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2.5fr 1.8fr 1.2fr 1.5fr 1.8fr',
                  minWidth: '850px',
                  opacity: user.enabled ? 1 : 0.6,
                }}
              >
                {/* Colaborador */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="crm-avatar-text">
                    {user.firstName.charAt(0)}
                    {user.lastName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      {user.firstName} {user.lastName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--crm-text-secondary)' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                {/* Role / Permissão */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isAdmin() && user.id !== currentUser.id ? (
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as KeycloakRole)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${badge.border}`,
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.color,
                        cursor: 'pointer',
                      }}
                    >
                      <option value="ADMIN">ADMIN (Geral)</option>
                      <option value="GESTOR">GESTOR (Vendas)</option>
                      <option value="VENDEDOR">VENDEDOR (Concierge)</option>
                    </select>
                  ) : (
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backgroundColor: badge.bg,
                        color: badge.color,
                        border: `1px solid ${badge.border}`,
                      }}
                    >
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: user.enabled ? '#ecfdf5' : '#fee2e2',
                      color: user.enabled ? '#059669' : '#dc2626',
                    }}
                  >
                    {user.enabled ? 'Ativo' : 'Bloqueado'}
                  </span>
                </div>

                {/* Último Acesso */}
                <div style={{ fontSize: '0.82rem', color: 'var(--crm-text-secondary)', display: 'flex', alignItems: 'center' }}>
                  {user.lastLoginAt}
                </div>

                {/* Ações */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                  {isAdmin() ? (
                    <>
                      <button
                        className="crm-btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', gap: '4px' }}
                        onClick={() => setResetPasswordUser(user)}
                        title="Redefinir Senha no Keycloak"
                      >
                        <KeyRound size={13} />
                        <span>Senha</span>
                      </button>

                      {user.id !== currentUser.id && (
                        <button
                          className="crm-btn-secondary"
                          style={{
                            padding: '4px 8px',
                            fontSize: '0.75rem',
                            color: user.enabled ? '#dc2626' : '#059669',
                          }}
                          onClick={() => toggleUserStatus(user.id)}
                          title={user.enabled ? 'Bloquear Acesso' : 'Desbloquear Acesso'}
                        >
                          {user.enabled ? <Lock size={13} /> : <CheckCircle2 size={13} />}
                        </button>
                      )}
                    </>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--crm-text-secondary)', fontStyle: 'italic' }}>
                      Somente leitura
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Onboarding de Novo Usuário */}
      {showOnboardingModal && (
        <OnboardingUserModal
          onClose={() => setShowOnboardingModal(false)}
          onSubmit={(data) => {
            createUser(data);
            setShowOnboardingModal(false);
          }}
        />
      )}

      {/* Modal: Redefinição de Senha */}
      {resetPasswordUser && (
        <ResetPasswordModal
          user={resetPasswordUser}
          onClose={() => setResetPasswordUser(null)}
          onSubmit={(newPass, temp) => {
            resetUserPassword(resetPasswordUser.id, newPass, temp);
            setResetPasswordUser(null);
          }}
        />
      )}
    </div>
  );
}

// Modal: Onboarding Novo Usuário
interface OnboardingModalProps {
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    role: KeycloakRole;
    temporaryPassword: boolean;
    initialPassword?: string;
  }) => void;
}

function OnboardingUserModal({ onClose, onSubmit }: OnboardingModalProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<KeycloakRole>('VENDEDOR');
  const [tempPassword, setTempPassword] = useState('Luxo@2026!k9');
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(res);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      role,
      temporaryPassword: requirePasswordChange,
      initialPassword: tempPassword,
    });
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="crm-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserPlus size={20} color="#C9A961" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Onboarding de Usuário</h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--crm-text-secondary)', marginBottom: '16px' }}>
          Cadastre um novo membro da equipe. O usuário será provisionado no Realm Keycloak com as permissões atribuídas.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="crm-form-field">
              <label>Nome *</label>
              <input
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ex: Beatriz"
                required
              />
            </div>
            <div className="crm-form-field">
              <label>Sobrenome</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Ex: Soares"
              />
            </div>
          </div>

          <div className="crm-form-field">
            <label>Email Institucional *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="beatriz@portalluxoestilo.com.br"
              required
            />
          </div>

          <div className="crm-form-field">
            <label>Papel de Acesso (Keycloak Role)</label>
            <select value={role} onChange={(e) => setRole(e.target.value as KeycloakRole)}>
              <option value="VENDEDOR">Vendedor / Concierge (Atendimento e Leads)</option>
              <option value="GESTOR">Gestor de Vendas (Supervisão do Funil)</option>
              <option value="ADMIN">Administrador Geral (Total)</option>
            </select>
          </div>

          <div className="crm-form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Senha Provisória</label>
              <button
                type="button"
                onClick={generateRandomPassword}
                style={{ background: 'none', border: 'none', color: 'var(--crm-accent-blue)', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <RefreshCw size={11} /> Gerar Nova
              </button>
            </div>
            <input
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)}
              style={{ fontFamily: 'monospace' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer', marginTop: '4px' }}>
            <input
              type="checkbox"
              checked={requirePasswordChange}
              onChange={(e) => setRequirePasswordChange(e.target.checked)}
            />
            <span>Exigir alteração de senha no primeiro login</span>
          </label>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="crm-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="crm-btn-primary">
              Concluir Onboarding
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal: Redefinição de Senha
interface ResetPasswordModalProps {
  user: KeycloakUser;
  onClose: () => void;
  onSubmit: (newPassword: string, temporary: boolean) => void;
}

function ResetPasswordModal({ user, onClose, onSubmit }: ResetPasswordModalProps) {
  const [password, setPassword] = useState('');
  const [temporary, setTemporary] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    onSubmit(password, temporary);
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="crm-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <KeyRound size={20} color="#C9A961" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>Redefinir Senha</h2>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--crm-text-secondary)', marginBottom: '16px' }}>
          Defina uma nova credencial no Keycloak para <strong>{user.firstName} {user.lastName}</strong> ({user.email}).
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="crm-form-field">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Nova Senha</label>
              <button
                type="button"
                onClick={generatePassword}
                style={{ background: 'none', border: 'none', color: 'var(--crm-accent-blue)', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Gerar Forte
              </button>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                autoFocus
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite ou gere uma senha..."
                required
                style={{ flex: 1, fontFamily: 'monospace' }}
              />
              {password && (
                <button
                  type="button"
                  className="crm-btn-secondary"
                  onClick={handleCopy}
                  title="Copiar senha"
                  style={{ padding: '6px 10px' }}
                >
                  {copied ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={temporary}
              onChange={(e) => setTemporary(e.target.checked)}
            />
            <span>Forçar alteração de senha no próximo acesso</span>
          </label>

          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className="crm-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="crm-btn-primary" disabled={!password.trim()}>
              Atualizar Credencial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
