import tutorials from "./data/record_tutorials"

// Defines the record proxy for handling linking to DNS tutorials.
export let ns: string | undefined
export let recordNsQueue: any[] = []
export const runNsDescription = (recordDescriptionSpanId: string, recordType: string) => {
    const span = document.getElementById(recordDescriptionSpanId)
    if (!span) {
        setTimeout(() => runNsDescription(recordDescriptionSpanId, recordType), 100)
        return

    }
    const tutorial = (tutorials as any)[ns!]
    let url: string | undefined
    if (typeof tutorial === "string") {
        url = tutorial
    } else if (tutorial) {
        url = tutorial[recordType]
    }
    if (url) {
        span!.innerHTML = `<p><a href="${url}">Learn how to configure ${recordType} records for your DNS.</a></p>`
    }
}

export const addNsDescription = (recordDescriptionSpanId: string, recordType: string) => {
    if (ns) {
        runNsDescription(recordDescriptionSpanId, recordType)
    } else {
        recordNsQueue.push([recordDescriptionSpanId, recordType])
    }
}

export const flushNsDescriptionQueue = () => {
    const oldQueue = recordNsQueue
    recordNsQueue = []
    while (oldQueue.length !== 0) {
        const item = oldQueue.shift()
        runNsDescription(item[0], item[1])
    }
}

export const setNs = (newNs: string | undefined) => { ns = newNs }
