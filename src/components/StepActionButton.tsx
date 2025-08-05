import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StepActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  actionText?: string;
  loadingText?: string;
  variant?: 'default' | 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  type?: 'button' | 'submit' | 'reset';
}

export function StepActionButton({
  onClick,
  disabled = false,
  isLoading = false,
  children,
  actionText,
  loadingText = 'Loading...',
  variant = 'primary',
  className,
  size,
  type = 'button'
}: StepActionButtonProps) {
  const buttonText = actionText || children;
  
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      type={type}
      className={cn(
        'min-w-[320px] px-12 py-3 text-base font-bold h-auto',
        'sm:w-auto',
        className
      )}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          <span className="font-bold">{loadingText}</span>
        </>
      ) : (
        <span className="font-bold">{buttonText}</span>
      )}
    </Button>
  );
} 