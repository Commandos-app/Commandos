import { RepositoryService } from './../repository/repository.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesSettings, RepositoriesSettingsService } from '@core/services';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    repositories: RepositoriesSettings = [];

    constructor(
        private router: Router,
        private repos: RepositoriesSettingsService,
        private repositoryService: RepositoryService
    ) { }

    ngOnInit(): void {
        this.repositoryService.unload();
        this.loadRepos();
    }

    loadRepos(): void {
        this.repositories = this.repos.getRepositories();
    }

    openRepository(id: number): void {
        this.router.navigate(['repository', id]);
    }
}
