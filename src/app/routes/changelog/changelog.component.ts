import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { marked } from 'marked';

@Component({
    selector: 'commandos-changelog',
    templateUrl: './changelog.component.html',
    styleUrls: ['./changelog.component.scss'],
})
export class ChangelogComponent implements OnInit {
    changelog: string;

    constructor(private http: HttpClient, private domSanitizer: DomSanitizer) {}

    ngOnInit(): void {
        this.http.get('assets/changelog.md', { responseType: 'text' }).subscribe((data) => {
            const changelog = marked(data);
            this.domSanitizer.sanitize(SecurityContext.HTML, changelog);
            this.changelog = changelog;
        });
    }
}
