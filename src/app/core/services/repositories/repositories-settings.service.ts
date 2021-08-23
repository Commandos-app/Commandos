import { Injectable } from '@angular/core';
import { StoreService } from '../store/store.service';
import { RepositoriesSettings, RepositorySetting } from '../store/store.types';

export type AddRepositoryParameter = { name: string, path: string };

@Injectable({
    providedIn: 'root'
})
export class RepositoriesSettingsService {

    constructor(
        private store: StoreService
    ) { }


    addRepository({ name, path }: AddRepositoryParameter): number {
        const repos = this.getRepositories();
        let nextId = 1;
        if (repos && repos.length > 0) {
            nextId = Math.max(...repos.map(r => r.id));
            nextId++;
        }

        const repo: RepositorySetting = { id: nextId, name, path, tags: [] };
        repos.push(repo);
        this.store.Repositories = repos;
        this.store.saveSettings();
        return nextId;
    }

    removeRepository(id: number): void {
        const repos = this.getRepositories();
        const newRepos = repos.filter(r => r.id !== id);
        this.store.Repositories = newRepos;
    }

    getRepositories(): RepositoriesSettings {
        return this.store.Repositories;
    }

    getRepositoriesByTag(tag: string): RepositoriesSettings {
        const repos = this.store.Repositories;
        return repos.filter(r => r.tags && r.tags.includes(tag));
    }

    getRepository(id: number): RepositorySetting {
        const repos = this.getRepositories();
        const repo = repos.find(r => r.id === id);
        return repo || <RepositorySetting>{};
    }

    addTagToRepo(id: number, tags: Array<string>): void {
        const repos = this.getRepositories();
        const repo = repos.find(r => r.id === id);
        repo.tags = tags;
        this.store.Repositories = repos;
    }

    saveRepo(repo: RepositorySetting): void {
        const allRepos = this.getRepositories();
        const idxRepo = allRepos.findIndex(r => r.id === repo.id);
        allRepos[idxRepo] = repo;
        this.store.Repositories = allRepos;
    }
}
