import { filter, take } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';
import { GroupByOptions, RepositoriesSettingsGroup, RepositoriesSettingsGrouped, RepositorySetting, StoreService } from '@core/services';
import { RepositoryService } from './../repository/repository.service';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesSettings, RepositoriesSettingsService } from '@core/services';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { fromEvent, merge, Subscription } from 'rxjs';
import { open } from '@tauri-apps/api/shell';
import { Clipboard } from '@angular/cdk/clipboard';
import { invoke } from '@tauri-apps/api/tauri';
import { groupBy, sortByProperty } from '@shared/functions';
import { FilterByPipe } from 'ngx-pipes';
import Fuse from 'fuse.js'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    private repositories: RepositoriesSettings = [];
    repositoriesGrouped: RepositoriesSettingsGrouped = [];

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
        this.handleGroupAndFilter(this.storeService.RepoGroupBy);
    }

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
        // const groupValue = this.storeService.RepoGroupBy;
        this.createFuzzySearch();
        this.handleGroupAndFilter('none');
    }

    loadRepos(): void {
        this.repositories = this.repos.getRepositories();
    }

    openRepository(id: number): void {
        this.router.navigate(['repository', id]);
    }

    // openContext(, $event: Event) {
    //     $event.preventDefault();
    //     $event.stopPropagation();
    // }

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

        // const windows = navigator.userAgent.includes('Windows');
        // let cmd = windows ? 'cmd' : 'sh';
        // let args = windows ? ['/C'] : ['-c'];
        // let script = 'echo "hello world"';
        // const command = new Command(cmd, [...args, script]);
        // command.spawn();
        // open('cmd', path);
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


    toggleFolderGroup() {
        const type = this.storeService.RepoGroupBy === 'tags' ? 'none' : 'tags';
        this.handleGroupAndFilter(type);
    }

    toggleTagsGroup() {
        const type = this.storeService.RepoGroupBy === 'tags' ? 'none' : 'tags';
        this.handleGroupAndFilter(type);
    }

    filterRepositories(): RepositoriesSettings {

        let search = highlight(this.fuse.search(this.searchText));
        console.log(`TCL: ~ file: home.component.ts ~ line 158 ~ HomeComponent ~ filterRepositories ~ seach`, search);
        let repos: any = search; //.map(item => item.item);
        // let repos = new FilterByPipe().transform<RepositoriesSettings>(this.repositories, ['name', 'path', 'tags'], this.searchText);
        if (repos.length === 0) {
            repos = this.repositories;
        }
        return repos;
    }


    private handleGroupAndFilter(type: GroupByOptions) {
        const repos = this.filterRepositories();
        switch (type) {
            case 'none': this.groupNone(repos); break;
            case 'tags': this.groupTags(repos); break;
            case 'folder': this.groupFolder(repos); break;
            default: this.groupNone(repos); break;
        }
        this.storeService.RepoGroupBy = type;
    }


    private groupFolder(repos: RepositoriesSettings) {
        const repositoriesGrouped = groupBy(repos, (t: any) => t.path.substring(0, t.path.lastIndexOf('/')));
        this.repositoriesGrouped = repositoriesGrouped.map(group => ({
            title: group.title.substring(group.title.lastIndexOf('/') + 1, group.title.length),
            path: group.title,
            repositories: group.repositories
        }));
    }

    private groupTags(repos: RepositoriesSettings) {
        const repositoriesGrouped = groupBy(repos, (t: any) => t.tags[0] ?? '---');
        this.repositoriesGrouped = repositoriesGrouped.sort(sortByProperty('title'));
    }

    private groupNone(repos: RepositoriesSettings) {
        const group: RepositoriesSettingsGroup = {
            repositories: repos
        }
        group.repositories.sort(sortByProperty('name'));
        this.repositoriesGrouped = [group];
    }

    private createFuzzySearch() {
        const options = {
            // isCaseSensitive: false,
            includeScore: true,
            // shouldSort: true,
            includeMatches: true,
            // findAllMatches: false,
            // minMatchCharLength: 1,
            // location: 0,
            threshold: 0.3,
            // distance: 100,
            // useExtendedSearch: false,
            ignoreLocation: true,
            // ignoreFieldNorm: false,
            keys: ['name', 'path']
        };
        this.fuse = new Fuse(this.repositories, options);
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
