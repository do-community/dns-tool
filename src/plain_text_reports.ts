/*
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export const reports = new Map<string, any>()

const format = (data: any) => {
    let formattedParts: string[] = []
    for (const key of Object.keys(data)) {
        const value = data[key]
        formattedParts.push(`${key[0].toUpperCase()}${key.substr(1)}: ${value}`)
    }
    return formattedParts.join(" | ")
}

export const generateTextReport = (allowedRecords: string[]) => {
    let report = ""
    for (const kv of reports.entries()) {
        const key = kv[0]
        if (!allowedRecords.includes(key)) {
            continue
        }
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

export const generateMdReport = (allowedRecords: string[]) => {
    let report = ""
    for (const kv of reports.entries()) {
        const key = kv[0]
        if (!allowedRecords.includes(key)) {
            continue
        }
        const value = kv[1]
        let textValue = "No records present."
        if (value.Answer) {
            const unformattedKeys = Object.keys(value.Answer[0])
            const keys: string[] = []
            for (const key of unformattedKeys) {
                keys.push(`${key.substr(0, 1).toUpperCase()}${key.substr(1)}`)
            }
            let dividers = ""
            let i = 0
            while (i !== keys.length) {
                dividers += "--- | "
                i++
            }
            textValue = `${keys.join("|")}\n${dividers}\n`
            for (const answer of value.Answer) {
                const parts = []
                for (const part of Object.values(answer)) {
                    parts.push(String(part))
                }
                textValue += parts.join(" | ") + "\n"
            }
        }
        report += `# ${key} Records\n${textValue}\n`
    }
    return report
}
