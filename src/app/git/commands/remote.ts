import { GitResult, runGit } from "./base";

export async function pull(repository: string): Promise<GitResult> {
    const args = [
        'pull'
    ];

    return await runGit(args, repository, 'pull');
}

export async function fetch(repository: string): Promise<GitResult> {
    const args = [
        'fetch',
    ];

    return await runGit(args, repository, 'fetch');
}

export async function push(repository: string): Promise<GitResult> {
    const args = [
        'push'
    ];

    return await runGit(args, repository, 'push');
}

export async function pushWithSetUpstream(repository: string, name: string): Promise<GitResult> {
    const args = [
        'push',
        '--set-upstream',
        'origin',
        name
    ];

    return await runGit(args, repository, 'pushWithSetUpstream');
}
