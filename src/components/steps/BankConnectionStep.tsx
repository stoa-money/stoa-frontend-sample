import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { Shield, Key, Zap } from 'lucide-react';

export function BankConnectionStep({ isLoading, onAction }: StepProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      {/* Your money is safe section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-left">Your money is safe with Stoa</h1>
        <p className="text-lg text-gray-600 leading-relaxed text-left">
          We&apos;ve partnered with Griffin, a UK bank that provides the infrastructure behind Stoa&apos;s saving experience. That means your money sits securely with a regulated bank, so you get the same level of protection you&apos;d expect from any UK bank.
        </p>
      </div>

      {/* FSCS Protected section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4 text-left">FSCS protected</h2>
        <p className="text-lg text-gray-600 text-left">
          Your eligible savings are protected up to £85,000 by the Financial Services Compensation Scheme.
        </p>
      </div>

      {/* Why Open Banking section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-left">Why Open Banking?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Secure and Regulated */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-16 w-16 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure and Regulated</h3>
            <p className="text-gray-600">Protected by FCA regulations</p>
          </div>
          
          {/* No Password Sharing */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Key className="h-16 w-16 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Password Sharing</h3>
            <p className="text-gray-600">Connect without sharing credentials</p>
          </div>
          
          {/* Instant Set up */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Zap className="h-16 w-16 text-gray-700" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Set up</h3>
            <p className="text-gray-600">Quick verification and connection</p>
          </div>
        </div>
      </div>
      
      {/* Connect Button */}
      <div className="flex justify-center mb-12">
        <StepActionButton
          onClick={onAction}
          isLoading={isLoading}
          loadingText="Preparing Connection..."
          actionText="Connect Bank Account"
        />
      </div>
    </div>
  );
} 