import { StoreService } from '@core/services';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import gitDiffParser, { File } from 'gitdiff-parser';

@Component({
    selector: 'commander-commandos-diff',
    templateUrl: './commandos-diff.component.html',
    styleUrls: ['./commandos-diff.component.scss']
})
export class CommandosDiffComponent implements OnInit {

    diff: File[];

    @Input()
    set data(value: string) {
        const outputFormat = this.storeService.getDiff2HtmlOutputFormat();
        this.diff = gitDiffParser.parse(value);
    }


    constructor(private storeService: StoreService) { }

    ngOnInit(): void {
    }



}
