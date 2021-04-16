import { Component, OnInit } from '@angular/core';
import { ErrorService, TauriService } from '@core/services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {



    constructor(
        public errorService: ErrorService,
        public tauriService: TauriService
    ) { }

    ngOnInit(): void {
    }

    minimize(): void {
        this.tauriService.minimize();
    }

    maximize(): void {
        this.tauriService.maximize();
    }

    unmaximize(): void {
        this.tauriService.unmaximize();
    }

    closeClient(): void {
        this.tauriService.closeClient();
    }
}
