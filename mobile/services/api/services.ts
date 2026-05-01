import apiClient from './client';

export type ServiceSession = {
  key: 'full_day' | 'morning' | 'afternoon';
  label: string;
  time: string;
  price: number;
};

export type ServiceCategory = 'tukang_harian' | 'perbaikan';

export type Service = {
  id: number;
  code: string;
  name: string;
  slug: string;
  description: string | null;
  icon_url: string | null;
  pricing: {
    full_day: number;
    morning: number;
    afternoon: number;
  };
  sessions: ServiceSession[];
  service_type: string;
  category: ServiceCategory;
  is_new: boolean;
  sort_order: number;
};

export type ServicesResponse = {
  success: boolean;
  message: string;
  data: Service[];
};

export const servicesApi = {
  list: (category?: ServiceCategory) =>
    apiClient.get<ServicesResponse>('/services', {
      params: category ? { category } : undefined,
    }),
  show: (idOrSlug: string | number) =>
    apiClient.get<{ success: boolean; message: string; data: Service }>(
      `/services/${idOrSlug}`,
    ),
};
