import { LoggerService } from '../logger/logger.service';
import { Injectable } from '@angular/core';
import { createDir, readDir, readTextFile, writeFile } from '@tauri-apps/api/fs';
import { localDataDir, appDir } from '@tauri-apps/api/path';
import { DiffFormate, GroupByOptions, RepositoriesSettings, RepositoryUser, Settings, ViewMode } from './store.types';
import { sortByProperty, Store } from '@shared/functions';
import { getName } from '@tauri-apps/api/app';

@Injectable({
    providedIn: 'root',
})
export class StoreService {
    @Store([]) Repositories: RepositoriesSettings;
    @Store(false) DarkMode: boolean;
    @Store(300) PaneSize: number;
    @Store(true) AutoFetch: boolean;
    @Store('') DefaultPath: string;
    @Store('line-by-line') DiffOutputFormat: DiffFormate;
    @Store([]) Tags: Array<string>;
    @Store([]) Users: Array<RepositoryUser>;
    @Store('tree') ViewMode: ViewMode;

    private fileName = 'store.json';
    private data: Settings = {
        repositories: [],
    };

    constructor(private logger: LoggerService) {}

    async loadSettings(): Promise<void> {
        const path = await this.getStorePath();
        this.checkDirIfExistsOrCreate(path);
        this.data = await this.parseFile(`${path}\\${this.fileName}`);
    }

    async saveSettings(): Promise<void> {
        const path = await this.getStorePath();
        this.data.repositories.sort(sortByProperty('name'));
        var data = JSON.stringify(this.data, null, 2);
        writeFile({ path: `${path}\\${this.fileName}`, contents: data });
    }

    private async parseFile(file: string): Promise<Settings> {
        try {
            const data = await readTextFile(file);
            return JSON.parse(data);
        } catch (e) {
            await this.saveSettings();
        }

        return {};
    }

    private async getStorePath(): Promise<string> {
        const basePath = await localDataDir();
        return `${basePath}commandos`;
    }

    private async checkDirIfExistsOrCreate(path: string): Promise<void> {
        try {
            await createDir(path, { recursive: true });
            //
        } catch (error: any) {
            this.logger.error(error);
        }
    }

    get<T = any>(prop: string, defaultValue: T): T {
        if (!prop || !this.data) {
            return <any>null;
        }
        prop = prop.toLowerCase();

        return this.data[prop] ?? defaultValue;
    }

    set<T = any>(prop: string, value: T): void {
        if (!prop) {
            return;
        }
        prop = prop.toLowerCase();
        this.data[prop] = value;
        this.saveSettings();
        // this.store.set(prop.toLowerCase(), value);
    }
}
