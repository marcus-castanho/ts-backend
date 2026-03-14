import { env } from './env';

const renderHost = env.RENDER ? `0.0.0.0` : null;

export const host = renderHost || `0.0.0.0`;
