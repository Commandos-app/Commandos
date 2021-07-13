import { LoggerService } from '../logger/logger.service';
import { Injectable } from '@angular/core';
import { createDir, readDir, readTextFile, writeFile } from '@tauri-apps/api/fs';
import { localDataDir } from '@tauri-apps/api/path';
import { DiffFormate, RepositoriesSettings, Settings } from './store.types';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    //  private store: Store;

    private fileName = 'store.json'
    private data: Settings = {};

    constructor(
        private logger: LoggerService
    ) { }

    async loadSettings(): Promise<void> {
        const path = await this.getStorePath();
        this.checkDirIfExistsOrCreate(path);
        this.data = await this.parseFile(`${path}\\${this.fileName}`);
    }

    async saveSettings(): Promise<void> {
        const path = await this.getStorePath();
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
            }
            catch (e2) {
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

    getRepositories = (): RepositoriesSettings => this.get<RepositoriesSettings>('repositories', []);
    setRepositories = (value: RepositoriesSettings): void => this.set<RepositoriesSettings>('repositories', value);

    getDarkMode = (): boolean => this.get<boolean>('darkmode', false);
    setDarkMode = (value: boolean): void => this.set<boolean>('darkmode', value);

    getPaneSize = (): number => this.get<number>('panesize', 300);
    setPaneSize = (value: number): void => this.set<number>('panesize', value);

    getAutoFetch = (): boolean => this.get<boolean>('autofetch', true);
    setAutoFetch = (value: boolean): void => this.set<boolean>('autofetch', value);

    // getGridCount = (): number => this.get<number>('gridcount', 10);
    // setGridCount = (value: number): void => this.save<number>('gridcount', value);

    getDiffOutputFormat = (): DiffFormate => this.get<DiffFormate>('diffoutputformat', 'line-by-line');
    setDiffOutputFormat = (value: DiffFormate): void => this.set<DiffFormate>('diffoutputformat', value);

    getTags = (): Array<string> => this.get<Array<string>>('tags', []);
    setTags = (value: Array<string>): void => this.set<Array<string>>('tags', value);

}
