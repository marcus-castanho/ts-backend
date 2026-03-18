type KeyMap = { [K in (typeof KEYS)[number]]: K };

const KEYS = ['query:users'] as const;

export const KEYSPACE = Object.fromEntries(
    KEYS.map((key) => [key, key] as const),
) as KeyMap;
