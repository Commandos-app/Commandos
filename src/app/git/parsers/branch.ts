import { Branch, Branches, branchFormaterObject } from '@git/model';


export function parseBranches<T extends Record<string, string>>(stdout: string): Branches {

    if (stdout) {
        const keys: Array<keyof T> = Object.keys(branchFormaterObject);
        const records = stdout.split('\n');
        let entries: Array<Branch> = [];

        for (let i = 0; i < records.length; i++) {
            const data = records[i].split('%x00');
            const entry = {} as { [K in keyof T]: string };
            keys.forEach((key, ix) => (entry[key] = data[ix]));

            const branch = (entry as unknown) as Branch;
            branch.ahead = '0';
            branch.behind = '0';

            entries.push(branch);
        }

        //remove all upstream if local exists!
        const withUpstreamBranch = entries.filter(e => e.upstream).map(m => m.upstream);
        entries = entries.filter(f => !withUpstreamBranch.includes(f.name));

        return entries;

    }
    else {
        throw new Error(`Failed to parse branches`);
    }
}


export function parseCurrentBranch(stdout: string): string {

    if (stdout) {
        const branches = stdout.split('\n');
        let [branch] = branches.filter(branch => branch.includes('*'));
        branch = branch.replace('* ', '');
        branch = branch.replace('(', '');
        branch = branch.replace(')', '');
        if (branch.includes('detached')) {
            const splitted = branch.split(' ');
            branch = splitted.pop();
            branch = `Detached (${branch})`
        }

        return branch;
    }
    else {
        throw new Error(`Failed to parse current branch!`);
    }
}
