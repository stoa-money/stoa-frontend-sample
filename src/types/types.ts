export interface PotFactoryDetails {
  id: string;
  displayName: string;
  code: string;
  url: string;
  category: Category;
  startAcceptingDepositsFromUtc: Date;
  stopAcceptingDepositsFromUtc: Date | null;
  minDeposit: number;
  maxDeposit: number;
  minPrice: number;
  maxPrice: number;
  depositPeriod: number;
  tier: PotFactoryTier;
  tags: Tag;
  logoUrl?: string;
  offers?: PotFactoryOffer[];
}

export enum PotFactoryTier {
  Standard = 1,
  Premium = 2,
  Enterprise = 3
}

export enum Tag {
  None = 0,
  Promoted = 1,
  Featured = 2,
  New = 4,
  ComingSoon = 8
}

export interface Category {
  name: string;
  description: string;
}

export interface PotFactoryOffer {
  id: string;
  potFactoryId: string;
  depositAmount: number;
  price: number;
  type: OfferType;
  tags: Tag;
  expiryDate: Date | null;
  isNewMerchantUser?: boolean;
}

export enum OfferType {
  OneOff = 0,
  Monthly = 1,
  Quarterly = 2,
  Yearly = 3,
  Evergreen = 4
}

export const OfferTypeMetadata = {
  [OfferType.OneOff]: { label: "One-off", description: "One-off reward" },
  [OfferType.Monthly]: { label: "Monthly", description: "Monthly recurring" },
  [OfferType.Quarterly]: { label: "Quarterly", description: "Every 3 months" },
  [OfferType.Yearly]: { label: "Yearly", description: "Annual reward" },
  [OfferType.Evergreen]: { label: "Evergreen", description: "Ongoing" }
};


export enum CardStatus {
  Pending = 0,
  Scheduled = 1,
  Processing = 2,
  Active = 3,
  Frozen = 4,
  Expired = 5,
  Cancelled = 6,
  Archived = 7
}

export interface CardConfig {
  id: string;
  name: string;
  description?: string;
}

export interface CardDetails {
  id: string;
  potId: string;
  externalId: string;
  code: string;
  expiryDate?: string;
  status: CardStatus;
}

export enum DepositStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2
}

export interface Deposit {
  id: string;
  receivedAt: string;
  failedAt?: string;
  potId: string;
  status: DepositStatus;
  reason?: string;
  amount: number;
}

export interface UserDetails {
  id: string;
  status: UserStatus;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dob: Date;
  address: Address;
}

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postCode: string;
  country: string;
}

export enum UserStatus {
  Draft = 0,
  ReadyToVerify = 1,
  VerificationInProgress = 2,
  Verified = 3,
  Rejected = 4,
  Active = 5,
  ReadyToDeposit = 6,
  Suspended = 7,
  Inactive = 8,
  Archived = 9
}

export interface BankAccount {
  id: string;
  externalId: string;
  name: string;
  status: Status;
  accountNumber: string;
  sortCode: string;
  consentTokenExpiry: Date;
}

export enum Status {
  Active = 0,
  Inactive = 1
}

export interface Pot {
  id: string;
  userId: string;
  potFactoryId: string;
  status: PotStatus;
  offerType: OfferType;
  termsAccepted: boolean;
  name: string;
  merchantId: string;
  depositAmount: number;
  price: number;
  expiryDate: Date;
}

export enum PotStatus {
  Draft = 0,
  ReadyToDeposit = 1,
  DepositInitiated = 2,
  DepositFailed = 3,
  DepositCompleted = 4,
  WithdrawalInitiated = 5,
  WithdrawalCompleted = 6,
  WithdrawalFailed = 7,
  Active = 8,
  Inactive = 9,
  Closed = 10,
  Abandoned = 11
}

export interface PaymentInstitution {
  id: string;
  externalId: string;
  name: string;
  fullName: string;
  environmentType: string;
  credentialsType: string;
  countries: PaymentInstitutionCountry[];
  media: PaymentInstitutionMedia[];
  features: string[];
}

export interface PaymentInstitutionCountry {
  displayName: string;
  countryCode2: string;
}

export interface PaymentInstitutionMedia {
  type: string;
  source: string;
}

export interface SourceOfFunds {
  id: string;
  value: string;
  displayName: string;
}

export interface EmploymentStatus {
  id: string;
  value: string;
  displayName: string;
}

export interface Industry {
  id: string;
  value: string;
  displayName: string;
}

export interface Occupation {
  id: string;
  value: string;
  displayName: string;
  industryId: string;
}