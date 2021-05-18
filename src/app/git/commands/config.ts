import { runGit } from './base';

export async function getUsername(repository: string, global: boolean): Promise<string> {
    return getConfig(repository, 'user.name', global, 'getUsername');
}

//TODO CHECK if works!
export async function setUsername(repository: string, value: string, global: boolean): Promise<void> {
    await setConfig(repository, 'user.name', value, global, 'setUsername');
}

export async function getUserMail(repository: string, global: boolean): Promise<string> {
    return getConfig(repository, 'user.email', global, 'getUserMail');
}

//TODO CHECK if works!
export async function setUserMail(repository: string, value: string, global: boolean): Promise<void> {
    await setConfig(repository, 'user.email', value, global, 'setUserMail');
}

// TODO add method to get complete config an parse into object with global/system/local param
async function getConfig(repository: string, command: string, global: boolean = false, func: string): Promise<string> {
    const args = [
        'config',
        global ? '--global' : '--local',
        command
    ];

    const result = await runGit(args, repository, func, global);
    return result;
}

// TODO add method to get complete config an parse into object with global/system/local param
async function setConfig(repository: string, command: string, value: string, global: boolean = false, func: string): Promise<string> {
    const args = [
        'config',
        global ? '--global' : '--local'
    ];

    if (!!value) {
        args.push(command);
        args.push(value);
    }
    else {
        args.push('--unset');
        args.push(command);
    }


    const result = await runGit(args, repository, func, global);
    return result;
}

export async function getOriginUrl(repository: string) {
    const args = [
        'config',
        'remote.origin.url'
    ];

    const result = await runGit(args, repository, 'getOriginUrl');
    return result;
}

export async function addOriginUrl(url: string, repository: string) {
    const args = [
        'remote',
        'add',
        'origin',
        url
    ];

    const result = await runGit(args, repository, 'getOriginUrl');
    return result;
}

export async function changeOriginUrl(url: string, repository: string) {
    const args = [
        'remote',
        'set-url',
        'origin',
        url
    ];

    const result = await runGit(args, repository, 'getOriginUrl');
    return result;
}

export async function removeOriginUrl(repository: string) {
    const args = [
        'remote',
        'remove',
        'origin'
    ];

    const result = await runGit(args, repository, 'getOriginUrl');
    return result;
}
