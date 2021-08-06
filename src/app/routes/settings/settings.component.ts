
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ErrorService, StoreService } from '@core/services';
import { DOCUMENT } from '@angular/common';
import { NgForm } from '@angular/forms';
import { UserConfig, RepositoryService } from '@routes/repository/repository.service';
import { sleep, LoadingState } from '@shared/functions';
import { selectFolder } from '@shared/functions';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    @ViewChild('form') settingsForm: NgForm;

    gridCounts = [25, 50, 100];
    gridCount: number;
    autoFetch: boolean;
    paneSize: number;
    darkMode: boolean;
    diffFormate: boolean;
    defaultPath: string;
    user: UserConfig = {
        name: '',
        email: '',
        global: true
    };

    saveState: LoadingState = 'default';

    constructor(
        private errorService: ErrorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2,
        private storeService: StoreService,
        private repositoryService: RepositoryService
    ) { }

    async ngOnInit(): Promise<void> {
        this.autoFetch = this.storeService.getAutoFetch();
        this.darkMode = this.storeService.getDarkMode();
        this.paneSize = this.storeService.getPaneSize();
        this.defaultPath = this.storeService.getDefaultPath();
        this.diffFormate = this.storeService.getDiffOutputFormat() === 'side-by-side';
        this.user = await this.repositoryService.loadGlobalUserConfig();
        this.settingsForm.form.markAsPristine();
    }

    openDevTools(): void {

    }


    async save(): Promise<void> {
        this.saveState = 'loading';
        this.storeService.setAutoFetch(this.autoFetch);
        this.storeService.setDarkMode(this.darkMode);
        this.storeService.setPaneSize(this.paneSize);
        this.storeService.setDefaultPath(this.defaultPath);
        this.storeService.setDiffOutputFormat(this.diffFormate ? 'side-by-side' : 'line-by-line');

        if (this.darkMode) {
            this.renderer.setAttribute(this.document.body, 'cds-theme', 'dark');
        }
        else {
            this.renderer.setAttribute(this.document.body, 'cds-theme', '');
        }
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
