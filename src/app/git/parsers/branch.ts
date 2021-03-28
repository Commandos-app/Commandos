

export function parseBranches(stdout: string) {
    if (stdout) {
        const delimiter = '1F';
        const delimiterString = String.fromCharCode(parseInt(delimiter, 16));
        const lines = stdout.split(delimiterString);
        // Remove the trailing newline
        lines.splice(-1, 1);
        if (lines.length === 0) {
            return [];
        }

        const branches = [];

        for (const [ix, line] of lines.entries()) {
            // preceding newline character after first row
            const pieces = (ix > 0 ? line.substr(1) : line).split('\0');

            const ref = pieces[0];
            const name = pieces[1];
            const upstream = pieces[2];


            branches.push({ name });
        }

        return branches;
    }
    else {
        throw new Error(`Failed to parse branches`);
    }
}
