import { StoreService } from './../../core/services/store/store.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { Pipe, PipeTransform } from '@angular/core';
import * as Diff2Html from 'diff2html/lib-esm/diff2html';

@Pipe({
    name: 'diff'
})
export class DiffPipe implements PipeTransform {

    constructor(
        private sanitizer: DomSanitizer,
        private storeService: StoreService
    ) { }

    transform(value: string, ...args: unknown[]): SafeHtml {

        if (!value) {
            return '';
        }
        const outputHtml = Diff2Html.html(value, {
            drawFileList: false,
            matching: 'lines',
            outputFormat: this.storeService.getDiff2HtmlOutputFormat(),
            renderNothingWhenEmpty: true
        });
        return this.sanitizer.bypassSecurityTrustHtml(outputHtml);
    }

}
