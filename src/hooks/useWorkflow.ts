import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import { WorkflowStep, WorkflowState } from "@/types/workflow";
import { PotNotificationStatus } from "@/types/notification";
import {
  PotFactoryOffer,
  PaymentInstitution,
  PotFactoryDetails,
  Pot,
} from "@/types/types";
import { usePotFactoryApi } from "@/hooks/apis/usePotFactoryApi";
import { usePotApi } from "@/hooks/apis/usePotApi";
import { useUserApi } from "@/hooks/apis/useUserApi";
import { useStaticDataApi } from "@/hooks/apis/useStaticDataApi";
import { notificationService } from "@/api/notificationService";
import { CreateUserRequest } from "@/types/apiModel";
import { useUserStore } from "@/store/userStore";
import { StepInfo } from "./useStepSetup";
import { useAuth, useUser, useSession } from "@clerk/nextjs";
import { formatISO } from "date-fns";

const EMPTY_USER: CreateUserRequest = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  dob: "",
  address: {
    addressLine1: "",
    addressLine2: "",
    city: "",
    postCode: "",
    country: "GB",
  },
  nationality: "",
  employmentStatus: "",
  occupation: "",
  industry: "",
  taxResidency: "",
  taxId: "",
  annualIncome: 0,
  sourceOfFunds: [],
};

const DEFAULT_USER: CreateUserRequest = {
  firstName: "Ethan",
  lastName: "Hunt",
  email: "ethan.hunt@example.com",
  phoneNumber: "07890123456",
  dob: formatISO(new Date(), { representation: 'date' }),
  address: {
    addressLine1: "123 Main Street",
    addressLine2: "Flat 7",
    city: "London",
    postCode: "SW1 1AA",
    country: "GB",
  },
  nationality: "GB",
  employmentStatus: "employed",
  industry: "creative-arts-and-design",
  occupation: "actor",
  taxResidency: "GB",
  taxId: "1234567890",
  annualIncome: 100000,
  sourceOfFunds: ["savings"],
};

const initialState: WorkflowState = {
  createUserRequest: DEFAULT_USER,
  potStatus: undefined,
  bankInstitutions: [],
  availableSteps: [],
  actionedSteps: new Set<WorkflowStep>(),
};

