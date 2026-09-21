import React from 'react';
import { cn } from '@/lib/utils';

export type AdminTabId = 
  | 'overview' 
  | 'products' 
  | 'collections' 
  | 'assign' 
  | 'tuckers' 
  | 'navigation' 
  | 'discounts';

interface TabConfig {
  id: AdminTabId;
  label: string;
}

const ADMIN_TABS: TabConfig[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'products', label: 'Products' },
  { id: 'collections', label: 'Collections' },
  { id: 'assign', label: 'Assign to Collections' },
  { id: 'discounts', label: 'Discount Codes' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'tuckers', label: "Tucker's Tees" },
];

interface AdminTabsProps {
  activeTab: AdminTabId;
  onTabChange: (tab: AdminTabId) => void;
}

const AdminTabs: React.FC<AdminTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-8 border-b border-border">
      <nav className="flex flex-wrap gap-2 sm:gap-0 sm:space-x-8" role="tablist">
        {ADMIN_TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'py-2 px-3 sm:px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
              activeTab === tab.id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminTabs;
