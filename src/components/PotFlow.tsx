import { useCallback, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { WorkflowStep } from "@/types/workflow";
import { useWorkflow } from "@/hooks/useWorkflow";
import { useStepCompletion } from "@/hooks/useStepCompletion";
import { useStepSetup } from "@/hooks/useStepSetup";

// Step Components
import { WelcomeStep } from "./steps/WelcomeStep";
import { PersonalDetailsStep } from "./steps/PersonalDetailsStep";
import { AddressStep } from "./steps/AddressStep";
import { FinancialDetailsStep } from "./steps/FinancialDetailsStep";
import { ContinueVerificationStep } from "./steps/ContinueVerificationStep";
import { VerificationStep } from "./steps/VerificationStep";
import { OfferSelectionStep } from "./steps/OfferSelectionStep";
import { OfferReviewStep } from "./steps/OfferReviewStep";
import { AcceptTermsStep } from "./steps/AcceptTermsStep";
import { BankConnectionStep } from "./steps/BankConnectionStep";
import { BankSelectionStep } from "./steps/BankSelectionStep";
import { BankAuthorizationStep } from "./steps/BankAuthorizationStep";
import { PaymentRequestStep } from "./steps/PaymentRequestStep";
import { PaymentAuthorizationStep } from "./steps/PaymentAuthorizationStep";
import { CompletionStep } from "./steps/CompletionStep";
import { VerificationNotificationStatus } from "@/types/notification";
import {
  Pot,
  PotFactoryDetails,
  PotFactoryOffer,
  UserStatus,
} from "@/types/types";
import { Loader2 } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { StepInfo } from "@/hooks/useStepSetup";

interface PotFlowProps {
  potFactory: PotFactoryDetails;
  pot?: Pot;
  steps: StepInfo[];
}

export function PotFlow({
  potFactory,
  pot,
  steps,
}: PotFlowProps) {
  const { userBankAccount, userDetails, userNotificationStatus } =
    useUserStore();

  const {
    workflowState,
    isLoading,
    isActionInProgress,
    executeStepAction,
    moveToNextStep,
    setSelectedOffer,
    setUserCreateRequest,
    setActionInProgress,
    setSelectedBankInstitution,
  } = useWorkflow(steps, potFactory, pot);

  const { isStepComplete } = useStepCompletion(
    workflowState.currentStep!,
    workflowState,
    isLoading
  );

  // Check if user is rejected
  const isUserRejected = useCallback(() => {
    return (
      userNotificationStatus === "user-rejected" ||
      userDetails?.status === UserStatus.Rejected
    );
  }, [userDetails, userNotificationStatus]);  

  const userVerificationInProgress = useCallback(() => {
    return (
      userDetails?.status === UserStatus.VerificationInProgress
    );
  }, [userDetails, userNotificationStatus]);

  const currentStepIndex = workflowState.availableSteps.indexOf(
    workflowState.currentStep!
  );

  useEffect(() => {
    if (isStepComplete && !isLoading) {
      moveToNextStep();
      setActionInProgress(false);
    }
  }, [isStepComplete, isLoading, isActionInProgress]);

  const renderCurrentStep = () => {
    if (!workflowState.currentStep) return;

    const stepProps = {
      isLoading: !isStepComplete && isActionInProgress,
      onAction: executeStepAction,
    };

    switch (workflowState.currentStep) {
      case WorkflowStep.Welcome:
        return <WelcomeStep {...stepProps} potFactory={potFactory} />;

      case WorkflowStep.PersonalDetails:
        return (
          <PersonalDetailsStep
            {...stepProps}
            userDetails={workflowState.createUserRequest}
            setUserDetails={setUserCreateRequest}
          />
        );

      case WorkflowStep.Address:
        return (
          <AddressStep
            {...stepProps}
            userDetails={workflowState.createUserRequest}
            setUserDetails={setUserCreateRequest}
          />
        );

      case WorkflowStep.FinancialDetails:
        return (
          <FinancialDetailsStep
            {...stepProps}
            userDetails={workflowState.createUserRequest}
            setUserDetails={setUserCreateRequest}
          />
        );

      case WorkflowStep.ContinueVerification:
        return <ContinueVerificationStep {...stepProps} />;

      case WorkflowStep.Verification:
        return (
          <VerificationStep
            {...stepProps}
            verificationStatus={
              userNotificationStatus as VerificationNotificationStatus
            }
            userIdvCheckUrl={workflowState.userIdvCheckUrl}
            userIdvCheckExpiresAt={workflowState.userIdvCheckExpiresAt}
          />
        );

      case WorkflowStep.OfferSelection:
        return (
          <OfferSelectionStep
            {...stepProps}
            setSelectedOffer={setSelectedOffer}
            potFactory={potFactory}
          />
        );

      case WorkflowStep.OfferReview:
        return (
          <OfferReviewStep
            {...stepProps}
            selectedOffer={workflowState.selectedOffer}
            potFactory={potFactory}
            setSelectedOffer={setSelectedOffer}
          />
        );

      case WorkflowStep.AcceptTerms:
        return <AcceptTermsStep {...stepProps} />;

      case WorkflowStep.BankAccountLinkRequest:
        return <BankConnectionStep {...stepProps} />;

      case WorkflowStep.BankSelection:
        return (
          <BankSelectionStep
            {...stepProps}
            bankInstitutions={workflowState.bankInstitutions}
            setSelectedBank={setSelectedBankInstitution}
          />
        );

      case WorkflowStep.BankAuth:
        return (
          <BankAuthorizationStep
            {...stepProps}
            authorisationUrl={workflowState.bankAuthUrl}
          />
        );

      case WorkflowStep.PaymentRequest:
        return (
          <PaymentRequestStep
            {...stepProps}
            depositAmount={
              workflowState.selectedOffer?.depositAmount ??
              workflowState.pot?.depositAmount
            }
            userBankAccount={userBankAccount}
            potFactory={potFactory}
          />
        );

      case WorkflowStep.PaymentAuth:
        return (
          <PaymentAuthorizationStep
            {...stepProps}
            authorisationUrl={workflowState.paymentAuthUrl}
          />
        );

      case WorkflowStep.Complete:
        return (
          <CompletionStep
            {...stepProps}
            potFactory={potFactory}
            depositAmount={workflowState.pot?.depositAmount}
          />
        );

      default:
        return <div>Something went wrong. Please try again later.</div>;
    }
  };

  // Show rejection message if user is rejected or verification is in progress
  if (isUserRejected() || userVerificationInProgress()) {
    return (
      <div className="max-w-2xl mx-auto md:p-6 space-y-6">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-medium text-amber-800 mb-1">
                {userVerificationInProgress() ? "Verification in progress" : "Additional verification needed"}
              </h3>
              <p className="text-amber-700">
                {userVerificationInProgress() 
                  ? "Verification is taking longer than expected. We will be in touch if we need some additional information."
                  : "We need to verify some additional information before you can proceed. Please contact our support team for assistance."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto py-4 px-4 bg-stoa-gray">
      {/* Progress Header */}
      {workflowState.currentStep && currentStepIndex !== steps.length - 1 && (
        <div className="space-y-4 mb-8">
          <p className="text-2xl font-semibold text-gray-800">{`Step ${
            currentStepIndex + 1
          } of ${steps.length} to get your Free Subscription Pot`}</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Step */}
      {renderCurrentStep()}

      {/* Error Display */}
      {workflowState.error && (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-lg text-red-700">{workflowState.error}</p>
        </div>
      )}
    </div>
  );
}
