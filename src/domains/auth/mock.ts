import { Auth } from './entity';

export const AUTH_MOCK: Auth = {
    id: 0,
    credentials: {
        email: '',
        password: '',
        salt: '',
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 0,
};
