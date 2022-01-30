import { selectFolder } from '@shared/functions';
import { RepositoryService } from './../repository/repository.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService, RepositoriesSettingsService } from '@core/services';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-add-repository',
    templateUrl: './add-repository.component.html',
    styleUrls: ['./add-repository.component.scss'],
})
export class AddRepositoryComponent implements OnInit {
    @ViewChild('form') addForm: NgForm;

    path = '';
    name = '';

    initGitRepo = false;

    constructor(
        private repositoriesSettingsService: RepositoriesSettingsService,
        private repositoryService: RepositoryService,
        private router: Router,
        private logger: LoggerService,
    ) {}

    ngOnInit(): void {
        this.repositoryService.unload();
    }

    async openDialog(): Promise<void> {
        const { path, name } = await selectFolder();
        if (path) {
            this.path = path;
            this.name = name;
            this.addForm.form.markAsDirty();
        }
    }

    async saveRepo(): Promise<void> {
        this.initGitRepo && (await this.initializeGitRepo());

        const nextId = this.repositoriesSettingsService.addRepository({
            name: this.name,
            path: this.path,
        });

        this.router.navigate(['/repository', nextId]);
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private async initializeGitRepo() {
        this.logger.warn('TODO Implement initializeGitRepo');
        // return this.electron.git.Repository.init(this.branchPath, 0);
    }
}
