import apiClient from './client';

export type BookingPayload = {
  photos: string[]; // base64 data URI: "data:image/jpeg;base64,..."
  address: string;
  address_detail?: string;
  latitude?: number | null;
  longitude?: number | null;
  survey_scheduled_at: string; // ISO 8601
  budget: string;
  promo_code?: string | null;
  referral_sources: string[];
  building_type: 'apartment' | 'ruko' | 'rumah';
  description?: string;
};

export type BookingResponse = {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    order_code: string;
    total_amount: number;
    status: string;
    photos_count: number;
    payment_url: string;
  };
};

export type BookingBusinessPayload = {
  photos: string[];
  address: string;
  address_detail?: string;
  latitude?: number | null;
  longitude?: number | null;
  survey_scheduled_at: string;
  budget: string;
  promo_code?: string | null;
  referral_sources: string[];
  business_name: string;
  branch_count: string;
  building_type: string; // free string: 'Kantor', 'Mall', dst.
  description?: string;
};

export type TukangHarianPayload = {
  service_id: number;
  referral_sources: string[];
  address: string;
  address_detail?: string;
  work_scheduled_at: string; // ISO 8601
  duration_hours: number; // 2..12
  description: string;
  promo_code?: string;
};

export type TukangHarianResponse = {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    order_code: string;
    service_id: number;
    service_name: string;
    duration_hours: number;
    work_scheduled_at: string;
    total_amount: number;
    status: string;
    payment_url: string;
  };
};

export type PerbaikanMaterialPayload = {
  service_id: number;
  referral_sources: string[];
  material_included: boolean;
  address: string;
  address_detail?: string;
  work_scheduled_at: string;
  duration_hours: number;
  description: string;
  promo_code?: string;
};

export type PerbaikanMaterialResponse = {
  success: boolean;
  message: string;
  data: {
    order_id: number;
    order_code: string;
    service_id: number;
    service_name: string;
    duration_hours: number;
    material_included: boolean;
    work_scheduled_at: string;
    total_amount: number;
    status: string;
    payment_url: string;
  };
};

export type OrderTab = 'rencana' | 'aktif' | 'arsip';

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'pending_survey'
  | 'on_survey'
  | 'pending_assignment'
  | 'paid'
  | 'searching_tukang'
  | 'assigned'
  | 'on_progress'
  | 'in_progress'
  | 'waiting_payment_final'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'rejected';

export type OrderListItem = {
  id: number;
  order_code: string;
  order_type: string; // 'daily_tukang' | 'daily_with_material' | 'borongan_home' | 'borongan_business'
  status: OrderStatus;
  status_label: string;
  service: {
    id: number;
    name: string;
    slug: string;
    category: string | null;
  } | null;
  survey_address: string | null;
  survey_address_detail: string | null;
  survey_scheduled_at: string | null;
  work_scheduled_at: string | null;
  duration_hours: number | null;
  material_included: boolean;
  pricing: {
    subtotal: number;
    total: number;
  };
  created_at: string | null;
};

export type OrderListResponse = {
  success: boolean;
  message: string;
  data: OrderListItem[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    tab_counts?: Record<OrderTab, number>;
  };
};

export const ordersApi = {
  createBoronganRumah: (payload: BookingPayload) =>
    apiClient.post<BookingResponse>('/booking/borongan/rumah', payload),

  createBoronganBisnis: (payload: BookingBusinessPayload) =>
    apiClient.post<BookingResponse>('/booking/borongan/bisnis', payload),

  createTukangHarian: (payload: TukangHarianPayload) =>
    apiClient.post<TukangHarianResponse>('/booking/tukang-harian', payload),

  createPerbaikanMaterial: (payload: PerbaikanMaterialPayload) =>
    apiClient.post<PerbaikanMaterialResponse>('/booking/perbaikan-material', payload),

  listByTab: (tab: OrderTab) =>
    apiClient.get<OrderListResponse>('/orders', { params: { tab } }),
};
