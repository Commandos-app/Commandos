
export type RepositorySetting = {
    id: number;
    name: string;
    path: string;
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
    diff2htmloutputformat: DiffFormate;
    [key: string]: any;
}

export type Settings = Partial<settings>;
