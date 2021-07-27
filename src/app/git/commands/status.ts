import { GitResult, runGit } from "./base";



async function getStatus(repository: string): Promise<GitResult> {
    const args = [
        '--no-optional-locks',
        'status',
        '--untracked-files=all',
        // '--branch',
        '--porcelain=2',
        '-z',
    ];

    const result = await runGit(args, repository, 'getStatus');
    return result;
}


export { getStatus };
