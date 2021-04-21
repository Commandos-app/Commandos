import { runGit } from "./base";

export async function pruneRemote(repository: string): Promise<void> {
    const args = [
        'remote',
        'update',
        'origin',
        '--prune'
    ];

    return await runGit(args, repository, 'pruneRemote');
}
