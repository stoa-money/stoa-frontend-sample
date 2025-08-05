import { AuthorizationInterface } from "@/components/AuthorizationInterface";
import { AuthorizationStepProps } from "@/types/workflow";
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

interface BankAuthorizationStepProps extends AuthorizationStepProps {
  institution?: string;
}

export function BankAuthorizationStep({
  authorisationUrl,
  institution,
}: BankAuthorizationStepProps) {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-left">Authorising with {institution}</h1>
      </div>
      
      <AuthorizationInterface
        url={authorisationUrl}
      />
      
      <FSCSDisclaimer />
    </div>
  );
}
