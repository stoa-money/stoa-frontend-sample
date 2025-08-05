import { Pot, PotStatus } from "@/types/types";
import { PotFactoryDetails, OfferType } from "@/types/types";
import { formatCurrency } from "@/lib/utils";
import { Wallet, Gift } from "lucide-react";

interface UserStatsGridProps {
  userPots: Pot[];
  availablePotFactories: PotFactoryDetails[];
}

export function UserStatsGrid({ userPots, availablePotFactories }: UserStatsGridProps) {
  // Calculate total yearly rewards
  const totalYearlyRewards = userPots.filter(pot => pot.status === PotStatus.Active).reduce((acc: number, pot: Pot) => {
    switch (pot.offerType) {
      case OfferType.OneOff:
      case OfferType.Yearly:
        return acc + pot.price;
      case OfferType.Monthly:
        return acc + (pot.price * 12);
      case OfferType.Quarterly:
        return acc + (pot.price * 4);
      case OfferType.Evergreen:
        // Treat evergreen as yearly for calculation purposes
        return acc + pot.price;
      default:
        return acc;
    }
  }, 0);
  
  const userStats = {
    activePots: userPots.filter(pot => pot.status === PotStatus.Active).length,
    totalDeposited: userPots.filter(pot => pot.status === PotStatus.Active).reduce((acc: number, pot: Pot) => 
      acc + pot.depositAmount, 0
    ),
    availablePotFactories: availablePotFactories.length,
    totalYearlyRewards
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch">
      {/* Active Subscriptions - White background, narrower */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:w-1/3">
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {userStats.activePots}
        </div>
        <div className="text-sm text-gray-600">
          Active Pots
        </div>
      </div>
      
      {/* Balance cards - Same size as Active Subscriptions */}
      <div className="bg-gray-100 rounded-2xl p-6 flex-1 relative">
        <div className="text-sm text-gray-600 mb-1">Total Deposits</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(userStats.totalDeposited, true)}
        </div>
        <div className="absolute top-6 right-6 text-gray-400">
          <Wallet className="h-5 w-5" />
        </div>
      </div>
      
      <div className="bg-gray-100 rounded-2xl p-6 flex-1 relative">
        <div className="text-sm text-gray-600 mb-1">Total Yearly Rewards</div>
        <div className="text-2xl font-bold text-gray-900">
          {formatCurrency(userStats.totalYearlyRewards, true)}
        </div>
        <div className="absolute top-6 right-6 text-gray-400">
          <Gift className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
} 