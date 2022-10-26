import { environment } from '@env/environment';

import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ErrorService, RepositoryUser, StoreService, ViewMode } from '@core/services';
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UserConfig, RepositoryService } from '@routes/repository/repository.service';
import { sleep, LoadingState } from '@shared/functions';
import { selectFolder } from '@shared/functions';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
    @ViewChild('form') settingsForm: NgForm;
    @ViewChild('updateUserForm') updateUserForm: NgForm;
    @ViewChild('addUserForm') addUserForm: NgForm;
    devMode = !environment.production;

    gridCounts = [25, 50, 100];
    gridCount: number;
    autoFetch: boolean;
    paneSize: number;
    darkMode: boolean;
    diffFormate: boolean;
    defaultPath: string;
    viewMode: ViewMode;
    user: UserConfig = {
        name: '',
        email: '',
        global: true,
    };

    saveState: LoadingState = 'default';
    addUserState: LoadingState = 'default';
    updateUserState: LoadingState = 'default';
    deleteUserState: LoadingState = 'default';
    availableUsers: RepositoryUser[];
    selectedUser: RepositoryUser;
    userToCreate: RepositoryUser;

    constructor(
        private errorService: ErrorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private storeService: StoreService,
        private repositoryService: RepositoryService,
    ) {}

    async ngOnInit(): Promise<void> {
        this.autoFetch = this.storeService.AutoFetch;
        this.darkMode = this.storeService.DarkMode;
        this.paneSize = this.storeService.PaneSize;
        this.defaultPath = this.storeService.DefaultPath;
        this.diffFormate = this.storeService.DiffOutputFormat === 'side-by-side';
        this.viewMode = this.storeService.ViewMode;
        this.availableUsers = await this.storeService.Users;        
        this.userToCreate = {name: '', email:''}
        this.selectedUser = {id: 0, name: '', email:''};
        this.user = await this.repositoryService.loadGlobalUserConfig();
        this.settingsForm.form.markAsPristine();
    }

    openDevTools(): void {}

    async addUser(): Promise<void>{
        this.addUserState = 'loading';
        let maxId = this.availableUsers.map(x => x.id).reduce((a, b) => Math.max(a, b), 0)
        this.userToCreate.id = maxId + 1
        this.availableUsers.push(this.userToCreate)
        this.userToCreate = {id: 0, name: '', email: ''}
        this.storeService.Users = this.availableUsers
        this.storeService.saveSettings();
        await sleep(600);
        this.addUserState = 'success';
        this.ngOnInit();
        this.addUserForm.form.markAsPristine();
        await sleep(1000);
        this.addUserState = 'default';
    }
    
    async updateUser(): Promise<void>{
        this.updateUserState = 'loading';
        const userIndex = this.availableUsers.findIndex(x => x.id == this.selectedUser.id)      
        this.availableUsers[userIndex].name = this.selectedUser.name
        this.availableUsers[userIndex].email = this.selectedUser.email
        this.storeService.Users = this.availableUsers
        this.storeService.saveSettings();
        await sleep(600);
        this.updateUserState = 'success';
        this.ngOnInit();
        this.updateUserForm.form.markAsPristine();
        await sleep(1000);
        this.updateUserState = 'default';
    }

    async deleteUser(): Promise<void>{
        this.deleteUserState = 'loading';
        const index = this.availableUsers.map(x => x.id).indexOf(this.selectedUser.id);
        if (index > -1) {
            this.availableUsers.splice(index, 1);
        }
        this.storeService.saveSettings();
        await sleep(600);
        this.deleteUserState = 'success';
        this.ngOnInit();
        this.updateUserForm.form.markAsPristine();
        await sleep(1000);
        this.deleteUserState = 'default';
    }


    async save(): Promise<void> {
        this.saveState = 'loading';
        this.storeService.AutoFetch = this.autoFetch;
        this.storeService.DarkMode = this.darkMode;
        this.storeService.PaneSize = this.paneSize;
        this.storeService.DefaultPath = this.defaultPath;
        this.storeService.DiffOutputFormat = this.diffFormate ? 'side-by-side' : 'line-by-line';
        this.storeService.ViewMode = this.viewMode;

        if (this.darkMode) {
            this.renderer.setAttribute(this.document.body, 'cds-theme', 'dark');
        } else {
            this.renderer.setAttribute(this.document.body, 'cds-theme', '');
        }
        this.storeService.Users = this.availableUsers
        this.storeService.saveSettings();
        this.repositoryService.saveGlobalUserConfig(this.user);

        // TODO Refactor this somehow!
        await sleep(600);
        this.saveState = 'success';
        await sleep(1000);
        this.saveState = 'default';

        this.ngOnInit();
    }

    async openDialog(): Promise<void> {
        const { path } = await selectFolder();
        if (path) {
            this.defaultPath = path;
            this.settingsForm.form.markAsDirty();
        }
    }
}
