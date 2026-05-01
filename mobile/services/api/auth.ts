import apiClient from './client';
import type { ApiResponse, User } from '../../types';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface OtpSentResponse {
  expires_in: number;
}

// ── Standalone exports ────────────────────────────────────────────────────

export const sendRegisterOtp = (phone: string) =>
  apiClient.post<ApiResponse<OtpSentResponse>>('/auth/register/send-otp', { phone });

export const verifyRegisterOtp = (phone: string, otp: string) =>
  apiClient.post<ApiResponse<null>>('/auth/register/verify-otp', { phone, otp });

export const completeRegistration = (data: {
  phone: string;
  name: string;
  email?: string;
}) => apiClient.post<ApiResponse<LoginResponse>>('/auth/register/complete', data);

export const sendLoginOtp = (phone: string) =>
  apiClient.post<ApiResponse<OtpSentResponse>>('/auth/login/send-otp', { phone });

export const verifyLoginOtp = (phone: string, otp: string) =>
  apiClient.post<ApiResponse<LoginResponse>>('/auth/login/verify-otp', { phone, otp });

export const logoutApi = () => apiClient.post<ApiResponse<null>>('/auth/logout');

export const me = () => apiClient.get<ApiResponse<User>>('/auth/me');

// ── Backward-compatible object API ────────────────────────────────────────

export const authApi = {
  sendRegisterOtp,
  verifyRegisterOtp,
  completeRegistration,
  sendLoginOtp,
  verifyLoginOtp,
  logout: logoutApi,
  me,
};
