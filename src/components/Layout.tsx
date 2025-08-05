import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { UserButton, SignedIn, useUser } from "@clerk/nextjs";
import { Unlink2, Users, Wallet, DollarSign, PiggyBank, Menu, Home, Recycle } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { BankAccountPage } from "@/components/BankAccountPage";
import { Footer } from "@/components/Footer";
import { BankAccount } from "@/types/types";

interface LayoutProps {
  children: ReactNode;
  userRole?: string;
  userBankAccount: BankAccount | null;
  systemAdmin: boolean;
}

export default function Layout({ children, userRole, userBankAccount, systemAdmin }: LayoutProps) {
  const router = useRouter();
  const { user } = useUser();
  const { userId, setUserId, setUserBankAccount } = useUserStore();

  useEffect(() => {
    if (!user) return;
  
    const clerkStoaId = user.publicMetadata.stoaId as string | undefined;
  
    if (!userId && clerkStoaId) {
      setUserId(clerkStoaId);
      if (userBankAccount) {
        setUserBankAccount(userBankAccount);
      }
      return;
    }
  }, [user, userId, setUserId]);

  // Clear stoaId from Clerk's publicMetadata via API
  const handleClearStoaId = async () => {
    try {
      const response = await fetch('/api/set-stoa-id', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stoaId: null }),
      });

      if (response.ok) {
        // Clear local state
        setUserId(undefined);
        setUserBankAccount(undefined);
        
        // Reload the page to refresh user data from Clerk
        window.location.reload();
      } else {
        const error = await response.json();
        console.error('Failed to clear Stoa ID:', error);
        alert('Failed to clear Stoa ID. Please try again.');
      }
    } catch (error) {
      console.error('Error clearing Stoa ID:', error);
      alert('An error occurred while clearing Stoa ID. Please try again.');
    }
  };

  const links = userRole === "admin" 
    ? [
        { href: "/admin", label: "Home", icon: Home },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/pots", label: "Pots", icon: Wallet },
        { href: "/admin/deposits", label: "Deposits", icon: DollarSign },
        { href: "/admin/potfactories", label: "Stoa Pots", icon: PiggyBank },
      ]
    : [];

  return (
    <div className="min-h-screen bg-stoa-gray flex flex-col">
      <nav className="top-0 z-50 bg-stoa-gray">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img src="/stoa.svg" alt="Stoa" className="h-10" />
            </Link>

            {/* Desktop Navigation - Centered */}
            <SignedIn>
              <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
                {links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 text-sm font-medium transition-all duration-200 relative",
                      router.pathname === l.href 
                        ? "text-slate-900" 
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <l.icon className="h-4 w-4" />
                    {l.label}
                    {router.pathname === l.href && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                    )}
                  </Link>
                ))}
              </nav>
            </SignedIn>

            {/* Right side - User button and mobile menu */}
            <div className="flex items-center gap-4">
              <SignedIn>
                <div className="flex items-center gap-3">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium text-slate-900">{user?.firstName}</p>
                  </div>
                  <UserButton>
                    <UserButton.UserProfilePage 
                      label="Bank Account" 
                      url="bank-account" 
                      labelIcon={<Wallet className="h-4 w-4" />}
                    >
                      <BankAccountPage />
                    </UserButton.UserProfilePage>
                  </UserButton>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="max-w-7xl mx-auto py-8">
            {children}
          </div>
        </div>
      </main>
      
      {/* Footer - Always at bottom */}
      <Footer />

      {/* Floating Delete Button */}
      <SignedIn>
        {userId && systemAdmin ? (
          <button
            onClick={handleClearStoaId}
            className="fixed bottom-6 right-6 p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50 group"
            title="Clear Stoa ID"
          >
            <Recycle className="h-5 w-5" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Clear Stoa ID
            </span>
          </button>
        ) : null}
      </SignedIn>
    </div>
  );
} 