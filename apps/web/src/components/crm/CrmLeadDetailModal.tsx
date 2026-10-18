import React from 'react';
import {
  X,
  ShoppingBag,
  Package,
  Heart,
  Compass,
  Phone,
  Mail,
  Building,
  UserCheck,
  TrendingUp,
  Tag,
} from 'lucide-react';
import { CrmTask, CrmColumn, LeadSource } from './types';

interface CrmLeadDetailModalProps {
  task: CrmTask | null;
  columns: CrmColumn[];
  onClose: () => void;
  onStatusChange: (taskId: number, newStatus: string) => void;
}

function getSourceLabel(source?: LeadSource): { label: string; bg: string; color: string } {
  switch (source) {
    case 'DIRECT_CHECKOUT':
      return { label: 'Compra Direta (Loja)', bg: '#ecfdf5', color: '#059669' };
    case 'LIVE_SHOPPING':
      return { label: 'Live Shopping Marina', bg: '#fef2f2', color: '#dc2626' };
    case 'AI_ASSISTANT':
      return { label: 'Assistente de Estilo IA', bg: '#f5f3ff', color: '#7c3aed' };
    case 'SHARED_GIFT':
      return { label: 'Presente Amiga (Split)', bg: '#fffbeb', color: '#d97706' };
    case 'ORGANIC':
    default:
      return { label: 'Navegação Orgânica', bg: '#eff6ff', color: '#2563eb' };
  }
}

export function CrmLeadDetailModal({
  task,
  columns,
  onClose,
  onStatusChange,
}: CrmLeadDetailModalProps) {
  if (!task) return null;

  const currentColumn = columns.find((c) => c.id === task.status);
  const source = getSourceLabel(task.leadSource);

  return (
    <div className="crm-modal-overlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div
        className="crm-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            {task.avatar ? (
              <img
                src={task.avatar}
                alt={task.name}
                style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.2rem',
                }}
              >
                {task.avatarText || task.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{task.name}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span
                  style={{
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    backgroundColor: source.bg,
                    color: source.color,
                  }}
                >
                  {source.label}
                </span>
                {task.assignedTo && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--crm-text-secondary)' }}>
                    Atribuído a: <strong>{task.assignedTo}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--crm-text-secondary)', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Phase Selector */}
        <div style={{ backgroundColor: 'var(--crm-bg-color)', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--crm-text-secondary)' }}>Fase Atual no Funil:</span>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: `1.5px solid ${currentColumn?.color || 'var(--crm-border-color)'}`,
              fontWeight: 600,
              fontSize: '0.85rem',
              color: currentColumn?.color || 'var(--crm-text-primary)',
              backgroundColor: 'var(--crm-card-bg)',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.title}
              </option>
            ))}
          </select>
        </div>

        {/* Financial & Sales Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--crm-border-color)', backgroundColor: 'var(--crm-card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.78rem', fontWeight: 600 }}>
              <TrendingUp size={14} />
              <span>LTV (Total Gasto)</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '6px', color: '#10b981' }}>
              {task.totalSpentBrl !== undefined
                ? `R$ ${task.totalSpentBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                : 'R$ 0,00'}
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--crm-border-color)', backgroundColor: 'var(--crm-card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#3b82f6', fontSize: '0.78rem', fontWeight: 600 }}>
              <Package size={14} />
              <span>Pedidos Concluídos</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '6px' }}>
              {task.ordersCount || 0} pedidos
            </div>
          </div>

          <div style={{ padding: '14px', borderRadius: '10px', border: '1px solid var(--crm-border-color)', backgroundColor: 'var(--crm-card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.78rem', fontWeight: 600 }}>
              <ShoppingBag size={14} />
              <span>Sacola Ativa</span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '6px' }}>
              {task.activeCartItemsCount ? `${task.activeCartItemsCount} itens` : 'Vazia'}
            </div>
            {task.activeCartTotalBrl ? (
              <span style={{ fontSize: '0.72rem', color: '#f59e0b', fontWeight: 500 }}>
                (R$ {task.activeCartTotalBrl.toFixed(2)})
              </span>
            ) : null}
          </div>
        </div>

        {/* Section: Contatos */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--crm-text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dados de Contato
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Mail size={15} color="var(--crm-text-secondary)" />
              <span>{task.email || 'Email não informado'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Phone size={15} color="var(--crm-text-secondary)" />
              <span>{task.phone || 'Telefone não informado'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <Building size={15} color="var(--crm-text-secondary)" />
              <span>Empresa: {task.company || 'Pessoa Física'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
              <UserCheck size={15} color="var(--crm-text-secondary)" />
              <span>Status: {task.checked ? 'Atendimento Concluído' : 'Em Aberto'}</span>
            </div>
          </div>
        </div>

        {/* Section: Navegação & Comportamento na Loja */}
        <div style={{ borderTop: '1px solid var(--crm-border-color)', paddingTop: '16px' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--crm-text-secondary)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Jornada de Navegação & Interesse
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={15} color="#3b82f6" />
              <span>
                Último Produto Navegado:{' '}
                <strong>{task.lastViewedProduct || 'Lenço Seda Riviera Esmeralda'}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={15} color="#f59e0b" />
              <span>
                Categoria de Maior Afinidade:{' '}
                <strong>{task.lastViewedCategory || 'Acessórios & Seda'}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Heart size={15} color="#ef4444" />
              <span>
                Favoritos na Wishlist: <strong>{task.wishlistCount || 2} peças salvas</strong>
              </span>
            </div>
            {task.lastOrderId && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={15} color="#10b981" />
                <span>
                  Último Pedido: <strong>{task.lastOrderId}</strong> ({task.lastOrderStatus || 'Pagamento Pix Confirmado'})
                </span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="crm-btn-primary" onClick={onClose}>
            Fechar Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}
