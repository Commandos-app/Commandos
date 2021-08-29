import { TauriService } from '@core/services';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'commandos-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    version = 'not set!';
    constructor(
        public tauriService: TauriService
    ) { }

    ngOnInit(): void {
        this.loadVersion();
    }

    async loadVersion() {
        const version = await this.tauriService.getVersion();
        this.version = `v${version}`;
    }


}
