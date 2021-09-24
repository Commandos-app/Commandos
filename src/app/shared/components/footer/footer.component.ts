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
        public repositoryService: RepositoryService
    ) { }

    ngOnInit(): void {
    }

    async sync() {
        this.isSync = true;
        await this.repositoryService.sync();
        await sleep(2000);
        this.isSync = false;
    }
}
