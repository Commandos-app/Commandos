import { selectFolder } from '@shared/functions';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesSettingsService, StoreService } from '@core/services';
import { RepositoryService, UserConfig } from './../repository.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-repository-setting',
    templateUrl: './repository-setting.component.html',
    styleUrls: ['./repository-setting.component.scss']
})
export class RepositorySettingComponent implements OnInit {

    @ViewChild('form') settingsForm: NgForm;
    selectedTags: Array<string> | undefined = [];

    tags: Array<string> = [];
    path = '';
    name = '';
    origin = '';
    user: UserConfig = {
        name: '',
        email: '',
        global: true
    }

    constructor(
        private repositoriesSettings: RepositoriesSettingsService,
        private router: Router,
        private storeService: StoreService,
        private repositoryService: RepositoryService
    ) { }

    async ngOnInit(): Promise<void> {
        this.tags = this.storeService.getTags();
        this.selectedTags = this.repositoryService.repositorySetting.tags;
        this.path = this.repositoryService.repositorySetting.path;
        this.name = this.repositoryService.repositorySetting.name;
        this.user = await this.repositoryService.loadUserConfig();
        this.origin = await this.repositoryService.getOriginUrl();
    }

    removeRepo(): void {
        this.repositoriesSettings.removeRepository(this.repositoryService.currentId);
        this.router.navigate(['home']);
    }


    async save(): Promise<void> {
        this.repositoryService.repositorySetting.path = this.path;
        this.repositoryService.repositorySetting.name = this.name;
        this.repositoryService.repositorySetting.tags = this.selectedTags;
        const repo = this.repositoryService.repositorySetting;
        this.repositoriesSettings.saveRepo(repo);

        const tagSet = new Set([...this.tags, ...this.selectedTags!]);
        const newTags = [...tagSet];
        this.storeService.setTags(newTags);
        await this.storeService.saveSettings();

        if (!this.user.global) {
            await this.repositoryService.saveLocalUserConfig(this.user);
        } else {
            await this.repositoryService.unsetLocalUserConfig();
        }

        this.settingsForm.form.markAsPristine();
        this.ngOnInit();
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
