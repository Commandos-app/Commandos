export type ChangedFile = {
    name: string;
    path: string;
    oldName?: string;
    isNew: boolean;
    isUntracked: boolean;
    isRenamed: boolean;
};

export type GroupedChangedFile = {
    name: string;
    path?: string;
    type: 'file' | 'path' | 'title';
    children: any[];
};

export type TreeObject = {
    file: ChangedFile;
    type: 'file' | 'path' | 'title';
    path: string;
    name: string;
    staged: boolean;
    children: any;
};

export type GroupedChangedFiles = Array<GroupedChangedFile>;
