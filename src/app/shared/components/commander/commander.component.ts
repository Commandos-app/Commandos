import { filter, take } from 'rxjs/operators';
import { commandosModalService } from './commandos-modal/commandos-modal.service';
import { LoggerService } from '@core/services';
import { commandosService, ICommand } from './commandos.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FilterPipe } from '@josee9988/filter-pipe-ngx';
import { Router } from '@angular/router';
import { fromEvent, merge, Subscription } from 'rxjs';


@Component({
    selector: 'app-commandos',
    templateUrl: './commandos.component.html',
    styleUrls: ['./commandos.component.scss']
})
export class commandosComponent implements OnInit {
    public sub: Subscription;

    @ViewChild('commandInputContainer', { read: ViewContainerRef }) commandInputContainerRef: ViewContainerRef;
    @ViewChild('commandInput', { read: ViewContainerRef }) commandInputRef: ViewContainerRef;
    @ViewChild('commandsTemplate', { read: TemplateRef }) commandsRef: TemplateRef<unknown>;


    @HostListener('window:keydown.arrowdown', ['$event.target'])
    arrowDownListener(): void {
        if (this.commandosModalService.preventKeyboardShortcuts()) { return; }
        const max = this.commands.length - 1;
        const val = this.selected + 1;
        this.selected = val > max ? 0 : val;
    }

    @HostListener('window:keydown.arrowup', ['$event.target'])
    arrowUpListener(): void {
        if (this.commandosModalService.preventKeyboardShortcuts()) { return; }
        const max = this.commands.length - 1;
        const val = this.selected - 1;
        this.selected = val >= 0 ? val : max;
    }

    @HostListener('window:resize', ['$event.target'])
    onResizeListener(): void {
        if (this.commandosModalService.preventKeyboardShortcuts()) { return; }
        if (this.overlayRef) {
            const width = this.commandInputContainerRef.element.nativeElement.clientWidth;
            this.overlayRef.updateSize({ width });
        }
    }

    @HostListener('window:keydown.esc', ['$event.target'])
    closeCommandListener(): void {
        if (this.overlayRef) {
            this.filterText = null;
            this.disposeOverlay();
        }
    }

    @HostListener('window:keyup.enter', ['$event'])
    runCommandListener(): void {
        if (this.commandosModalService.preventKeyboardShortcuts()) { return; }
        if (this.overlayRef) {
            this.runCommandSelected();
        }
    }

    @HostListener('window:keydown.f1', ['$event'])
    @HostListener('window:keydown.control.e', ['$event'])
    handleKeyDownListener($event: Event): void {
        $event.preventDefault();
        $event.stopPropagation();
        if (this.commandosModalService.preventKeyboardShortcuts()) { return; }
        if (!this.overlayRef) {
            //new FlexibleConnectedPositionStrategy(this.commandInput.element);
            const width = this.commandInputContainerRef.element.nativeElement.clientWidth;
            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(this.commandInputContainerRef.element)
                .withPositions(this.getPosition())
                .withPush(false);

            this.overlayRef = this.overlay.create({
                positionStrategy,
                width,
                hasBackdrop: true,

            });
            const commandos = new TemplatePortal(this.commandsRef, this.viewContainerRef);
            this.overlayRef.attach(commandos);
            this.selected = 0;
            this.commandInputRef.element.nativeElement.focus();

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
                ).subscribe(() => this.disposeOverlay())
        }
        else {
            if (this.overlayRef) {
                this.disposeOverlay();
            }
        }

    }

    // @HostListener()
    // clickOutside(): void {

    // }

    overlayRef: OverlayRef;

    commands: ICommand[];

    private filterText: string;
    get searchText(): string {
        return this.filterText;
    }

    set searchText(value: string) {
        this.filterText = value;
        this.filterCommands();
    }

    selected = 0;

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private router: Router,
        public commandosService: commandosService,
        private logger: LoggerService,
        private commandosModalService: commandosModalService
    ) { }

    ngOnInit(): void {
        this.filterCommands();
    }

    private getPosition(): ConnectedPosition[] {
        return [{
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            panelClass: 'command-overlay'
        }];
    }

    private filterCommands() {
        this.commands = new FilterPipe().transform(this.commandosService.commands, this.filterText);
    }

    runCommand(command: ICommand): void {
        this.logger.info(`Command '${command.name}' is called`);
        if (command.callback) {
            command.callback();
        }
        this.closeCommandListener();
    }

    runCommandSelected(): void {
        if (this.selected >= 0) {
            this.logger.info(`Command '${this.commands[this.selected].name}' is called`);
            this.commands[this.selected].callback();
        }
        this.closeCommandListener();
    }

    private disposeOverlay() {
        this.sub && this.sub.unsubscribe();
        this.overlayRef.dispose();
        this.overlayRef = null;
    }
}
