import { Component, Input, OnInit } from '@angular/core';
import { File } from 'gitdiff-parser';

@Component({
    selector: 'commandos-diff-line-by-line',
    templateUrl: './diff-line-by-line.component.html',
    styleUrls: ['./diff-line-by-line.component.scss']
})
export class DiffLineByLineComponent implements OnInit {

    @Input()
    diff: File[];

    constructor() { }

    ngOnInit(): void {
    }

}
