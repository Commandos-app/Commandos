import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-button-control',
    templateUrl: './button-control.component.html',
    styleUrls: ['./button-control.component.scss'],
})
export class ButtonControlComponent implements OnInit {
    // @ViewChild('commandButtonControlContainer', { read: ViewContainerRef }) commandButtonControlContainerRef: ViewContainerRef;
    // @ViewChild('commandsTemplate', { read: TemplateRef }) commandsRef: TemplateRef<unknown>;
    // overlayRef: OverlayRef;

    @Input() startIcon: string;
    @Input() title: string;
    @Input() value: string;

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

    constructor() {}

    ngOnInit(): void {}
}
