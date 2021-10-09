import { Clipboard } from '@angular/cdk/clipboard';
import { CommanderService } from './../commander/commander.service';
import { CommanderModalService } from '@shared/services';
import { RepositoryService } from '@routes/repository/repository.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { RepositoriesSettingsService } from '@core/services';
import { sleep, LoadingState } from '@shared/functions';
import { FieldDefinition } from '..';
import { invoke } from '@tauri-apps/api';
import { open } from '@tauri-apps/api/shell';

type NewBranch = {
    pushRemote?: boolean;
    override?: boolean;
    checkout?: boolean;
    branchName?: string;
};

type branches = Array<{ name: string; remote?: boolean }>;

@Component({
    selector: 'app-subnav',
    templateUrl: './subnav.component.html',
    styleUrls: ['./subnav.component.scss']
})
export class SubnavComponent implements OnInit {

    currentId = 0;
    branches: branches = [];
    repositories: any[];
    isSyncing: LoadingState = 'default';
    isMenuOpen = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public repositoryService: RepositoryService,
        public repositoriesSettingsService: RepositoriesSettingsService,
        private commanderModalService: CommanderModalService,
        private clipboard: Clipboard,
        private commanderService: CommanderService
    ) { }

    ngOnInit(): void {
        this.repositoryService.loaded$.pipe(filter(x => x), first()).subscribe(() => {
            this.repositoryService.getBranches();
        });
        this.repositories = this.repositoriesSettingsService.getRepositories();
    }


    navigate(id: number): void {
        this.currentId = id;
        const oldURL = this.router.url;

        if (oldURL.indexOf('/repository/') >= 0) {
            this.router.navigate(this.replacePathArrayId(id))
        } else {
            this.router.navigate(['/repository', id]);
        }

    }

    openNewBranch($event: Event): void {
        $event.preventDefault();
        $event.stopPropagation();
        const name = 'Create Branch';
        const fields: Array<FieldDefinition> = [
            { type: 'repository', label: 'Repository', name: 'repo', value: this.repositoryService.repositorySetting.path },
            { type: 'branch', label: 'Base branch', name: 'from', value: this.repositoryService.currentBranch.name },
            { type: 'string', label: 'Name', name: 'name' },
            { type: 'bool', label: 'Checkout', name: 'checkout' }
        ];


        const onClose$ = this.commanderModalService.openModal({ title: name, fields: fields! });
        const sub = onClose$
            .subscribe(async (params) => {
                if (params?.formData?.name && !params?.formData?.from) {
                    await this.repositoryService.createBranch(params.formData.name, params.formData?.checkout);
                }
                else if (params?.formData?.name && params?.formData?.from) {
                    await this.repositoryService.createBranchFromAnother(params.formData.name, params.formData.from, params.formData?.checkout);
                }
                this.commanderService.reloadData();
                this.commanderModalService.closeModal();
                sub.unsubscribe();
            });
    }

    async sync($event: Event) {
        this.isSyncing = 'loading';
        $event.preventDefault();
        $event.stopPropagation();
        await this.repositoryService.sync();
        this.commanderService.reloadData();
        this.repositoryService.loadAheadBehindOfCurrentBranch();
        await sleep(1000);
        this.isSyncing = 'default';
    }

    private getPathArray(route: ActivatedRouteSnapshot): Array<string | undefined> {
        let array: Array<string | undefined> = [];

        if (route.routeConfig && route.routeConfig.path !== '') {
            array.push(route.routeConfig.path);
        }

        if (route.firstChild) {
            array = array.concat(this.getPathArray(route.firstChild));
        }

        return array;
    }

    private replacePathArrayId(id: number) {
        const pathArray = this.getPathArray(this.activatedRoute.snapshot.root);
        const data = pathArray.map((path) => {
            return path!.replace(':id', id.toString());
        });
        // data[0] = `/${data[0]}`;
        return data;
    }

    openCmd(): void {
        const path = this.repositoryService.getPath();
        console.log(`TCL: ~ file: subnav.component.ts ~ line 128 ~ SubnavComponent ~ openCmd ~ path`, path);
        open(path);
        this.close();
    }

    openCode(): void {
        const path = this.repositoryService.getPath();
        open(path, 'code');
        this.close();
    }

    openTerminal(): void {
        const path = this.repositoryService.getPath();
        invoke('open_cmd', { path });
        this.close();
    }

    copyPath(): void {
        const path = this.repositoryService.getPath();
        this.clipboard.copy(path);
        this.close();
    }

    close() {
        this.isMenuOpen = false;
    }

    goToHome(): void {
        this.router.navigate(['/home']);
    }

}
