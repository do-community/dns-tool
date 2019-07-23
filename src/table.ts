// Creates the table headings.
export const createHeadings = (keys: string[]) => {
    let headings = "<thead><tr>"
    for (const heading of keys) {
        headings += `
            <th>${heading}</th>
        `
    }
    headings += "</tr></thead>"
    return headings
}

// Gets the largest record part.
export const getLargestRecordPart = (parts: string[]) => {
    let largestRecordPart = 0
    for (const part of parts) {
        if ((part as string).length > largestRecordPart) {
            largestRecordPart = (part as string).length
        }
    }
    return largestRecordPart
}
