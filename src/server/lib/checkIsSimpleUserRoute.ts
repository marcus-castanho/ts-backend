export function checkIsSimpleUserRoute(url: string) {
    const [path] = url.split('?');
    const segments = path?.split('/').filter(Boolean);

    return segments?.[0] === 'users' && segments.length <= 2;
}
