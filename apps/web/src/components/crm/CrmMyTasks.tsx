import React, { useState } from 'react';
import { LayoutGrid, List as ListIcon, Search, Filter, Plus, Sun, Moon, Download } from 'lucide-react';
import { CrmKanbanBoard } from './CrmKanbanBoard';
import { CrmListView } from './CrmListView';
import { CrmLeadDetailModal } from './CrmLeadDetailModal';
import { CrmTask, CrmColumn } from './types';

interface CrmMyTasksProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  tasks: CrmTask[];
  columns: CrmColumn[];
  addColumn: (title: string) => void;
  renameColumn: (columnId: string, newTitle: string) => void;
  addTask: (taskData: Partial<CrmTask> & { name: string; status: string }) => void;
  toggleTaskCompletion: (taskId: number, e?: React.MouseEvent) => void;
  toggleTaskSelection: (taskId: number) => void;
  moveTask: (taskId: number, newStatus: string) => void;
}

function exportTasksCSV(tasks: CrmTask[], columns: CrmColumn[]) {
  const columnMap = Object.fromEntries(columns.map((c) => [c.id, c.title]));
  const header = 'Nome,Email,Telefone,Empresa,Fase,Concluído';
  const rows = tasks.map((t) => {
    const escape = (v: unknown) => `"${String(v || '').replace(/"/g, '""')}"`;
    return [
      escape(t.name),
      escape(t.email),
      escape(t.phone),
      escape(t.company),
      escape(columnMap[t.status] || t.status),
      t.checked ? 'Sim' : 'Não',
    ].join(',');
  });
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leads_gothan_crm.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function CrmMyTasks({
  darkMode,
  toggleDarkMode,
  tasks,
  columns,
  addColumn,
  renameColumn,
  addTask,
  toggleTaskCompletion,
  toggleTaskSelection,
  moveTask,
}: CrmMyTasksProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState<CrmTask | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.phone.toLowerCase().includes(q) ||
      t.company.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ color: '#3b82f6' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 12l10 10 10-10L12 2zm0 14.5L6.5 12 12 6.5 17.5 12 12 16.5z" opacity="0.3" />
              <path d="M12 2L2 12h20L12 2z" />
            </svg>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Minhas Tarefas & Leads</h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="crm-btn-secondary"
            onClick={toggleDarkMode}
            title={darkMode ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            className="crm-btn-secondary"
            onClick={() => exportTasksCSV(tasks, columns)}
            title="Exportar dados para CSV"
          >
            <Download size={16} />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Second Header Row (Controls) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div className="crm-view-toggle">
          <button
            className={`crm-toggle-btn ${view === 'list' ? 'active' : ''}`}
            onClick={() => setView('list')}
          >
            <ListIcon size={16} />
            <span>Lista</span>
          </button>
          <button
            className={`crm-toggle-btn ${view === 'kanban' ? 'active' : ''}`}
            onClick={() => setView('kanban')}
          >
            <LayoutGrid size={16} />
            <span>Kanban</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showSearch ? (
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, email ou empresa..."
              style={{
                padding: '7px 12px',
                borderRadius: '6px',
                border: '1px solid var(--crm-border-color)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--crm-card-bg)',
                color: 'var(--crm-text-primary)',
                minWidth: '240px',
              }}
              onBlur={() => {
                if (!searchQuery) setShowSearch(false);
              }}
            />
          ) : (
            <button
              className="crm-btn-secondary"
              onClick={() => setShowSearch(true)}
              title="Pesquisar leads"
            >
              <Search size={16} />
              <span>Buscar</span>
            </button>
          )}

          <button
            className="crm-btn-primary"
            onClick={() => setShowNewTaskModal(true)}
          >
            <Plus size={16} />
            <span>Nova Tarefa</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {view === 'kanban' ? (
          <CrmKanbanBoard
            tasks={filteredTasks}
            columns={columns}
            toggleTaskCompletion={toggleTaskCompletion}
            toggleTaskSelection={toggleTaskSelection}
            moveTask={moveTask}
            addColumn={addColumn}
            renameColumn={renameColumn}
            addTask={addTask}
            onOpenDetail={(task) => setSelectedDetailTask(task)}
          />
        ) : (
          <CrmListView
            tasks={filteredTasks}
            columns={columns}
            toggleTaskCompletion={toggleTaskCompletion}
            toggleTaskSelection={toggleTaskSelection}
            onOpenDetail={(task) => setSelectedDetailTask(task)}
          />
        )}
      </div>

      {/* Modal Detalhes do Lead (Vendas & Navegação) */}
      {selectedDetailTask && (
        <CrmLeadDetailModal
          task={selectedDetailTask}
          columns={columns}
          onClose={() => setSelectedDetailTask(null)}
          onStatusChange={(taskId, newStatus) => {
            moveTask(taskId, newStatus);
            setSelectedDetailTask((prev) => (prev && prev.id === taskId ? { ...prev, status: newStatus } : prev));
          }}
        />
      )}

      {/* Modal Nova Tarefa */}
      {showNewTaskModal && (
        <NewTaskModal
          columns={columns}
          onSubmit={(taskData) => {
            addTask(taskData);
            setShowNewTaskModal(false);
          }}
          onClose={() => setShowNewTaskModal(false)}
        />
      )}
    </div>
  );
}

interface NewTaskModalProps {
  columns: CrmColumn[];
  onSubmit: (data: { name: string; email: string; phone: string; company: string; status: string }) => void;
  onClose: () => void;
}

function NewTaskModal({ columns, onSubmit, onClose }: NewTaskModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState(columns[0]?.id || 'enquiry');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), email, phone, company, status });
  };

  return (
    <div className="crm-modal-overlay" onClick={onClose}>
      <div className="crm-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginBottom: '18px', fontSize: '1.2rem', fontWeight: 700 }}>Nova Tarefa / Lead</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="crm-form-field">
            <label>Nome do Contato *</label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Marina Ferraz"
              required
            />
          </div>
          <div className="crm-form-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contato@cliente.com"
            />
          </div>
          <div className="crm-form-field">
            <label>Telefone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 98765-4321"
            />
          </div>
          <div className="crm-form-field">
            <label>Empresa</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Ex: Unicentro"
            />
          </div>
          <div className="crm-form-field">
            <label>Fase Inicial</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.title}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', justifyContent: 'flex-end' }}>
            <button type="button" className="crm-btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="crm-btn-primary">
              Salvar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
