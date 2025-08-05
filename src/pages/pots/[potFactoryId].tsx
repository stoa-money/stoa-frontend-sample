import React, { useEffect } from "react";
import { GetServerSidePropsContext } from "next";
import { getAuth } from "@clerk/nextjs/server";
import {
  BankAccount,
  Pot,
  PotFactoryDetails,
  PotStatus,
  UserDetails,
  UserStatus,
} from "@/types/types";
import { apiService } from "@/api/apiService";
import { PotFlow } from "@/components/PotFlow";
import { useStepSetup } from "@/hooks/useStepSetup";
import { clerkClient } from "@clerk/nextjs/server";
import { useUserStore } from "@/store/userStore";

interface PotFlowPageProps {
  currentUserId?: string;
  currentUserDetails?: UserDetails;
  currentUserBankAccount?: BankAccount;
  potFactory: PotFactoryDetails;
  pot?: Pot;
}

export default function PotFlowPage({
  currentUserId,
  currentUserDetails,
  currentUserBankAccount,
  potFactory,
  pot,
}: PotFlowPageProps) {
  const { setUserBankAccount, setUserDetails, setUserId } = useUserStore();

  useEffect(() => {
    setUserId(currentUserId);
    setUserDetails(currentUserDetails);
    setUserBankAccount(currentUserBankAccount);
  }, []);

  const { steps } = useStepSetup({
    potFactory,
    potExists: !!pot,
    userExists: !!currentUserId,
    userVerificationRequired:
      currentUserDetails?.status === UserStatus.ReadyToVerify || currentUserDetails?.status === UserStatus.Draft,
    singleOffer: potFactory.offers?.length === 1,
    termsAccepted: pot?.termsAccepted,
    bankAccountLinked: !!currentUserBankAccount,
    potActive: pot?.status === PotStatus.Active,
  });

  return potFactory ? (
    <div className="max-w-7xl mx-auto antialiased">
      <PotFlow
        potFactory={potFactory}
        pot={pot}
        steps={steps}
      />
    </div>
  ) : (
    <div className="max-w-7xl mx-auto antialiased bg-slate-50">
      <h1>Something went wrong. Please try again later.</h1>
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
  const token = await getToken({ template: 'stoa-core-api-apim' });

  if (!token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const currentUserId = (user.publicMetadata as { stoaId?: string } | undefined)?.stoaId;
  const userRole = (user.publicMetadata as { role?: string } | undefined)?.role;

  let currentUserDetails: UserDetails | null = null;
  let userBankAccount: BankAccount | null = null;

  if(currentUserId) {
    currentUserDetails = await apiService.getUserDetails(token);
    userBankAccount = await apiService.getUserBankAccount(token);
  }
    
  const potFactoryId = context.query.potFactoryId as string;
  const potId = context.query.potId as string;

  const potFactory = await apiService.getPotFactoryDetails(potFactoryId, token);
  let pot = potId ? await apiService.getPot(potId, token) : null;

  if (pot?.userId !== currentUserId) {
    //TODO: handle on the API side
    pot = null;
  }

  return {
    props: {
      currentUserId,
      currentUserDetails: currentUserDetails ?? null,
      currentUserBankAccount: userBankAccount ?? null,
      potFactory,
      pot,
      userRole,
    },
  };
}
