export type ChangedFile = {
    name: string;
    path: string;
    oldName?: string;
    isNew: boolean;
    isUntracked: boolean;
    isRenamed: boolean;
}

export type GroupedChangedFile = {
    name: string;
    type: string;
    children: any[];
};

export type TreeObject = {
    file: ChangedFile;
    type: string;
    path: string;
    name: string;
    staged: boolean;
    children: any;
}

export type GroupedChangedFiles = Array<GroupedChangedFile>;
