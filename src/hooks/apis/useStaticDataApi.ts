import {
  EmploymentStatus,
  Industry,
  Occupation,
  PaymentInstitution,
  SourceOfFunds,
} from "@/types/types";
import { apiService } from "@/api/apiService";
import { useApi } from "@/lib/useApi";

export function useStaticDataApi() {
  const { isLoading, withLoading } = useApi();

  const getPaymentInstitutions = async (token: string): Promise<PaymentInstitution[]> => {
    return withLoading(() => apiService.getPaymentInstitutions(token));
  };

  const getSourceOfFunds = async (token: string): Promise<SourceOfFunds[]> => {
    return withLoading(() => apiService.getSourceOfFunds(token));
  };

  const getEmploymentStatuses = async (token: string): Promise<EmploymentStatus[]> => {
    return withLoading(() => apiService.getEmploymentStatuses(token));
  };

  const getIndustries = async (token: string): Promise<Industry[]> => {
    return withLoading(() => apiService.getIndustries(token));
  };

  const getOccupations = async (industryId: string, token: string): Promise<Occupation[]> => {
    return withLoading(() => apiService.getOccupations(industryId, token));
  };

  return {
    isLoading,
    getPaymentInstitutions,
    getSourceOfFunds,
    getEmploymentStatuses,
    getIndustries,
    getOccupations,
  };
}
