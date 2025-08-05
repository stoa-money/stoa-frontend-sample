import { useState } from "react";
import { useRouter } from "next/router";
import { formatCurrency } from "@/lib/utils";
import { PotFactoryDetails, OfferType } from "@/types/types";
import Image from "next/image";

interface AvailablePotFactoryProps {
  potFactory: PotFactoryDetails;
}

export function AvailablePotFactory({ potFactory }: AvailablePotFactoryProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  // Determine display logic based on offers
  const isSubscription = potFactory.offers?.length === 1 && potFactory.offers?.[0]?.type === OfferType.Yearly;
  const isSingleOneOffOffer = potFactory.offers?.length === 1 && potFactory.offers?.[0]?.type === OfferType.OneOff;
  
  // Calculate pricing display
  let depositFeeText = "";
  let giftCardText = "";
  
  if (isSubscription) {
    // Subscription: Membership fee = minDeposit, Gift Card = offer.price
    depositFeeText = `Membership fee`;
    giftCardText = `Gift Card ${formatCurrency(potFactory.offers?.[0]?.price ?? 0, true)}`;
  } else if (isSingleOneOffOffer) {
    // Single one-off offer: Deposit (minDeposit), Gift Card (price)
    depositFeeText = `Deposit ${formatCurrency(potFactory.minDeposit, true)}`;
    giftCardText = `Gift Card ${formatCurrency(potFactory.offers?.[0]?.price ?? 0, true)}`;
  } else if (potFactory.offers?.length && potFactory.offers.length > 1) {
    // Multiple offers: show range
    const minOffer = potFactory.offers?.reduce((min, offer) => 
      offer.depositAmount < min.depositAmount ? offer : min
    );
    depositFeeText = `Deposit ${formatCurrency(minOffer.depositAmount, true)} per ${formatCurrency(minOffer.price, true)}`;
    giftCardText = `£${potFactory.minPrice}-${potFactory.maxPrice}`;
  } else {
    // Fallback to original logic
    depositFeeText = `Deposit ${formatCurrency(potFactory.minDeposit, true)} per 50`;
    giftCardText = `£${potFactory.minPrice}-${potFactory.maxPrice}`;
  }
  
  const handleClick = async () => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    await router.push(`/pots/${potFactory.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className={`group block cursor-pointer ${isNavigating ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="bg-white rounded-md p-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              loader={({ src }) => src}
              src={potFactory.logoUrl || ""}
              alt={`${potFactory.displayName} logo`}
              className="rounded-lg object-contain flex-shrink-0"
              width={48}
              height={48}
            />
            <div className="min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {potFactory.displayName}
              </h3>
              <p className="text-sm font-semibold text-gray-400 truncate">
                {depositFeeText}
              </p>
              {isSubscription && (
                <p className="text-sm font-semibold text-gray-400">
                  {formatCurrency(potFactory.minDeposit, true)}
                </p>
              )}
            </div>
          </div>
          
          <span className="bg-gray-700 text-white px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0">
            {giftCardText}
          </span>
        </div>
      </div>
    </div>
  );
}
