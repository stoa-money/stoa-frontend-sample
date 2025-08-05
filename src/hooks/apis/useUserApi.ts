import { BankAccount, Pot, UserDetails } from "@/types/types";
import { apiService } from "@/api/apiService";
import { useApi } from "@/lib/useApi";
import { CreateUserRequest } from "@/types/apiModel";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

export function useUserApi() {
  const { isLoading, withLoading, withLoadingAndRetry } = useApi();

  const createUser = async (payload: CreateUserRequest, token: string) => {
    return withLoading(() => apiService.createUser(payload, token));
  };

  const getUserDetails = async (
    token: string,
    retryCondition?: (userDetails: UserDetails | null) => boolean
  ): Promise<UserDetails | null> => {
    return withLoadingAndRetry(
      () => apiService.getUserDetails(token),
      MAX_RETRIES,
      BASE_DELAY,
      retryCondition
    );
  };

  const getUserPots = async (
    token: string,
    retryCondition?: (pots: Pot[]) => boolean
  ): Promise<Pot[]> => {
    return withLoadingAndRetry(
      () => apiService.getUserPots(token),
      MAX_RETRIES,
      BASE_DELAY,
      retryCondition
    );
  };

  const getUserBankAccount = async (
    token: string,
    retryCondition?: (bankAccount: BankAccount | null) => boolean
  ): Promise<BankAccount | null> => {
    return withLoadingAndRetry(
      () => apiService.getUserBankAccount(token),
      MAX_RETRIES,
      BASE_DELAY,
      retryCondition
    );
  };

  const linkAccount = async (
    bankId: string,
    token: string
  ): Promise<void> => {
    return withLoading(() => apiService.linkUserAccount(bankId, token));
  };

  const unlinkAccount = async (
    token: string
  ): Promise<void> => {
    return withLoading(() => apiService.unlinkUserAccount(token));
  };

  const startVerification = async (
    token: string
  ): Promise<void> => {
    return withLoading(() => apiService.startVerification(token));
  };

  return {
    isLoading,
    createUser,
    getUserDetails,
    getUserPots,
    getUserBankAccount,
    linkAccount,
    unlinkAccount,
    startVerification,
  };
}

export type UseUserApiReturn = ReturnType<typeof useUserApi>;
