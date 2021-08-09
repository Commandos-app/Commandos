
import { GitResult, runGit } from "./base";



export async function initRepository(path: string): Promise<GitResult> {
    const args = [
        'init',
        path
    ];

    return await runGit(args, null, 'initRepository', true);
}


export async function cloneRepository(url: string, path: string): Promise<GitResult> {
    const args = [
        'clone',
        url,
        path
    ];

    return await runGit(args, null, 'cloneRepository', true);
}
