import { Component, OnInit, Input } from '@angular/core';
import { File } from 'gitdiff-parser';

@Component({
    selector: 'commandos-diff-side-by-side',
    templateUrl: './diff-side-by-side.component.html',
    styleUrls: ['./diff-side-by-side.component.scss']
})
export class DiffSideBySideComponent implements OnInit {

    @Input()
    diff: File[];

    constructor() { }

    ngOnInit(): void {
    }

    onScrollLeft(e: any, idx: number) {
        this.onScroll(e, 'right', idx);
    }

    onScrollRight(e: any, idx: number) {
        this.onScroll(e, 'left', idx);
    }

    private onScroll(event: any, side: string, idx: number) {
        let scroll = event.srcElement.scrollLeft;
        const elem = document.getElementById(`block-${side}-${idx}`);
        elem.scrollLeft = scroll;
    }
}
