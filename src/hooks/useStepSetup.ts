import { WorkflowStep } from "@/types/workflow";
import { PotFactoryDetails } from "@/types/types";

export interface StepInfo {
  workflowStep: WorkflowStep;
}

interface StepSetupProps {
  potFactory: PotFactoryDetails;
  userExists: boolean;
  userVerificationRequired: boolean;
  potExists: boolean;
  singleOffer: boolean;
  termsAccepted?: boolean;
  bankAccountLinked: boolean;
  potActive: boolean;
}

export function useStepSetup(stepSetupProps: StepSetupProps) {
  const buildSteps = (): StepInfo[] => {
    const list: StepInfo[] = [];

    if (!stepSetupProps.potExists) {
      list.push({ workflowStep: WorkflowStep.Welcome });
    }

    if (!stepSetupProps.userExists) {
      list.push({ workflowStep: WorkflowStep.PersonalDetails });
      list.push({ workflowStep: WorkflowStep.Address });
      list.push({ workflowStep: WorkflowStep.FinancialDetails });
      list.push({ workflowStep: WorkflowStep.Verification });
    }

    if (stepSetupProps.userExists && stepSetupProps.userVerificationRequired) {
      list.push({ workflowStep: WorkflowStep.ContinueVerification });
      list.push({ workflowStep: WorkflowStep.Verification });
    }

    if (!stepSetupProps.potExists) {
      if (!stepSetupProps.singleOffer) {
        list.push({ workflowStep: WorkflowStep.OfferSelection });
      }
      list.push({ workflowStep: WorkflowStep.OfferReview });
    }

    if (!stepSetupProps.termsAccepted) {
      list.push({ workflowStep: WorkflowStep.AcceptTerms });
    }

    if (!stepSetupProps.bankAccountLinked) {
      list.push({ workflowStep: WorkflowStep.BankAccountLinkRequest });
      list.push({ workflowStep: WorkflowStep.BankSelection });
      list.push({ workflowStep: WorkflowStep.BankAuth });
    }

    if (!stepSetupProps.potActive) {
      list.push({ workflowStep: WorkflowStep.PaymentRequest });
      list.push({ workflowStep: WorkflowStep.PaymentAuth });
    }

    list.push({ workflowStep: WorkflowStep.Complete });

    return list;
  };

  return { steps: buildSteps() };
}