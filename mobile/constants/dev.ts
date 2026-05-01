import type { User } from '../types';

/**
 * Development shortcuts — set SKIP_AUTH=false sebelum production build.
 */
export const DEV_CONFIG = {
  /** Bypass splash → welcome → login. Langsung landing ke /(tabs). */
  SKIP_AUTH: true,

  /** Token dummy untuk dev mode (tidak valid untuk backend). */
  MOCK_TOKEN: 'dev-token-123',

  /** User dummy — harus match shape dari `User` type di types/index.ts */
  MOCK_USER: {
    id: 1,
    name: 'Dev User',
    phone: '+6281234567890',
    email: 'dev@test.com',
    avatar: null,
    role: 'customer',
    status: 'active',
  } satisfies User,
} as const;
