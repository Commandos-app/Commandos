import { Component, OnInit } from '@angular/core';
import { ErrorService } from '@core/services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(
        public errorService: ErrorService
    ) { }

    ngOnInit(): void {
    }

    minimize(): void {
        // this.electronService.minimize();
    }

    maximize(): void {
        // this.electronService.maximize();
    }

    restore(): void {
        // this.electronService.restore();
    }

    closeClient(): void {
        // this.electronService.close();
    }
}
