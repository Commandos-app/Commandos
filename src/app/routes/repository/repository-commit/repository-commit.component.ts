import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { StoreService, ViewMode } from '@core/services';
import { LoggerService } from '@core/services/logger/logger.service';
import { ChangedFile, GroupedChangedFiles, IStatusResult, TreeObject } from '@git/model';
import { GroupedChangedFile } from '@git/model/file';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { basename, LoadingState, sleep } from '@shared/functions';
import { interval } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { RepositoryService } from '../repository.service';


@UntilDestroy()
@Component({
    selector: 'app-repository-commit',
    templateUrl: './repository-commit.component.html',
    styleUrls: ['./repository-commit.component.scss']
})
export class RepositoryCommitComponent implements OnInit {

    @ViewChild('myForm') commitForm: NgForm;

    fileTree: GroupedChangedFiles = [];
    formDisabled = false;
    viewMode: ViewMode = this.storeService.ViewMode;


    get commitMessage(): string {
        return localStorage.getItem(`commitMessage-${this.repositoryService.currentId}`);
    }

    set commitMessage(value: string) {
        // Form resetting does change this value to null!
        value = value ?? '';
        localStorage.setItem(`commitMessage-${this.repositoryService.currentId}`, value);
    }

    private hasStaged = false;
    isDiffLoading = false;
    isLoading: LoadingState = 'default';
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
        if (this.storeService.AutoFetch) {
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
        this.isLoading = 'loading';
        this.logger.info('Reload commit data');

        const files = await this.repositoryService.getStatus();

        if (this.viewMode === 'tree') {
            const filesUnstaged = this.groupChangedFiles(files.filter(file => !file.isStaged), 'Changes', false);
            const filesStaged = this.groupChangedFiles(files.filter(file => file.isStaged), 'Staged Changes', true);
            const filesUnstagedSorted = this.sortFileTree(filesUnstaged);
            const filesStagedSorted = this.sortFileTree(filesStaged);

            const fileTree = [filesStagedSorted, filesUnstagedSorted];
            this.fileTree = this.flattenTree(fileTree);

            this.formDisabled = this.fileTree.length === 0;
            this.hasStaged = filesStagedSorted?.children?.length > 0;
            this.isLoading = 'default';
        } else {

            const filesUnstaged = this.groupChangedFilesFlat(files.filter(file => !file.isStaged), 'Changes', false);
            const filesStaged = this.groupChangedFilesFlat(files.filter(file => file.isStaged), 'Staged Changes', true);
            const filesUnstagedSorted = this.sortFileTree(filesUnstaged);
            const filesStagedSorted = this.sortFileTree(filesStaged);

            const fileTree = [filesStagedSorted, filesUnstagedSorted];
            this.fileTree = fileTree.filter(x => !!x.name);

            this.formDisabled = this.fileTree.length === 0;
            this.hasStaged = files.some(file => file.isStaged);
            this.isLoading = 'default';
        }
        console.log(this.fileTree);
    }

    private flattenTree(fileTree: GroupedChangedFiles): GroupedChangedFiles {
        const gen = this.getFiles(fileTree);
        const flattened = [];
        for (let file of gen) {
            this.checkPath(file, gen);
            if (file.type === 'title') {
                flattened.push(file);
            }
        }

        return flattened;
    }

    private checkPath(file: GroupedChangedFile, gen: Generator<GroupedChangedFile, any, undefined>) {
        if (file.type === 'path' && file.children.length === 1) {
            let { value: nextFile } = gen.next();
            if (nextFile.type === 'path') {
                file.name = `${file.name}/${nextFile.name}`;
                file.children = [...nextFile.children];
                this.checkPath(file, gen);
            }
        }
    }

    private * getFiles(fileTree: GroupedChangedFiles): Generator<GroupedChangedFile, any, undefined> {
        for (const file of fileTree) {
            yield file;
            if (file.children) {
                yield* this.getFiles(file.children);
            }
        }
    }

    private sortFileTree(file: GroupedChangedFile): GroupedChangedFile {
        file.children?.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            if (a.type === 'path' && b.type === 'file') {
                return -1;
            }
            return a.name.localeCompare(b.name);
        });

        if (file.children) {
            for (const child of file.children) {
                if (child.children) {
                    this.sortFileTree(child);
                }
            }
        }

        return file;
    }

    private groupChangedFiles(files: IStatusResult[], title: string, staged: boolean): GroupedChangedFile {
        if (files.length === 0) {
            return {} as GroupedChangedFile;
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
                            obj.type = 'path';
                        }
                        res.result.push(obj);
                    }

                    return res[name];
                }, level);


        });

        return { name: title, type: 'title', children: result };
    }

    private groupChangedFilesFlat(files: IStatusResult[], title: string, staged: boolean): GroupedChangedFile {
        if (files.length === 0) {
            return {} as GroupedChangedFile;
        }

        const result: Array<any> = [];

        files.forEach((file: IStatusResult) => {

            const changedFile: ChangedFile = {
                name: basename(file.path),
                ...file
            };

            if (file.isRenamed) {
                changedFile.oldName = file.oldPath;
            }

            const obj: TreeObject = {
                name: basename(file.path),
                path: file.path,
                staged,
                children: [],
                type: 'file',
                file: changedFile,

            };


            result.push(obj);
        });

        return { name: title, type: 'title', children: result };
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

        this.repositoryService.loadAheadBehindOfCurrentBranch();
        this.commitForm.resetForm();
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

    changeToListView() {
        this.viewMode = 'list';
        this.storeService.ViewMode = 'list';
        this.load();
    }

    changeToTreeView() {
        this.viewMode = 'tree';
        this.storeService.ViewMode = 'tree';
        this.load();
    }

    hideChild(node: any) {
        node.hideChildren = !node.hideChildren;
    }

}
