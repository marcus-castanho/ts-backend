export function jsonSafeStringify(value: unknown) {
    try {
        return JSON.stringify(value);
    } catch (_) {
        return '';
    }
}
