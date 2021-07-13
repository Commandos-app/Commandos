import * as GitPerf from '../git-perf';
import { invoke } from '@tauri-apps/api/tauri';
// import { Command } from '@tauri-apps/api/shell';

// export async function runGit2(args: string[], path: string, name: string): Promise<any> {

//     return new Promise((resolve, reject) => {

//         let dataStore: string = ''
//         args.unshift(path);
//         args.unshift('-C');

//         const commandName = `${name}: git ${args.join(' ')}`;

//         const command = new Command('git', args);

//         command.on('close', (data: any) => {
//             console.log(`[COMMAND]: ${commandName}\nfinished with code ${data.code} and signal ${data.signal}\n [DATA-Len]: ${dataStore.length}`);

//             resolve(dataStore);
//         })

//         command.on('error', (error: any) => console.log(`command error: "${error}"`));

//         command.stdout.on('data', (line: any) => {
//             console.log(`[${name}]command stdout: "${line}"`)
//             dataStore += `${line}\n`;
//         });
//         // command.stderr.on('data', (line: any) => console.log(`command stderr: "${line}"`));
//         console.log(`%c[${name}] Start Command!`, 'color: darkred; font-size:16px;');
//         command.spawn();
//     });

// }

type GitResult = {
    stdout: string;
    stderr: string;
}



export async function runGit(args: string[], path: string, name: string, global = false): Promise<any> {

    if (!global) {
        // unshift adds at first position!
        args.unshift(path);
        args.unshift('-C');
    }
    const commandName = `${name}: git ${args.join(' ')}`;

    // const cmd = new Command('git', args);
    // const result = await GitPerf.measure(commandName, () => cmd.execute())
    const cmd = invoke<GitResult>('git', { args });

    const result = await GitPerf.measure(commandName, () => cmd)
        .catch(err => {
            throw new Error(`Failed to execute ${name}: ${err.code}`);
        });

    return result.stdout;
}

