import { StepActionButton } from "@/components/StepActionButton";
import { StepProps } from "@/types/workflow";
import { VerificationNotificationStatus } from "@/types/notification";
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  LucideIcon,
  Shield,
} from "lucide-react";
import { AuthorizationInterface } from "@/components/AuthorizationInterface";
import { FSCSDisclaimer } from '@/components/FSCSDisclaimer';

interface VerificationStepProps extends StepProps {
  verificationStatus: VerificationNotificationStatus | undefined;
  userIdvCheckUrl?: string;
  userIdvCheckExpiresAt?: Date;
}

const verificationStatusConfig: Record<
  VerificationNotificationStatus,
  {
    title: string;
    description: string;
    icon: LucideIcon;
    variant: "info" | "success" | "warning" | "error";
  }
> = {
  "user-ready-to-verify": {
    title: "Starting Verification",
    description: "Please wait while we initialize your verification",
    icon: Clock,
    variant: "info",
  },
  "user-verification-in-progress": {
    title: "Verification in process",
    description: "You're moments away from getting free subscriptions. Please check your email for identity verification link",
    icon: Loader2,
    variant: "info",
  },
  "user-idv-check-created": {
    title: "Complete verification",
    description: "Please check your email for identity verification link",
    icon: FileText,
    variant: "warning",
  },
  "user-verified": {
    title: "Verified Successfully",
    description: "Your identity has been successfully verified",
    icon: CheckCircle,
    variant: "success",
  },
  "user-rejected": {
    title: "Verification Failed",
    description: "Identity verification was unsuccessful",
    icon: XCircle,
    variant: "error",
  },
};

export function VerificationStep({
  isLoading,
  onAction,
  verificationStatus,
  userIdvCheckUrl,
}: VerificationStepProps) {
  const statusConfig = verificationStatusConfig[verificationStatus || "user-ready-to-verify"];
  const isIdvCheckAvailable =
    verificationStatus === "user-idv-check-created" && userIdvCheckUrl;


  return (
    <div className="max-w-4xl mx-auto p-8 bg-white/80">
      {/* Shield Icon */}
      <div className="flex justify-center mb-12">
        <div className="w-24 h-24 flex items-center justify-center">
          <Shield className="w-20 h-20 text-gray-700" strokeWidth={1.5} />
        </div>
      </div>

      {/* Title and Description */}
      <h1 className="text-4xl font-bold mb-4 text-left">{statusConfig.title}</h1>
      <p className="text-lg text-gray-600 mb-12 text-left">
        {statusConfig.description}
      </p>

      {/* Loading Spinner for in-progress state */}
      {verificationStatus === "user-verification-in-progress" && (
      <div className="flex items-center justify-center p-8">
      <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
    </div>
      )}

      {/* Authorization Interface for IDV check */}
      {isIdvCheckAvailable && (
        <div className="mb-12">
          <AuthorizationInterface
            url={userIdvCheckUrl}
          />
        </div>
      )}

      {/* Continue button for verified state */}
      {verificationStatus === "user-verified" && (
        <div className="flex justify-center mb-12">
          <StepActionButton
            onClick={onAction}
            isLoading={isLoading}
            loadingText="Processing..."
            actionText="Continue"
          />
        </div>
      )}

      <FSCSDisclaimer />
    </div>
  );
}
