export function generateJitterTTL(base: number, jitterPercent = 0.2) {
    const jitter = base * jitterPercent;
    const min = base - jitter;
    const max = base + jitter;

    return Math.floor(Math.random() * (max - min + 1) + min);
}
