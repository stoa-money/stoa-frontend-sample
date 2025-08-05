import { ReactNode } from "react";

interface PageBannerProps {
  title: string | ReactNode;
  subtitle?: string;
  highlightText?: string;
  highlightColor?: 'purple' | 'blue' | 'emerald' | 'slate';
  size?: 'sm' | 'md' | 'lg';
}

export function PageBanner({ 
  title, 
  subtitle, 
  highlightText, 
  highlightColor = 'purple',
  size = 'md' 
}: PageBannerProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      title: 'text-2xl md:text-3xl',
      subtitle: 'text-base'
    },
    md: {
      container: 'py-8',
      title: 'text-xl md:text-md',
      subtitle: 'text-md'
    },
    lg: {
      container: 'py-16',
      title: 'text-4xl md:text-2xl',
      subtitle: 'text-xl'
    }
  };

  const colorClasses = {
    purple: 'text-brand',
    blue: 'text-stoa-blue',
    emerald: 'text-stoa-emerald',
    slate: 'text-stoa-slate'
  };

  const currentSize = sizeClasses[size];
  const highlightClass = colorClasses[highlightColor];

  // Helper function to render title with optional highlight
  const renderTitle = () => {
    if (typeof title === 'string' && highlightText) {
      const parts = title.split(highlightText);
      return (
        <>
          {parts[0]}
          <span className={highlightClass}>{highlightText}</span>
          {parts[1]}
        </>
      );
    }
    return title;
  };

  return (
    <div className={`text-center ${currentSize.container} px-4`}>
      <h1 className={`${currentSize.title} font-bold text-slate-900 mb-4 tracking-tight leading-tight`}>
        {renderTitle()}
      </h1>
      {subtitle && (
        <p className={`text-slate-600 ${currentSize.subtitle} max-w-2xl mx-auto leading-relaxed font-medium`}>
          {subtitle}
        </p>
      )}
    </div>
  );
} 