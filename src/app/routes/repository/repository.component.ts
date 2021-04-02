import { LoggerService } from '@core/services';
import { RepositoryService } from './repository.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { invoke } from '@tauri-apps/api/tauri';

@Component({
    selector: 'app-repository',
    templateUrl: './repository.component.html',
    styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        public repositoryService: RepositoryService,
        private logger: LoggerService
    ) {
        // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    }

    ngOnInit(): void {
        this.activeRoute.params.subscribe((params) => {
            this.repositoryService.setId(params.id);
            this.repositoryService.loadRepositorySetting();
            this.repositoryService.loadGitRepository();
        });
    }
    async invokeIt() {
        const rtn: string = await invoke('logging', { message: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum ', level: 4 });
        this.logger.trace(rtn);

    }

}
