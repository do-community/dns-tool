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

// Parses URL's from data.
export default (text: string) => {
    const matchRegex = /{link\|([^|]+)\|([^|]+)}/
    const items: (string | string[])[] = []
    for (;;) {
        const match = text.match(matchRegex)
        if (!match) break
        const splitByMatch = text.split(match[0])
        items.push(splitByMatch[0])
        items.push([match[1], match[2]])
        text = splitByMatch[1]
    }
    items.push(text)
    return items
}
