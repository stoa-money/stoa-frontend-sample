import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  theme?: 'purple' | 'slate' | 'emerald' | 'blue';
  formatValue?: boolean;
}

export function StatCard({ title, value, icon: Icon, theme = 'slate', formatValue = false }: StatCardProps) {
  const themeClasses = {
    purple: {
      container: 'stat-card-purple',
      iconWrapper: 'icon-purple',
      iconColor: 'text-stoa-purple'
    },
    slate: {
      container: 'stat-card-slate',
      iconWrapper: 'icon-slate',
      iconColor: 'text-stoa-slate'
    },
    emerald: {
      container: 'stat-card-emerald',
      iconWrapper: 'icon-emerald',
      iconColor: 'text-stoa-emerald'
    },
    blue: {
      container: 'stat-card-blue',
      iconWrapper: 'icon-blue',
      iconColor: 'text-stoa-blue'
    }
  };

  const currentTheme = themeClasses[theme];
  const displayValue = formatValue && typeof value === 'number' 
    ? formatCurrency(value, true) 
    : value;

  return (
    <div className={`${currentTheme.container} rounded-lg p-4 transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`${currentTheme.iconWrapper} shadow-sm`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-xl font-bold text-slate-900 tracking-tight">
          {displayValue}
        </div>
      </div>
      <div className="text-xs font-medium text-slate-600 uppercase tracking-wide">
        {title}
      </div>
    </div>
  );
}

export type { StatCardProps }; 