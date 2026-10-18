import React, { useState, useRef } from 'react';
import { Mail, Phone, MessageSquare, Paperclip, MoreHorizontal, Plus, Flag, X } from 'lucide-react';
import { CrmTask, CrmColumn } from './types';

interface CrmKanbanBoardProps {
  tasks: CrmTask[];
  columns: CrmColumn[];
  toggleTaskCompletion: (taskId: number, e?: React.MouseEvent) => void;
  toggleTaskSelection: (taskId: number) => void;
  moveTask: (taskId: number, newStatus: string) => void;
  addColumn: (title: string) => void;
  renameColumn: (columnId: string, newTitle: string) => void;
  addTask: (taskData: Partial<CrmTask> & { name: string; status: string }) => void;
  onOpenDetail?: (task: CrmTask) => void;
}

export function CrmKanbanBoard({
  tasks,
  columns,
  toggleTaskCompletion,
  toggleTaskSelection,
  moveTask,
  addColumn,
  renameColumn,
  addTask,
  onOpenDetail,
}: CrmKanbanBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [editingColumn, setEditingColumn] = useState<{ id: string; title: string } | null>(null);
  const [addingColumn, setAddingColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [addingTaskInColumn, setAddingTaskInColumn] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ name: '', email: '', phone: '', company: '' });
  const isDragging = useRef(false);

  const handleDragStart = (e: React.DragEvent, taskId: number) => {
    isDragging.current = true;
    e.dataTransfer.setData('taskId', taskId.toString());
    e.dataTransfer.effectAllowed = 'move';
    (e.currentTarget as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).style.opacity = '1';
    setTimeout(() => {
      isDragging.current = false;
    }, 0);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
    if (!isNaN(taskId)) {
      moveTask(taskId, columnId);
    }
  };

  const handleCardClick = (taskId: number) => {
    if (!isDragging.current) {
      toggleTaskSelection(taskId);
    }
  };

  const handleRenameSubmit = (columnId: string) => {
    if (editingColumn && editingColumn.title.trim()) {
      renameColumn(columnId, editingColumn.title.trim());
    }
    setEditingColumn(null);
  };

  const handleAddColumnSubmit = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim());
      setNewColumnTitle('');
      setAddingColumn(false);
    }
  };

  const handleInlineTaskSubmit = (columnId: string) => {
    if (newTask.name.trim()) {
      addTask({ ...newTask, name: newTask.name.trim(), status: columnId });
      setNewTask({ name: '', email: '', phone: '', company: '' });
      setAddingTaskInColumn(null);
    }
  };

  const cancelInlineTask = () => {
    setAddingTaskInColumn(null);
    setNewTask({ name: '', email: '', phone: '', company: '' });
  };

  return (
    <div className="crm-kanban-board" style={{ overflowX: 'auto', paddingBottom: '16px' }}>
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);
        const isOver = dragOverColumn === column.id;

        return (
          <div
            key={column.id}
            className={`crm-kanban-column${isOver ? ' drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="crm-column-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                {editingColumn?.id === column.id ? (
                  <input
                    autoFocus
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      border: '1px solid var(--crm-accent-blue)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      outline: 'none',
                      color: 'var(--crm-text-primary)',
                      backgroundColor: 'var(--crm-bg-color)',
                      width: '100%',
                    }}
                    value={editingColumn.title}
                    onChange={(e) => setEditingColumn({ ...editingColumn, title: e.target.value })}
                    onBlur={() => handleRenameSubmit(column.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(column.id);
                      if (e.key === 'Escape') setEditingColumn(null);
                    }}
                  />
                ) : (
                  <span
                    style={{ fontWeight: 600, color: column.color, fontSize: '0.9rem', cursor: 'text' }}
                    onDoubleClick={() => setEditingColumn({ id: column.id, title: column.title })}
                    title="Duplo clique para renomear"
                  >
                    {column.title}
                  </span>
                )}
                <span style={{ color: 'var(--crm-text-secondary)', fontSize: '0.85rem' }}>
                  {columnTasks.length}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', color: 'var(--crm-text-secondary)', alignItems: 'center' }}>
                <MoreHorizontal size={16} style={{ cursor: 'pointer' }} />
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', padding: 0, color: 'inherit', cursor: 'pointer', display: 'flex' }}
                  onClick={() => {
                    setAddingTaskInColumn(column.id);
                    setNewTask({ name: '', email: '', phone: '', company: '' });
                  }}
                  title="Adicionar card nesta coluna"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="crm-task-cards">
              {/* Inline task creation */}
              {addingTaskInColumn === column.id && (
                <div className="crm-card" style={{ borderColor: 'var(--crm-accent-blue)', backgroundColor: 'var(--crm-bg-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Novo Card</span>
                    <X size={14} cursor="pointer" color="var(--crm-text-secondary)" onClick={cancelInlineTask} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <input
                      autoFocus
                      placeholder="Nome *"
                      value={newTask.name}
                      onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--crm-border-color)', fontSize: '0.85rem' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInlineTaskSubmit(column.id);
                        if (e.key === 'Escape') cancelInlineTask();
                      }}
                    />
                    <input
                      placeholder="Email"
                      value={newTask.email}
                      onChange={(e) => setNewTask({ ...newTask, email: e.target.value })}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--crm-border-color)', fontSize: '0.85rem' }}
                    />
                    <input
                      placeholder="Telefone"
                      value={newTask.phone}
                      onChange={(e) => setNewTask({ ...newTask, phone: e.target.value })}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--crm-border-color)', fontSize: '0.85rem' }}
                    />
                    <input
                      placeholder="Empresa"
                      value={newTask.company}
                      onChange={(e) => setNewTask({ ...newTask, company: e.target.value })}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--crm-border-color)', fontSize: '0.85rem' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleInlineTaskSubmit(column.id);
                      }}
                    />
                    <button
                      className="crm-btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center', marginTop: '4px' }}
                      onClick={() => handleInlineTaskSubmit(column.id)}
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              {columnTasks.map((task) => (
                <div
                  key={task.id}
                  className={`crm-card ${task.isSelected ? 'selected' : ''}`}
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleCardClick(task.id)}
                >
                  {task.isSelected && (
                    <div className="crm-flag-icon">
                      <Flag size={13} fill="#ef4444" color="#ef4444" />
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      className={`crm-checkbox ${task.checked ? 'checked' : ''}`}
                      onClick={(e) => toggleTaskCompletion(task.id, e)}
                    >
                      {task.checked && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </div>

                    {task.avatar ? (
                      <img src={task.avatar} alt={task.name} className="crm-avatar-img" />
                    ) : (
                      <div className="crm-avatar-text">{task.avatarText || task.name.charAt(0).toUpperCase()}</div>
                    )}

                    <span
                      style={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        textDecoration: task.checked ? 'line-through' : 'none',
                        color: task.checked ? 'var(--crm-text-secondary)' : 'inherit',
                      }}
                    >
                      {task.name}
                    </span>
                  </div>

                  <div className="crm-card-body">
                    {task.email && (
                      <div className="crm-detail-row">
                        <Mail size={14} />
                        <span>{task.email}</span>
                      </div>
                    )}
                    {task.phone && (
                      <div className="crm-detail-row">
                        <Phone size={14} />
                        <span>{task.phone}</span>
                      </div>
                    )}
                    {task.company && (
                      <div className="crm-detail-row">
                        <span className="crm-dot" style={{ backgroundColor: task.companyColor || '#3b82f6' }}></span>
                        <span>{task.company}</span>
                      </div>
                    )}
                    {/* Sales & Cart Pills */}
                    {(task.totalSpentBrl !== undefined || task.activeCartItemsCount) && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                        {task.totalSpentBrl !== undefined && task.totalSpentBrl > 0 && (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: '#059669',
                              backgroundColor: '#ecfdf5',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            R$ {task.totalSpentBrl.toFixed(2)} ({task.ordersCount || 1} ped.)
                          </span>
                        )}
                        {task.activeCartItemsCount ? (
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color: '#d97706',
                              backgroundColor: '#fffbeb',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            Sacola: {task.activeCartItemsCount} un.
                          </span>
                        ) : null}
                      </div>
                    )}
                  </div>

                  <div className="crm-card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <MessageSquare size={13} />
                        <span>{task.comments}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}>
                        <Paperclip size={13} />
                        <span>{task.attachments}</span>
                      </div>
                    </div>
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
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '2px 6px',
                        }}
                      >
                        Detalhes →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add Column Button */}
      <div style={{ minWidth: '200px', alignSelf: 'flex-start' }}>
        {addingColumn ? (
          <div className="crm-card" style={{ padding: '14px' }}>
            <input
              autoFocus
              placeholder="Nome da coluna..."
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                borderRadius: '6px',
                border: '1px solid var(--crm-border-color)',
                fontSize: '0.85rem',
                backgroundColor: 'var(--crm-bg-color)',
                color: 'var(--crm-text-primary)',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddColumnSubmit();
                if (e.key === 'Escape') {
                  setAddingColumn(false);
                  setNewColumnTitle('');
                }
              }}
            />
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                className="crm-btn-primary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={handleAddColumnSubmit}
              >
                Adicionar
              </button>
              <button
                className="crm-btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                onClick={() => {
                  setAddingColumn(false);
                  setNewColumnTitle('');
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            className="crm-btn-secondary"
            style={{ width: '100%', borderStyle: 'dashed', justifyContent: 'center' }}
            onClick={() => setAddingColumn(true)}
          >
            <Plus size={16} />
            <span>Adicionar coluna</span>
          </button>
        )}
      </div>
    </div>
  );
}
