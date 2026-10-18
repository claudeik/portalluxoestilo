import React from 'react';
import { Users, Flame, TrendingUp, UserCheck } from 'lucide-react';
import { CrmTask, CrmColumn } from './types';

interface CrmDashboardProps {
  tasks: CrmTask[];
  columns: CrmColumn[];
}

export function CrmDashboard({ tasks, columns }: CrmDashboardProps) {
  const totalCards = tasks.length;
  const hotLeads = tasks.filter(t => t.status === 'lead').length;
  const inDevelopment = tasks.filter(t => t.status === 'interested').length;
  const customers = tasks.filter(t => t.status === 'customer').length;
  const completed = tasks.filter(t => t.checked).length;
  const completionRate = totalCards > 0 ? Math.round((completed / totalCards) * 100) : 0;

  const statCards = [
    { label: 'Total de Leads', value: totalCards, icon: Users, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Leads Quentes', value: hotLeads, icon: Flame, color: '#ef4444', bg: '#fef2f2' },
    { label: 'Em Negociação', value: inDevelopment, icon: TrendingUp, color: '#f97316', bg: '#fff7ed' },
    { label: 'Clientes Fechados', value: customers, icon: UserCheck, color: '#10b981', bg: '#ecfdf5' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, margin: 0 }}>Gothan CRM · Dashboard</h1>
        <p style={{ color: 'var(--crm-text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Gestão de tarefas, produtividade e funil de clientes
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {statCards.map(card => (
          <div key={card.label} className="crm-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--crm-text-secondary)', fontWeight: 500 }}>{card.label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={18} color={card.color} />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Progress + Pipeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Task Completion */}
        <div className="crm-card" style={{ padding: '22px' }}>
          <div style={{ fontWeight: 600, marginBottom: '16px' }}>Conclusão de Tarefas</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.875rem' }}>
            <span>{completed} de {totalCards} concluídas</span>
            <span style={{ fontWeight: 600 }}>{completionRate}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--crm-bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${completionRate}%`, height: '100%', backgroundColor: 'var(--crm-accent-blue)', transition: 'width 0.3s' }}></div>
          </div>
        </div>

        {/* Pipeline by Column */}
        <div className="crm-card" style={{ padding: '22px' }}>
          <div style={{ fontWeight: 600, marginBottom: '16px' }}>Pipeline por Fase</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {columns.map(col => {
              const count = tasks.filter(t => t.status === col.id).length;
              const pct = totalCards > 0 ? Math.round((count / totalCards) * 100) : 0;
              return (
                <div key={col.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ color: col.color, fontWeight: 500 }}>{col.title}</span>
                    <span style={{ color: 'var(--crm-text-secondary)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--crm-bg-color)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: col.color, transition: 'width 0.3s' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
