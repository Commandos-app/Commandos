
declare var Diff2HtmlUI: any;

export function Differ(id: string, value: string, outputFormat: string) {
    console.log(`TCL: ~ file: diff.ts ~ line 5 ~ Differ ~ value`, value);
    if (!value) {
        return;
    }

    const targetElement = document.getElementById(id);
    const configuration = {
        //  inputFormat: 'json',
        drawFileList: true,
        fileListToggle: true,
        fileListStartVisible: true,
        fileContentToggle: true,
        matching: 'lines',
        outputFormat,
        synchronisedScroll: true,
        highlight: true,
        renderNothingWhenEmpty: true,
    };
    const diff2htmlUi = new Diff2HtmlUI(targetElement, value, configuration);
    diff2htmlUi.draw();
    diff2htmlUi.highlightCode();
}
