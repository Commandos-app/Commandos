export interface IStatusResult {
    filename: string;
    path: string;
    oldPath?: string;
    isStaged: boolean;
    isRenamed: boolean;
    isCopied: boolean;
    isModified: boolean;
    isNew: boolean;
    isUntracked: boolean;
    isDeleted: boolean;
}

export enum GitStatusEntry {
    Modified = 'M',
    Added = 'A',
    Deleted = 'D',
    Renamed = 'R',
    Copied = 'C',
    Unchanged = '.',
    Untracked = '?',
    Ignored = '!',
    UpdatedButUnmerged = 'U',
}


export enum UnmergedEntrySummary {
    AddedByUs = 'added-by-us',
    DeletedByUs = 'deleted-by-us',
    AddedByThem = 'added-by-them',
    DeletedByThem = 'deleted-by-them',
    BothDeleted = 'both-deleted',
    BothAdded = 'both-added',
    BothModified = 'both-modified',
}


export interface IParsedStatusEntry {
    code: string;
    path: string;
    oldPath?: string;
}
