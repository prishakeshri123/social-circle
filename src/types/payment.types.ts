export type TransactionType = 'club_joining_fee' | 'club_subscription' | 'event_ticket';
export type TransactionStatus =
  'success' | 'failed' | 'pending' | 'refunded' | 'partially_refunded';

export interface Transaction {
  id: string;
  userId: string;
  clubId: string;
  eventId?: string;
  type: TransactionType;
  amount: number;
  currency: string;
  status: TransactionStatus;
  gateway: 'razorpay' | 'stripe' | 'payu' | 'mock';
  gatewayTransactionId?: string;
  planId?: string;
  description: string;
  invoiceUrl?: string;
  refundReason?: string;
  refundedAt?: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  clubId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEndsAt?: string;
  createdAt: string;
}

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'wallet';

export type CardBrand = 'visa' | 'mastercard' | 'rupay' | 'amex';

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  brand: CardBrand;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  createdAt: string;
}

export interface BillingAddress {
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
