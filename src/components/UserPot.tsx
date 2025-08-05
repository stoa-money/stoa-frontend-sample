import { ChevronRight, Trash2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import {
  Pot,
  PotStatus,
} from "@/types/types";
import { useState } from "react";

interface UserPotProps {
  pot: Pot;
  onPotClick: (potId: string) => void;
  onAbandonPot?: (potId: string) => void;
}

export function UserPot({
  pot,
  onPotClick,
  onAbandonPot,
}: UserPotProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const getStatusConfig = (status: PotStatus) => {
    switch (status) {
      case PotStatus.Active:
        return { color: "bg-emerald-500", label: "Active" };
      case PotStatus.ReadyToDeposit:
      case PotStatus.DepositInitiated:
        return { color: "bg-orange-500", label: "Complete your deposit" };
      case PotStatus.DepositFailed:
        return { color: "bg-red-500", label: "Deposit Failed" };
      case PotStatus.Closed:
        return { color: "bg-slate-400", label: "Closed" };
      default:
        return { color: "bg-slate-400", label: "Unknown" };
    }
  };

  const canNavigate = (status: PotStatus) => {
    return (
      status === PotStatus.ReadyToDeposit ||
      status === PotStatus.DepositInitiated
    );
  };

  const isPending = (status: PotStatus) => {
    return (
      status === PotStatus.ReadyToDeposit ||
      status === PotStatus.DepositInitiated ||
      status === PotStatus.DepositFailed
    );
  };

  const expiryDate = pot.expiryDate
  ? new Date(pot.expiryDate)
  : null;

  const statusConfig = getStatusConfig(pot.status);
  const canNavigateToPot = canNavigate(pot.status);
  const isPendingPot = isPending(pot.status);

  return (
    <div className="group relative">
      <div
        className={`relative bg-white rounded-md p-4 ${isPendingPot ? 'pb-10 md:pb-4' : ''} hover:shadow-md transition-all duration-300 ${
          canNavigateToPot ? "cursor-pointer" : ""
        }`}
        onClick={
          canNavigateToPot
            ? () => onPotClick(pot.id)
            : undefined
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name & status */}
          <div className="flex items-center justify-center md:justify-start gap-3">
            {/* Always show dot in front */}
            <span className={`w-2 h-2 rounded-full ${statusConfig.color} flex-shrink-0`}></span>
            
            <span className="text-lg font-semibold text-gray-900 group-hover:text-stoa-purple">
              {pot.name}
            </span>
            
            {/* Show badge for non-active statuses */}
            {pot.status !== PotStatus.Active && (
              <span
                title={statusConfig.label}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-[2px] flex-shrink-0"
              >
                <span className="text-xs font-medium text-gray-600">
                  {statusConfig.label}
                </span>
              </span>
            )}
          </div>

          {/* Metrics */}
          <div className="flex items-center justify-center md:justify-end">
            <div className="flex items-center gap-4">
              {/* Deposit */}
              <div className="text-center md:text-right">
                <p className="text-xs font-semibold text-gray-500">
                  Deposit
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {formatCurrency(pot.depositAmount, true)}
                </p>
              </div>

              {/* Reward */}
              <div className="text-center md:text-right">
                <p className="text-xs font-semibold text-gray-500">
                  Reward
                </p>
                <p className="text-base font-semibold text-stoa-purple">
                  {formatCurrency(pot.price)}
                </p>
              </div>
            </div>

            {/* Arrow */}
            {canNavigateToPot && (
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-stoa-purple ml-4" />
            )}
          </div>
        </div>
      </div>
      
      {/* Abandon button - shows for pending pots */}
      {isPendingPot && onAbandonPot && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowConfirmation(true);
          }}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:-right-10 md:top-1/2 md:-translate-y-1/2 p-2 transition-colors duration-200"
          title="Abandon pot"
        >
          <Trash2 className="h-4 w-4 text-red-500 hover:text-red-600" />
        </button>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Remove Pot
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to remove this pot?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onAbandonPot) {
                    onAbandonPot(pot.id);
                  }
                  setShowConfirmation(false);
                }}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
