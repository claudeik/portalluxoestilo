import React, { useState, useEffect } from 'react';
import '../components/crm/crm.css';
import { CrmSidebar } from '../components/crm/CrmSidebar';
import { CrmDashboard } from '../components/crm/CrmDashboard';
import { CrmMyTasks } from '../components/crm/CrmMyTasks';
import { CrmUsersManagement } from '../components/crm/CrmUsersManagement';
import { CrmTask, CrmColumn, CrmViewType } from '../components/crm/types';
import { usePortalStore } from '../stores/app.store';
import { useKeycloakStore } from '../lib/keycloak/keycloak.store';

const STORAGE_KEY_TASKS = 'gothan_crm_tasks_v2';
const STORAGE_KEY_COLUMNS = 'gothan_crm_columns_v2';
const STORAGE_KEY_DARK = 'gothan_crm_dark_v2';

const DEFAULT_COLUMNS: CrmColumn[] = [
  { id: 'enquiry', title: 'Just Enquiry', color: '#ef4444' },
  { id: 'interested', title: 'Partially Interested', color: '#f97316' },
  { id: 'lead', title: 'Hot Lead', color: '#10b981' },
  { id: 'customer', title: 'Customer', color: '#10b981' },
  { id: 'not_interested', title: 'Not Interested', color: '#ef4444' },
];

const COLUMN_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4', '#10b981', '#ef4444'];
const COMPANY_COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

const INITIAL_DEMO_TASKS: CrmTask[] = [
  {
    id: 1,
    name: 'Abel Maclead',
    email: 'amaclead@gmail.com',
    phone: '631-335-3414',
    company: 'Honeywell',
    companyColor: '#ef4444',
    comments: 2,
    attachments: 3,
    checked: true,
    isSelected: false,
    status: 'enquiry',
    avatar: 'https://i.pravatar.cc/150?u=1',
    ordersCount: 0,
    totalSpentBrl: 0,
    activeCartItemsCount: 2,
    activeCartTotalBrl: 380,
    wishlistCount: 4,
    lastViewedProduct: 'Óculos Acetato Capri',
    lastViewedCategory: 'Acessórios & Óculos',
    leadSource: 'ORGANIC',
    assignedTo: 'Lucas Mendes',
  },
  {
    id: 2,
    name: 'Bernardo Figeroa',
    email: 'bfigeroa@aol.com',
    phone: '936-336-3951',
    company: 'Zotware',
    companyColor: '#3b82f6',
    comments: 4,
    attachments: 2,
    checked: false,
    isSelected: false,
    status: 'enquiry',
    avatarText: 'B',
    ordersCount: 1,
    totalSpentBrl: 214,
    lastOrderId: 'PEL-2026-0842',
    lastOrderStatus: 'Objeto entregue ao destinatário',
    wishlistCount: 1,
    lastViewedProduct: 'Lenço Seda Riviera Esmeralda',
    leadSource: 'DIRECT_CHECKOUT',
    assignedTo: 'Lucas Mendes',
  },
  {
    id: 3,
    name: 'Bia Ribeiro (Presente Amiga)',
    email: 'bia.ribeiro@gmail.com',
    phone: '11-98711-2233',
    company: 'Studio Design',
    companyColor: '#10b981',
    comments: 6,
    attachments: 2,
    checked: false,
    isSelected: false,
    status: 'interested',
    avatarText: 'B',
    ordersCount: 1,
    totalSpentBrl: 185,
    lastOrderId: 'SPLIT-2026-BIA',
    activeCartItemsCount: 1,
    leadSource: 'SHARED_GIFT',
    assignedTo: 'Marina Ferraz',
  },
  {
    id: 4,
    name: 'Alisha Slusarski',
    email: 'alisha@slusarski.com',
    phone: '732-658-3154',
    company: 'Appharvest',
    companyColor: '#f59e0b',
    comments: 5,
    attachments: 2,
    checked: false,
    isSelected: false,
    status: 'interested',
    avatar: 'https://i.pravatar.cc/150?u=4',
    ordersCount: 0,
    activeCartItemsCount: 3,
    activeCartTotalBrl: 512,
    lastViewedProduct: 'Cinto Couro Fivela Ouro',
    leadSource: 'AI_ASSISTANT',
    assignedTo: 'Lucas Mendes',
  },
  {
    id: 5,
    name: 'Camila Guimarães (Live Marina)',
    email: 'camila.live@hotmail.com',
    phone: '21-99882-1144',
    company: 'Vogue Rio',
    companyColor: '#ef4444',
    comments: 8,
    attachments: 1,
    checked: false,
    isSelected: false,
    status: 'lead',
    avatarText: 'C',
    ordersCount: 2,
    totalSpentBrl: 640,
    lastOrderId: 'PEL-2026-LIVE01',
    lastOrderStatus: 'Postado nos Correios (SRO)',
    leadSource: 'LIVE_SHOPPING',
    assignedTo: 'Marina Ferraz',
  },
  {
    id: 6,
    name: 'Albina Glick',
    email: 'albina@glick.com',
    phone: '732-924-7882',
    company: 'Zotware',
    companyColor: '#3b82f6',
    comments: 3,
    attachments: 1,
    checked: false,
    isSelected: false,
    status: 'lead',
    avatar: 'https://i.pravatar.cc/150?u=6',
    ordersCount: 1,
    totalSpentBrl: 320,
    leadSource: 'ORGANIC',
    assignedTo: 'Lucas Mendes',
  },
  {
    id: 7,
    name: 'Alishia Sergi',
    email: 'alisha@slusarski.com',
    phone: '732-658-3154',
    company: 'Appharvest',
    companyColor: '#f59e0b',
    comments: 5,
    attachments: 2,
    checked: false,
    isSelected: false,
    status: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=8',
    ordersCount: 3,
    totalSpentBrl: 1140,
    lastOrderId: 'PEL-2026-0711',
    lastOrderStatus: 'Entregue',
    leadSource: 'DIRECT_CHECKOUT',
    assignedTo: 'Marina Ferraz',
  },
];

