import { CommanderModalComponent } from './../../../shared/components/commander/commander-modal/commander-modal.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommanderService } from '@shared/services';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChangeBranch, NewBranch, RepositoryService } from '../repository.service';
import { filter, first } from 'rxjs/operators';
import { NgxTippyProps } from 'ngx-tippy-wrapper';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { Branch, Branches } from '@git/model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

type MergeStrategy = { id: number, title: string, subtitle: string };
type MergeStrategies = Array<MergeStrategy>

@UntilDestroy()
@Component({
    selector: 'app-repository-branch',
    templateUrl: './repository-branch.component.html',
    styleUrls: ['./repository-branch.component.scss']
})
export class RepositoryBranchComponent implements OnInit {


    remoteBranches: Branches = [];

    openModalNew = false;
    openModalChange = false;

    newBranch: NewBranch = {};
    changeBranch: ChangeBranch = {};

    templateRef: NgxTippyProps = {
        arrow: true,
        theme: 'light',
        allowHTML: true,
        appendTo: 'parent',
        interactive: true,
        //interactiveBorder: 5,
        placement: 'bottom',
        trigger: 'click',
    };

    mergeObj: any = {
        modal: false
    };

    mergeStrategy: MergeStrategies = [
        {
            id: 1,
            title: 'Merge (no fast forward)',
            subtitle: 'Nonlinear history preserving all commits'
        },
        {
            id: 2,
            title: 'Squash commit',
            subtitle: 'Linear history with only a single commit on the target'
        },
        {
            id: 3,
            title: 'Rebase and fast-forward',
            subtitle: 'Rebase source commits onto target and fast-forward'
        },
        {
            id: 4,
            title: 'Semi-linear merge',
            subtitle: 'Rebase source commits onto target and create a two-parent merge'
        }
    ];

    selectedMergeStrategy: MergeStrategy = this.mergeStrategy[0];

    constructor(
        public repositoryService: RepositoryService,
        private ngxTippyService: NgxTippyService,
        private commanderService: CommanderService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.repositoryService.loaded$
            .pipe(
                filter(x => x), first(),
                untilDestroyed(this)
            )
            .subscribe(() => {
                this.repositoryService.getBranches();
                // setTimeout(() => {
                //     this.cd.detectChanges();
                // }, 200);
            });
        this.commanderService.onReload$.pipe(untilDestroyed(this))
            .subscribe(() => {
                this.repositoryService.getBranches();
                // this.cd.detectChanges();
            });
    }


    async onDelete(branch: Branch): Promise<void> {
        await this.repositoryService.deleteBranch(branch);

        this.repositoryService.getBranches();
    }

    async onCreate(): Promise<void> {
        if (!this.newBranch.branchName) {
            return;
        }

        try {
            await this.repositoryService.createBranch(this.newBranch.branchName, this.newBranch.checkout);
            // .gitRepository.getBranchCommit(this.repositoryService.currentBranch);
            // const ref = await this.repositoryService.gitRepository.createBranch(this.newBranch.branchName, commit, !!this.newBranch.override);

            // if (this.newBranch.checkout) {
            //     await this.repositoryService.gitRepository.checkoutBranch(ref);
            // }

            // if (this.newBranch.pushRemote) {
            //     // const pushResult = await pushToRepo(repo, [`${ref.name()}:${ref.name()}`]);
            //     this.electronService.git.Branch.setUpstream(ref, `origin/${this.newBranch.branchName}`);
            // }


            this.openModalNew = false;

            this.repositoryService.getBranches();

            this.newBranch = {
                branchName: ''
            };
        } catch {
            // hello?
        }
    }

    async onRename(current: string, newName: string): Promise<void> {
        await this.repositoryService.renameBranch(current, newName);

        this.repositoryService.getBranches();
        this.changeBranch = {};
    }

    async onCheckout(branch: Branch): Promise<void> {
        await this.repositoryService.checkoutBranch(branch.logicalName);
        this.repositoryService.getBranches();
        this.ngxTippyService.hideAll();
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.isPointerOverContainer && event.previousContainer !== event.container) {
            const [from] = event.previousContainer.getSortedItems();
            const [to] = event.container.getSortedItems();
            this.mergeObj.modal = true;
            this.mergeObj.from = from.data;
            this.mergeObj.to = to.data;
        }
    }

    merge() {

    }

    onMergeChange(event: any) {

    }

    closeModal() {
        this.mergeObj = { modal: false };
    }
}
