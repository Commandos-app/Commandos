
import { GitStatusEntry, IParsedStatusEntry, IStatusResult, UnmergedEntrySummary } from "../model";




export function parseStatus(stdout: string): IStatusResult[] {

    if (stdout) {
        const unparsedFiles = stdout.split('\0');

        const files = [];

        for (let index = 0; index < unparsedFiles.length; index++) {
            const entry = unparsedFiles[index];
            if (!entry) { continue; }

            const parsedStatusEntry = splitByTypeOfChange(entry);
            if (parsedStatusEntry) {

                const statusResult: IStatusResult = {
                    filename: parsedStatusEntry.path,
                    path: parsedStatusEntry.path,
                    isStaged: isStaged(parsedStatusEntry.code),
                    isRenamed: isRenamed(parsedStatusEntry.code),
                    isCopied: isCopied(parsedStatusEntry.code),
                    isModified: isModified(parsedStatusEntry.code),
                    isNew: isAdded(parsedStatusEntry.code),
                    isUntracked: isUntracked(parsedStatusEntry.code),
                    isDeleted: isDeleted(parsedStatusEntry.code)
                };

                if (statusResult.isRenamed || statusResult.isCopied) {
                    statusResult.oldPath = unparsedFiles[index + 1];
                    unparsedFiles[index + 1] = '';
                }

                files.push(statusResult);
            }
        }

        return files;
    }

    return [];
}

const ChangedEntryType = '1';
const RenamedOrCopiedEntryType = '2';
const UnmergedEntryType = 'u';
const UntrackedEntryType = '?';
const IgnoredEntryType = '!';

function splitByTypeOfChange(entry: string): IParsedStatusEntry | undefined {
    const entryKind = entry.substr(0, 1);

    switch (entryKind) {
        case ChangedEntryType:
            return parseChangedEntry(entry);
        case RenamedOrCopiedEntryType:
            return parsedRenamedOrCopiedEntry(entry);
        case UnmergedEntryType:
            return parseUnmergedEntry(entry);
        case UntrackedEntryType:
            return parseUntrackedEntry(entry);
        case IgnoredEntryType:
        default:
            // TODO!
            return undefined;
    }
}


// 1 <XY> <sub> <mH> <mI> <mW> <hH> <hI> <path>
const changedEntryRe = /^1 ([MADRCUTX?!.]{2}) (N\.\.\.|S[C.][M.][U.]) (\d+) (\d+) (\d+) ([a-f0-9]+) ([a-f0-9]+) ([\s\S]*?)$/

function parseChangedEntry(field: string): IParsedStatusEntry {
    const match = changedEntryRe.exec(field);

    if (!match) {
        throw new Error(`Failed to parse status line for changed entry`)
    }

    return {
        code: match[1],
        path: match[8],
    }
}

// 2 <XY> <sub> <mH> <mI> <mW> <hH> <hI> <X><score> <path><sep><origPath>
const renamedOrCopiedEntryRe = /^2 ([MADRCUTX?!.]{2}) (N\.\.\.|S[C.][M.][U.]) (\d+) (\d+) (\d+) ([a-f0-9]+) ([a-f0-9]+) ([RC]\d+) ([\s\S]*?)$/

function parsedRenamedOrCopiedEntry(field: string): IParsedStatusEntry {
    const match = renamedOrCopiedEntryRe.exec(field)

    if (!match) {
        throw new Error(`Failed to parse status line for renamed or copied entry`);
    }

    return {
        code: match[1],
        path: match[9]
    }
}

// u <xy> <sub> <m1> <m2> <m3> <mW> <h1> <h2> <h3> <path>
const unmergedEntryRe = /^u ([DAU]{2}) (N\.\.\.|S[C.][M.][U.]) (\d+) (\d+) (\d+) (\d+) ([a-f0-9]+) ([a-f0-9]+) ([a-f0-9]+) ([\s\S]*?)$/

function parseUnmergedEntry(field: string): IParsedStatusEntry {
    const match = unmergedEntryRe.exec(field)

    if (!match) {
        throw new Error(`Failed to parse status line for unmerged entry`);
    }

    return {
        code: match[1],
        path: match[10],
    }
}

function parseUntrackedEntry(field: string): IParsedStatusEntry {
    const path = field.substr(2)
    return {
        code: '?',
        path,
    }
}

function isUntracked(status: string): boolean {
    return !!status && status[0] === '?';
}

function isAdded(status: string): boolean {
    return !!status && (status[0] === 'A' || status[1] === 'A');
}

function isModified(status: string): boolean {
    return !!status && (status[0] === 'M' || status[1] === 'M');
}

