import { runGit } from "./base";

export async function commit(repository: string, message: string): Promise<string> {
    const args = [
        'commit',
        '-m',
        message
    ];

    return await runGit(args, repository, 'commit');
}
