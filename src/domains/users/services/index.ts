import { getUser } from './getUser';
import { createUser } from './createUser';
import { updateUser } from './updateUser';
import { getUsers } from './getUsers';
import { deleteUser } from './deleteUser';
import { getUserWithAuth } from './getUserWithAuth';
import { createIfNotExists } from './createIfNotExists';
import { getCachedUsers } from './getCachedUsers';

export const userServices = {
    getUser,
    getCachedUsers,
    createUser,
    updateUser,
    getUsers,
    deleteUser,
    getUserWithAuth,
    createIfNotExists,
};
