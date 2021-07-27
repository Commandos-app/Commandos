import { GitResult, runGit } from "./base";

export async function countRevList(repository: string, branchFrom: string, branchTo: string): Promise<GitResult> {
    const args = [
        'rev-list',
        `${branchFrom}..${branchTo}`,
        '--count'
    ];

    return await runGit(args, repository, 'countRevList');
}


