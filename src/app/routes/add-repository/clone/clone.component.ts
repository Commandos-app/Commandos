import { harmonize, selectFolder, basename } from '@shared/functions';
import { RepositoryService } from './../../repository/repository.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LoggerService, RepositoriesSettingsService, StoreService } from '@core/services';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'commandos-clone-repository',
    templateUrl: './clone.component.html',
    styleUrls: ['./clone.component.scss']
})
export class CloneComponent implements OnInit {

    @ViewChild('form') addForm: NgForm;

    path = '';
    name = '';
    private repositoryURL: string;

    set url(value: string) {
        this.repositoryURL = value;
        this.setPathAndName();
    }
    get url() {
        return this.repositoryURL;
    }

    initGitRepo = false;

    constructor(
        private repositoriesSettingsService: RepositoriesSettingsService,
        private repositoryService: RepositoryService,
        private router: Router,
        private logger: LoggerService,
        private storeService: StoreService
    ) { }

    ngOnInit(): void {
        this.repositoryService.unload();
        this.path = this.storeService.getDefaultPath();

    }

    setPathAndName() {
        const path = harmonize(this.url);
        let name = basename(path);
        name = name.replace('.git', '');
        this.path = `${this.path}/${name}`;
        this.name = name.charAt(0).toUpperCase() + name.slice(1);;
    }


    async openDialog(): Promise<void> {
        const { path, name } = await selectFolder();
        if (path) {
            this.path = path;
            this.name = name;
            this.addForm.form.markAsDirty();
        }
    }

    async clone(): Promise<void> {
        this.logger.info(`Cloning repository ${this.url} to ${this.path}`);
        const nextId = await this.repositoriesSettingsService.cloneRepository(this.url, this.name, this.path);

        this.router.navigate(['/repository', nextId]);
    }

}
