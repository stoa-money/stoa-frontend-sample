import { apiService } from "@/api/apiService";
import { PotFactoryOffer, Pot } from "@/types/types";
import { useApi } from "@/lib/useApi";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

export function usePotApi() {
  const { isLoading, withLoading, withLoadingAndRetry } = useApi();

  const createPot = async (offer: PotFactoryOffer, token: string) => {
    return withLoading(() =>
      apiService.createPot({
        potFactoryId: offer.potFactoryId,
        depositAmount: offer.depositAmount,
        price: offer.price,
        isNewMerchantUser: offer.isNewMerchantUser,
      }, token)
    );
  };

  const getPot = async (
    potId: string,
    token: string,
    retryCondition: (sub: Pot | null) => boolean
  ): Promise<Pot | null> => {
    return withLoadingAndRetry(
      () => apiService.getPot(potId, token),
      MAX_RETRIES,
      BASE_DELAY,
      retryCondition
    );
  };

  const acceptTerms = async (potId: string, token: string): Promise<void> => {
    if (!potId) throw new Error("Pot ID is required");

    return withLoading(() =>
      apiService.acceptPotTerms(potId, token)
    );
  };

  const deposit = async (
    potId: string,
    amount: number,
    token: string
  ): Promise<void> => {
    if (!potId) throw new Error("Pot ID is required");

    return withLoading(() =>
      apiService.depositToPot(potId, amount, token)
    );
  };

  const sendFunds = async (
    potId: string,
    amount: number,
    token: string
  ): Promise<void> => {
    if (!potId) throw new Error("Pot ID is required");

    return withLoading(() =>
      apiService.sendFundsToPot(potId, amount, token)
    );
  };

  return {
    isLoading,
    createPot,
    getPot,
    acceptTerms,
    deposit,
    sendFunds,
  };
}

export type UsePotApiReturn = ReturnType<typeof usePotApi>;
