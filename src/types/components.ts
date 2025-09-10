import { ReactNode } from 'react';

// Base Component Props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Dashboard Component Types
export interface DashboardCardProps extends BaseComponentProps {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
  value?: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  loading?: boolean;
  error?: string;
  onRefresh?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export interface ChartProps extends BaseComponentProps {
  data: any[];
  type: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  loading?: boolean;
  error?: string;
}

export interface MetricCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  loading?: boolean;
}

// Form Component Types
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  options?: SelectOption[];
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

// Table Component Types
export interface TableColumn<T = any> {
  key: keyof T | string;
  title: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
}

export interface TableProps<T = any> extends BaseComponentProps {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  error?: string;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  selection?: {
    selectedRowKeys: string[];
    onChange: (selectedRowKeys: string[], selectedRows: T[]) => void;
  };
  onRowClick?: (record: T, index: number) => void;
}

// Modal Component Types
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  footer?: ReactNode;
  loading?: boolean;
}

// Navigation Component Types
export interface NavItem {
  key: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: NavItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface SidebarProps extends BaseComponentProps {
  items: NavItem[];
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  selectedKey?: string;
  onSelect?: (key: string) => void;
}

// Alert Component Types
export interface AlertProps extends BaseComponentProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  closable?: boolean;
  onClose?: () => void;
  action?: ReactNode;
}

// Loading Component Types
export interface LoadingProps extends BaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  overlay?: boolean;
}

// Drag and Drop Types
export interface DragItem {
  id: string;
  type: string;
  data: any;
}

export interface DropZoneProps extends BaseComponentProps {
  accept?: string[];
  onDrop: (items: DragItem[]) => void;
  disabled?: boolean;
  loading?: boolean;
}

// Filter Component Types
export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'boolean';
  options?: SelectOption[];
  placeholder?: string;
}

export interface FilterProps extends BaseComponentProps {
  options: FilterOption[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
  loading?: boolean;
}

// Search Component Types
export interface SearchProps extends BaseComponentProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  loading?: boolean;
  suggestions?: string[];
  debounceMs?: number;
}

// Notification Component Types
export interface NotificationProps {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message?: string;
  duration?: number;
  closable?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme Types
export interface ThemeConfig {
  mode: 'light' | 'dark';
  primaryColor: string;
  borderRadius: number;
  fontSize: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// Layout Types
export interface LayoutProps extends BaseComponentProps {
  header?: ReactNode;
  sidebar?: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
}

export interface GridProps extends BaseComponentProps {
  cols?: number;
  gap?: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

// Animation Types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'normal' | 'reverse' | 'alternate';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Responsive Types
export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ResponsiveValue<T> {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}