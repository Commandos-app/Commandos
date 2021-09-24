import { Component, OnInit } from '@angular/core';
import { RepositoryService } from '@routes/repository/repository.service';

@Component({
    selector: 'commandos-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    constructor(
        public repositoryService: RepositoryService
    ) { }

    ngOnInit(): void {
    }

    sync() {
        this.repositoryService.sync();
    }
}
