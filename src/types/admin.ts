// Admin API Types
export interface CardConfigTemplate {
  id: string;
  externalId: string;
}

export interface CreateCardConfigTemplateRequest {
  externalId: string;
}

export interface UpdateCardConfigTemplateRequest {
  id: string;
  externalId: string;
}

// Deposit Group Template Types
export interface DepositGroupTemplate {
  id: string;
  annualInterestRate: number;
  contingency?: number;
  withdrawalPeriod?: string; // TimeSpan as ISO 8601 duration string
  depositPeriod?: string; // TimeSpan as ISO 8601 duration string
  roundDepositUpToNearest: number;
  annual: boolean;
}

export interface CreateDepositGroupTemplateRequest {
  annualInterestRate: number;
  contingency?: number;
  withdrawalPeriod?: string;
  depositPeriod?: string;
  roundDepositUpToNearest: number;
  annual: boolean;
}

export interface UpdateDepositGroupTemplateRequest {
  id: string;
  annualInterestRate: number;
  contingency?: number;
  withdrawalPeriod?: string;
  depositPeriod?: string;
  roundDepositUpToNearest: number;
  annual: boolean;
}

// PotFactory Template Types
export interface PotFactoryTemplate {
  id: string;
  cardConfigTemplateId: string;
  depositGroupTemplateId: string;
  minDeposit: number;
  maxDeposit: number;
  depositCeiling: number;
  minPrice: number;
  maxPrice: number;
  upgradeable: boolean;
  downgradeable: boolean;
}

export interface CreatePotFactoryTemplateRequest {
  cardConfigTemplateId: string;
  depositGroupTemplateId: string;
  minDeposit: number;
  maxDeposit: number;
  depositCeiling: number;
  minPrice: number;
  maxPrice: number;
  upgradeable: boolean;
  downgradeable: boolean;
}

export interface UpdatePotFactoryTemplateRequest {
  id: string;
  minDeposit: number;
  maxDeposit: number;
  depositCeiling: number;
  minPrice: number;
  maxPrice: number;
  upgradeable: boolean;
  downgradeable: boolean;
} 