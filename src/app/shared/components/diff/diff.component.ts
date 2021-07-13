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

    @Input()
    set data(value: string) {
        if (value) {
            this.outputFormat = this.storeService.getDiffOutputFormat();
            this.diff = gitDiffParser.parse(value);
            console.log(`TCL: ~ file: diff.component.ts ~ line 20 ~ DiffComponent ~ setdata ~ this.diff`, this.diff);
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
