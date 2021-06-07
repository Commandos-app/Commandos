import { Clipboard } from '@angular/cdk/clipboard';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { RepositoryService } from '../repository.service';
import { filter, first, take } from 'rxjs/operators';
import { LogItem } from '@git/model';
import { fromEvent, merge, Subscription } from 'rxjs';
import { TemplatePortal } from '@angular/cdk/portal';


@Component({
    selector: 'app-repository-history',
    templateUrl: './repository-history.component.html',
    styleUrls: ['./repository-history.component.scss']
})
export class RepositoryHistoryComponent implements OnInit {

    commits: Array<LogItem>;
    commitsCount = 0;

    @ViewChild('userMenu') userMenu: TemplateRef<any>;
    overlayRef: OverlayRef | null;
    sub: Subscription;

    constructor(
        private cd: ChangeDetectorRef,
        private repositoryService: RepositoryService,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef,
        private clipboard: Clipboard
    ) {
    }

    ngOnInit(): void {
        this.repositoryService.loaded$.pipe(filter(x => x), first()).subscribe(() => {
            this.getHeadCommits();
        });
    }

    async getHeadCommits(): Promise<void> {
        try {
            this.commits = await this.repositoryService.getHistroy();
        } catch (er) {
            alert(er);
        }
    }

    async checkout(sha: string): Promise<void> {
        await this.repositoryService.checkoutBranch(sha);
        this.repositoryService.getBranches();
        await this.getHeadCommits();
        this.close();
    }

    copySha(sha: string): void {
        this.clipboard.copy(sha);
        this.close();
    }

    openContext($event: MouseEvent, commit: any) {
        console.log(`TCL: ~ file: repository-history.component.ts ~ line 60 ~ RepositoryHistoryComponent ~ openContext ~ commit`, commit);
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

    close() {
        this.sub && this.sub.unsubscribe();
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }
}
