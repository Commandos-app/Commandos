import { logFormaterObject, LogItem } from "../model";


export function parseLog<T extends Record<string, string>>(stdout: string): Array<LogItem> {


    if (stdout) {

        const keys: Array<keyof T> = Object.keys(logFormaterObject);
        const records = stdout.split('\0');
        const entries: Array<LogItem> = [];

        for (let i = 0; i < records.length - keys.length; i += keys.length) {
            const entry = {} as { [K in keyof T]: string };
            keys.forEach((key, ix) => (entry[key] = records[i + ix]));
            entries.push((entry as unknown) as LogItem);
        }

        return entries;

    }
    else {
        throw new Error(`Failed to parse log`);
    }
}


