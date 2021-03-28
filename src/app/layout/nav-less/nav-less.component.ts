import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-nav-less',
    templateUrl: './nav-less.component.html',
    styleUrls: ['./nav-less.component.scss']
})
export class NavLessLayoutComponent implements OnInit {

    hasError = false;

    constructor(
    ) { }

    ngOnInit(): void {
    }

    closeClient(): void {
        // this.electron.close();
    }

}
