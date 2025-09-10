'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Settings,
  Bell,
  BarChart3,
  Users,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Brain,
  Layout,
  FileText,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: string | number;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    key: 'dashboard-builder',
    label: 'Construtor',
    icon: Layout,
    path: '/dashboard-builder',
  },
  {
    key: 'products',
    label: 'Produtos',
    icon: Package,
    path: '/products',
    badge: '1.2k',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
  },
  {
    key: 'trends',
    label: 'Tendências',
    icon: TrendingUp,
    path: '/trends',
  },
  {
    key: 'automation',
    label: 'Automação',
    icon: Settings,
    path: '/automation',
  },
  {
    key: 'reputation',
    label: 'Reputação',
    icon: Users,
    path: '/reputation',
    badge: 3,
  },
  {
    key: 'ai-assistant',
    label: 'Assistente IA',
    icon: Brain,
    path: '/ai-assistant',
  },
  {
    key: 'reports',
    label: 'Relatórios',
    icon: FileText,
    path: '/reports',
  },
  {
    key: 'messages',
    label: 'Mensagens',
    icon: MessageSquare,
    path: '/messages',
    badge: 12,
  },
  {
    key: 'alerts',
    label: 'Alertas',
    icon: Bell,
    path: '/alerts',
    badge: 5,
  },
  {
    key: 'settings',
    label: 'Configurações',
    icon: Settings,
    path: '/settings',
  },
];

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MD</span>
            </div>
            <span className="font-semibold text-lg">MeliDash</span>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onCollapse(!collapsed)}
          className="p-2"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.key} href={item.path}>
              <div
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors relative group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                  collapsed && "justify-center"
                )}
                onMouseEnter={() => setHoveredItem(item.key)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0")} />
                
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant={isActive ? "secondary" : "default"} 
                        className="ml-auto text-xs"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
                
                {/* Tooltip for collapsed state */}
                {collapsed && hoveredItem === item.key && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-md shadow-md border z-50 whitespace-nowrap">
                    {item.label}
                    {item.badge && (
                      <Badge variant="default" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-muted-foreground text-center">
            <p>MeliDash v1.0</p>
            <p>© 2025</p>
          </div>
        </div>
      )}
    </div>
  );
}