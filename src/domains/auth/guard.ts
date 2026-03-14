import { FastifyReply, FastifyRequest } from 'fastify';
import { verifyToken } from './services/verifyToken';

export async function protectRoute(req: FastifyRequest, res: FastifyReply) {
    const { authorization, ['platform']: platform } = req.headers;
    const [_, authToken] = authorization?.split(' ') || '';
    const cookieToken = req.cookies['token'];
    const token = platform === 'native' ? authToken : cookieToken;

    const tokenValidation = await verifyToken(token || '');

    if (!tokenValidation.success) {
        res.status(401).send();
        return;
    }

    if (tokenValidation.payload?.isAdmin) {
        req['isAdmin'] = true;
        return;
    }

    const parsedSub = parseInt(`${tokenValidation.payload.sub}`);
    req['userId'] = Number.isNaN(parsedSub) ? -1 : parsedSub;
}

export async function verifyPermission(req: FastifyRequest, res: FastifyReply) {
    const isAdmin = !!req['isAdmin'];
    const userId = req['userId'];
    //@ts-expect-error - req.params type unknown
    const isDataOwner = req.params['id'] === userId;

    if (!isAdmin && !isDataOwner) {
        res.status(403).send();
        return;
    }

    res.headers({ user_id: userId });

    return;
}

export async function verifyIsAdmin(req: FastifyRequest, res: FastifyReply) {
    const isAdmin = !!req['isAdmin'];
    const userId = req['userId'];

    if (!isAdmin) {
        res.status(403).send();
        return;
    }

    res.headers({ user_id: userId });

    return;
}
