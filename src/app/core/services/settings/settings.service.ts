import { Injectable } from '@angular/core';
import { DiffFormate, StoreService } from '../store/store.service';


@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    private darkMode: boolean = null;
    private autoFetch: boolean = null;
    private gridCount: number = null;
    private gitPath: string = null;
    private diff2HtmlOutputFormat: DiffFormate = null;

    constructor(
        private store: StoreService
    ) {

    }

    init() {
    }

    get DarkMode(): boolean {
        if (this.darkMode == null) {
            this.darkMode = this.store.getDarkMode();
        }
        return this.darkMode;
    }

    set DarkMode(value: boolean) {
        this.store.saveDarkMode(value);
        this.darkMode = value;
    }

    get AutoFetch(): boolean {
        if (this.autoFetch == null) {
            this.autoFetch = this.store.getAutoFetch();
        }
        return this.autoFetch;
    }

    set AutoFetch(value: boolean) {
        this.store.saveAutoFetch(value);
        this.autoFetch = value;
    }

    get GridCount(): number {
        if (this.gridCount == null) {
            this.gridCount = this.store.getGridCount();
        }
        return this.gridCount;
    }

    set GridCount(value: number) {
        this.store.saveGridCount(value);
        this.gridCount = value;
    }

    get GitExecutablePath(): string {
        if (this.gitPath === null) {
            this.gitPath = this.store.getGitExecutablePath();
        }
        return this.gitPath;
    }

    set GitExecutablePath(value: string) {
        this.store.saveGitExecutablePath(value);
        this.gitPath = value;
    }

    get Diff2HtmlOutputFormat(): DiffFormate {
        if (this.diff2HtmlOutputFormat == null) {
            this.diff2HtmlOutputFormat = this.store.getDiff2HtmlOutputFormat();
        }
        return this.diff2HtmlOutputFormat;
    }

    set Diff2HtmlOutputFormat(value: DiffFormate) {
        this.store.saveDiff2HtmlOutputFormat(value);
        this.diff2HtmlOutputFormat = value;
    }

}
