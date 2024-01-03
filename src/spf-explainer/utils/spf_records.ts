/*
Copyright 2024 DigitalOcean

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

import cfDNS from "../../shared/utils/cfDNS"

const getSPFRecords = async (domain: string): Promise<string[]> => {
    const res = await cfDNS(domain, "TXT")
    if (!res.ok) throw new Error("Failed to fetch SPF records")

    const json = await res.json()
    if (json.Status !== 0 || !json.Answer) throw new Error("Failed to fetch SPF records")

    const records = []
    for (const answer of json.Answer) {
        // If the answer starts with a quote, we need to extract the actual answer
        if (answer.data.startsWith("\"")) {
            // Extract all the quoted sections in the string
            const matches = answer.data.matchAll(/"([^"]*)"/g)
            if (matches) answer.data = [...matches].map(match => match[1]).join("")
        }

        if (answer.data.startsWith("v=spf1")) records.push(answer.data)
    }

    return records
}

export default getSPFRecords
