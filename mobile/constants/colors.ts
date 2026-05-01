export const Colors = {
  primary: '#E8272A',
  primaryDark: '#B81E21',
  primaryLight: '#FEE2E2',
  background: '#F5F5F5',
  white: '#FFFFFF',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  dark: '#1F2937',
  whatsapp: '#25D366',
} as const;

export type ColorKey = keyof typeof Colors;
