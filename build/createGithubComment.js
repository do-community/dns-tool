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

const fetch = require('node-fetch')
const path = require('path')
const { readdirSync } = require('fs')

const main = async () => {

    const baseURL = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${process.env.COMMIT_SHA}`

    const tools = readdirSync(path.join(__dirname, '..', 'dist'), { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .map(name => `[${name}](${baseURL}/${name}/index.html)`)

    const comment = `This commit has been deployed to DigitalOcean Spaces for easy reviewing.

| ${tools.join(' | ')} |
|${(new Array(tools.length).fill('---')).join('|')}|`

    const res = await fetch(
        `https://api.github.com/repos/do-community/dns-tool/commits/${process.env.COMMIT_SHA}/comments`,
        {
            method: 'POST',
            body: JSON.stringify({
                body: comment,
            }),
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/vnd.github.v3+json',
                Authorization: `Basic ${Buffer.from(`github-actions:${process.env.GITHUB_ACCESS_TOKEN}`).toString('base64')}`,
            }
        },
    ).catch(async e => {
        console.log(await e.json())
        process.exit(1)
    })

    if (!res.ok) {
        console.log(await res.json())
        process.exit(1)
    }
}

main()
