export interface UserStatusNotification {
  type: "user";
  userId?: string;
  status: UserNotificationStatus;
  message?: string;
  data?: any;
}

export interface PotStatusNotification {
  type: "pot";
  potId?: string;
  status: PotNotificationStatus;
  message?: string;
  data?: any;
}

export type VerificationNotificationStatus =
  | "user-ready-to-verify"
  | "user-verification-in-progress"
  | "user-idv-check-created"
  | "user-verified"
  | "user-rejected";
export type UserNotificationStatus =
  | VerificationNotificationStatus
  | "user-created"
  | "user-active"
  | "user-account-authorization-requested"
  | "user-ready-to-deposit";
export type PotNotificationStatus =
  | "pot-draft"
  | "pot-ready-to-deposit"
  | "pot-terms-accepted"
  | "pot-deposit-initiated"
  | "pot-deposit-authorization-requested"
  | "pot-deposit-completed"
  | "pot-withdrawal-initiated"
  | "pot-withdrawal-completed"
  | "pot-active"
  | "pot-abandoned";