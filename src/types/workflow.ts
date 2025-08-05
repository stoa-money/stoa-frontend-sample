import { CreatePotRequest, CreateUserRequest } from "./apiModel";
import { PotNotificationStatus } from "./notification";
import { PotFactoryDetails, PotFactoryOffer, Pot, PaymentInstitution } from "./types";

export enum WorkflowStep {
  Welcome = 'Welcome',
  PersonalDetails = 'PersonalDetails',
  Address = 'Address',
  FinancialDetails = 'FinancialDetails',
  ContinueVerification = 'ContinueVerification',
  Verification = 'Verification',
  OfferSelection = 'OfferSelection',
  OfferReview = 'OfferReview',
  AcceptTerms = 'AcceptTerms',
  BankAccountLinkRequest = 'BankAccountLinkRequest',
  BankSelection = 'BankSelection',
  BankAuth = 'BankAuth',
  PaymentRequest = 'PaymentRequest',
  PaymentAuth = 'PaymentAuth',
  Complete = 'Complete'
}

export interface WorkflowState {
  currentStep?: WorkflowStep;
  potFactory?: PotFactoryDetails;
  selectedOffer?: PotFactoryOffer;
  createUserRequest: CreateUserRequest;
  userIdvCheckUrl?: string;
  userIdvCheckExpiresAt?: Date;
  createPotRequest?: CreatePotRequest;
  pot?: Pot;
  potId?: string;
  potStatus?: PotNotificationStatus;
  bankAuthUrl?: string;
  paymentAuthUrl?: string;
  bankInstitutions: PaymentInstitution[];
  selectedBankInstitution?: PaymentInstitution;
  error?: string;
  availableSteps: WorkflowStep[];
  actionedSteps: Set<WorkflowStep>;
}

export interface AuthorizationStepProps {
  authorisationUrl?: string;
}

export interface StepProps {
  isLoading: boolean;
  onAction: () => void;
}

export const WORKFLOW_STEPS = [
  WorkflowStep.Welcome,
  WorkflowStep.PersonalDetails,
  WorkflowStep.Address,
  WorkflowStep.FinancialDetails,
  WorkflowStep.ContinueVerification,
  WorkflowStep.Verification,
  WorkflowStep.OfferSelection,
  WorkflowStep.OfferReview,
  WorkflowStep.AcceptTerms,
  WorkflowStep.BankAccountLinkRequest,
  WorkflowStep.BankSelection,
  WorkflowStep.BankAuth,
  WorkflowStep.PaymentRequest,
  WorkflowStep.PaymentAuth,
  WorkflowStep.Complete
]; 