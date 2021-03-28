import { ErrorService } from '@core/services/error/error.service';
import { Component, OnInit } from '@angular/core';
import {  SettingsService, GitService } from '@core/services';


@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export class BaseLayoutComponent implements OnInit {


    show = false;

    gitNotSet = true;
    openModal = false;
    currentId = 0;

    showProgress = false;
    isMaximized = false;

    constructor(
        private gitService: GitService,
        public settingsService: SettingsService,

        public errorService: ErrorService
    ) {

    }

    ngOnInit(): void {
        this.gitNotSet = !this.settingsService.GitExecutablePath;
    }


    action(command: string): void {
        this.openModal = true;
    }

}
