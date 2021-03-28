import * as GitPerf from '../git-perf';
import { execute } from '@tauri-apps/api/shell';



export async function runGit(args: string[], path: string, name: string): Promise<any> {
    // console.log(`[ %cGIT`, 'color: #f00', `] Run command ${name} `, args);
    // const rtn = await GitProcess.exec(args, path);
    // console.log(`[ %cGIT`, 'color: #f00', `] Return command ${rtn} `);
    // return rtn;
    args.unshift(path);
    args.unshift('-C');
    console.log(`TODO logger.service.ts`);
    const commandName = `${name}: git ${args.join(' ')}`;
    console.log(`TCL: ~ file: base.ts ~ line 15 ~ runGit ~ commandName`, commandName);

    const result = await GitPerf.measure(commandName, () => execute('git', args))
        .catch(err => {
            // If this is an exception thrown by Node.js (as opposed to
            // dugite) let's keep the salient details but include the name of
            // the operation.
            throw new Error(`Failed to execute ${name}: ${err.code}`)
        });

    return result;


}

