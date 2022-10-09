import { BehaviorSubject } from 'rxjs';
import { RepositoryService } from '@routes/repository/repository.service';
import { SelectedRepositoryTypes } from './../types';
import { RepositoriesSettings, StoreService } from '@core/services';
import { RepositoriesSettingsService } from '@core/services';
import { CommanderModalService } from './commander-modal.service';
import { Component, HostListener, OnInit, ChangeDetectorRef, OnChanges } from '@angular/core';
import { getBranches } from '@git/commands';
import { parseBranches } from '@git/parsers';

type FormData = { [key: string]: any };

@Component({
    selector: 'app-commander-modal',
    templateUrl: './commander-modal.component.html',
    styleUrls: ['./commander-modal.component.scss'],
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
        public repositoryService: RepositoryService,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.addAll();
        this.loadTags();
        this.loadRepos();
        this.checkIfRepoIsSelected();
        this.sortActiveRepoToTop();
    }

    private checkIfRepoIsSelected(): void {
        const selected = this.commanderModalService.fields.find((field) => field.type === 'repository');
        if (selected) {
            const repoType: SelectedRepositoryTypes = {
                type: 'Repository',
                text: 'Repository',
                id: this.repositoryService.currentId,
            };
            this.onRepositoriesSelected(repoType);
        }
    }

    run(): void {
        const repos = this.loadSelectedRepos(this.selected);
        const formData: FormData = {};

        this.commanderModalService.fields.forEach((field) => {
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
                const { stdout: branches } = await getBranches(repo.path);
                if (branches) {
                    const parsedBranches = parseBranches(branches);

                    branchSet = new Set([...branchSet, ...parsedBranches.map((branch) => branch.name)]);
                }
            }
            this.branches = [...branchSet];
            this.branches = this.branches.sort();
        } else {
            this.branches = [];
        }
    }

    private loadSelectedRepos(selected: SelectedRepositoryTypes): RepositoriesSettings {
        switch (selected?.type) {
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

    private addAll(): void {
        this.items.push({
            type: 'All',
            text: 'All Repositories',
        });
    }

    private loadTags(): void {
        const tags = this.storeService.Tags;
        const mapedTags = tags.map<SelectedRepositoryTypes>((tag) => ({ type: 'Tag', text: tag }));

        this.items.push(...mapedTags);
    }

    private loadRepos(): void {
        const repos = this.repositoriesSettingsService.getRepositories();
        const mapedRepos = repos.map<SelectedRepositoryTypes>((repo) => ({ type: 'Repository', text: repo.name, id: repo.id }));

        this.items.push(...mapedRepos);
    }

    private sortActiveRepoToTop(): void {
        const activeRepo = this.items.find((item) => item.id === this.repositoryService.currentId);
        if (activeRepo) {
            this.items = this.items.filter((item) => item !== activeRepo);
            activeRepo.type = 'Current Repository';
            this.items = [activeRepo, ...this.items];
        }
    }
}
