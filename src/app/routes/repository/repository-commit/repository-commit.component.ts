import { IStatusResult, TreeObject, ChangedFile, GroupedChangedFiles } from '@git/model';
import { LoggerService } from '@core/services/logger/logger.service';
import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { StoreService } from '@core/services';
import { RepositoryService } from '../repository.service';
import { filter, first } from 'rxjs/operators';
import { interval } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { basename, Differ, sleep, LoadingState } from '@shared/functions';

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
    private hasStaged = false;
    isDiffLoading = false;
    isLoading = false;

    isCommiting: LoadingState = 'default';

    fileDiff: string;


    constructor(
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
        this.isLoading = true;
        this.logger.info('Reload commit data');
        const files = await this.repositoryService.getStatus();
        const filesUnstaged = this.groupChangedFiles(files.filter(file => !file.isStaged), 'Changes', false);
        const filesStaged = this.groupChangedFiles(files.filter(file => file.isStaged), 'Staged Changes', true);

        this.fileTree = [...filesStaged, ...filesUnstaged];
        this.formDisabled = this.fileTree.length === 0;
        this.hasStaged = filesStaged.length > 0;
        this.isLoading = false;
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

    @HostListener('window:keyup.control.enter', ['$event'])
    async commit(): Promise<void> {
        // const { name, email } = await this.repositoryService.loadConfig();
        if (this.fileTree.length === 0 || this.commitMessage === '') {
            return;
        }
        this.isCommiting = 'loading';
        this.cd.detectChanges();
        if (!this.hasStaged) {
            await this.repositoryService.stageAll();
        }

        // const author = this.electronService.git.Signature.create(name, email, Date.now(), new Date().getTimezoneOffset());
        // await this.repositoryService.gitRepository.createCommitOnHead([], author, author, message);
        await this.repositoryService.commit(this.commitMessage);
        this.commitMessage = '';
        await this.load();

        // TODO Refactor this somehow!
        await sleep(300);
        this.isCommiting = 'success';
        await sleep(1000);
        this.isCommiting = 'default';
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
        await this.repositoryService.unstageFile(path);
        await this.load();
        this.cd.detectChanges();
    }

    async loadDiff(node: TreeObject) {
        this.isDiffLoading = true;
        const newOrUntracked = node.file.isNew || node.file.isUntracked;
        const { stdout } = await this.repositoryService.getDiffOfFile(node.file.path, newOrUntracked, node.file.isRenamed, node.staged);
        this.fileDiff = stdout;

        // const outputFormat = this.storeService.getDiff2HtmlOutputFormat()
        // Differ('diffoutput', changes, { outputFormat, drawFileList: false });

        this.isDiffLoading = false;
    }


    hideChild(node: any) {
        node.hideChildren = !node.hideChildren;
    }

}
