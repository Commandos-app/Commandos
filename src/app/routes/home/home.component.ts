import { filter, take } from 'rxjs/operators';
import { TemplatePortal } from '@angular/cdk/portal';
import { RepositorySetting } from '@core/services';
import { RepositoryService } from './../repository/repository.service';
import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { RepositoriesSettings, RepositoriesSettingsService } from '@core/services';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { fromEvent, merge, Subscription } from 'rxjs';
import { Command, open } from '@tauri-apps/api/shell';
import { Clipboard } from '@angular/cdk/clipboard';
import { invoke } from '@tauri-apps/api/tauri';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    repositories: RepositoriesSettings = [];
    @ViewChild('userMenu') userMenu: TemplateRef<any>;
    overlayRef: OverlayRef | null;
    sub: Subscription;

    constructor(
        private router: Router,
        private repos: RepositoriesSettingsService,
        private repositoryService: RepositoryService,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef,
        private clipboard: Clipboard

    ) { }

    ngOnInit(): void {
        this.repositoryService.unload();
        this.loadRepos();
        this.repositoryService.clearUIBranches();
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

    close() {
        this.sub && this.sub.unsubscribe();
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
