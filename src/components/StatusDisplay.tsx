import { LucideIcon } from 'lucide-react';

interface StatusDisplayProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: 'info' | 'success' | 'warning' | 'error';
}

const variantStyles = {
  info: {
    container: 'bg-blue-50 border-blue-100',
    icon: 'text-blue-600',
    title: 'text-blue-600'
  },
  success: {
    container: 'bg-green-50 border-green-100',
    icon: 'text-green-600',
    title: 'text-green-600'
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-100',
    icon: 'text-yellow-600',
    title: 'text-yellow-600'
  },
  error: {
    container: 'bg-red-50 border-red-100',
    icon: 'text-red-600',
    title: 'text-red-600'
  }
};

export function StatusDisplay({
  icon: Icon,
  title,
  description,
  variant = 'info'
}: StatusDisplayProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`rounded-lg p-4 border ${styles.container}`}>
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${styles.icon}`} />
        <div>
          <p className={`font-medium ${styles.title}`}>{title}</p>
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
} 