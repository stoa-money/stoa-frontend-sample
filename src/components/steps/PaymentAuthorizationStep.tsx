import { AuthorizationInterface } from "@/components/AuthorizationInterface";
import { AuthorizationStepProps } from "@/types/workflow";
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

export function PaymentAuthorizationStep({
  authorisationUrl,
}: AuthorizationStepProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-left">Payment Authorization</h1>
        <p className="text-lg text-gray-600 text-left">
          Complete the payment authorization to finalize your deposit
        </p>
      </div>
      
      <AuthorizationInterface
        url={authorisationUrl}
      />
      
      <FSCSDisclaimer />
    </div>
  );
}
