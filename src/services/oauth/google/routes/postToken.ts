import z from 'zod';
import { Fetch } from '@/infra/http';
import { client } from '../client';
import { validateResBody } from '@/infra/http/validations/validateResBody';

const resBodySchema = z.object({
    id_token: z.string(),
    /**
     * Non used fields - optional validation
     */
    access_token: z.string().optional(),
    expires_in: z.number().optional(),
    scope: z.string().optional(),
    token_type: z.string().optional(),
});
type ResBody = z.infer<typeof resBodySchema>;

type Payload = {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    grant_type: string;
    code: string;
};
export const postToken: Fetch<ResBody, Payload> = async (payload) => {
    const response = await client.request({
        path: `/token`,
        options: {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                ...payload,
            }),
        },
    });

    const { status } = response;
    if (status !== 200)
        return { success: false, status, data: null, rawRes: response };

    const resBody = await response.json().catch(() => ({}));
    const data = await validateResBody(resBody, resBodySchema);

    return {
        success: true,
        status,
        data,
        rawRes: response,
    };
};
