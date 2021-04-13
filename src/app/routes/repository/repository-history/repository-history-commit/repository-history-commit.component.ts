import { StoreService } from '@core/services';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../repository.service';
import { LogItem } from '@git/model';
import { Differ } from '@shared/functions';

@Component({
    selector: 'commander-repository-history-commit',
    templateUrl: './repository-history-commit.component.html',
    styleUrls: ['./repository-history-commit.component.scss']
})
export class RepositoryHistoryCommitComponent implements OnInit {

    sha!: string;
    isLoading = true;
    metadata: LogItem;

    constructor(
        private route: ActivatedRoute,
        private repositoryService: RepositoryService,
        private storeService: StoreService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.sha = params['sha'];
            this.load();
        });
    }

    async load(): Promise<void> {
        this.isLoading = true;
        const value = await this.repositoryService.getChangesOfSha(this.sha);
        this.metadata = await this.repositoryService.getChangesMetaDataOfSha(this.sha);

        const outputFormat = this.storeService.getDiff2HtmlOutputFormat()
        Differ('diffoutput', value, outputFormat);
        this.isLoading = false;
    }

    copy() {

    }
}
