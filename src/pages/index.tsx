import { SignIn, SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useRef } from "react";
import { UserStatsGrid } from "@/components/UserStatsGrid";
import { AvailablePotFactories } from "@/components/AvailablePotFactories";
import { HeroSection } from "@/components/HeroSection";
import { ProtectionBanner } from "@/components/ProtectionBanner";
import { GreetingSection } from "@/components/GreetingSection";
import { ChoosePerksSection } from "@/components/ChoosePerksSection";
import { ProtectionFooter } from "@/components/ProtectionFooter";
import { PotFactoryDetails, Pot, BankAccount } from "@/types/types";
import { UserPotsList } from "@/components/UserPotsList";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { GetServerSidePropsContext } from "next";
import { apiService } from "@/api/apiService";

interface HomeProps {
  currentUserPots: Pot[];
  availablePotFactories: PotFactoryDetails[];
}

export default function Home({
  currentUserPots,
  availablePotFactories,
}: HomeProps) {
  const router = useRouter();
  const availablePotsRef = useRef<HTMLDivElement>(null);

  const scrollToAvailablePots = () => {
    availablePotsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <SignIn routing="hash" />
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="space-y-0">
          {/* Hero Section */}
          <HeroSection onBrowsePots={scrollToAvailablePots} />

          {/* Protection Banner */}
          <ProtectionBanner />

          {/* Greeting Section */}
          <GreetingSection />

          {/* Stats Grid */}
          {currentUserPots.length > 0 && (
            <div className="pb-12">
              <div className="max-w-7xl mx-auto px-6">
                <UserStatsGrid
                  userPots={currentUserPots}
                  availablePotFactories={availablePotFactories}
                />
              </div>
            </div>
          )}
          
          {/* User Pots List */}
          <div className="pb-12">
            <div className="max-w-7xl mx-auto px-6">
              <UserPotsList
                pots={currentUserPots}
                onPotClick={(potId) => {
                  const pot = currentUserPots.find((p) => p.id === potId);
                  if (pot) {
                    router.push(`/pots/${pot.potFactoryId}?potId=${pot.id}`);
                  }
                }}
              />
            </div>
          </div>

          {/* Choose Your Perks Section */}
          <ChoosePerksSection />

          {/* Available PotFactories */}
          <div ref={availablePotsRef} className="py-12">
            <div className="max-w-7xl mx-auto px-6">
              <AvailablePotFactories
                potFactories={availablePotFactories}
                isLoading={false}
                showSearch={true}
              />
            </div>
          </div>
        </div>

        {/* Protection Footer - Only on home page */}
        <ProtectionFooter />
      </SignedIn>
    </>
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
  const token = await getToken({ template: "stoa-core-api-apim" });

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userRole = (user.publicMetadata as { role?: string } | undefined)?.role;
  const systemAdmin = (user.privateMetadata as { systemAdmin?: string } | undefined)?.systemAdmin === "true";
  const stoaId = (user.publicMetadata as { stoaId?: string } | undefined)?.stoaId;

  console.log("\n auth token \n\n", token);
  console.log("\n");

  const potFactories = (await apiService.getPotFactories(token)) ?? [];

  let pots: Pot[] = [];
  let userBankAccount: BankAccount | null = null;

  if(stoaId) {
    pots = (await apiService.getUserPots(token)) ?? [];
    userBankAccount = (await apiService.getUserBankAccount(token)) ?? null;
  }

  return {
    props: {
      currentUserPots: pots,
      availablePotFactories: potFactories,
      userRole,
      userBankAccount,
      systemAdmin,
    },
  };
}
