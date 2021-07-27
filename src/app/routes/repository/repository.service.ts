import { Injectable } from '@angular/core';
import { RepositoriesSettingsService, RepositorySetting } from '@core/services';
import { BehaviorSubject } from 'rxjs';
import { LoggerService } from '@core/services/logger/logger.service';
import {
    createBranch, deleteLocalBranch, deleteRemoteBranch, getBranches, getCurrentBranch,
    getStatus, renameBranch, stageAll, stageFile, unstageAll,
    unstageFile, revertFile, checkout, commit, getLogMeta, getLogOfSha, getLogMetadataOfSha, getDiffOfFile, pull, push,
    addOriginUrl, changeOriginUrl, getOriginUrl, getUserMail, getUsername, setUserMail, setUsername, removeOriginUrl, createBranchFromSha, pushWithSetUpstream, createBranchFromAnother
} from '@git/commands';
import { parseBranches, parseCurrentBranch, parseLog, parseStatus } from '@git/parsers';
import { IStatusResult, LogItem, ChangedFile, Branch, Branches } from '@git/model';
import { countRevList } from '@git/commands/rev-list';
import { GitResult } from '@git/commands/base';

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

export type UserConfig = { name: string; email: string, global: boolean };

@Injectable({
    providedIn: 'root'
})
export class RepositoryService {

