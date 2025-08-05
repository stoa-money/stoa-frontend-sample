import { StepActionButton } from "@/components/StepActionButton";
import { StepProps } from "@/types/workflow";
import { OfferTypeMetadata, PotFactoryOffer, PotFactoryDetails } from "@/types/types";
import { formatCurrency } from "@/lib/utils";
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';
import Image from 'next/image';
import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";

interface OfferReviewStepProps extends StepProps {
  selectedOffer?: PotFactoryOffer;
  potFactory: PotFactoryDetails;
  setSelectedOffer: (offer: PotFactoryOffer) => void;
}

export function OfferReviewStep({
  isLoading,
  onAction,
  selectedOffer,
  potFactory,
  setSelectedOffer,
}: OfferReviewStepProps) {
  const [isExistingUser, setIsExistingUser] = useState(false);

  const getOfferTypeInfo = () => {
    if (!selectedOffer) return null;
    return OfferTypeMetadata[selectedOffer.type];
  };

  const handleContinue = () => {
    if (selectedOffer) {
      // Update the selectedOffer with isNewMerchantUser
      setSelectedOffer({
        ...selectedOffer,
        isNewMerchantUser: !isExistingUser
      });
    }
    onAction();
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      {/* Header */}
      <div className="text-left mb-8">
        <h1 className="text-4xl font-bold mb-2">Review your selection</h1>
        <p className="text-lg text-gray-600">Confirm your selection to proceed</p>
      </div>

      {selectedOffer && (
        <div className="space-y-8">
          {/* Brand Logo and Title */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
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
                <span className="text-6xl font-bold text-gray-400">logo</span>
              )}
            </div>
            <h2 className="text-3xl font-semibold mb-6 text-center">{potFactory.displayName}</h2>
            
            {/* Reward Section */}
            <div className="space-y-4 px-12 mx-auto">
              <p className="text-gray-600">Your reward:</p>
              <p className="text-2xl font-medium">
                {potFactory.displayName} <span className="text-green-600">Free</span> {formatCurrency(selectedOffer.price)} {getOfferTypeInfo()?.label} Reward
              </p>
              
              <p className="text-gray-600 mt-6">How to unlock:</p>
              <p className="text-2xl font-medium">
                Deposit {formatCurrency(selectedOffer.depositAmount, true)} into your {potFactory.displayName} Stoa Pot.
              </p>
              
              <p className="text-gray-600 mt-4">
                That's all it takes to enjoy {potFactory.displayName} reward.
              </p>
            </div>
          </div>

          {/* Existing User Checkbox */}
          <div className="flex items-center space-x-2 mt-8 px-12">
            <Checkbox
              id="existing-user"
              checked={isExistingUser}
              onCheckedChange={(checked) => setIsExistingUser(checked as boolean)}
            />
            <label
              htmlFor="existing-user"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I am an existing customer
            </label>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-center mt-12 mb-12">
        <StepActionButton
          onClick={handleContinue}
          isLoading={isLoading}
          loadingText="Processing..."
          actionText="Continue"
        />
      </div>

      {/* FSCS Protection Notice */}
      <FSCSDisclaimer />
    </div>
  );
}
