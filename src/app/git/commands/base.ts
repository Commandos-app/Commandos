import * as GitPerf from '../git-perf';
import { Command } from '@tauri-apps/api/shell';



export async function runGit(args: string[], path: string, name: string): Promise<any> {
    // console.log(`[ %cGIT`, 'color: #f00', `] Run command ${name} `, args);
    // const rtn = await GitProcess.exec(args, path);
    // console.log(`[ %cGIT`, 'color: #f00', `] Return command ${rtn} `);
    // return rtn;
    args.unshift(path);
    args.unshift('-C');
    const commandName = `${name}: git ${args.join(' ')}`;

    const cmd = new Command('git', args);

    const result = await GitPerf.measure(commandName, () => cmd.execute())
        .catch(err => {
            // If this is an exception thrown by Node.js (as opposed to
            // dugite) let's keep the salient details but include the name of
            // the operation.
            throw new Error(`Failed to execute ${name}: ${err.code}`);
        });

    return result.stdout;


}