function isDeleted(status: string): boolean {
    return !!status && (status[0] === 'D' || status[1] === 'D');
}

function isRenamed(status: string): boolean {
    return !!status && (status[0] === 'R' || status[1] === 'R');
}

function isCopied(status: string): boolean {
    return !!status && (status[0] === 'C' || status[1] === 'C');
}

function isUpdatedButUnmerged(status: string): boolean {
    return !!status && (status[0] === 'U' || status[1] === 'U');
}

function isStaged(status: string): boolean {
    return !!status && status[1] === '.';
}



function mapStatus(status: string): any {

    if (status === '.M') {
        return {
            kind: 'ordinary',
            type: 'modified',
            index: GitStatusEntry.Unchanged,
            workingTree: GitStatusEntry.Modified,
        }
    }

    if (status === 'M.') {
        return {
            kind: 'ordinary',
            type: 'modified',
            index: GitStatusEntry.Modified,
            workingTree: GitStatusEntry.Unchanged,
        }
    }

    if (status === '.A') {
        return {
            kind: 'ordinary',
            type: 'added',
            index: GitStatusEntry.Unchanged,
            workingTree: GitStatusEntry.Added,
        }
    }

    if (status === 'A.') {
        return {
            kind: 'ordinary',
            type: 'added',
            index: GitStatusEntry.Added,
            workingTree: GitStatusEntry.Unchanged,
        }
    }

    if (status === '.D') {
        return {
            kind: 'ordinary',
            type: 'deleted',
            index: GitStatusEntry.Unchanged,
            workingTree: GitStatusEntry.Deleted,
        }
    }

    if (status === 'D.') {
        return {
            kind: 'ordinary',
            type: 'deleted',
            index: GitStatusEntry.Deleted,
            workingTree: GitStatusEntry.Unchanged,
        }
    }

    if (status === 'R.') {
        return {
            kind: 'renamed',
            index: GitStatusEntry.Renamed,
            workingTree: GitStatusEntry.Unchanged,
        }
    }

    if (status === '.R') {
        return {
            kind: 'renamed',
            index: GitStatusEntry.Unchanged,
            workingTree: GitStatusEntry.Renamed,
        }
    }

    if (status === 'C.') {
        return {
            kind: 'copied',
            index: GitStatusEntry.Copied,
            workingTree: GitStatusEntry.Unchanged,
        }
    }

    if (status === '.C') {
        return {
            kind: 'copied',
            index: GitStatusEntry.Unchanged,
            workingTree: GitStatusEntry.Copied,
        }
    }

    if (status === 'AD') {
        return {
            kind: 'ordinary',
            type: 'added',
            index: GitStatusEntry.Added,
            workingTree: GitStatusEntry.Deleted,
        }
    }

    if (status === 'AM') {
        return {
            kind: 'ordinary',
            type: 'added',
            index: GitStatusEntry.Added,
            workingTree: GitStatusEntry.Modified,
        }
    }

    if (status === 'RM') {
        return {
            kind: 'renamed',
            index: GitStatusEntry.Renamed,
            workingTree: GitStatusEntry.Modified,
        }
    }

    if (status === 'RD') {
        return {
            kind: 'renamed',
            index: GitStatusEntry.Renamed,
            workingTree: GitStatusEntry.Deleted,
        }
    }

    if (status === 'DD') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.BothDeleted,
            us: GitStatusEntry.Deleted,
            them: GitStatusEntry.Deleted,
        }
    }

    if (status === 'AU') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.AddedByUs,
            us: GitStatusEntry.Added,
            them: GitStatusEntry.UpdatedButUnmerged,
        }
    }

    if (status === 'UD') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.DeletedByThem,
            us: GitStatusEntry.UpdatedButUnmerged,
            them: GitStatusEntry.Deleted,
        }
    }

    if (status === 'UA') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.AddedByThem,
            us: GitStatusEntry.UpdatedButUnmerged,
            them: GitStatusEntry.Added,
        }
    }

    if (status === 'DU') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.DeletedByUs,
            us: GitStatusEntry.Deleted,
            them: GitStatusEntry.UpdatedButUnmerged,
        }
    }

    if (status === 'AA') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.BothAdded,
            us: GitStatusEntry.Added,
            them: GitStatusEntry.Added,
        }
    }

    if (status === 'UU') {
        return {
            kind: 'conflicted',
            action: UnmergedEntrySummary.BothModified,
            us: GitStatusEntry.UpdatedButUnmerged,
            them: GitStatusEntry.UpdatedButUnmerged,
        }
    }

    // as a fallback, we assume the file is modified in some way
    return {
        kind: 'ordinary',
        type: 'modified',
    }
}



