
declare var performance: any;
let measuringPerf = false
let markID = 0

/** Start capturing git performance measurements. */
export function start() {
    measuringPerf = true
}

/** Stop capturing git performance measurements. */
export function stop() {
    measuringPerf = false
}

/** Measure an async git operation. */
export async function measure<T>(
    cmd: string,
    fn: () => Promise<T>
): Promise<T> {
    const id = ++markID

    const startTime = performance && performance.now ? performance.now() : null
    // let id = getRndInteger(100000, 2000000);
    markBegin(id, cmd)
    try {

        console.log(`%c Executeing %c-${id}-`, 'color: #b71cd0', 'color:red;font-weight: bold', ` ${cmd}`);
        return await fn()
    } finally {
        if (startTime) {
            const rawTime = performance.now() - startTime;
            const timeInSeconds = (rawTime / 1000).toFixed(3);
            console.log(`%c Executed %c-${id}-`, 'color: #1cd0b7', 'color:red;font-weight: bold', ` ${cmd} (took ${timeInSeconds}s)`);
        }

        markEnd(id, cmd)
    }
}

/** Mark the beginning of a git operation. */
function markBegin(id: number, cmd: string) {
    if (!measuringPerf) {
        return
    }

    const markName = `${id}::${cmd}`
    performance.mark(markName)
}

/** Mark the end of a git operation. */
function markEnd(id: number, cmd: string) {
    if (!measuringPerf) {
        return
    }

    const markName = `${id}::${cmd}`
    const measurementName = cmd
    performance.measure(measurementName, markName)

    performance.clearMarks(markName)
    performance.clearMeasures(measurementName)
}

function getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}
