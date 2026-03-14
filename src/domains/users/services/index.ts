import { getUser } from './getUser';
import { createUser } from './createUser';
import { updateUser } from './updateUser';
import { getUsers } from './getUsers';
import { deleteUser } from './deleteUser';
import { getUserWithAuth } from './getUserWithAuth';
import { createIfNotExists } from './createIfNotExists';

export const userServices = {
    getUser,
    createUser,
    updateUser,
    getUsers,
    deleteUser,
    getUserWithAuth,
    createIfNotExists,
};
