import apiClient from './client';

export type Voucher = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_discount: number | null;
  min_order: number;
  applicable_for: string[];
  expires_at: string | null;
  is_active: boolean;
  is_used: boolean;
};

type WalletResponse = {
  success: boolean;
  message: string;
  data: Voucher[];
};

type RedeemResponse = {
  success: boolean;
  message: string;
  data: Voucher;
};

export const vouchersApi = {
  /** Voucher yang sudah di-claim user ke wallet */
  wallet: () => apiClient.get<WalletResponse>('/vouchers/wallet'),

  /** Klaim kode promo ke wallet user */
  redeem: (code: string) =>
    apiClient.post<RedeemResponse>('/vouchers/redeem', {
      code: code.toUpperCase().trim(),
    }),
};
