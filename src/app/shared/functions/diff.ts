
import * as Diff2Html from 'diff2html/lib-esm/diff2html';

declare var Diff2HtmlUI: any;


type DifferOptions = Partial<{
    outputFormat: 'line-by-line' | 'side-by-side';
    drawFileList: boolean;
    diffStyle: 'word' | 'char';
    diffMaxChanges: number | undefined;
    diffMaxLineLength: number | undefined;
    diffTooBigMessage: string;
    matching: 'lines' | 'words' | 'none';
    matchWordsThreshold: number;
    matchingMaxComparisons: number;
    maxLineSizeInBlockForComparison: number;
    maxLineLengthHighlight: number;
    renderNothingWhenEmpty: boolean;
    fileListToggle: boolean;
    fileListStartVisible: boolean;
    fileContentToggle: boolean;
    synchronisedScroll: boolean;
    highlight: boolean;
}>


export function Differ(id: string, value: string, options: DifferOptions) {
    if (!value) {
        return;
    }

    const targetElement = document.getElementById(id);
    const defaultConfiguration: DifferOptions = {
        outputFormat: 'line-by-line',
        drawFileList: true,
        diffStyle: 'word',
        diffMaxChanges: undefined,
        diffMaxLineLength: 1000,
        diffTooBigMessage: 'Diff to Big',
        matching: 'lines',
        matchWordsThreshold: 0.25,
        matchingMaxComparisons: 2500,
        maxLineSizeInBlockForComparison: 200,
        maxLineLengthHighlight: 10000,
        renderNothingWhenEmpty: true,
        fileListToggle: true,
        fileListStartVisible: true,
        fileContentToggle: true,
        synchronisedScroll: true,
        highlight: true,
    };

    const configuration = { ...defaultConfiguration, ...options };

    let startTime = performance.now();
    const diff2htmlUi = new Diff2HtmlUI(targetElement, value, configuration);
    perfLogging('diffHtml', startTime);

    const currentURL = location.href;
    diff2htmlUi.diffHtml = diff2htmlUi.diffHtml.replaceAll('#d2h', `${currentURL}#d2h`);


    startTime = performance.now();
    diff2htmlUi.draw();
    perfLogging('draw', startTime);

    startTime = performance.now();
    diff2htmlUi.highlightCode();
    perfLogging('highlightCode', startTime);
}


export function DifferParse(value: string, options: any) {

    const defaultConfiguration: DifferOptions = {
        drawFileList: false,
        matching: 'lines',
        outputFormat: 'line-by-line',
        renderNothingWhenEmpty: true
    };

    const configuration = { ...defaultConfiguration, ...options };

    return Diff2Html.parse(value, configuration);
}

function perfLogging(type: string, startTime: number) {
    const rawTime = performance.now() - startTime;
    const timeInSeconds = (rawTime / 1000).toFixed(3);
    console.log(`%c Executed %c-${type}-`, 'color: #1cd0b7', 'color:red;font-weight: bold', ` (took ${timeInSeconds}s)`);
}
