import { Component, OnInit, Input } from '@angular/core';
import { File } from 'gitdiff-parser';

@Component({
    selector: 'commandos-diff-side-by-side',
    templateUrl: './diff-side-by-side.component.html',
    styleUrls: ['./diff-side-by-side.component.scss'],
})
export class DiffSideBySideComponent implements OnInit {
    @Input()
    diff: File[];

    constructor() {}

    ngOnInit(): void {}

    onScrollLeft(e: any, fileIdx: number, hunkIdx: number) {
        this.onScroll(e, 'right', fileIdx, hunkIdx);
    }

    onScrollRight(e: any, fileIdx: number, hunkIdx: number) {
        this.onScroll(e, 'left', fileIdx, hunkIdx);
    }

    private onScroll(event: any, side: string, fileIdx: number, hunkIdx: number) {
        let scroll = event.srcElement.scrollLeft;
        const elem = document.getElementById(`block-${side}-${fileIdx}-${hunkIdx}`);
        elem.scrollLeft = scroll;
    }
}
