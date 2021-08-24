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
        private router: Router
    ) {
        this.version = environment.version;
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
        this.isMenuOpen = false;
    }

    closeClient(): void {
        this.tauriService.closeClient();
    }

    goto(page: string) {
        this.router.navigate([page]);
        this.isMenuOpen = false;
    }
}
