import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'commandos-select-hint',
    templateUrl: './select-hint.component.html',
    styleUrls: ['./select-hint.component.scss'],
})
export class SelectHintComponent implements OnInit {
    @Input() text: string;

    constructor() {}

    ngOnInit(): void {}
}
