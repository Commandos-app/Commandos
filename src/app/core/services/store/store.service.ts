import { Injectable } from '@angular/core';
//import Store from 'electron-store';
// import { readTexKtFile, writeFile } from 'tauri/api/fs';

export type RepositorySetting = {
    id: number;
    name: string;
    path: string;
    tags?: Array<string>;
};

export type RepositoriesSettings = Array<RepositorySetting>;
export type DiffFormate = 'side-by-side' | 'line-by-line';
export type Settins = { [key: string]: any };


@Injectable({
    providedIn: 'root'
})
export class StoreService {
    //  private store: Store;
    private data: Settins = {
        "repositories": [
            { "id": 1, "name": "multi-repo-command", "path": "D:\\_dev\\_git\\Playground\\multi-repo-command" },
            { "id": 2, "name": "init", "path": "D:\\_dev\\_repotest\\init" },
            { "id": 3, "name": "branch", "path": "D:\\_dev\\_repotest\\branch", "tags": ["test"] }
        ],
        "darkmode": false,
        "tags": ["test"]
    };

    constructor() {
        // this.store = new Store(/*{ cwd: storepath }*/);
    }

    get<T = any>(prop: string, defaultValue: T): T {
        if (!prop) {
            return <any>null;
        }
        prop = prop.toLowerCase();
        let data = defaultValue;

        if (this.data[prop]) {
            data = this.data[prop];
        }

        return data;
        //return null;

    }

    save<T = any>(prop: string, value: T): void {
        if (!prop) {
            return;
        }
        prop = prop.toLowerCase();
        this.data[prop] = value;
        // this.store.set(prop.toLowerCase(), value);
    }

    getRepositories = (): RepositoriesSettings => this.get<RepositoriesSettings>('repositories', []);
    saveRepositories = (value: RepositoriesSettings): void => this.save<RepositoriesSettings>('repositories', value);

    getDarkMode = (): boolean => this.get<boolean>('darkmode', false);
    saveDarkMode = (value: boolean): void => this.save<boolean>('darkmode', value);

    getAutoFetch = (): boolean => this.get<boolean>('autofetch', false);
    saveAutoFetch = (value: boolean): void => this.save<boolean>('autofetch', value);

    getGridCount = (): number => this.get<number>('gridcount', 10);
    saveGridCount = (value: number): void => this.save<number>('gridcount', value);

    getGitExecutablePath = (): string => this.get<string>('gitexecutablepath', 'node_modules/dugite/git/');
    saveGitExecutablePath = (value: string): void => this.save<string>('gitexecutablepath', value);

    getDiff2HtmlOutputFormat = (): DiffFormate => this.get<DiffFormate>('diff2htmloutputformat', 'line-by-line');
    saveDiff2HtmlOutputFormat = (value: DiffFormate): void => this.save<DiffFormate>('diff2htmloutputformat', value);

    getTags = (): Array<string> => this.get<Array<string>>('tags', []);
    saveTags = (value: Array<string>): void => this.save<Array<string>>('tags', value);

}
