
import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';

@Component({
    selector: 'app-button-control',
    templateUrl: './button-control.component.html',
    styleUrls: ['./button-control.component.scss']
})
export class ButtonControlComponent implements OnInit {


    // @ViewChild('commandButtonControlContainer', { read: ViewContainerRef }) commandButtonControlContainerRef: ViewContainerRef;
    // @ViewChild('commandsTemplate', { read: TemplateRef }) commandsRef: TemplateRef<unknown>;
    // overlayRef: OverlayRef;

    @Input() startIcon: string;
    @Input() title: string;
    @Input() value: string;
    @Input() width: string;

    @Output() onClick = new EventEmitter<void>();


    // @HostListener('document:click', ['$event.target'])
    // onClickOutside(targetElement): void {
    //     if (!this.overlayRef) {
    //         return;
    //     }

    //     const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    //     const clickedInsideElem = this.overlayRef.overlayElement.contains(targetElement);

    //     if (!clickedInside && !clickedInsideElem) {
    //         this.dispose();
    //     }
    // }

    constructor(
        private overlay: Overlay,
        private viewContainerRef: ViewContainerRef,
        private elementRef: ElementRef
    ) { }

    ngOnInit(): void {
    }

    // toggle(): void {
    //     if (!this.overlayRef) {
    //         //new FlexibleConnectedPositionStrategy(this.commandInput.element);
    //         const width = this.commandButtonControlContainerRef.element.nativeElement.clientWidth;
    //         const positionStrategy = this.overlay.position()
    //             .flexibleConnectedTo(this.commandButtonControlContainerRef.element)
    //             .withPositions(this.getPosition())
    //             .withPush(false);

    //         this.overlayRef = this.overlay.create({
    //             positionStrategy,
    //             width: this.width ?? width,
    //             height: '100%',
    //             hasBackdrop: true,
    //             backdropClass: 'commander-button-control-backdrop'

    //         });
    //         this.overlayRef.keydownEvents().subscribe((event) => {
    //             if (event.code === 'Escape') {
    //                 this.dispose();
    //             }

    //         })
    //         const commander = new TemplatePortal(this.commandsRef, this.viewContainerRef);
    //         this.overlayRef.attach(commander);

    //         // this.overlayRef.backdropClick().subscribe(() => {
    //         //     console.log(`TCL: ~ file: button-control.component.ts ~ line 53 ~ ButtonControlComponent ~ this.overlayRef.backdropClick ~ subscribe`);
    //         //     this.dispose();
    //         // })
    //     }
    //     else {
    //         if (this.overlayRef) {
    //             this.dispose();
    //         }
    //     }
    // }

    // close(): void {
    //     this.dispose();
    // }

    // private dispose() {
    //     this.overlayRef.dispose();
    //     this.overlayRef = null;
    // }

    // private getPosition(): ConnectedPosition[] {
    //     return [{
    //         originX: 'start',
    //         originY: 'bottom',
    //         overlayX: 'start',
    //         overlayY: 'top',
    //         // panelClass: 'command-overlay'
    //     }];
    // }
}

