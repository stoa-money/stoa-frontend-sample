import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { CheckCircle } from 'lucide-react';
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';
import { PotFactoryDetails } from '@/types/types';
import { formatCurrency } from '@/lib/utils';

interface CompletionStepProps extends StepProps {
  potFactory: PotFactoryDetails;
  depositAmount?: number;
}

export function CompletionStep({ isLoading, onAction, potFactory, depositAmount }: CompletionStepProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      {/* Success Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2} />
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Success Message */}
        <div>
          <p className="text-3xl font-bold text-gray-900 text-center">
            You've successfully deposited {formatCurrency(depositAmount ?? 0)} and just secured {potFactory.displayName} reward for FREE
          </p>
        </div>
        
        {/* Dashboard Button */}
        <div className="flex justify-center mb-12">
          <StepActionButton
            onClick={onAction}
            isLoading={isLoading}
            loadingText="Processing..."
            actionText="Go to my Dashboard"
          />
        </div>
        
        {/* FSCS Protection Notice */}
        <FSCSDisclaimer />
      </div>
    </div>
  );
} 