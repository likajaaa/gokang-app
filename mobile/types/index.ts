export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  avatar: string | null;
  role: 'customer' | 'tukang' | 'admin';
  status: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface Service {
  id: number;
  code: string;
  name: string;
  slug: string;
  description: string;
  icon_url: string;
  price_full_day: number;
  price_morning: number;
  price_afternoon: number;
}

export interface Address {
  id: number;
  label: string;
  recipient_name: string;
  recipient_phone: string;
  full_address: string;
  address_note: string | null;
  postal_code: string | null;
  lat: number;
  lng: number;
  is_default: boolean;
}

export type OrderStatus =
  | 'draft'
  | 'pending_payment'
  | 'paid'
  | 'searching_tukang'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: number;
  order_code: string;
  order_type: string;
  status: OrderStatus;
  status_label: string;
  total: number;
  created_at: string;
  payment_url?: string | null;
}
