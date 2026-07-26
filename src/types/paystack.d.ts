// Types for the Paystack Inline v1 script (https://js.paystack.co/v1/inline.js).

export interface PaystackResponse {
  reference: string;
  status?: string;
  trans?: string;
  transaction?: string;
  message?: string;
}

export interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number; // in the currency's smallest unit (e.g. cents / kobo)
  currency?: string;
  ref?: string;
  channels?: string[];
  metadata?: Record<string, unknown>;
  callback?: (response: PaystackResponse) => void;
  onClose?: () => void;
}

export interface PaystackHandler {
  openIframe: () => void;
}

export interface PaystackPopStatic {
  setup: (options: PaystackSetupOptions) => PaystackHandler;
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopStatic;
  }
}

export {};
