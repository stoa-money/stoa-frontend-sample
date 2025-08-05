import { Wallet, Unplug, AlertTriangle, Loader2 } from "lucide-react";
import { useUserApi } from "@/hooks/apis/useUserApi";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";

export function BankAccountPage() {
  const { unlinkAccount, isLoading } = useUserApi();
  const { userId, setUserBankAccount, userBankAccount } = useUserStore();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { getToken } = useAuth();

  const handleUnlinkAccount = async () => {
    if (!userId) return;

    try {
      const token = await getToken({ template: 'stoa-core-api-apim' });
      if (!token) return;
      await unlinkAccount(token);
      setUserBankAccount(undefined);
      setShowConfirmDialog(false);
      window.location.reload();

    } catch (error) {
      console.error("Failed to unlink account:", error);
    }
  };

  return (
    isLoading ? (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    ) : (
    <div className="space-y-8">
      {userBankAccount ? (
        <>
          {/* Connected Account Card */}
          <div className="card-elevated rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="icon-emerald shadow-sm">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Connected Account
                  </h3>
                  <p className="text-sm text-slate-600">
                    {userBankAccount.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowConfirmDialog(true)}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50"
              >
                <Unplug className="h-4 w-4" />
                Disconnect
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                  Account
                </p>
                <span className="text-sm text-slate-700 font-mono">
                  ••••••••{userBankAccount.accountNumber.slice(-4)}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                  Sort Code
                </p>
                <span className="text-sm text-slate-700 font-mono">
                  ••••{userBankAccount.sortCode.slice(-2)}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">
                  Status
                </p>
                <div
                  className={`w-fit ${
                    userBankAccount.status === 0
                      ? "bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-xs font-medium"
                      : "bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
                  }`}
                >
                  {userBankAccount.status === 0 ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="icon-red shadow-sm">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Confirm Disconnection
                  </h3>
                </div>
                <p className="text-slate-600 mb-6">
                  Are you sure you want to disconnect your bank account? You'll
                  need to reconnect it to make deposits or withdrawals.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUnlinkAccount}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Disconnecting..." : "Disconnect"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Bank Account Connected
          </h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            Connect your bank account when you create a pot to start
            making deposits and managing your investments.
          </p>
        </div>
      )}
    </div>
    )
  );
}
