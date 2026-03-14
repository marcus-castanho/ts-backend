import { env } from '@/infra/env';

type GenerateGoogleAuthUrlArgs = {
    scope?: string;
    redirect_uri: string;
    state: string;
};
export function generateGoogleAuthUrl({
    scope,
    redirect_uri,
    state,
}: GenerateGoogleAuthUrlArgs) {
    const redirectUri = {
        [env.APP_SCHEME]: 'mobile',
        [env.BASE_URL]: 'web',
    };
    const client_id = env.GOOGLE_CLIENT_ID;
    const platform = redirectUri[redirect_uri] || 'web';
    const defaultScope = ['openid', 'email', 'profile'].join('+');

    const params = new URLSearchParams({
        client_id,
        redirect_uri: `${env.BASE_URL}/auth/callback`,
        response_type: 'code',
        scope: scope || defaultScope,
        state: `${platform}|${state}`,
        prompt: 'select_account',
    });
    const url = `${env.GOOGLE_AUTH_URL}?${params.toString()}`;

    return url;
}
