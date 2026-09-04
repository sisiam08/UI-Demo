export interface IUserSession {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  lastActiveAt: string | null;
  createdAt: string;
}

export interface IPaginated<T> {
  total: number;
  page: number;
  limit: number;
  data?: T[];
}
