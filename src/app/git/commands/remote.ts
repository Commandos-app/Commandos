import { runGit } from "./base";

export async function pull(repository: string): Promise<void> {
    const args = [
        'pull'
    ];

    return await runGit(args, repository, 'pull');
}

export async function fetch(repository: string): Promise<void> {
    const args = [
        'fetch',
    ];

    return await runGit(args, repository, 'fetch');
}

export async function push(repository: string): Promise<void> {
    const args = [
        'push'
    ];

    return await runGit(args, repository, 'push');
}
