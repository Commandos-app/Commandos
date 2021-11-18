import { Clipboard } from '@angular/cdk/clipboard';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { GroupByOptions, RepositoriesSettings, RepositoriesSettingsService, RepositorySetting, StoreService } from '@core/services';
import { sortByProperty } from '@shared/functions';
import { open } from '@tauri-apps/api/shell';
import { invoke } from '@tauri-apps/api/tauri';
import Fuse from 'fuse.js';
import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { RepositoryService } from './../repository/repository.service';


type tag = {
    selected: boolean,
    name: string
}
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    private repositories: RepositoriesSettings = [];
    filtredRepositories: RepositoriesSettings = [];

    @ViewChild('userMenu') userMenu: TemplateRef<any>;
    overlayRef: OverlayRef | null;
    sub: Subscription;
    private fuse: Fuse<RepositorySetting>;

    private filterText: string = '';
    get searchText(): string {
        return this.filterText;
    }

    set searchText(value: string) {
        this.filterText = value;
        this.handleFilter();
    }

    isFilterOpen = false;
    isGroupOpen = false;
    tags: tag[] = [];
    emptyTag: tag = { selected: false, name: 'No tags' };
    isTagFilterActive = false;

    constructor(
        private router: Router,
        private repos: RepositoriesSettingsService,
        private repositoryService: RepositoryService,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef,
        private clipboard: Clipboard,
        private storeService: StoreService
    ) { }

    ngOnInit(): void {
        this.repositoryService.unload();
        this.loadRepos();
        this.repositoryService.clearUIBranches();
        // for now it is deactivated.
        this.handleFilter();
        const test = this.storeService.get<string[]>('tags', []);
        this.tags = test.map(tag => ({ selected: false, name: tag }));
        this.tags.sort((a, b) => a.name.localeCompare(b.name));
        this.tags.push(this.emptyTag);
    }

    loadRepos(): void {
        this.repositories = this.repos.getRepositories();
    }

    openRepository(id: number): void {
        this.router.navigate(['repository', id]);
    }


    openCmd(path: string): void {
        open(path);
        this.close();
    }

    openCode(path: string): void {
        open(path, 'code');
        this.close();
    }

    openTerminal(path: string): void {

        invoke('open_cmd', { path });
        this.close();
    }

    copyPath(path: string): void {
        this.clipboard.copy(path);
        this.close();
    }

    openContext($event: MouseEvent, repo: RepositorySetting) {
        $event.preventDefault();
        $event.stopPropagation();
        const { x, y } = $event;
        this.close();
        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo({ x, y })
            .withPositions([
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        this.overlayRef.attach(new TemplatePortal(this.userMenu, this.viewContainerRef, {
            $implicit: repo
        }));

        this.sub = merge(
            fromEvent<MouseEvent>(document, 'click'),
            fromEvent<MouseEvent>(document, 'contextmenu')
        )
            .pipe(
                filter(event => {
                    const clickTarget = event.target as HTMLElement;
                    return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
                }),
                take(1)
            )
            .subscribe(() => this.close());

    }


    toggle(tag: tag) {
        tag.selected = !tag.selected;
        this.handleFilter();
    }

    clearTagFilter() {
        this.tags.forEach(tag => tag.selected = false);
        this.handleFilter();
    }

    filterRepositories(): RepositoriesSettings {
        const selectedTags = this.tags.filter(tag => tag.selected).map(tag => tag.name);
        this.isTagFilterActive = selectedTags.length > 0;
        let reposFiltredByTags = this.repositories.filter(repo => {
            return selectedTags.some(tag => repo.tags.includes(tag) || (this.emptyTag.selected && repo.tags.length === 0));
        });

        if (reposFiltredByTags.length === 0) {
            this.isTagFilterActive = false;
            reposFiltredByTags = this.repositories;
        }

        this.createFuzzySearch(reposFiltredByTags);
        const searchResult = this.fuse.search(this.searchText);
        searchResult.forEach(repo => {
            repo.item.pathOrig = repo.item.path;
        });

        let search = highlight(searchResult);
        if (search.length === 0) {
            search = reposFiltredByTags;
        }
        return search;
    }


    handleFilter() {
        const repos = this.filterRepositories();
        this.filtredRepositories = repos.sort(sortByProperty('name'));
    }


    private createFuzzySearch(repos: RepositoriesSettings = this.repositories) {
        const options = {
            // isCaseSensitive: false,
            includeScore: true,
            // shouldSort: true,
            includeMatches: true,
            // findAllMatches: false,
            //minMatchCharLength: 2,
            // location: 0,
            //threshold: 0.3,
            //distance: 100,
            // useExtendedSearch: false,
            //ignoreLocation: true,
            // ignoreFieldNorm: false,
            keys: ['name', 'path']
        };
        this.fuse = new Fuse(repos, options);
    }


    close() {
        this.sub && this.sub.unsubscribe();
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

}


const highlight = (fuseSearchResult: any, highlightClassName: string = 'commandos-highlight') => {
    const set = (obj: any, path: string, value: any) => {
        const pathValue = path.split('.');
        let i;

        for (i = 0; i < pathValue.length - 1; i++) {
            obj = obj[pathValue[i]];
        }

        obj[pathValue[i]] = value;
    };

    const generateHighlightedText = (inputText: string, regions: number[] = []) => {
        let content = '';
        let nextUnhighlightedRegionStartingIndex = 0;

        regions.forEach((region: any) => {
            const lastRegionNextIndex = region[1] + 1;

            content += [
                inputText.substring(nextUnhighlightedRegionStartingIndex, region[0]),
                `<b class="${highlightClassName}">`,
                inputText.substring(region[0], lastRegionNextIndex),
                '</b>',
            ].join('');

            nextUnhighlightedRegionStartingIndex = lastRegionNextIndex;
        });

        content += inputText.substring(nextUnhighlightedRegionStartingIndex);

        return content;
    };

    return fuseSearchResult
        .filter(({ matches }: any) => matches && matches.length)
        .map(({ item, matches }: any) => {
            const highlightedItem = { ...item };

            matches.forEach((match: any) => {
                set(highlightedItem, match.key, generateHighlightedText(match.value, match.indices));
            });

            return highlightedItem;
        });
};
