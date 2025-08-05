import { useCallback, useMemo } from "react";
import { WorkflowStep, WorkflowState } from "@/types/workflow";
import { PotStatus, UserStatus } from "@/types/types";
import { useUserStore } from "@/store/userStore";

export function useStepCompletion(
  currentStep: WorkflowStep,
  workflowState: WorkflowState,
  isLoading: boolean
) {
  const { userId, userDetails, userNotificationStatus, userBankAccount } =
    useUserStore();

  const hasPotFactory = useCallback(() => {
    return !!workflowState.potFactory;
  }, [workflowState.potFactory]);

  const hasUserId = useCallback(() => {
    return !!userId;
  }, [userId]);

  const userVerified = useCallback(() => {
    return (
      userDetails?.status === UserStatus.Verified ||
      userNotificationStatus === "user-verified"
    );
  }, [userDetails, userNotificationStatus]);

  const userVerificationInProgress = useCallback(() => {
    return (
      userDetails?.status === UserStatus.VerificationInProgress ||
      userNotificationStatus === "user-verification-in-progress" ||
      userNotificationStatus === "user-idv-check-created"
    );
  }, [userDetails, userNotificationStatus]);

  const isOfferSelected = useCallback(() => {
    return !!workflowState.selectedOffer;
  }, [workflowState.selectedOffer]);

  const canAcceptOffer = useCallback(() => {
    return (
      !!workflowState.potId &&
      (workflowState.pot?.status === PotStatus.ReadyToDeposit ||
        workflowState.potStatus === "pot-ready-to-deposit")
    );
  }, [workflowState.potId, workflowState.pot, workflowState.potStatus]);

  const hasBanks = useCallback(() => {
    return workflowState.bankInstitutions.length > 0;
  }, [workflowState.bankInstitutions]);

  const isBankSelected = useCallback(() => {
    return !!workflowState.selectedBankInstitution;
  }, [workflowState.selectedBankInstitution]);

  const isBankAuthorized = useCallback(() => {
    return (
      !!userBankAccount ||
      userDetails?.status === UserStatus.ReadyToDeposit ||
      userNotificationStatus === "user-ready-to-deposit"
    );
  }, [userBankAccount, userDetails, userNotificationStatus]);

  const isPaymentRequestInitiated = useCallback(() => {
    return (
      workflowState.pot?.status === PotStatus.DepositInitiated ||
      workflowState.potStatus === "pot-deposit-authorization-requested"
    );
  }, [workflowState.pot, workflowState.potStatus]);

  const isPaymentProcessed = useCallback(() => {
    return (
      workflowState.pot?.status === PotStatus.Active ||
      workflowState.potStatus === "pot-active"
    );
  }, [workflowState.pot, workflowState.potStatus]);

  const canAcceptTerms = useCallback(() => {
    return (
      (userDetails?.status === UserStatus.Active ||
        userDetails?.status === UserStatus.ReadyToDeposit ||
        userNotificationStatus === "user-active" ||
        userNotificationStatus === "user-ready-to-deposit") &&
      (workflowState.pot?.status === PotStatus.DepositInitiated ||
        workflowState.potStatus === "pot-deposit-initiated" ||
        workflowState.pot?.status === PotStatus.Active ||
        workflowState.potStatus === "pot-active" ||
        workflowState.pot?.termsAccepted ||
        workflowState.potStatus === "pot-terms-accepted")
    );
  }, [
    userDetails,
    userNotificationStatus,
    workflowState.pot,
    workflowState.potStatus,
  ]);

  const isStepComplete = useMemo(() => {
    switch (currentStep) {
      case WorkflowStep.Welcome:
        return (
          hasPotFactory() &&
          workflowState.actionedSteps.has(WorkflowStep.Welcome) &&
          !isLoading
        );

      case WorkflowStep.PersonalDetails:
        return (
          workflowState.actionedSteps.has(WorkflowStep.PersonalDetails) &&
          !isLoading
        );

      case WorkflowStep.Address:
        return (
          workflowState.actionedSteps.has(WorkflowStep.Address) && !isLoading
        );

      case WorkflowStep.FinancialDetails:
        return (
          hasUserId() &&
          workflowState.actionedSteps.has(WorkflowStep.FinancialDetails) &&
          !isLoading
        );

      case WorkflowStep.ContinueVerification:
        return (
          hasUserId() && userVerificationInProgress() &&
          workflowState.actionedSteps.has(WorkflowStep.ContinueVerification) &&
          !isLoading
        );

      case WorkflowStep.Verification:
        return (
          userVerified() &&
          workflowState.actionedSteps.has(WorkflowStep.Verification) &&
          !isLoading
        );

      case WorkflowStep.OfferSelection:
        return (
          isOfferSelected() &&
          workflowState.actionedSteps.has(WorkflowStep.OfferSelection) &&
          !isLoading
        );

      case WorkflowStep.OfferReview:
        return (
          canAcceptOffer() &&
          workflowState.actionedSteps.has(WorkflowStep.OfferReview) &&
          !isLoading
        );

      case WorkflowStep.AcceptTerms:
        return (
          canAcceptTerms() &&
          workflowState.actionedSteps.has(WorkflowStep.AcceptTerms) &&
          !isLoading
        );

      case WorkflowStep.BankAccountLinkRequest:
        return (
          hasBanks() &&
          workflowState.actionedSteps.has(
            WorkflowStep.BankAccountLinkRequest
          ) &&
          !isLoading
        );

      case WorkflowStep.BankSelection:
        return (
          isBankSelected() &&
          workflowState.actionedSteps.has(WorkflowStep.BankSelection) &&
          !isLoading
        );

      case WorkflowStep.BankAuth:
        if (isBankAuthorized()) {
          workflowState.actionedSteps.add(WorkflowStep.BankAuth);
        }
        return (
          isBankAuthorized() &&
          workflowState.actionedSteps.has(WorkflowStep.BankAuth) &&
          !isLoading
        );

      case WorkflowStep.PaymentRequest:
        return (
          isPaymentRequestInitiated() &&
          workflowState.actionedSteps.has(WorkflowStep.PaymentRequest) &&
          !isLoading
        );

      case WorkflowStep.PaymentAuth:
        if (isPaymentProcessed()) {
          workflowState.actionedSteps.add(WorkflowStep.PaymentAuth);
        }
        return (
          isPaymentProcessed() &&
          workflowState.actionedSteps.has(WorkflowStep.PaymentAuth) &&
          !isLoading
        );

      case WorkflowStep.Complete:
        return (
          isPaymentProcessed() &&
          workflowState.actionedSteps.has(WorkflowStep.Complete) &&
          !isLoading
        );

      default:
        return false;
    }
  }, [
    currentStep,
    workflowState,
    userId,
    userDetails,
    userDetails?.status,
    userNotificationStatus,
    userBankAccount,
  ]);

  return { isStepComplete };
}
