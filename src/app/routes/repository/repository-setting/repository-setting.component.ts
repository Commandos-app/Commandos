import { selectFolder, sleep, LoadingState } from '@shared/functions';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesSettingsService, RepositoryUser, StoreService } from '@core/services';
import { RepositoryService, UserConfig } from './../repository.service';
import { NgForm } from '@angular/forms';
import { stdout } from 'process';

@Component({
    selector: 'app-repository-setting',
    templateUrl: './repository-setting.component.html',
    styleUrls: ['./repository-setting.component.scss'],
})
export class RepositorySettingComponent implements OnInit {
    @ViewChild('form') settingsForm: NgForm;
    selectedTags: Array<string> | undefined = [];

    tags: Array<string> = [];
    path = '';
    name = '';
    origin: string;
    private oldOrigin: string;
    user: UserConfig = {
        name: '',
        email: '',
        global: true,
    };
    saveState: LoadingState = 'default';
    availableUsers: RepositoryUser[];
    selectedUser: RepositoryUser = { id: 0, name: '', email: '', };

    constructor(
        private repositoriesSettings: RepositoriesSettingsService,
        private router: Router,
        private storeService: StoreService,
        private repositoryService: RepositoryService,
    ) { }

    ngOnInit(): void {
        this.load();
    }

    addUserToAvailableUsers(): void{
        let userAvailable = this.availableUsers.find(x => x.name == this.user.name && x.email == this.user.email)
        if (userAvailable == undefined){
            this.availableUsers.unshift(this.user)
        }
    }

    async load(): Promise<void> {
        this.selectedUser = { id: 0, name: '', email: ''};
        this.availableUsers = await this.storeService.Users;
        this.user = await this.repositoryService.loadUserConfig();
        this.addUserToAvailableUsers();
        if (!this.user.global) {
            this.selectedUser = this.availableUsers.find(x => x.name == this.user.name && x.email == this.user.email)
        }

        this.tags = this.storeService.Tags;
        this.selectedTags = this.repositoryService.repositorySetting.tags;
        this.path = this.repositoryService.repositorySetting.path;
        this.name = this.repositoryService.repositorySetting.name;
        const { stdout } = await this.repositoryService.getOriginUrl();
        this.origin = stdout;
        this.oldOrigin = this.origin;
        this.settingsForm.form.markAsPristine();
    }

    removeRepo(): void {
        this.repositoriesSettings.removeRepository(this.repositoryService.currentId);
        this.router.navigate(['home']);
    }

    async save(): Promise<void> {
        this.saveState = 'loading';
        this.repositoryService.repositorySetting.path = this.path;
        this.repositoryService.repositorySetting.name = this.name;
        this.repositoryService.repositorySetting.tags = this.selectedTags;
        const repo = this.repositoryService.repositorySetting;
        this.repositoriesSettings.saveRepo(repo);

        const tagSet = new Set([...this.tags, ...this.selectedTags!]);
        const newTags = [...tagSet];
        this.storeService.Tags = newTags;
        await this.storeService.saveSettings();

        if (!this.user.global) {
            let userToSave: UserConfig = { 'name': this.selectedUser.name, 'email': this.selectedUser.email, 'global': this.user.global }
            await this.repositoryService.saveLocalUserConfig(userToSave);
        } else {
            await this.repositoryService.unsetLocalUserConfig();
        }

        if (this.settingsForm.form.controls.origin.dirty && this.oldOrigin !== this.origin) {
            await this.saveOrigin();
        }

        // TODO Refactor this somehow! maybe mojs?
        await sleep(300);
        this.saveState = 'success';
        await sleep(1000);
        this.saveState = 'default';

        this.ngOnInit();
    }

    private async saveOrigin() {
        if (this.origin === '') {
            await this.repositoryService.removeOriginUrl();
        }
        if (this.oldOrigin === '' && this.origin !== '') {
            await this.repositoryService.addOriginUrl(this.origin);
        } else {
            await this.repositoryService.changeOriginUrl(this.origin);
        }
    }

    async openDialog(): Promise<void> {
        const { path, name } = await selectFolder();
        if (path) {
            this.path = path;
            this.name = name;
        }
        this.settingsForm.form.markAsDirty();
    }
}
