import { StoreService } from '@core/services';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import gitDiffParser, { File } from 'gitdiff-parser';

@Component({
    selector: 'commandos-diff',
    templateUrl: './diff.component.html',
    styleUrls: ['./diff.component.scss']
})
export class DiffComponent implements OnInit {

    diff: File[];
    outputFormat: string;

    @Input() text: string;

    @Input()
    set data(value: string) {
        if (value) {
            this.outputFormat = this.storeService.getDiffOutputFormat();
            this.diff = gitDiffParser.parse(value);
        }
    }


    constructor(private storeService: StoreService) { }

    ngOnInit(): void {
    }

    formatChange($event: any) {
        this.storeService.setDiffOutputFormat($event);
        this.outputFormat = $event;
    }

}
