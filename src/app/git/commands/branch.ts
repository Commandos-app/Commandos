import { branchFormaterObject } from "@git/model";
import { runGit } from "./base";



export async function getCurrentBranch(repository: string): Promise<string> {
    const args = [
        'branch',
        '--show-current'
    ];

    let currentBranch = 'not found';

    const result = await runGit(args, repository, 'getCurrentBranch');
    if (result) {
        currentBranch = result;
    }

    return currentBranch;
}

export async function getBranches(repository: string): Promise<any> {


    const format = Object.values(branchFormaterObject).join('%x00');

    // const delimiter = '1F';

    // const format = [
    //     '%(refname)',
    //     '%(refname:short)',
    //     '%(upstream:short)',
    //     // '%(objectname)', // SHA
    //     // '%(objectname:short)', // short SHA
    //     // '%(author)',
    //     // '%(committer)',
    //     // '%(symref)',
    //     `%${delimiter}`, // indicate end-of-line as %(body) may contain newlines
    // ].join('%00');

    const args = [
        'for-each-ref',
        `--format=${format}`
    ];

    return runGit(args, repository, 'getBranches');

}

export async function createBranch(name: string, repository: string, noTrack = false): Promise<any> {
    const args = [
        'branch',
        name
    ];

    if (noTrack) {
        args.push('--no-track');
    }

    return runGit(args, repository, 'createBranch');
}

export async function checkout(name: string, repository: string): Promise<any> {
    const args = [
        'checkout',
        name
    ];

    return runGit(args, repository, 'checkout');
}

export async function renameBranch(oldName: string, newName: string, repository: string): Promise<any> {
    const args = [
        'branch',
        '-m',
        oldName,
        newName
    ];

    return runGit(args, repository, 'renameBranch');
}


export async function deleteLocalBranch(name: string, repository: string): Promise<any> {
    const args = [
        'branch',
        '-d',
        name
    ];

    return runGit(args, repository, 'deleteLocalBranch');
}

export async function deleteRemoteBranch(name: string, repository: string): Promise<any> {
    const args = [
        'push',
        'origin',
        '--delete',
        name
    ];

    return runGit(args, repository, 'deleteRemoteBranch');

}

export async function clone(url: string, repository: string): Promise<any> {
    const args = [
        'clone',
        '--recursive',
        '--',
        url,
        repository
    ];

    return runGit(args, repository, 'clone');
}

