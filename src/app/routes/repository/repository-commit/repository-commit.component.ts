import { IStatusResult } from './../../../git/model/status';
import { LoggerService } from '@core/services/logger/logger.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RepositoriesSettingsService, StoreService } from '@core/services';
import { RepositoryService } from '../repository.service';
import { filter, first } from 'rxjs/operators';
import { interval } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { basename } from '@shared/functions';


export type ChangedFile = {
    name: string;
    path: string;
    oldName?: string;
}

export type GroupedChangedFile = {
    name: string;
    type: string;
    children: any[];
};

export type TreeObject = {
    file: ChangedFile;
    type: string;
    path: string;
    name: string;
    staged: boolean;
    children: any;
}

export type GroupedChangedFiles = Array<GroupedChangedFile>;


@UntilDestroy()
@Component({
    selector: 'app-repository-commit',
    templateUrl: './repository-commit.component.html',
    styleUrls: ['./repository-commit.component.scss']
})
export class RepositoryCommitComponent implements OnInit {

    fileTree: GroupedChangedFiles = [];
    formDisabled = false;
    commitMessage = '';
    autofetch = false;
    private hasStaged = false;
    isLoading = false;
    changes: string;


    constructor(
        private repositoriesSettings: RepositoriesSettingsService,
        private storeService: StoreService,
        private repositoryService: RepositoryService,
        private logger: LoggerService,
        private cd: ChangeDetectorRef
    ) { }


    ngOnInit(): void {
        this.repositoryService.loaded$.pipe(filter(x => x), first()).subscribe(() => {
            this.load();
        });
        if (this.storeService.getAutoFetch()) {
            // defer(() => this.load())
            //     .pipe(
            //         untilDestroyed(this),
            //         repeatWhen(delay(1000))
            //     )


            interval(10000)
                .pipe(
                    untilDestroyed(this),
                    // switchMap(() => this.electronService.hasFocus$),
                    // filter(a => !!a)
                )
                .subscribe(() => {
                    this.logger.info('Auto fetch');
                    this.load();
                });
        }
    }


    async load(): Promise<void> {
        this.logger.info('Reload commit data');
        const files = await this.repositoryService.getStatus();
        const filesUnstaged = this.groupChangedFiles(files.filter(file => !file.isStaged), 'Changes', false);
        const filesStaged = this.groupChangedFiles(files.filter(file => file.isStaged), 'Staged Changes', true);

        this.fileTree = [...filesStaged, ...filesUnstaged];
        this.formDisabled = this.fileTree.length === 0;
        this.hasStaged = filesStaged.length > 0;
        this.autofetch = this.storeService.getAutoFetch();
    }

    private groupChangedFiles(files: IStatusResult[], title: string, staged: boolean): GroupedChangedFiles {
        if (files.length === 0) {
            return [];
        }

        const result: Array<any> = [];
        const level = { result };
        files.forEach((file: IStatusResult) => {

            const changedFile: ChangedFile = {
                name: basename(file.path), //path.basename(file.path),
                ...file
            };

            if (file.isRenamed) {
                changedFile.oldName = file.oldPath; // path.basename(file.oldPath);
            }

            file.path.split('/')
                .reduce((res: any, name: string, idx: number, arr) => {
                    if (!res[name]) {
                        res[name] = { result: [] };

                        const obj: Partial<TreeObject> = { name, staged, children: res[name].result };

                        if (idx === arr.length - 1) {
                            obj.file = changedFile;
                            obj.type = 'file';
                        } else {
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                            obj.path = `${file.path.substring(0, file.path.indexOf(name) + name.length)}/`;
                        }
                        res.result.push(obj);
                    }

                    return res[name];
                }, level);


        });

        return [{ name: title, type: 'title', children: result }];
    }

    async commit(): Promise<void> {

        // const { name, email } = await this.repositoryService.loadConfig();
        if (this.fileTree.length === 0) {
            return;
        }
        if (!this.hasStaged) {
            await this.repositoryService.stageAll();
        }

        // const author = this.electronService.git.Signature.create(name, email, Date.now(), new Date().getTimezoneOffset());
        // await this.repositoryService.gitRepository.createCommitOnHead([], author, author, message);
        await this.repositoryService.commit(this.commitMessage);
        this.commitMessage = '';
        this.changes = null;
        await this.load();
    }

    async undo(file: ChangedFile): Promise<void> {
        await this.repositoryService.revertFile(file);
        await this.load();
    }

    async stage(path: string): Promise<void> {
        await this.repositoryService.addFile(path);
        await this.load();
        this.cd.detectChanges();
    }

    async unstage(path: string): Promise<void> {
        console.log(`[ unsatge ] Begin `);
        await this.repositoryService.unstageFile(path);
        console.log(`[ unsatge ] unstageFile `);
        await this.load();
        console.log(`[ unsatge ] load `);
        this.cd.detectChanges();
    }

    async loadDiff(node: TreeObject) {
        this.isLoading = true;
        this.changes = await this.repositoryService.getDiffOfFile(node.file.path, node.staged);
        this.isLoading = false;
    }
}
