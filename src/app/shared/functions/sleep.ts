export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export type LoadingState = 'default' | 'loading' | 'success' | 'error';
