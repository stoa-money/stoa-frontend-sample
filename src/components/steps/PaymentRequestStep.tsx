import { StepActionButton } from "@/components/StepActionButton";
import { StepProps } from "@/types/workflow";
import { BankAccount, PotFactoryDetails } from "@/types/types";
import { BanknoteArrowUp } from "lucide-react";
import { FSCSDisclaimer } from "@/components/FSCSDisclaimer";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

interface PaymentRequestStepProps extends StepProps {
  depositAmount?: number;
  userBankAccount?: BankAccount;
  potFactory: PotFactoryDetails;
}

export function PaymentRequestStep({
  isLoading,
  onAction,
  depositAmount,
  userBankAccount,
  potFactory,
}: PaymentRequestStepProps) {
  const institutionName = userBankAccount?.name || "your bank";

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-left">
          Review your details
        </h1>
        <p className="text-lg text-gray-600 text-left border-b border-gray-300 pb-8">
          Stoa has partnered with Yapily Connect to securely initiate movement
          of funds from your account at {institutionName}.
        </p>
      </div>

      <div className="space-y-8">
        {/* Deposit Amount */}
        <div className="flex items-center gap-4 mb-8">
          <BanknoteArrowUp className="h-8 w-8 m-2 text-green-400" />
          <div>
            <p className="text-gray-600">Deposit amount</p>
            <p className="text-2xl font-bold">
              {formatCurrency(depositAmount ?? 0)}
            </p>
          </div>
        </div>

        {/* Reward Section */}
        <div className="flex items-start gap-4">
          {potFactory.logoUrl ? (
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={potFactory.logoUrl}
                alt={`${potFactory.displayName} logo`}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-gray-500 font-bold text-sm">logo</span>
            </div>
          )}
          <div>
            <p className="text-gray-600 mb-1">Your reward:</p>
            <p className="text-lg font-semibold">{potFactory.displayName}</p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mb-12">
          <StepActionButton
            onClick={onAction}
            isLoading={isLoading}
            loadingText="Processing..."
            actionText="Continue"
          />
        </div>

        {/* FSCS Protection Notice */}
        <FSCSDisclaimer />
      </div>
    </div>
  );
}
