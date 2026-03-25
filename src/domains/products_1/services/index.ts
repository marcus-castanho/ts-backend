import { get } from './get';
import { create } from './create';
import { update } from './update';
import { getAllCached } from './getAllCached';
import { remove } from './remove';
import { query } from './query';
import { createWriteThrough } from './createWriteThrough';
import { updateWriteThrough } from './updateWriteThrough';
import { removeWriteThrough } from './removeWriteThrough';

export const products_1Services = {
    create,
    createWriteThrough,
    getAllCached,
    query,
    get,
    update,
    updateWriteThrough,
    remove,
    removeWriteThrough,
};
