import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import * as Diff2Html from 'diff2html/lib-esm/diff2html';

@Pipe({
    name: 'diff'
})
export class DiffPipe implements PipeTransform {

    constructor(
        private sanitizer: DomSanitizer
    ) { }

    transform(value: string, ...args: unknown[]): SafeHtml {

        if (!value) {
            return '';
        }


        let startTime = performance.now();

        const outputHtml = Diff2Html.parse(value, {
            drawFileList: false,
            matching: 'lines',
            outputFormat: 'line-by-line',
            renderNothingWhenEmpty: true
        });

        this.perfLogging('Diff2Html', startTime);

        startTime = performance.now();
        // const sani = this.sanitizer.bypassSecurityTrustHtml(outputHtml);
        this.perfLogging('sani', startTime);

        return outputHtml;
    }


    perfLogging(type: string, startTime: number) {
        const rawTime = performance.now() - startTime;
        const timeInSeconds = (rawTime / 1000).toFixed(3);
        console.log(`%c Executed %c-${type}-`, 'color: #1cd0b7', 'color:red;font-weight: bold', ` (took ${timeInSeconds}s)`);
    }


}
