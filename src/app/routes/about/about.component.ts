import { environment } from '@env/environment';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'commandos-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    version = 'not set!';
    constructor() { }

    ngOnInit(): void {
        this.version = environment.version;
    }

}
