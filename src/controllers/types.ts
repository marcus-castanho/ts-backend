import { Server } from '@/server/types';

export type Controller = (route: string) => (instance: Server) => void;
