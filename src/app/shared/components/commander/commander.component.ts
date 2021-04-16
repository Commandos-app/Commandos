import { CommanderModalService } from './commander-modal/commander-modal.service';
import { LoggerService } from '@core/services';
import { CommanderService, ICommand } from './commander.service';
import { TemplatePortal } from '@angular/cdk/portal';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Component, HostListener, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FilterPipe } from '@josee9988/filter-pipe-ngx';
import { Router } from '@angular/router';


@Component({
    selector: 'app-commander',
    templateUrl: './commander.component.html',
    styleUrls: ['./commander.component.scss']
})
export class CommanderComponent implements OnInit {

    @ViewChild('commandInputContainer', { read: ViewContainerRef }) commandInputContainerRef: ViewContainerRef;
    @ViewChild('commandInput', { read: ViewContainerRef }) commandInputRef: ViewContainerRef;
    @ViewChild('commandsTemplate', { read: TemplateRef }) commandsRef: TemplateRef<unknown>;


    @HostListener('window:keydown.arrowdown', ['$event.target'])
    arrowDownListener(): void {
        if (this.commanderModalService.preventKeyboardShortcuts()) { return; }
        const max = this.commands.length - 1;
        const val = this.selected + 1;
        this.selected = val > max ? 0 : val;
    }

    @HostListener('window:keydown.arrowup', ['$event.target'])
    arrowUpListener(): void {
        if (this.commanderModalService.preventKeyboardShortcuts()) { return; }
        const max = this.commands.length - 1;
        const val = this.selected - 1;
        this.selected = val >= 0 ? val : max;
    }

    @HostListener('window:resize', ['$event.target'])
    onResizeListener(): void {
        if (this.commanderModalService.preventKeyboardShortcuts()) { return; }
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
        if (this.commanderModalService.preventKeyboardShortcuts()) { return; }
        if (this.overlayRef) {
            this.runCommandSelected();
        }
    }

    @HostListener('window:keydown.f1', ['$event'])
    @HostListener('window:keydown.control.e', ['$event'])
    handleKeyDownListener(): void {
        if (this.commanderModalService.preventKeyboardShortcuts()) { return; }
        if (!this.overlayRef) {
            //new FlexibleConnectedPositionStrategy(this.commandInput.element);
            const width = this.commandInputContainerRef.element.nativeElement.clientWidth;
            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(this.commandInputContainerRef.element)
                .withPositions(this.getPosition())
                .withPush(false);

            this.overlayRef = this.overlay.create({
                positionStrategy,
                width
            });
            const commander = new TemplatePortal(this.commandsRef, this.viewContainerRef);
            this.overlayRef.attach(commander);
            this.selected = 0;
            this.commandInputRef.element.nativeElement.focus();
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
        public commanderService: CommanderService,
        private logger: LoggerService,
        private commanderModalService: CommanderModalService
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
        this.commands = new FilterPipe().transform(this.commanderService.commands, this.filterText);
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
        this.overlayRef.dispose();
        this.overlayRef = null;
    }
}
