import { NotificationService } from './../notification/notification.service';
import { environment } from '@env/environment';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService, TauriService } from '@core/services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    isMaximised = false;
    isMenuOpen = false;
    version = '0.0.1';

    constructor(
        public errorService: ErrorService,
        public tauriService: TauriService,
        private cd: ChangeDetectorRef,
        private router: Router,
        private notificationService: NotificationService
    ) {
    }


    ngOnInit(): void {
        this.tauriService.windowState$
            .subscribe((state) => {
                this.isMaximised = state === 'maximized';
                this.cd.detectChanges();
            });
        this.loadVersion();
    }

    async loadVersion() {
        const version = await this.tauriService.getVersion();
        this.version = `v${version}${environment.versionPostfix}`;
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
        this.isMenuOpen = false;
    }

    closeClient(): void {
        this.tauriService.closeClient();
    }

    goto(page: string) {
        this.router.navigate([page]);
        this.isMenuOpen = false;
    }

    async checkUpdate() {
        try {
            await this.tauriService.checkUpdate();
        } catch {
            this.isMenuOpen = false;
            this.notificationService.addNotification('info', 'Commandos ist up to date :-D', 5000);
        }
    }

}
