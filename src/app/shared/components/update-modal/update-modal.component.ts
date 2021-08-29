import { Component, Input, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { relaunch } from "@tauri-apps/api/process";
import { installUpdate, UpdateResult } from '@tauri-apps/api/updater';
import marked from 'marked';

@Component({
    selector: 'commandos-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.scss']
})
export class UpdateModalComponent implements OnInit {


    version: string;
    manifest: string;


    @Input()
    public set update(value: UpdateResult) {
        this.version = value.manifest.version;
        const manifest = marked(value.manifest.body);
        this.manifest = this.domSanitizer.sanitize(SecurityContext.HTML, manifest);
    }


    constructor(
        private domSanitizer: DomSanitizer
    ) { }

    ngOnInit(): void {
    }

    async startUpdate() {
        await installUpdate();
        await relaunch();
    }

    cancel() {

    }
}
