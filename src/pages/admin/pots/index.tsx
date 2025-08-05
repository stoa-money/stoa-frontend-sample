import { GetServerSidePropsContext } from "next";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { apiService } from "@/api/apiService";
import { OfferTypeMetadata, Pot, PotStatus, CardDetails, CardStatus } from "@/types/types";
import { useState, useMemo, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/router";
import {
  Search,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Package,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Shield,
} from "lucide-react";

interface AdminPotsPageProps {
  pots: Pot[];
  cards: CardDetails[];
  error?: string;
  userRole: string;
  systemAdmin: boolean;
}

const statusConfig = {
  [PotStatus.Draft]: {
    label: "Draft",
    icon: Clock,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  [PotStatus.ReadyToDeposit]: {
    label: "Ready to Deposit",
    icon: AlertCircle,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [PotStatus.DepositInitiated]: {
    label: "Deposit Initiated",
    icon: RefreshCw,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [PotStatus.DepositFailed]: {
    label: "Deposit Failed",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  [PotStatus.DepositCompleted]: {
    label: "Deposit Completed",
    icon: CheckCircle,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [PotStatus.WithdrawalInitiated]: {
    label: "Withdrawal Initiated",
    icon: RefreshCw,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  [PotStatus.WithdrawalCompleted]: {
    label: "Withdrawal Completed",
    icon: CheckCircle,
    color: "bg-purple-50 text-purple-700 border-purple-200",
  },
  [PotStatus.WithdrawalFailed]: {
    label: "Withdrawal Failed",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  [PotStatus.Active]: {
    label: "Active",
    icon: CheckCircle,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  [PotStatus.Inactive]: {
    label: "Inactive",
    icon: XCircle,
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  [PotStatus.Closed]: {
    label: "Closed",
    icon: Package,
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  [PotStatus.Abandoned]: {
    label: "Abandoned",
    icon: XCircle,
    color: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

const cardStatusConfig = {
  [CardStatus.Pending]: {
    label: "Pending",
    icon: Clock,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  [CardStatus.Scheduled]: {
    label: "Scheduled",
    icon: Clock,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [CardStatus.Processing]: {
    label: "Processing",
    icon: RefreshCw,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [CardStatus.Active]: {
    label: "Active",
    icon: CheckCircle,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  [CardStatus.Frozen]: {
    label: "Frozen",
    icon: Shield,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  [CardStatus.Expired]: {
    label: "Expired",
    icon: XCircle,
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  [CardStatus.Cancelled]: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  [CardStatus.Archived]: {
    label: "Archived",
    icon: Package,
    color: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

export default function AdminPotsPage({ pots, cards, error }: AdminPotsPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<PotStatus | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "depositAmount" | "status">("createdAt");
  const [expandedPotId, setExpandedPotId] = useState<string | null>(null);
  const [activatingCard, setActivatingCard] = useState<string | null>(null);
  const [activationForm, setActivationForm] = useState<{ cardId: string; externalId: string; code: string } | null>(null);
  const { getToken } = useAuth();
  const router = useRouter();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPots = pots.length;
    const activePots = pots.filter(p => p.status === PotStatus.Active).length;
    const totalDeposits = pots
      .filter(p => p.status === PotStatus.Active)
      .reduce((sum, p) => sum + p.depositAmount, 0);
    const pendingDeposits = pots.filter(
      p => p.status === PotStatus.ReadyToDeposit || p.status === PotStatus.DepositInitiated
    ).length;

    return { totalPots, activePots, totalDeposits, pendingDeposits };
  }, [pots]);

  // Handle card activation
  const handleActivateCard = useCallback(async () => {
    if (!activationForm) return;
    
    try {
      setActivatingCard(activationForm.cardId);
      const token = await getToken({ template: 'stoa-core-api-apim' });
      if (!token) {
        throw new Error('No token available');
      }
      
      await apiService.activateCard(
        activationForm.cardId, 
        activationForm.externalId, 
        activationForm.code, 
        token
      );
      
      // Refresh the page to show updated card status
      router.reload();
    } catch (error) {
      console.error('Error activating card:', error);
      alert('Failed to activate card. Please try again.');
    } finally {
      setActivatingCard(null);
      setActivationForm(null);
    }
  }, [activationForm, getToken, router]);

  // Filter and sort pots
  const filteredPots = useMemo(() => {
    let filtered = pots;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        pot =>
          pot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pot.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pot.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== null) {
      filtered = filtered.filter(pot => pot.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "depositAmount":
          return b.depositAmount - a.depositAmount;
        case "status":
          return a.status - b.status;
        case "createdAt":
        default:
          // Sort by ID as a proxy for creation date
          return b.id.localeCompare(a.id);
      }
    });

    return filtered;
  }, [pots, searchTerm, statusFilter, sortBy]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Pots</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
          Stoa Pot Analytics
        </h1>
        <p className="text-muted-foreground">
          Monitor Stoa Pots performance and User statistics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pots</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPots}</p>
            </div>
            <Package className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Pots</p>
              <p className="text-2xl font-bold text-green-600">{stats.activePots}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposits</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalDeposits)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Deposits</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingDeposits}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by pot name, user ID, or pot ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter ?? ""}
            onChange={(e) => setStatusFilter(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {Object.entries(statusConfig).map(([status, config]) => (
              <option key={status} value={status}>{config.label}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="createdAt">Sort by Date</option>
            <option value="depositAmount">Sort by Amount</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Pots Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pot Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPots.map((pot) => {
                const config = statusConfig[pot.status as keyof typeof statusConfig] || {
                  label: "Unknown",
                  icon: AlertCircle,
                  color: "bg-gray-100 text-gray-700 border-gray-200",
                };
                const StatusIcon = config.icon;
                const potCards = cards.filter(card => card.potId === pot.id);
                
                return (
                  <>
                    <tr key={pot.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{pot.name}</div>
                          <div className="text-sm text-gray-500">{pot.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{pot.userId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(pot.depositAmount)}
                          </div>
                          <div className="text-sm text-gray-500">
                            Reward: {formatCurrency(pot.price)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {OfferTypeMetadata[pot.offerType].label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {pot.status === PotStatus.Active && (
                          <button
                            onClick={() => setExpandedPotId(expandedPotId === pot.id ? null : pot.id)}
                            className="text-purple-600 hover:text-purple-800 transition-colors"
                          >
                            {expandedPotId === pot.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    {pot.status === PotStatus.Active && expandedPotId === pot.id && (
                      <tr key={`${pot.id}-cards`} className="bg-gray-50">
                        <td colSpan={6} className="px-6 py-4 border-t-0">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                              <CreditCard className="h-4 w-4" />
                              <span>Card Details</span>
                            </div>
                            {potCards.length > 0 ? (
                              <div className="space-y-2">
                                {potCards.map((card) => {
                                  const cardConfig = cardStatusConfig[card.status as keyof typeof cardStatusConfig] || {
                                    label: "Unknown",
                                    icon: AlertCircle,
                                    color: "bg-gray-100 text-gray-700 border-gray-200",
                                  };
                                  const CardIcon = cardConfig.icon;
                                  
                                  return (
                                    <div key={card.id} className="bg-white rounded-lg p-4 border border-gray-200">
                                      <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                          <div className="text-sm font-medium text-gray-900">
                                            Card ID: {card.id}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            Code: {card.code || "N/A"}
                                          </div>
                                          {card.externalId && (
                                            <div className="text-xs text-gray-500">
                                              External ID: {card.externalId}
                                            </div>
                                          )}
                                          {card.expiryDate && (
                                            <div className="text-xs text-gray-500">
                                              Expires: {new Date(card.expiryDate).toLocaleDateString()}
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cardConfig.color}`}>
                                            <CardIcon className="h-3 w-3" />
                                            {cardConfig.label}
                                          </span>
                                          {card.status !== CardStatus.Active && (
                                            <button
                                              onClick={() => setActivationForm({ cardId: card.id, externalId: '', code: '' })}
                                              disabled={activatingCard === card.id}
                                              className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                              {activatingCard === card.id ? "Activating..." : "Activate"}
                                            </button>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic">
                                No cards found for this pot
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredPots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No pots found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Activation Form Modal */}
      {activationForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 shadow-sm">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Activate Card
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Enter the external ID and activation code to activate this card.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleActivateCard();
            }}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="externalId" className="block text-sm font-medium text-slate-700 mb-1.5">
                    External ID
                  </label>
                  <input
                    type="text"
                    id="externalId"
                    value={activationForm.externalId}
                    onChange={(e) => setActivationForm({ ...activationForm, externalId: e.target.value })}
                    className="w-full px-3 py-2 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-slate-400"
                    placeholder="Enter external ID"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Activation Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={activationForm.code}
                    onChange={(e) => setActivationForm({ ...activationForm, code: e.target.value })}
                    className="w-full px-3 py-2 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder:text-slate-400"
                    placeholder="Enter activation code"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setActivationForm(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={activatingCard !== null}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {activatingCard !== null ? "Activating..." : "Activate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { userId, getToken } = getAuth(context.req);
  if (!userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const userRole = (user.publicMetadata as { role?: string } | undefined)?.role;
  const systemAdmin = (user.privateMetadata as { systemAdmin?: string } | undefined)?.systemAdmin === "true";

  // Redirect non-admin users
  if (userRole !== 'admin') {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    const token = await getToken({ template: 'stoa-core-api-apim' });
    if (!token) {
      throw new Error('No token available');
    }

    const [pots, cards] = await Promise.all([
      apiService.getAdminPots(token),
      apiService.getAdminCards(token)
    ]);

    return {
      props: {
        pots: pots || [],
        cards: cards || [],
        userRole,
        systemAdmin,
      },
    };
  } catch (error) {
    console.error('Error fetching pots:', error);
    return {
      props: {
        pots: [],
        cards: [],
        userRole,
        systemAdmin,
        error: 'Failed to load pots data',
      },
    };
  }
}