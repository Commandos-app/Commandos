import { SettingsService } from '@core/services';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as Diff2Html from 'diff2html/lib-esm/diff2html';
import { RepositoryService } from '../../repository.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'commander-repository-history-commit',
    templateUrl: './repository-history-commit.component.html',
    styleUrls: ['./repository-history-commit.component.scss']
})
export class RepositoryHistoryCommitComponent implements OnInit {

    sha!: string;
    outputHtml!: SafeHtml;
    isLoading = true;

    constructor(
        private route: ActivatedRoute,
        private repositoryService: RepositoryService,
        private sanitizer: DomSanitizer,
        private settingsService: SettingsService
    ) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.sha = params['sha'];
            this.load();
        });
    }

    async load(): Promise<void> {
        this.isLoading = true;
        this.outputHtml = '';
        const strInput = await this.repositoryService.getChangedOfSha(this.sha);
        const outputHtml = Diff2Html.html(strInput, {
            drawFileList: false,
            matching: 'lines',
            outputFormat: this.settingsService.Diff2HtmlOutputFormat,
            renderNothingWhenEmpty: true
        });
        this.isLoading = false;
        this.outputHtml = this.sanitizer.bypassSecurityTrustHtml(outputHtml);
    }

}
