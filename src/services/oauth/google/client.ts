import { env } from '@/infra/env';
import { HttpClient } from '@/infra/http';

export const client = new HttpClient(env.GOOGLE_AUTH_ACCOUNT_URL);
