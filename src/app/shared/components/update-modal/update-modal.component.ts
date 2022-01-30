import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { relaunch } from '@tauri-apps/api/process';
import { installUpdate, UpdateResult } from '@tauri-apps/api/updater';
import { marked } from 'marked';

@Component({
    selector: 'commandos-update-modal',
    templateUrl: './update-modal.component.html',
    styleUrls: ['./update-modal.component.scss'],
})
export class UpdateModalComponent implements AfterViewInit {
    @ViewChild('content') content: ElementRef<HTMLElement>;

    version: string;
    manifest: string;

    @Output() close = new EventEmitter();

    @Input()
    public set update(value: UpdateResult) {
        this.version = value.manifest.version;
        const manifest = marked(value.manifest.body);
        this.manifest = this.domSanitizer.sanitize(SecurityContext.HTML, manifest);
    }

    constructor(private domSanitizer: DomSanitizer) {}

    ngAfterViewInit(): void {
        const shadowDom = this.content.nativeElement.shadowRoot;
        if (shadowDom) {
            const scrollStyle = `
                ::-webkit-scrollbar {
                    height: 7px;
                    width: 7px;
                }

                /* Track */

                ::-webkit-scrollbar-track {
                    background: transparent;
                }

                /* Handle */

                ::-webkit-scrollbar-thumb {
                    background: var(--cds-global-color-gray-300);
                }

                /* Handle on hover */

                ::-webkit-scrollbar-thumb:hover {
                    background: var(--cds-global-color-gray-600);
                }
            `;

            const style = shadowDom.querySelectorAll('style');

            if (!Array.from(style).some((el: any) => el.innerHTML === scrollStyle)) {
                const scrollCss = document.createElement('style');
                scrollCss.innerHTML = scrollStyle;
                shadowDom.insertBefore(scrollCss, shadowDom.firstChild);
            }
        }
    }

    async startUpdate() {
        await installUpdate();
        await relaunch();
    }

    cancel() {
        this.close.emit();
    }
}