export function CrmPage() {
  const [currentView, setCurrentView] = useState<CrmViewType>('tasks');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DARK);
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [tasks, setTasks] = useState<CrmTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      return saved ? JSON.parse(saved) : INITIAL_DEMO_TASKS;
    } catch {
      return INITIAL_DEMO_TASKS;
    }
  });

  const [columns, setColumns] = useState<CrmColumn[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLUMNS);
      return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
    } catch {
      return DEFAULT_COLUMNS;
    }
  });

  // Store & Keycloak hooks
  const { customer, orders, cart, wishlistIds } = usePortalStore();
  const { isAdmin, isGestor, currentUser } = useKeycloakStore();

  // Sincronização automática do cliente ativo na loja com o CRM
  useEffect(() => {
    if (!customer) return;

    setTasks((prevTasks) => {
      const customerOrders = orders.filter((o) => o.customerId === customer.id);
      const totalSpent = customerOrders.reduce((acc, o) => acc + o.totalBrl, 0);
      const totalCartQty = cart.reduce((acc, i) => acc + i.quantity, 0);
      const latestOrder = customerOrders[0];

      const existingIndex = prevTasks.findIndex(
        (t) => t.email.toLowerCase() === customer.email.toLowerCase()
      );

      const customerLeadData: Partial<CrmTask> = {
        name: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        company: 'Portal Estilo Luxo (Cliente)',
        companyColor: '#C9A961',
        ordersCount: customerOrders.length,
        totalSpentBrl: totalSpent,
        lastOrderId: latestOrder?.id,
        lastOrderDate: latestOrder?.createdAt,
        lastOrderStatus: latestOrder?.status ? `Pedido ${latestOrder.status}` : 'Em processamento',
        activeCartItemsCount: totalCartQty,
        wishlistCount: wishlistIds.length,
        leadSource: 'DIRECT_CHECKOUT',
        assignedTo: 'Marina Ferraz',
      };

      if (existingIndex >= 0) {
        const updated = [...prevTasks];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...customerLeadData,
          status: customerOrders.length > 0 ? 'customer' : updated[existingIndex].status,
        };
        return updated;
      } else {
        const newLead: CrmTask = {
          id: Date.now(),
          name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          company: 'Portal Estilo Luxo (Cliente)',
          companyColor: '#C9A961',
          comments: 1,
          attachments: 0,
          checked: false,
          isSelected: false,
          status: customerOrders.length > 0 ? 'customer' : 'interested',
          avatarText: customer.fullName.charAt(0),
          ...customerLeadData,
        };
        return [newLead, ...prevTasks];
      }
    });
  }, [customer, orders, cart, wishlistIds]);

  // Persistência em localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error('Error saving tasks to localStorage', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COLUMNS, JSON.stringify(columns));
    } catch (e) {
      console.error('Error saving columns to localStorage', e);
    }
  }, [columns]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DARK, JSON.stringify(darkMode));
    } catch (e) {
      console.error('Error saving dark mode', e);
    }
  }, [darkMode]);

  const addColumn = (title: string) => {
    if (!isGestor()) {
      alert(`Acesso Restrito: Apenas Gestores e Administradores podem adicionar colunas.`);
      return;
    }
    const color = COLUMN_COLORS[columns.length % COLUMN_COLORS.length];
    const id = `col_${Date.now()}`;
    setColumns([...columns, { id, title, color }]);
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    if (!isGestor()) {
      alert(`Acesso Restrito: Apenas Gestores e Administradores podem renomear colunas.`);
      return;
    }
    setColumns(columns.map((col) => (col.id === columnId ? { ...col, title: newTitle } : col)));
  };

  const addTask = (taskData: Partial<CrmTask> & { name: string; status: string }) => {
    const newTask: CrmTask = {
      id: Date.now(),
      name: taskData.name,
      email: taskData.email || '',
      phone: taskData.phone || '',
      company: taskData.company || 'Pessoa Física',
      companyColor: COMPANY_COLORS[tasks.length % COMPANY_COLORS.length],
      comments: 0,
      attachments: 0,
      checked: false,
      isSelected: false,
      status: taskData.status,
      avatarText: taskData.name.charAt(0).toUpperCase(),
      leadSource: 'ORGANIC',
      assignedTo: currentUser.firstName + ' ' + currentUser.lastName,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (taskId: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, checked: !task.checked } : task)));
  };

  const toggleTaskSelection = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, isSelected: !task.isSelected } : task)));
  };

  const moveTask = (taskId: number, newStatus: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
  };

  return (
    <div className={`gothan-crm-root ${darkMode ? 'dark' : ''}`}>
      <CrmSidebar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="crm-main-content">
        <div className="crm-content-area">
          {currentView === 'dashboard' && <CrmDashboard tasks={tasks} columns={columns} />}
          {currentView === 'tasks' && (
            <CrmMyTasks
              darkMode={darkMode}
              toggleDarkMode={() => setDarkMode(!darkMode)}
              tasks={tasks}
              columns={columns}
              addColumn={addColumn}
              renameColumn={renameColumn}
              addTask={addTask}
              toggleTaskCompletion={toggleTaskCompletion}
              toggleTaskSelection={toggleTaskSelection}
              moveTask={moveTask}
            />
          )}
          {currentView === 'users' && <CrmUsersManagement />}
        </div>
      </main>
    </div>
  );
}

export default CrmPage;
