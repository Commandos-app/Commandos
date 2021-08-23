import { Component, OnInit } from '@angular/core';
import { StoreService } from '@core/services';

@Component({
    selector: 'commander-split-layout',
    templateUrl: './split-layout.component.html',
    styleUrls: ['./split-layout.component.scss']
})
export class SplitLayoutComponent implements OnInit {

    paneSize: number;

    constructor(
        private storeService: StoreService
    ) { }

    ngOnInit(): void {
        this.paneSize = this.storeService.PaneSize;
    }

}
