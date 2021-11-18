
export type RepositorySetting = {
    id: number;
    name: string;
    path: string;
    pathOrig?: string;
    tags: Array<string>;
};

export type RepositoriesSettings = Array<RepositorySetting>;

export type DiffFormate = 'side-by-side' | 'line-by-line';

export type Tag = {
    id: number,
    name: string;
}

export type settings = {
    repositories: RepositoriesSettings;
    darkmode: boolean;
    autofetch: boolean;
    gridcount: string;
    tags: Array<string>;
    [key: string]: any;
}

export type Settings = Partial<settings>;


export type GroupByOptions = 'none' | 'tags' | 'folder';

export type ViewMode = 'tree' | 'list';
