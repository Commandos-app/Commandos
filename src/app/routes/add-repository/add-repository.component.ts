import { RepositoryService } from './../repository/repository.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService, RepositoriesSettingsService } from '@core/services';
import { open } from "@tauri-apps/api/dialog";


@Component({
    selector: 'app-add-repository',
    templateUrl: './add-repository.component.html',
    styleUrls: ['./add-repository.component.scss']
})
export class AddRepositoryComponent implements OnInit {

    path = '';
    name = '';

    initGitRepo = false;

    constructor(
        private repositoriesSettingsService: RepositoriesSettingsService,
        private repositoryService: RepositoryService,
        private router: Router,
        private logger: LoggerService
    ) { }

    ngOnInit(): void {
        this.repositoryService.unload();
    }


    async openDialog(): Promise<void> {
        const filePath: string = await open({ /*defaultPath: 'd:\\_WORK',*/ directory: true }) as string;
        // const [filePath] = filePaths;
        if (filePath) {
            this.path = filePath.replace(/\\\\/g, '/');
            this.name = this.path; //path.basename(filePath);
            console.log(`TODO!: ~ file: add-repository.component.ts ~ line 38 ~ AddRepositoryComponent ~ openDialog ~ this.path`, this.path);
        }
    }

    async saveRepo(): Promise<void> {
        this.initGitRepo && await this.initializeGitRepo();

        const nextId = this.repositoriesSettingsService.addRepository({
            name: this.name,
            path: this.path
        });

        this.router.navigate(['/repository', nextId]);
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private async initializeGitRepo() {
        this.logger.warn('TODO Implement initializeGitRepo');
        // return this.electron.git.Repository.init(this.branchPath, 0);
    }

}
