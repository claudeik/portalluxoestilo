import React from 'react';
import { LayoutDashboard, CheckSquare, ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CrmViewType } from './types';

interface CrmSidebarProps {
  currentView: CrmViewType;
  setCurrentView: (view: CrmViewType) => void;
}

export function CrmSidebar({ currentView, setCurrentView }: CrmSidebarProps) {
  return (
    <aside className="crm-sidebar">
      <div className="crm-sidebar-header">
        <Link to="/" className="crm-logo-placeholder" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #0A0908 0%, #25201A 100%)',
              border: '1.5px solid #C9A961',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C9A961',
              boxShadow: '0 2px 8px rgba(201, 169, 97, 0.2)',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A961" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
              <path d="M11 3 8 9l4 12 4-12-3-6" />
              <path d="M2 9h20" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '0.98rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                lineHeight: 1.15,
                color: 'var(--crm-text-primary)',
              }}
            >
              PORTAL LUXO
            </span>
            <span
              style={{
                fontSize: '0.62rem',
                letterSpacing: '0.18em',
                color: '#C9A961',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginTop: '1px',
              }}
            >
              Estilo · CRM
            </span>
          </div>
        </Link>
      </div>
      
      <div className="crm-nav-links">
        <div 
          className={`crm-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>
        
        <div 
          className={`crm-nav-item ${currentView === 'tasks' ? 'active' : ''}`}
          onClick={() => setCurrentView('tasks')}
        >
          <CheckSquare size={20} />
          <span>Minhas Tarefas</span>
        </div>

        <div 
          className={`crm-nav-item ${currentView === 'users' ? 'active' : ''}`}
          onClick={() => setCurrentView('users')}
        >
          <Users size={20} />
          <span>Usuários & Acessos</span>
        </div>
      </div>

      <div style={{ padding: '16px', borderTop: '1px solid var(--crm-border-color)' }}>
        <Link 
          to="/"
          className="crm-btn-secondary" 
          style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
        >
          <ArrowLeft size={16} />
          <span>Voltar ao Portal</span>
        </Link>
      </div>
    </aside>
  );
}
