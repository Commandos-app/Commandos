import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RepositoryHistoryCommitComponent } from './repository-history-commit/repository-history-commit.component';
import { CommanderModalService, CommanderService } from '@shared/services';
import { FieldDefinition } from '@shared/components';
import { Clipboard } from '@angular/cdk/clipboard';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { filter, first, map, take, distinctUntilChanged } from 'rxjs/operators';
import { LogItem } from '@git/model';
import { fromEvent, merge, Subscription } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';


@UntilDestroy()
@Component({
    selector: 'app-repository-history',
    templateUrl: './repository-history.component.html',
    styleUrls: ['./repository-history.component.scss']
})
export class RepositoryHistoryComponent implements OnInit {

    commits: Array<LogItem>;
    commitsCount = 0;
    isChildRouteLoaded = false;

    @ViewChild('userMenu') userMenu: TemplateRef<any>;
    overlayRef: OverlayRef | null;
    sub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private repositoryService: RepositoryService,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef,
        private commanderModalService: CommanderModalService,
        private clipboard: Clipboard
    ) {

    }

    ngOnInit(): void {
        this.repositoryService.loaded$.pipe(filter(x => x), first()).subscribe(() => {
            this.getHistory();
        });

        this.router.events
            .pipe(
                filter(event => event instanceof ActivationEnd),
                untilDestroyed(this)
            )
            .subscribe(_ => {
                this.isChildRouteLoaded = this.route.children.length > 0;
            });

    }

    async getHistory(): Promise<void> {
        try {
            this.commits = await this.repositoryService.getHistroy();
        } catch (er) {
            alert(er);
        }
    }

    async checkout(sha: string): Promise<void> {
        await this.repositoryService.checkoutBranch(sha);
        this.repositoryService.getBranches();
        await this.getHistory();
        this.close();
    }

    copySha(sha: string): void {
        this.clipboard.copy(sha);
        this.close();
    }

    openContext($event: MouseEvent, commit: any) {
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
            $implicit: commit
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

    createBranch(commit: LogItem): void {
        const fields: Array<FieldDefinition> = [
            { type: 'repository', label: 'Repository', name: 'repo', value: this.repositoryService.repositorySetting.path },
            { type: 'string', label: 'Name', name: 'name' },
        ];
        const onClose$ = this.commanderModalService.openModal({ title: `Create branch for ${commit.shortSha}`, fields: fields! });
        const sub = onClose$
            .subscribe(async (params) => {
                if (params?.formData?.name) {
                    await this.repositoryService.createBranchFromSha(params.formData.name, commit.sha);
                }
                this.repositoryService.getBranches();
                await this.getHistory();
                this.commanderModalService.closeModal();
                sub.unsubscribe();
            });
    }

    close() {
        this.sub && this.sub.unsubscribe();
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
