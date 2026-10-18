import React from 'react';
import { Mail, Phone, Flag, ExternalLink } from 'lucide-react';
import { CrmTask, CrmColumn } from './types';

interface CrmListViewProps {
  tasks: CrmTask[];
  columns: CrmColumn[];
  toggleTaskCompletion: (taskId: number, e?: React.MouseEvent) => void;
  toggleTaskSelection: (taskId: number) => void;
  onOpenDetail?: (task: CrmTask) => void;
}

export function CrmListView({
  tasks,
  columns,
  toggleTaskCompletion,
  toggleTaskSelection,
  onOpenDetail,
}: CrmListViewProps) {
  const columnMap = Object.fromEntries(columns.map((c) => [c.id, c]));

  return (
    <div className="crm-list-view" style={{ overflowX: 'auto' }}>
      <div
        className="crm-list-header"
        style={{
          display: 'grid',
          gridTemplateColumns: '44px 2.2fr 1.8fr 1.2fr 1.5fr 1.2fr 80px',
          minWidth: '920px',
        }}
      >
        <div></div>
        <div>Cliente / Lead</div>
        <div>Contatos</div>
        <div>Empresa</div>
        <div>Vendas & Sacola</div>
        <div>Fase / Status</div>
        <div style={{ textAlign: 'right' }}>Ações</div>
      </div>

      <div>
        {tasks.map((task) => {
          const col = columnMap[task.status];
          const colTitle = col ? col.title : task.status;
          const colColor = col ? col.color : '#6b7280';

          return (
            <div
              key={task.id}
              className="crm-list-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '44px 2.2fr 1.8fr 1.2fr 1.5fr 1.2fr 80px',
                minWidth: '920px',
                backgroundColor: task.isSelected ? 'rgba(59, 130, 246, 0.08)' : undefined,
                position: 'relative',
              }}
              onClick={() => toggleTaskSelection(task.id)}
            >
              {task.isSelected && (
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                  <Flag size={14} fill="#ef4444" color="#ef4444" />
                </div>
              )}

              <div onClick={(e) => toggleTaskCompletion(task.id, e)}>
                <div className={`crm-checkbox ${task.checked ? 'checked' : ''}`}>
                  {task.checked && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {task.avatar ? (
                  <img src={task.avatar} alt={task.name} className="crm-avatar-img" />
                ) : (
                  <div className="crm-avatar-text">{task.avatarText || task.name.charAt(0).toUpperCase()}</div>
                )}
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      textDecoration: task.checked ? 'line-through' : 'none',
                      color: task.checked ? 'var(--crm-text-secondary)' : 'inherit',
                    }}
                  >
                    {task.name}
                  </div>
                  {task.assignedTo && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--crm-text-secondary)' }}>
                      Resp: {task.assignedTo}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.82rem', color: 'var(--crm-text-secondary)' }}>
                {task.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={12} /> {task.email}
                  </div>
                )}
                {task.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={12} /> {task.phone}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <span className="crm-dot" style={{ backgroundColor: task.companyColor || '#3b82f6' }}></span>
                <span>{task.company || 'Pessoa Física'}</span>
              </div>

              {/* Vendas & Sacola */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                {task.totalSpentBrl !== undefined && task.totalSpentBrl > 0 ? (
                  <span style={{ fontWeight: 600, color: '#059669' }}>
                    R$ {task.totalSpentBrl.toFixed(2)} ({task.ordersCount || 1} ped.)
                  </span>
                ) : (
                  <span style={{ color: 'var(--crm-text-secondary)' }}>Sem compras</span>
                )}
                {task.activeCartItemsCount ? (
                  <span style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 500 }}>
                    Sacola: {task.activeCartItemsCount} itens
                  </span>
                ) : null}
              </div>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: `${colColor}18`,
                    color: colColor,
                    border: `1px solid ${colColor}35`,
                  }}
                >
                  {colTitle}
                </span>
              </div>

              {/* Ações */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {onOpenDetail && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(task);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--crm-accent-blue)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                    title="Ver Detalhes do Lead"
                  >
                    <ExternalLink size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
