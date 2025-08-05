import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StepActionButton } from "@/components/StepActionButton";
import { StepProps } from "@/types/workflow";
import { AlertCircle } from "lucide-react";

export function ContinueVerificationStep({ isLoading, onAction }: StepProps) {
  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            We still need to verify your details
          </h3>
          <p className="text-muted-foreground mb-6">
            Please continue with the verification process to complete your
            account setup.
          </p>
        </div>

        <div className="flex justify-center">
          <StepActionButton
            onClick={onAction}
            isLoading={isLoading}
            loadingText="Starting Verification..."
            actionText="Continue Verification"
          />
        </div>
      </CardContent>
    </Card>
  );
}