export function useWorkflow(steps: StepInfo[], potFactory: PotFactoryDetails, pot?: Pot) {
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const { session } = useSession();
  const [state, setState] = useState<WorkflowState>({
    ...initialState,
    potFactory,
    selectedOffer: potFactory.offers?.length === 1 ? potFactory.offers[0] : undefined,
    pot,
    availableSteps: steps.map((step) => step.workflowStep),
    currentStep: steps[0]?.workflowStep,
  });
  const [actionInProgress, setActionInProgress] = useState(false);
  const stateRef = useRef<WorkflowState>(state);

  const potFactoryApi = usePotFactoryApi();
  const potApi = usePotApi();
  const userApi = useUserApi();
  const staticDataApi = useStaticDataApi();

  const {
    userId,
    userBankAccount,
    setUserId,
    setUserBankAccount,
    setUserDetails,
  } = useUserStore();

  const isLoading =
    potFactoryApi.isLoading ||
    potApi.isLoading ||
    userApi.isLoading ||
    staticDataApi.isLoading;

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const handleDataUpdate = async (notification: any) => {
      const { status, data, type } = notification;

      if (type === "user") {
        switch (status) {
          case "user-idv-check-created":
            setState((prev) => ({
              ...prev,
              userIdvCheckUrl: data?.idvCheckUrl,
              userIdvCheckExpiresAt: data?.idvCheckExpiresAt,
            }));
            break;
          case "user-account-authorization-requested":
            setState((prev) => ({
              ...prev,
              bankAuthUrl: data?.authorisationUrl,
            }));
            break;
        }
      }
      if (type === "pot") {
        switch (status) {
          case "pot-draft":
          case "pot-ready-to-deposit":
          case "pot-terms-accepted":
          case "pot-deposit-initiated":
          case "pot-deposit-completed":
          case "pot-active":
            setState((prev) => ({
              ...prev,
              potStatus: status as PotNotificationStatus,
            }));
            break;
          case "pot-deposit-authorization-requested":
            setState((prev) => ({
              ...prev,
              potStatus: status as PotNotificationStatus,
              paymentAuthUrl: data?.authorisationUrl,
            }));
            break;
        }
      }
    };

    notificationService.on("DataUpdate", handleDataUpdate);

    return () => {
      notificationService.off("DataUpdate", handleDataUpdate);
    };
  }, []);

  const executeStepAction = useCallback(async () => {
    if (actionInProgress) return;

    const token = await getToken({ template: 'stoa-core-api-apim' });

    if (!token) return;

    setActionInProgress(true);
    setState((prev) => ({
      ...prev,
      error: undefined,
      actionedSteps: new Set([...prev.actionedSteps, state.currentStep!]),
    }));

    try {
      switch (stateRef.current.currentStep) {
        case WorkflowStep.Welcome:
          break;

        case WorkflowStep.PersonalDetails:
          break;

        case WorkflowStep.Address:
          break;

        case WorkflowStep.FinancialDetails:
          try {
            const { userId: newUserId } = await userApi.createUser(
              stateRef.current.createUserRequest,
              token
            );
            
            // Update Clerk's publicMetadata with the stoaId
            await fetch('/api/set-stoa-id', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ stoaId: newUserId })
            });

            await user?.reload();
            await session?.reload();

            const newToken = await getToken({ template: 'stoa-core-api-apim', skipCache: true });
            
            setUserId(newUserId);

            const userDetails = await userApi.getUserDetails(
              newToken || token,
              (user) => !user
            );


            if (userDetails) {
              setUserDetails(userDetails);
            }
          } catch {
            setState((prev) => ({
              ...prev,
              error: "Failed to create user account",
            }));
            setUserId(undefined);
            setUserBankAccount(undefined);
          }
          break;

        case WorkflowStep.ContinueVerification:
          if (userId) {
            try {
              await userApi.startVerification(token);
            } catch (error) {
              setState((prev) => ({
                ...prev,
                error: "Failed to start verification process",
              }));
            }
          }
          break;

        case WorkflowStep.Verification:
          break;

        case WorkflowStep.OfferSelection:
          break;

        case WorkflowStep.OfferReview:
          if (
            stateRef.current.potFactory &&
            stateRef.current.selectedOffer
          ) {
            const { potId } = await potApi.createPot(
              stateRef.current.selectedOffer,
              token
            );
            setState((prev) => ({ ...prev, potId }));

            const pot = await potApi.getPot(potId, token, (sub) => !sub);
            if (pot) {
              setState((prev) => ({ ...prev, pot }));
            }

            const url = new URL(window.location.href);
            url.searchParams.set("potId", potId);
            window.history.replaceState(
              window.history.state,
              "",
              url.toString()
            );
          }
          break;

        case WorkflowStep.AcceptTerms:
          if (stateRef.current.pot?.id) {
            await potApi.acceptTerms(stateRef.current.pot.id, token);

            if (stateRef.current.pot) {
              await potApi.deposit(
                stateRef.current.pot.id,
                stateRef.current.pot.depositAmount,
                token
              );
            }
          }
          break;

        case WorkflowStep.BankAccountLinkRequest:
          if (!userBankAccount) {
            const bankInstitutions =
              await staticDataApi.getPaymentInstitutions(token);

            setState((prev) => ({
              ...prev,
              bankInstitutions,
            }));
          }
          break;

        case WorkflowStep.BankSelection:
          if (stateRef.current.selectedBankInstitution) {
            await userApi.linkAccount(
              stateRef.current.selectedBankInstitution.externalId,
              token
            );
          }
          break;

        case WorkflowStep.BankAuth:
          break;

        case WorkflowStep.PaymentRequest:
          if (
            stateRef.current.pot?.id &&
            stateRef.current.pot?.depositAmount
          ) {
            await potApi.sendFunds(
              stateRef.current.pot.id,
              stateRef.current.pot?.depositAmount,
              token
            );
          }
          break;

        case WorkflowStep.PaymentAuth:
          break;

        case WorkflowStep.Complete:
          // await notificationService.disconnect();
          break;
      }
    } catch {
      setState((prev) => ({
        ...prev,
        error: `Failed to complete ${state.currentStep} step`,
        isLoading: false,
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.currentStep, actionInProgress, userId]);

  const moveToNextStep = useCallback(() => {
    const currentIndex = state.availableSteps.indexOf(state.currentStep!);
    const nextIndex = currentIndex + 1;

    if (nextIndex < state.availableSteps.length) {
      const nextStep = state.availableSteps[nextIndex];
      setState((prev) => ({ ...prev, currentStep: nextStep }));
    }

    if (nextIndex === state.availableSteps.length) {
      router.push("/");
    }
  }, [state.currentStep]);

  const setSelectedOffer = (offer: PotFactoryOffer) => {
    setState((prev) => ({ ...prev, selectedOffer: offer }));
  };

  const setUserCreateRequest = (userCreateRequest: CreateUserRequest) => {
    setState((prev) => ({ ...prev, createUserRequest: userCreateRequest }));
  };

  const setSelectedBankInstitution = (bankInstitution: PaymentInstitution) => {
    setState((prev) => ({
      ...prev,
      selectedBankInstitution: bankInstitution,
    }));
  };

  return {
    workflowState: state,
    isLoading,
    isActionInProgress: actionInProgress,
    executeStepAction,
    moveToNextStep,
    setUserCreateRequest,
    setSelectedBankInstitution,
    setSelectedOffer,
    setActionInProgress,
  };
}
