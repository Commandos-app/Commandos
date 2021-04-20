import { Branch } from '@git/model';
import { RepositoryService } from '@routes/repository/repository.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'commander-branch-ahead-behind',
    templateUrl: './branch-ahead-behind.component.html',
    styleUrls: ['./branch-ahead-behind.component.scss']
})
export class BranchAheadBehindComponent implements OnInit {

    @Input() noColor = false;

    @Input() branch: Branch;

    constructor(
        private repositoryService: RepositoryService
    ) { }

    ngOnInit(): void {
    }
}
