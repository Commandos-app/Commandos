import { logFormaterObject } from "../model";
import { runGit } from "./base";

export async function getLog(repository: string, branch = 'HEAD', limit = 100): Promise<string> {

    const format = Object.values(logFormaterObject).join('%x00');

    const args = [
        'log',
        branch,
        '--date=iso-local',
        `--max-count=${limit}`,
        '-z',
        `--format=${format}`,
        '--no-show-signature',
        '--no-color',
        '--'
    ];

    const result = await runGit(args, repository, 'getLog');
    return result;
}

export async function getLogOfSha(repository: string, sha: string): Promise<string> {

    const args = [
        'log',
        sha,
        '-m',
        '-1',
        '--first-parent',
        '--patch-with-raw',
        '-z',
        //        `--format=${format}`,
        '--no-color',
        '--'
    ];

    const result = await runGit(args, repository, 'getLogOfSha');
    return result;
}
