export const reports = new Map<string, any>()

const format = (data: any) => {
    let formattedParts: string[] = []
    for (const key of Object.keys(data)) {
        const value = data[key]
        formattedParts.push(`${key[0].toUpperCase()}${key.substr(1)}: ${value}`)
    }
    return formattedParts.join(" | ")
}

export const generateTextReport = () => {
    let report = ""
    for (const kv of reports.entries()) {
        const key = kv[0]
        const value = kv[1]
        let textValue = " None"
        if (value.Answer) {
            textValue = ""
            for (const answerIndex in value.Answer) {
                const answer = value.Answer[answerIndex]
                textValue += `\n[${answerIndex}] ${format(answer)}`
            }
        }
        report += `${key} Records:${textValue}\n-----------\n`
    }
    return report
}
