type RequestArgs = { path: string; options?: RequestInit };

export class HttpClient {
    constructor(private readonly url: string) {}

    async request({ path, options }: RequestArgs) {
        return fetch(`${this.url}${path}`, {
            ...options,
        });
    }
}
