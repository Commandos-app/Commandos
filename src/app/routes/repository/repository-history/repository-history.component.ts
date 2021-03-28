import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SettingsService } from '@core/services';
import { RepositoryService } from '../repository.service';
import { filter, first } from 'rxjs/operators';
import { LogItem } from '@git/model';


@Component({
    selector: 'app-repository-history',
    templateUrl: './repository-history.component.html',
    styleUrls: ['./repository-history.component.scss']
})
export class RepositoryHistoryComponent implements OnInit {

    commits: Array<LogItem>;
    commitsCount = 0;
    items = Array.from({ length: 1000 }, (v, k) => k + 1);

    constructor(
        private cd: ChangeDetectorRef,
        public settingsService: SettingsService,
        private repositoryService: RepositoryService
    ) {
    }

    ngOnInit(): void {
        this.repositoryService.loaded$.pipe(filter(x => x), first()).subscribe(() => {
            this.getHeadCommits();
        });
    }

    async getHeadCommits(): Promise<void> {
        try {
            this.commits = await this.repositoryService.getHistroy();
        } catch (er) {
            alert(er);
        }
    }

}
