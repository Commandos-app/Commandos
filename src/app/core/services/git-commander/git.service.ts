import { FieldDefinition, RegisterCommandOptions } from '@shared/components';
import { ICommand, CommanderService, CommanderModalService } from '@shared/services';
import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { createBranch, deleteLocalBranch } from '@git/commands';
import { RepositorySetting } from '../store/store.types';



//! Refactor: Rename this Service 

@Injectable({
    providedIn: 'root'
})
export class GitService {

    private sub!: Subscription;

    constructor(
        private commanderService: CommanderService,
        private commanderModalService: CommanderModalService
    ) { }

    registerGitCommands(): void {
        // this.registerPullCommand();
        // this.registerPushCommand();
        this.registerDeleteBranchCommand();
        this.registerCreateBranchCommand();
        // this.registerMergeCommand();
        // this.registerSyncCommand();
    }

    // private registerPullCommand() {
    //     const name = 'Pull repositories';
    //     const icon = 'download-cloud';
    //     const command = 'executePull';
    //     this.registerCommand({ name, command, icon });
    // }

    // private registerPushCommand() {
    //     const name = 'Push repositories';
    //     const icon = 'upload-cloud';
    //     const command = 'executePush';
    //     this.registerCommand({ name, command, icon });
    // }

    // private registerSyncCommand() {
    //     const name = 'Sync repositories';
    //     const icon = 'two-way-arrows';
    //     const direction = 'left';
    //     const command = 'executeSync';
    //     this.registerCommand({ name, command, icon, direction });
    // }
    private registerCreateBranchCommand() {
        const name = 'Create Branch';
        const icon = 'branch-16';
        const command = 'executeCreateBranch';
        const fields: Array<FieldDefinition> = [{ type: 'string', label: 'Name', name: 'name' }];
        this.registerCommand({ name, command, icon, fields });
    }

    private registerDeleteBranchCommand() {
        const name = 'Delete branch';
        const icon = 'trash';
        const command = 'executeDeleteBranch';
        const fields: Array<FieldDefinition> = [{ type: 'branch', label: 'Branch', name: 'name' }];
        this.registerCommand({ name, command, icon, fields });
    }



    // private registerMergeCommand() {
    //     const name = 'Merge repositories';
    //     const icon = 'merge-16';
    //     const command = 'executeMerge';
    //     this.registerCommand({ name, command, icon });
    // }

    private registerCommand(options: RegisterCommandOptions): void {
        const command: ICommand = {
            name: options.name,
            icon: options.icon,
            direction: options.direction,
            callback: () => { this.runCommand(options) }
        };
        this.commanderService.registerCommand(command);
    }

    private runCommand(options: RegisterCommandOptions) {
        this.unsubscribe();

        const onClose$ = this.commanderModalService.openModal({ title: options.name, fields: options.fields! });
        this.sub = onClose$
            .subscribe((params) => {
                if (params.repos && params.repos.length > 0 && this[options.command]) {
                    for (let i = 0; i < params.repos.length; i++) {
                        this[options.command](params.formData, params.repos[i]);
                    }
                }
                this.commanderService.reloadData();
                this.unsubscribe();
                this.commanderModalService.closeModal();
            });

    }

    private async executeMerge(formData: any, repository: RepositorySetting): Promise<any> {
        throw new Error('Method not implemented.');

    }

    private async executeDeleteBranch(formData: any, repository: RepositorySetting): Promise<any> {
        return deleteLocalBranch(formData.name, repository.path);
    }

    private executePush(formData: any, repository: RepositorySetting): Promise<any> {
        throw new Error('Method not implemented.');

    }

    private executePull(formData: any, repository: RepositorySetting): Promise<any> {
        throw new Error('Method not implemented.');
    }

    private async executeCreateBranch(formData: any, repository: RepositorySetting): Promise<any> {
        return createBranch(formData.name, repository.path);
    }

    private async executeSync(formData: any, repository: RepositorySetting): Promise<any> {
        await this.executePull(formData, repository);
        return this.executePush(formData, repository);
    }

    private unsubscribe() {
        if (this.sub) {
            this.sub.unsubscribe();
            this.sub = null;
        }
    }
}
