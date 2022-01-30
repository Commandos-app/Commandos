import { ChangedFile } from './../model/file';

import { runGit } from './base';

export async function stageFile(file: string, repository: string): Promise<any> {
    const args = ['add', file];

    return runGit(args, repository, 'addFile');
}

export async function unstageFile(file: string, repository: string): Promise<any> {
    const args = ['restore', '--staged', file];

    return runGit(args, repository, 'unstageFile');
}

export async function revertFile(file: ChangedFile, repository: string): Promise<any> {
    let args = [];
    if (file.isUntracked) {
        args = ['clean', '-f', 'q', file.path];
    } else {
        args = ['restore', file.path];
    }

    return runGit(args, repository, 'revertFile');
}

export async function stageAll(repository: string): Promise<void> {
    const args = ['add', '.'];

    await runGit(args, repository, 'stageAll');
}

export async function unstageAll(repository: string): Promise<void> {
    const args = ['reset', '--', '.'];

    await runGit(args, repository, 'unstageAll');
}
