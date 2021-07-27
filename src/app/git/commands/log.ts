import { logFormaterObject } from "../model";
import { GitResult, runGit } from "./base";

export async function getLogMeta(repository: string, branch = 'HEAD', limit = 100): Promise<GitResult> {

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

    return await runGit(args, repository, 'getLogMeta');
}

export async function getLogMetadataOfSha(repository: string, sha: string): Promise<GitResult> {

    const format = Object.values(logFormaterObject).join('%x00');

    const args = [
        'log',
        sha,
        '-m',
        '-1',
        '--date=iso-local',
        '-z',
        `--format=${format}`,
        '--no-show-signature',
        '--no-color',
        '--'
    ];

    return await runGit(args, repository, 'getLogMetaDataOfSha');
}

export async function getLogOfSha(repository: string, sha: string): Promise<GitResult> {

    const args = [
        'show',
        // '-p',
        sha,
        // '-m',
        // '-1',
        // '--first-parent',
        // '--patch-with-raw',
        // '-z',
        //        `--format=${format}`,
        '--no-color',
        //'--'
    ];

    return await runGit(args, repository, 'getLogOfSha');
}


export async function getDiffOfFile(repository: string, path: string, isNew: boolean, isRenamed: boolean, staged: boolean = false): Promise<GitResult> {

    const args = [
        'diff',
        '--no-ext-diff',
        '--patch-with-raw',
        //   '-z',
        '--no-color'
    ];

    if (isNew && !staged) {
        args.push('--no-index', '--', '/dev/null');
        // } else if (isRenamed) {
        //     args.push('--');
    } else {
        args.push('HEAD', '--');
    }

    if (staged) {
        args.push('--staged');
    }

    return await runGit([...args, path], repository, 'getDiffOfFile');
}
