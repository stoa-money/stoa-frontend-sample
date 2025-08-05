import { UserPot } from "./UserPot";
import { Pot, PotStatus } from "@/types/types";
import { apiService } from "@/api/apiService";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";

interface UserPotsListProps {
  pots: Pot[];
  onPotClick: (potId: string) => void;
  onPotsUpdate?: () => void;
}

export function UserPotsList({ pots, onPotClick, onPotsUpdate }: UserPotsListProps) {
  const { getToken } = useAuth();
  const [abandoningPotId, setAbandoningPotId] = useState<string | null>(null);
  const [localPots, setLocalPots] = useState<Pot[]>(pots);

  // Update local pots when props change
  useEffect(() => {
    setLocalPots(pots);
  }, [pots]);

  if (!localPots || localPots.length === 0) {
    return;
  }

  // Separate pots into active and pending
  const activePots = localPots.filter(pot => pot.status === PotStatus.Active);
  const pendingPots = localPots.filter(pot => 
    pot.status === PotStatus.ReadyToDeposit || 
    pot.status === PotStatus.DepositInitiated ||
    pot.status === PotStatus.DepositFailed
  );

  const handleAbandonPot = async (potId: string) => {
    try {
      setAbandoningPotId(potId);
      
      // Optimistically remove the pot from the list
      setLocalPots(prevPots => prevPots.filter(pot => pot.id !== potId));
      
      const token = await getToken({ template: 'stoa-core-api-apim' });
      if (!token) {
        // Restore the pot if we can't get a token
        setLocalPots(pots);
        return;
      }
      
      await apiService.abandonPot(potId, token);
      
      // Refresh the pots list from server to ensure consistency
      if (onPotsUpdate) {
        onPotsUpdate();
      }
    } catch (error) {
      console.error("Failed to abandon pot:", error);
      // Restore the original list on error
      setLocalPots(pots);
    } finally {
      setAbandoningPotId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Active Pots Section */}
      {activePots.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Active Pots</h3>
          <div className="space-y-3">
            {activePots.map((pot) => (
              <UserPot key={pot.id} pot={pot} onPotClick={onPotClick} />
            ))}
          </div>
        </div>
      )}

      {/* Pending Pots Section */}
      {pendingPots.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Pending Pots</h3>
          <div className="space-y-3">
            {pendingPots.map((pot) => (
              <UserPot 
                key={pot.id} 
                pot={pot} 
                onPotClick={onPotClick} 
                onAbandonPot={handleAbandonPot}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}