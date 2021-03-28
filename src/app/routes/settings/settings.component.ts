import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { ErrorService, SettingsService } from '@core/services';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    gridCounts = [25, 50, 100];
    gridCount: number;
    gitExecutablePath: string;
    autoFetch: boolean;
    darkMode: boolean;
    diffFormate: boolean;

    constructor(
        private settingsService: SettingsService,
        private errorService: ErrorService,
        @Inject(DOCUMENT) private document: Document,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.gridCount = this.settingsService.GridCount;
        this.autoFetch = this.settingsService.AutoFetch;
        this.darkMode = this.settingsService.DarkMode;
        this.gitExecutablePath = this.settingsService.GitExecutablePath;
        this.diffFormate = this.settingsService.Diff2HtmlOutputFormat === 'side-by-side';
    }

    openDevTools(): void {

    }


    save(): void {
        this.settingsService.GridCount = this.gridCount;
        this.settingsService.AutoFetch = this.autoFetch;
        this.settingsService.DarkMode = this.darkMode;
        this.settingsService.Diff2HtmlOutputFormat = this.diffFormate ? 'side-by-side' : 'line-by-line';

        if (this.gitExecutablePath) {
            this.settingsService.GitExecutablePath = this.gitExecutablePath;
            this.errorService.clearError();
        }
        if (this.darkMode) {
            this.renderer.setAttribute(this.document.body, 'cds-theme', 'dark');
        }
        else {
            this.renderer.setAttribute(this.document.body, 'cds-theme', '');
        }
    }

}
