export enum SubscriptionStatus {
  created = "created",
  authenticated = "authenticated",
  active = "active",
  pending = "pending",
  halted = "halted",
  cancelled = "cancelled",
  completed = "completed",
  expired = "expired",
}

export type SubscriptionStatusType = keyof typeof SubscriptionStatus;
