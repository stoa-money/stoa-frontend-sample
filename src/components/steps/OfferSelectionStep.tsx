import { StepActionButton } from "@/components/StepActionButton";
import { StepProps } from "@/types/workflow";
import { PotFactoryOffer, PotFactoryDetails } from "@/types/types";
import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';
import Image from 'next/image';

interface OfferSelectionStepProps extends StepProps {
  potFactory: PotFactoryDetails;
  setSelectedOffer: (offer: PotFactoryOffer) => void;
}

export function OfferSelectionStep({
  isLoading,
  onAction,
  setSelectedOffer,
  potFactory,
}: OfferSelectionStepProps) {
  // Sort offers by price to ensure proper cycling
  const sortedOffers = [...(potFactory.offers || [])].sort((a, b) => a.price - b.price);
  
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const currentOffer = sortedOffers[currentOfferIndex];

  useEffect(() => {
    if (sortedOffers[0]) {
      setSelectedOffer(sortedOffers[0]);
    }
  }, []);

  useEffect(() => {
    if (currentOffer) {
      setSelectedOffer(currentOffer);
    }
  }, [currentOffer]);

  const handlePrevious = () => {
    setCurrentOfferIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentOfferIndex((prevIndex) => Math.min(sortedOffers.length - 1, prevIndex + 1));
  };

  if (!currentOffer) {
    return (
      <div className="max-w-4xl mx-auto text-center p-8 bg-white/80">
        <p className="text-gray-600">No offers available at this time</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto text-center p-8 bg-white/80">
      {/* Brand Logo */}
      <div className="flex justify-center mb-8">
        {potFactory.logoUrl ? (
          <div className="relative w-24 h-24">
            <Image
              src={potFactory.logoUrl}
              alt={`${potFactory.displayName} logo`}
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-400 text-xl font-bold">logo</span>
          </div>
        )}
      </div>
      
      {/* Title */}
      <h1 className="text-4xl text-left font-bold mb-8 leading-tight">
        Secure your {potFactory.displayName} gift card for free when you deposit safety with Stoa
      </h1>
      
      {/* Gift card section */}
      <div className="mb-12 text-left">
        <p className="text-xl text-gray-600 mb-6">Your gift card:</p>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentOfferIndex === 0}
            className="flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="text-2xl font-bold min-w-[120px] text-center">
            {formatCurrency(currentOffer.price)}
          </div>
          
          <button
            onClick={handleNext}
            disabled={currentOfferIndex === sortedOffers.length - 1}
            className="flex items-center justify-center w-10 h-10 rounded-2xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        <div className="mt-12">
          <p className="text-xl text-gray-700 mb-2">How to unlock:</p>
          <p className="text-2xl font-semibold mb-6">
            Deposit {formatCurrency(currentOffer.depositAmount, true)} into your Stoa Pot.
          </p>
          <p className="text-lg text-gray-600">
            That's all it takes to claim a {potFactory.displayName} gift card, without paying a penny.
          </p>
        </div>
      </div>
      
      {/* Start Button */}
      <div className="flex justify-center mb-12">
        <StepActionButton
          onClick={onAction}
          isLoading={isLoading}
          loadingText="Loading..."
          actionText="Start now"
        />
      </div>
      
      <FSCSDisclaimer />
    </div>
  );
}
