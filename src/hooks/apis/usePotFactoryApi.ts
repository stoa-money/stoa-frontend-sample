import { PotFactoryDetails, PotFactoryOffer } from "@/types/types";
import { apiService } from "@/api/apiService";
import { useApi } from "@/lib/useApi";

const MAX_RETRIES = 5;
const BASE_DELAY = 1000;

export function usePotFactoryApi() {
  const { isLoading, withLoading, withLoadingAndRetry } = useApi();

  const getAvailablePotFactories = async (token: string): Promise<PotFactoryDetails[]> => {
    const potFactories = await withLoading(() => apiService.getPotFactories(token));
    return potFactories;
  };

  const getPotFactoryDetails = async (
    potFactoryId: string,
    token: string,
    retryCondition?: (potFactory: PotFactoryDetails | null) => boolean
  ): Promise<PotFactoryDetails | null> => {
    const details = await withLoadingAndRetry(
      () => apiService.getPotFactoryDetails(potFactoryId, token),
      MAX_RETRIES,
      BASE_DELAY,
      retryCondition
    );
    return details;
  };

  return {
    isLoading,
    getAvailablePotFactories,
    getPotFactoryDetails,
  };
}

export type UsePotFactoryApiReturn = ReturnType<typeof usePotFactoryApi>;
