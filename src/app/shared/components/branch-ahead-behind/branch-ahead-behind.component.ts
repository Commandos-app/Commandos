import { Component, Input, OnInit } from '@angular/core';
import { Branch } from '@git/model';

@Component({
    selector: 'commandos-branch-ahead-behind',
    templateUrl: './branch-ahead-behind.component.html',
    styleUrls: ['./branch-ahead-behind.component.scss']
})
export class BranchAheadBehindComponent implements OnInit {

    @Input() noColor = false;

    @Input() branch: Branch;

    constructor(
    ) { }

    ngOnInit(): void {
    }
}
