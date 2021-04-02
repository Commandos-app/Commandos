import { Injectable } from '@angular/core';
import { RepositoriesSettingsService, RepositorySetting } from '@core/services';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from '@core/services/logger/logger.service';
import {
    createBranch, deleteLocalBranch, deleteRemoteBranch, getBranches, getCurrentBranch,
    getStatus, renameBranch, stageAll, stageFile, unstageAll,
    unstageFile, revertFile, checkout, commit, getLog, getLogOfSha
} from '@git/commands';
import { parseBranches, parseLog, parseStatus } from '@git/parsers';
import { IStatusResult, LogItem } from '@git/model';
import { ChangedFile } from './repository-commit/repository-commit.component';

export type NewBranch = {
    pushRemote?: boolean;
    override?: boolean;
    checkout?: boolean;
    branchName?: string;
};
export type ChangeBranch = {
    oldName?: string;
    newName?: string;
    checkout?: boolean;
};

export type Branch = { name: string; remote?: boolean };
export type Branches = Array<Branch>;


@Injectable({
    providedIn: 'root'
})
export class RepositoryService {

    currentId!: number;
    repositorySetting!: RepositorySetting;
    // currentBranch: Branch;
    currentBranch!: string;

    private loaded = new BehaviorSubject(false);
    loaded$ = this.loaded.asObservable();

    private branches = new BehaviorSubject<Branches | null>(null);
    branches$ = this.branches.asObservable();

    constructor(
        private repositoriesSettingsService: RepositoriesSettingsService,
        private logger: LoggerService
    ) { }

    setId(id: string): void {
        const newId = parseInt(id);
        if (this.currentId !== newId) {
            this.loaded.next(false);
        }
        this.currentId = newId;
    }

    loadRepositorySetting(): void {
        if (!this.loaded.getValue()) {
            this.repositorySetting = this.repositoriesSettingsService.getRepository(this.currentId);
        }
    }

    unload(): void {
        this.loaded.next(false);
        this.repositorySetting = null;
    }

    async loadGitRepository(): Promise<void> {
        if (!this.loaded.getValue()) {
            this.loaded.next(false);
            // this.getRepository();
            await this.getCurrentBranch();
            this.loaded.next(true);
        }
    }

    async reloadData(): Promise<void> {
        this.loaded.next(false);
        this.loadRepositorySetting();
        await this.loadGitRepository();
    }

    //#region Branches

    async getCurrentBranch(): Promise<string | void> {
        const currentBranch = await getCurrentBranch(this.getPath());
        console.log(`TCL: ~ file: repository.service.ts ~ line 92 ~ RepositoryService ~ getCurrentBranch ~ currentBranch`, currentBranch);
        if (currentBranch) {
            this.currentBranch = currentBranch;
        }

        // this.branches.find(b => b.name === currentBranch);

        return this.currentBranch;
    }

    async getBranches(): Promise<void> {
        // this.branches.next(null);
        const branches = await getBranches(this.getPath());
        if (branches) {
            const parsedBranches = parseBranches(branches);
            this.branches.next(parsedBranches);
        }
    }


    async createBranch(name: string, checkout = false): Promise<void> {
        this.logger.info(`create branch ${name}`);
        await createBranch(name, this.getPath(), false);
        if (checkout) {
            this.checkoutBranch(name);
        }

        this.getCurrentBranch();
    }

    async deleteBranch(name: string, includeRemote = false): Promise<void> {
        // if is localbranch -> deleteLocalBranch
        // if is remote -> deleteBranh
        const isRemote = false;

        if (!isRemote) {
            const rtn = await deleteLocalBranch(name, this.getPath());
            console.log(`TCL: ~ file: repository.service.ts ~ line 121 ~ RepositoryService ~ deleteBranch ~ rtn`, rtn);
        }
        if (includeRemote || isRemote) {
            await deleteRemoteBranch(name, this.getPath());
        }
    }

    async renameBranch(oldName: string, newName: string): Promise<void> {
        await renameBranch(oldName, newName, this.getPath());
    }

    async checkoutBranch(name: string): Promise<void> {
        await checkout(name, this.getPath());
    }


    async deleteBranches(names: string[]): Promise<void> {
        for (let index = 0; index < names.length; index++) {
            const name = names[index];
            this.logger.info(`delete branch ${name}`);
            await this.deleteBranch(name);

        }
    }

    //#endregion

    //#region Commit
    // async getStatus(): Promise<IStatusResult | null> {
    async getStatus(): Promise<IStatusResult[]> {
        const status = await getStatus(this.getPath());
        const result = parseStatus(status);

        return result;
    }

    async commit(message: string): Promise<any> {
        await commit(this.getPath(), message);
    }

    //#endregion

    //#region History
    async getHistroy(): Promise<Array<LogItem>> {
        const log = await getLog(this.getPath());
        const result = parseLog(log);

        return result;
    }

    async getChangedOfSha(sha: string) {
        return getLogOfSha(this.getPath(), sha);
    }

    async getHistroyOfHeadBranch(): Promise<void> {
        // const commits = await git.log({
        //     fs: this.fs,
        //     dir: this.getPath(),
        //     depth: this.settingsService.GridCount,
        //     // ref: '47a070e247f5dbad14037ffa1a5f595e25bd5585'
        // })

        // return commits;
    }
    //#endregion

    // loadConfig(): any {
    //     const globalPath = getGitConfigPath('global')
    //     let config = {}
    //     if (this.electronService.fs.existsSync(globalPath)) {
    //         config = parseConfig.sync(globalPath);
    //     }

    //     if (this.repositorySetting.path) {
    //         const repoConfig = path.join(this.repositorySetting.path, '.git', 'config');
    //         const newConfig = parseConfig.sync(repoConfig);
    //         extend(true, config, newConfig);
    //     }

    //     return config;
    // }

    async loadConfig(): Promise<any> {
        // const globalConfig = await this.electronService.git.Config.openDefault();
        // const globalName = await globalConfig.getStringBuf('user.name');
        // const globalEmail = await globalConfig.getStringBuf('user.email');

        // const localConfig = await this.gitRepository.config();
        // const localName = await localConfig.getStringBuf('user.name');
        // const localEmail = await localConfig.getStringBuf('user.email');

        // const name = localName || globalName;
        // const email = globalEmail || localEmail;

        // return { name, email };
    }

    async stageAll(): Promise<void> {
        return await stageAll(this.getPath());
    }

    async unstageAll(): Promise<void> {
        return await unstageAll(this.getPath());
    }


    async addFile(path: string): Promise<any> {
        return await stageFile(path, this.getPath());
    }

    async unstageFile(path: string): Promise<any> {
        return await unstageFile(path, this.getPath());

    }


    async revertFile(file: ChangedFile): Promise<any> {
        return await revertFile(file, this.getPath());
    }


    private getPath(): string {
        return this.repositorySetting?.path?.replace(/\\\\/g, '/');
    }

    // private getRepository() {
    //     this.gitRepository = new Repository(this.getPath(), 0, null, true, null, false);
    // }
}
