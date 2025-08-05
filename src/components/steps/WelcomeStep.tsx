import { StepActionButton } from '@/components/StepActionButton';
import { StepProps } from '@/types/workflow';
import { PotFactoryDetails } from '@/types/types';
import Image from 'next/image';

interface WelcomeStepProps extends StepProps {
  potFactory: PotFactoryDetails;
}

export function WelcomeStep({ isLoading, onAction, potFactory }: WelcomeStepProps) {
  return (
    <div className="max-w-4xl text-center mx-auto py-12 bg-white/80 rounded-lg">
      <h1 className="mb-8 text-4xl font-bold">
        Your money is safe with Stoa
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-12">
        We&apos;ve partnered with Griffin, a UK bank that provides the infrastructure behind Stoa&apos;s saving experience. That means your money sits securely with a regulated bank, so you get the same level of protection you&apos;d expect from any UK bank.
      </p>
      
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">FSCS protected</h2>
        <p className="text-lg text-gray-600">
          Your eligible savings are protected up to £85,000 by the Financial Services Compensation Scheme.
        </p>
      </div>
      
      <div className="flex justify-center items-center gap-4 mb-8">
        {potFactory.logoUrl ? (
          <div className="relative w-16 h-16">
            <Image
              src={potFactory.logoUrl}
              alt={`${potFactory.displayName} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <span className="text-2xl font-bold text-gray-400">logo</span>
        )}
        <span className="text-2xl font-semibold">Secure your {potFactory.displayName} Pot for free</span>
      </div>
      
      <div className="flex justify-center">
        <StepActionButton
          onClick={onAction}
          isLoading={isLoading}
          loadingText="Processing..."
          actionText="See Pot Details"
        />
      </div>
    </div>
  );
} 