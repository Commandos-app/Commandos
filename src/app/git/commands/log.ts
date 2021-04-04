import { logFormaterObject } from "../model";
import { runGit } from "./base";

export async function getLogMeta(repository: string, branch = 'HEAD', limit = 100): Promise<string> {

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

    const result = await runGit(args, repository, 'getLogMeta');
    return result;
}

export async function getLogMetadataOfSha(repository: string, sha: string): Promise<string> {

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

    const result = await runGit(args, repository, 'getLogMetaDataOfSha');
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


export async function getDiffOfFile(repository: string, path: string, staged: boolean = false): Promise<string> {

    const args = [
        'diff',
        '--no-color'
    ];
    if (staged) {
        args.push('--staged');
    }

    const result = await runGit([...args, path], repository, 'getDiffOfFile');
    return result;
}
