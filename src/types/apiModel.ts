import { Address } from "./types";

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: string; // Date in "yyyy-MM-dd" format
  address: Address;
  nationality: string;
  employmentStatus: string;
  occupation: string;
  industry: string;
  taxResidency: string;
  taxId: string;
  annualIncome: number;
  sourceOfFunds: string[];
}

export interface CreatePotRequest {
  potFactoryId: string;
  depositAmount: number;
  price: number;
  isNewMerchantUser?: boolean;
}

export interface DepositRequest {
  amount: number;
}

export interface SendFundsRequest {
  amount: number;
  fromInstitutionId: string;
  userId: string;
}