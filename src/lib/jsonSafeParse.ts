export function jsonSafeParse(value: string | null) {
    try {
        return JSON.parse(value || 'null');
    } catch (_) {
        return {};
    }
}
