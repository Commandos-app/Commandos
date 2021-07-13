import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ErrorService, TauriService } from '@core/services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isMaximised = false;
    isOpen = false;

    constructor(
        public errorService: ErrorService,
        public tauriService: TauriService,
        private cd: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.tauriService.windowState$
            .subscribe((state) => {
                this.isMaximised = state === 'maximized';
                this.cd.detectChanges();
            });
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

    pin() {
        this.tauriService.tooglePin();
    }

    closeClient(): void {
        this.tauriService.closeClient();
    }
}
