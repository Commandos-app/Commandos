import { CommanderService } from './../commander/commander.service';
import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '@routes/repository/repository.service';
import { sleep } from '@shared/functions';

@Component({
    selector: 'commandos-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    isSync = false;

    constructor(
        public repositoryService: RepositoryService,
        private commanderService: CommanderService
    ) { }

    ngOnInit(): void {
    }

    async sync() {
        this.isSync = true;
        await this.repositoryService.sync();
        this.commanderService.reloadData();
        this.repositoryService.loadAheadBehindOfCurrentBranch();
        await sleep(1000);
        this.isSync = false;
    }
}
