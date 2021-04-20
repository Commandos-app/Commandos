import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommanderService } from '@shared/services';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChangeBranch, NewBranch, RepositoryService } from '../repository.service';
import { filter, first } from 'rxjs/operators';
import { NgxTippyProps } from 'ngx-tippy-wrapper';
import { NgxTippyService } from 'ngx-tippy-wrapper';
import { Branches } from '@git/model';


@UntilDestroy()
@Component({
    selector: 'app-repository-branch',
    templateUrl: './repository-branch.component.html',
    styleUrls: ['./repository-branch.component.scss']
})
export class RepositoryBranchComponent implements OnInit {


    branches: Branches = [];
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

    async onDelete(name: string): Promise<void> {
        await this.repositoryService.deleteBranch(name);

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

    onNew(): void {
        this.openModalNew = true;
    }

    async onRename(current: string, newName: string): Promise<void> {
        await this.repositoryService.renameBranch(current, newName);

        this.repositoryService.getBranches();
        this.repositoryService.getCurrentBranch();
        this.changeBranch = {};
    }

    async onCheckout(name: string): Promise<void> {
        await this.repositoryService.checkoutBranch(name);
        this.repositoryService.getCurrentBranch();
        this.ngxTippyService.hideAll();
    }
}
