import { LoggerService } from '../logger/logger.service';
import { Injectable } from '@angular/core';
import { createDir, readDir, readTextFile, writeFile } from '@tauri-apps/api/fs';
import { localDataDir } from '@tauri-apps/api/path';
import { DiffFormate, GroupByOptions, RepositoriesSettings, Settings, ViewMode } from './store.types';
import { sortByProperty, Store } from '@shared/functions';

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
            await readDir(path);
            //
        } catch (e) {
            try {
                this.logger.warn(`Tring to create the settings folder ${e}`);
                this.createDir(path);
            } catch (e2: any) {
                this.logger.error(e2);
            }
        }
    }

    private async createDir(path: string): Promise<void> {
        await createDir(path);
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
