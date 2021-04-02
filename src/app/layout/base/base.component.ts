import { ErrorService } from '@core/services/error/error.service';
import { Component, OnInit } from '@angular/core';
import { GitService } from '@core/services';


@Component({
    selector: 'app-base',
    templateUrl: './base.component.html',
    styleUrls: ['./base.component.scss']
})
export class BaseLayoutComponent implements OnInit {


    show = false;

    openModal = false;
    currentId = 0;

    showProgress = false;
    isMaximized = false;

    constructor(
        private gitService: GitService,
        public errorService: ErrorService
    ) {

    }

    ngOnInit(): void {
    }


    action(command: string): void {
        this.openModal = true;
    }

}