    currentId!: number;
    repositorySetting!: RepositorySetting;
    // currentBranch: Branch;
    currentBranch!: Branch;
    // currentBranchStr!: string;

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
            await this.getBranches();
            this.loaded.next(true);
        }
    }

    async reloadData(): Promise<void> {
        this.loaded.next(false);
        this.loadRepositorySetting();
        await this.loadGitRepository();
    }

    //#region Branches

    // async getCurrentBranch(): Promise<string | void> {
    //     const currentBranchStr = await getCurrentBranch(this.getPath());

    //     if (currentBranchStr) {
    //         this.currentBranchStr = currentBranchStr;
    //     }

    //     return this.currentBranchStr;
    // }

    async getBranches(): Promise<void> {
        // this.branches.next(null);
        const { stdout: branches } = await getBranches(this.getPath());
        if (branches) {
            const parsedBranches = parseBranches(branches);
            const upstreamBranches = parsedBranches.filter(f => f.upstream);
            for (let index = 0; index < upstreamBranches.length; index++) {
                const element = upstreamBranches[index];
                const { stdout: ahead } = await countRevList(this.getPath(), element.upstream, element.name);
                const { stdout: behind } = await countRevList(this.getPath(), element.name, element.upstream);
                element.ahead = ahead;
                element.behind = behind;
            }
            const currentBranchStr = await this.getCurrentBranch();
            let currentBranch = parsedBranches.find(b => b.name === currentBranchStr);
            if (currentBranch) {
                currentBranch.current = true;
            } else {
                // Detached
                currentBranch = new Branch();
                currentBranch.name = currentBranchStr;
            }
            this.currentBranch = currentBranch;

            this.branches.next(parsedBranches);
        }
    }

    async createBranch(name: string, checkout = false): Promise<void> {
        this.logger.info(`create branch: ${name}`);
        await createBranch(name, this.getPath(), false);
        if (checkout) {
            await this.checkoutBranch(name);
        }
    }

    async createBranchFromAnother(name: string, from: string, checkout = false): Promise<void> {
        this.logger.info(`create branch from Another: ${name}`);
        await createBranchFromAnother(name, from, this.getPath());
        if (checkout) {
            await this.checkoutBranch(name);
        }
    }

    async createBranchFromSha(name: string, sha: string): Promise<void> {
        this.logger.info(`create branch from sha: ${name}`);
        await createBranchFromSha(name, sha, this.getPath());
    }

    async deleteBranch(branch: Branch, includeRemote = false): Promise<void> {

        if (!branch.isRemote) {
            await deleteLocalBranch(branch.name, this.getPath());
        }
        if (includeRemote || branch.isRemote) {
            await deleteRemoteBranch(branch.logicalName, this.getPath());
        }
    }

    async renameBranch(oldName: string, newName: string): Promise<void> {
        await renameBranch(oldName, newName, this.getPath());
    }

    async checkoutBranch(name: string): Promise<void> {
        await checkout(name, this.getPath());
    }

    async deleteBranches(branches: Branch[]): Promise<void> {
        for (let index = 0; index < branches.length; index++) {
            const brnach = branches[index];
            this.logger.info(`delete branch ${brnach}`);
            await this.deleteBranch(brnach);

        }
    }

    async getAheadCount(branch: Branch): Promise<GitResult> {
        return await countRevList(this.getPath(), branch.upstream, branch.name);
    }

    async getBehindCount(branch: Branch): Promise<GitResult> {
        return await countRevList(this.getPath(), branch.name, branch.upstream);
    }

    private async getCurrentBranch(): Promise<string> {
        const currentBranchStr = await getCurrentBranch(this.getPath());
        const branch = parseCurrentBranch(currentBranchStr);
        return branch;
    }

    clearUIBranches() {
        this.branches.next(null);
    }
    //#endregion

    //#region Commit
    async getStatus(): Promise<IStatusResult[]> {
        const status = await getStatus(this.getPath());
        const result = parseStatus(status?.stdout);

        return result;
    }

    async commit(message: string): Promise<any> {
        await commit(this.getPath(), message);
    }

    //#endregion

    //#region Push/Pull
    async sync(): Promise<void> {
        await this.pull();
        await this.push();
    }

    async pull(): Promise<void> {
        await pull(this.getPath());
    }

    async push(): Promise<void> {
        if (!this.currentBranch.upstream) {
            await pushWithSetUpstream(this.getPath(), this.currentBranch.name);
        } else {
            await push(this.getPath());
        }
    }

    //#endregion



    //#region History
    async getHistroy(branch = 'HEAD'): Promise<Array<LogItem>> {
        const log = await getLogMeta(this.getPath(), branch);
        const result = parseLog(log?.stdout);

        return result;
    }

    async getChangesOfSha(sha: string): Promise<GitResult> {
        return getLogOfSha(this.getPath(), sha);
    }

    async getChangesMetaDataOfSha(sha: string): Promise<LogItem> {
        const log = await getLogMetadataOfSha(this.getPath(), sha);
        const [result] = parseLog(log?.stdout);

        return result;
    }

    async getDiffOfFile(path: string, isNew: boolean, isRenamed: boolean, staged: boolean): Promise<GitResult> {
        return getDiffOfFile(this.getPath(), path, isNew, isRenamed, staged);
    }

    //#endregion

    //#region Config
    async loadUserConfig(): Promise<UserConfig> {
        const user = await this.loadGlobalUserConfig();
        const { stdout: localName } = await getUsername(this.getPath(), false);
        const { stdout: localEmail } = await getUserMail(this.getPath(), false);

        if (localName || localEmail) {
            user.global = false;
            user.name = localName;
            user.email = localEmail;
        }

        return user;
    }

    //! Refactor this to a global git service
    async loadGlobalUserConfig(): Promise<UserConfig> {
        const { stdout: name } = await getUsername(undefined, true);
        const { stdout: email } = await getUserMail(undefined, true);

        return {
            name,
            email,
            global: true
        };
    }

    async getOriginUrl(): Promise<GitResult> {
        return getOriginUrl(this.getPath());
    }

    async changeOriginUrl(url: string): Promise<GitResult> {
        return changeOriginUrl(url, this.getPath());
    }

    async removeOriginUrl(): Promise<GitResult> {
        return removeOriginUrl(this.getPath());
    }

    async addOriginUrl(url: string): Promise<GitResult> {
        return addOriginUrl(url, this.getPath());
    }

    async saveLocalUserConfig(user: UserConfig): Promise<void> {
        await setUsername(this.getPath(), user.name, false);
        await setUserMail(this.getPath(), user.email, false);
    }

    async saveGlobalUserConfig(user: UserConfig): Promise<void> {
        setUsername(undefined, user.name, true);
        setUserMail(undefined, user.email, true);
    }

    async unsetLocalUserConfig(): Promise<void> {
        setUsername(this.getPath(), undefined, false);
        setUserMail(this.getPath(), undefined, false);
    }
    //#endregion

    //#region commit operations
    async stageAll(): Promise<void> {
        return stageAll(this.getPath());
    }

    async unstageAll(): Promise<void> {
        return unstageAll(this.getPath());
    }

    async addFile(path: string): Promise<any> {
        return stageFile(path, this.getPath());
    }

    async unstageFile(path: string): Promise<any> {
        return unstageFile(path, this.getPath());
    }

    async revertFile(file: ChangedFile): Promise<any> {
        // Check if Added then delete!
        return revertFile(file, this.getPath());
    }
    //#endregion

    private getPath(): string {
        return this.repositorySetting?.path?.replace(/\\\\/g, '/');
    }

    // private getRepository() {
    //     this.gitRepository = new Repository(this.getPath(), 0, null, true, null, false);
    // }
}
