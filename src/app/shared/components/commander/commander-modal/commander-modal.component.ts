import { RepositoryService } from '@routes/repository/repository.service';
import { FieldDefinition, SelectedRepositoryTypes } from './../types';
import { RepositoriesSettings, StoreService } from '@core/services';
import { RepositoriesSettingsService } from '@core/services';
import { CommanderModalService } from './commander-modal.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { getBranches } from '@git/commands';
import { parseBranches } from '@git/parsers';

type FormData = { [key: string]: any };

@Component({
    selector: 'app-commander-modal',
    templateUrl: './commander-modal.component.html',
    styleUrls: ['./commander-modal.component.scss']
})
export class CommanderModalComponent implements OnInit {

    items: Array<SelectedRepositoryTypes> = [];
    branches: Array<string> = [];
    selected: SelectedRepositoryTypes = null;

    @HostListener('window:keydown.esc', ['$event.target'])
    closeModalListener(): void {
        this.commanderModalService.closeModal();
    }


    constructor(
        public commanderModalService: CommanderModalService,
        private repositoriesSettingsService: RepositoriesSettingsService,
        private storeService: StoreService,
        public repositoryService: RepositoryService
    ) { }

    ngOnInit(): void {
        this.addAll();
        this.loadTags();
        this.loadRepos();
    }

    run(): void {
        const repos = this.loadSelectedRepos(this.selected);
        const formData: FormData = {};

        this.commanderModalService.fields
            .forEach((field) => {
                formData[field.name] = field.value;
            });

        const param = { repos, formData };
        this.commanderModalService.run(param);
    }

    async onRepositoriesSelected(event: SelectedRepositoryTypes): Promise<void> {

        if (event) {
            const repos = this.loadSelectedRepos(event);
            this.branches = [];
            let branchSet = new Set<string>();
            for (let index = 0; index < repos.length; index++) {
                const repo = repos[index];
                const branches = await getBranches(repo.path);
                if (branches) {
                    const parsedBranches = parseBranches(branches);

                    branchSet = new Set([...branchSet, ...parsedBranches.map(branch => branch.name)]);
                }
            }
            this.branches = [...branchSet];
            this.branches = this.branches.sort();
        }
        else {
            this.branches = [];
        }

    }

    private addAll() {
        this.items.push({
            type: 'All',
            text: 'All Repositories'
        });
    }

    private loadSelectedRepos(selected: SelectedRepositoryTypes): RepositoriesSettings {
        switch (selected.type) {
            case 'Tag':
                return this.repositoriesSettingsService.getRepositoriesByTag(selected.text);
            case 'Repository':
                return [this.repositoriesSettingsService.getRepository(selected.id)];
            case 'All':
                return this.repositoriesSettingsService.getRepositories();
            default:
                return [];
        }
    }

    private async loadTags(): Promise<void> {
        const tags = await this.storeService.getTags();
        const mapedTags = tags.map<SelectedRepositoryTypes>(tag => ({ type: 'Tag', text: tag }));

        this.items.push(...mapedTags);
    }

    private loadRepos(): void {
        const repos = this.repositoriesSettingsService.getRepositories();
        const mapedRepos = repos.map<SelectedRepositoryTypes>(repo => ({ type: 'Repository', text: repo.name, id: repo.id }));

        this.items.push(...mapedRepos);
    }

}
