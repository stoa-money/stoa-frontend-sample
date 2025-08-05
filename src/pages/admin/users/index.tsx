import { GetServerSidePropsContext } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { apiService } from "@/api/apiService";
import { UserDetails, UserStatus } from "@/types/types";
import { useState, useMemo } from "react";
import {
  Search,
  Mail,
  Phone,
  User,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  AlertCircle,
  Users,
  Calendar,
  Activity,
} from "lucide-react";

interface UsersPageProps {
  users: UserDetails[];
  error?: string;
  userRole: string;
  systemAdmin: boolean;
}

const statusConfig = {
  [UserStatus.Draft]: {
    label: "Draft",
    icon: Clock,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  [UserStatus.ReadyToVerify]: {
    label: "Ready to Verify",
    icon: AlertCircle,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  [UserStatus.VerificationInProgress]: {
    label: "Verifying",
    icon: Clock,
    color: "bg-blue-50 text-blue-700 border-blue-200",
  },
  [UserStatus.Verified]: {
    label: "Verified",
    icon: Shield,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  [UserStatus.Rejected]: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-50 text-red-700 border-red-200",
  },
  [UserStatus.Active]: {
    label: "Active",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-700 border-green-200",
  },
  [UserStatus.ReadyToDeposit]: {
    label: "Ready to Deposit",
    icon: CheckCircle2,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  [UserStatus.Suspended]: {
    label: "Suspended",
    icon: AlertCircle,
    color: "bg-orange-50 text-orange-700 border-orange-200",
  },
  [UserStatus.Inactive]: {
    label: "Inactive",
    icon: XCircle,
    color: "bg-gray-100 text-gray-600 border-gray-200",
  },
  [UserStatus.Archived]: {
    label: "Archived",
    icon: XCircle,
    color: "bg-gray-50 text-gray-500 border-gray-200",
  },
};

export default function UsersPage({ users, error }: UsersPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | null>(null);
  const [sortBy, setSortBy] = useState<"createdAt" | "name" | "status">("createdAt");

  // Calculate statistics
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => 
      u.status === UserStatus.Active || u.status === UserStatus.ReadyToDeposit
    ).length;
    const verifiedUsers = users.filter(u => u.status === UserStatus.Verified).length;
    const pendingUsers = users.filter(u => 
      u.status === UserStatus.ReadyToVerify || u.status === UserStatus.VerificationInProgress
    ).length;

    return { totalUsers, activeUsers, verifiedUsers, pendingUsers };
  }, [users]);

  // Filter and sort users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        user =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== null) {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "status":
          return a.status - b.status;
        case "createdAt":
        default:
          // Sort by ID as a proxy for creation date
          return b.id.localeCompare(a.id);
      }
    });

    return filtered;
  }, [users, searchTerm, statusFilter, sortBy]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
          User Analytics
        </h1>
        <p className="text-muted-foreground">
          Monitor and manage platform users
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <Activity className="h-8 w-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Verified Users</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.verifiedUsers}</p>
            </div>
            <Shield className="h-8 w-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Verification</p>
              <p className="text-2xl font-bold text-amber-600">{stats.pendingUsers}</p>
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
                placeholder="Search by name, email, or user ID..."
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
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Information
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const config = statusConfig[user.status as keyof typeof statusConfig] || {
                  label: "Unknown",
                  icon: AlertCircle,
                  color: "bg-gray-100 text-gray-700 border-gray-200",
                };
                const StatusIcon = config.icon;
                
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <div>{user.address.addressLine1}</div>
                          {user.address.addressLine2 && (
                            <div className="text-gray-500">{user.address.addressLine2}</div>
                          )}
                          <div className="text-gray-500">
                            {user.address.city}, {user.address.postCode}
                          </div>
                          <div className="text-gray-500">{user.address.country}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found matching your criteria.</p>
          </div>
        )}
      </div>
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

    const users = await apiService.getAdminUsers(token);

    return {
      props: {
        users: users || [],
        userRole,
        systemAdmin,
      },
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      props: {
        users: [],
        userRole,
        systemAdmin,
        error: 'Failed to load users data',
      },
    };
  }
}