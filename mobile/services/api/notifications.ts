import apiClient from './client';

export type AppNotification = {
  id: number;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
};

type ListResponse = {
  success: boolean;
  message: string;
  data: AppNotification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    unread_count: number;
  };
};

type MarkReadResponse = {
  success: boolean;
  message: string;
  data: AppNotification;
};

type MarkAllReadResponse = {
  success: boolean;
  message: string;
  data: { marked_read: number };
};

export const notificationsApi = {
  list: () => apiClient.get<ListResponse>('/notifications'),
  markRead: (id: number) => apiClient.post<MarkReadResponse>(`/notifications/${id}/read`),
  markAllRead: () => apiClient.post<MarkAllReadResponse>('/notifications/mark-all-read'),
};
