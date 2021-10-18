
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '../../repository.service';
import { LogItem } from '@git/model';
import { Differ, DifferParse } from '@shared/functions';
import { DiffFile } from 'diff2html/lib/types';
import gitDiffParser, { File } from 'gitdiff-parser';

@Component({
    selector: 'commandos-repository-history-commit',
    templateUrl: './repository-history-commit.component.html',
    styleUrls: ['./repository-history-commit.component.scss']
})
export class RepositoryHistoryCommitComponent implements OnInit {

    sha!: string;
    isLoading = true;
    metadata: LogItem;
    data: string;

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
        const value = await this.repositoryService.getChangesOfSha(this.sha);
        this.metadata = await this.repositoryService.getChangesMetaDataOfSha(this.sha);

        // Differ('diffoutput', value, { outputFormat });
        // this.data = DifferParse(value, { outputFormat });
        if (value) {
            this.data = value?.stdout;
        } else {
            this.data = "";
        }
        this.isLoading = false;
    }

    copy() {

    }
}
