import { Component, OnInit } from '@angular/core';
import { ErrorService } from '@core/services';
import { appWindow } from '@tauri-apps/api/window'

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
        appWindow.minimize();
    }

    maximize(): void {
        appWindow.maximize();
    }

    restore(): void {
        // this.electronService.restore();
    }

    closeClient(): void {
        appWindow.close();
    }
}
