export type LeadSource =
  | 'DIRECT_CHECKOUT'
  | 'LIVE_SHOPPING'
  | 'AI_ASSISTANT'
  | 'SHARED_GIFT'
  | 'ORGANIC';

export interface CrmTask {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  companyColor: string;
  comments: number;
  attachments: number;
  checked: boolean;
  isSelected: boolean;
  status: string;
  avatar?: string;
  avatarText?: string;

  // Campos de Venda & E-commerce
  ordersCount?: number;
  totalSpentBrl?: number;
  lastOrderId?: string;
  lastOrderDate?: string;
  lastOrderStatus?: string;
  activeCartItemsCount?: number;
  activeCartTotalBrl?: number;

  // Campos de Navegação & Comportamento
  wishlistCount?: number;
  lastViewedProduct?: string;
  lastViewedCategory?: string;
  leadSource?: LeadSource;
  assignedTo?: string; // Vendedor responsável
}

export interface CrmColumn {
  id: string;
  title: string;
  color: string;
}

export type CrmViewType = 'dashboard' | 'tasks' | 'users';
