import { useAuth } from "@clerk/nextjs";
import { apiService } from "@/api/apiService";
import { UserDetails, Pot, CardDetails, PotFactoryDetails, Deposit } from "@/types/types";

export function useAdminApi() {
  const { getToken } = useAuth();

  const getAuthToken = async (): Promise<string> => {
    const token = await getToken();
    if (!token) {
      throw new Error("No authentication token available");
    }
    return token;
  };

  const getUsers = async (): Promise<UserDetails[]> => {
    const token = await getAuthToken();
    return apiService.getAdminUsers(token);
  };

  const getPots = async (): Promise<Pot[]> => {
    const token = await getAuthToken();
    return apiService.getAdminPots(token);
  };

  const getCards = async (): Promise<CardDetails[]> => {
    const token = await getAuthToken();
    return apiService.getAdminCards(token);
  };

  const getPotFactories = async (): Promise<PotFactoryDetails[]> => {
    const token = await getAuthToken();
    return apiService.getAdminPotFactories(token);
  };

  const getDeposits = async (): Promise<Deposit[]> => {
    const token = await getAuthToken();
    return apiService.getAdminDeposits(token);
  };

  const getDepositsByPotFactory = async (potFactoryId: string): Promise<Deposit[]> => {
    const token = await getAuthToken();
    return apiService.getAdminDepositsByPotFactory(potFactoryId, token);
  };

  const getDepositsByPot = async (potId: string): Promise<Deposit[]> => {
    const token = await getAuthToken();
    return apiService.getAdminDepositsByPot(potId, token);
  };

  const getDepositsByUser = async (userId: string): Promise<Deposit[]> => {
    const token = await getAuthToken();
    return apiService.getAdminDepositsByUser(userId, token);
  };

  return {
    getUsers,
    getPots,
    getCards,
    getPotFactories,
    getDeposits,
    getDepositsByPotFactory,
    getDepositsByPot,
    getDepositsByUser,
  };
}