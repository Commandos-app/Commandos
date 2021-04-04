import { StoreService } from '@core/services';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../repository.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LogItem } from '@git/model';

@Component({
    selector: 'commander-repository-history-commit',
    templateUrl: './repository-history-commit.component.html',
    styleUrls: ['./repository-history-commit.component.scss']
})
export class RepositoryHistoryCommitComponent implements OnInit {

    sha!: string;
    isLoading = true;
    metadata: LogItem;
    changes: string;

    constructor(
        private route: ActivatedRoute,
        private repositoryService: RepositoryService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.sha = params['sha'];
            this.load();
        });
    }

    async load(): Promise<void> {
        this.isLoading = true;
        this.changes = await this.repositoryService.getChangesOfSha(this.sha);
        this.metadata = await this.repositoryService.getChangesMetaDataOfSha(this.sha);
        this.isLoading = false;
    }

    copy() {
        
    }
}
