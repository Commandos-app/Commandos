import { RepositoryService } from '@routes/repository/repository.service';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { filter, first } from 'rxjs/operators';
import { RepositoriesSettingsService } from '@core/services';

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

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public repositoryService: RepositoryService,
        public repositoriesSettingsService: RepositoriesSettingsService
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

    openNewBranch(): void {

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


    goToHome(): void {
        this.router.navigate(['/home']);
    }

}
