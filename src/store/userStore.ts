import { BankAccount, UserDetails } from "@/types/types";
import { UserNotificationStatus, VerificationNotificationStatus } from "@/types/notification";
import { create } from "zustand";

interface UserStoreState {
  userId?: string;
  userBankAccount?: BankAccount;
  userDetails?: UserDetails;
  userNotificationStatus?: UserNotificationStatus | VerificationNotificationStatus;
  setUserId: (id?: string) => void;
  setUserBankAccount: (ba: BankAccount | undefined) => void;
  setUserDetails: (details: UserDetails | undefined) => void;
  setUserNotificationStatus: (
    status: UserNotificationStatus | VerificationNotificationStatus | undefined
  ) => void;
}

export const useUserStore = create<UserStoreState>((set) => ({
  userId: undefined,
  userDetails: undefined,
  userBankAccount: undefined,
  userNotificationStatus: undefined,
  setUserId: (id) => set({ userId: id }),
  setUserBankAccount: (ba) => set({ userBankAccount: ba }),
  setUserDetails: (details) => set({ userDetails: details }), 
  setUserNotificationStatus: (status) => set({ userNotificationStatus: status }),
})); 