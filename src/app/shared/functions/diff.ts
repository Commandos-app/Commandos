
declare var Diff2HtmlUI: any;


type DifferOptions = Partial<{
    outputFormat: string;
    drawFileList: boolean;
    fileListToggle: boolean;
    fileListStartVisible: boolean;
    fileContentToggle: boolean;
    matching: 'lines',
    synchronisedScroll: boolean;
    highlight: boolean;
    renderNothingWhenEmpty: boolean;
}>


export function Differ(id: string, value: string, options: DifferOptions) {
    if (!value) {
        return;
    }

    const targetElement = document.getElementById(id);
    const defaultConfiguration: DifferOptions = {
        drawFileList: true,
        fileListToggle: true,
        fileListStartVisible: true,
        fileContentToggle: true,
        matching: 'lines',
        outputFormat: 'line-by-line',
        synchronisedScroll: true,
        highlight: true,
        renderNothingWhenEmpty: true,
    };

    const configuration = { ...defaultConfiguration, ...options };

    const diff2htmlUi = new Diff2HtmlUI(targetElement, value, configuration);
    const currentURL = location.href;
    diff2htmlUi.diffHtml = diff2htmlUi.diffHtml.replaceAll('#d2h', `${currentURL}#d2h`);
    diff2htmlUi.draw();
    diff2htmlUi.highlightCode();
}
