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

const Bundler = require('parcel-bundler')
const Path = require('path')
const posthtml = require('posthtml')
const fs = require('fs')

const build = async (asset, out) => {
    console.log(`\nLoading in ${asset} & building...`)

    // Define options
    const entry = Path.join(__dirname, '..', asset)
    const options = {
        outDir: Path.dirname(out),
        outFile: Path.basename(out),
        publicUrl: './',
        watch: false,
        cache: false,
        contentHash: false,
        minify: true,
        logLevel: 2,
        sourceMaps: false,
        detailedReport: false,
    }

    // Build
    const bundler = new Bundler(entry, options)
    await bundler.bundle()

    console.log(`...build successfully, saved to ${out}`)
}

const index = async (file, out) => {
    console.log(`\nLoading in ${file} & building...`)

    // Get source HTML
    let source = fs.readFileSync(Path.join(__dirname, '..', file)).toString()

    // Replace SCSS w/ CSS
    source = source.replace('href="scss/style.scss"', 'href="style.css"')

    // Load posthtml plugins
    const config = require(Path.join(__dirname, '..', '.posthtmlrc'))
    const plugins = []
    Object.keys(config.plugins).forEach(plugin => {
        const pl = require(plugin)
        plugins.push(pl(config.plugins[plugin]))
    })
    const post = posthtml(plugins)

    // Process
    const html = (await post.process(source)).html

    // Remove comments before HTML
    const result = html.replace(/^(<!--.+?-->[\w\n]*)*/gms, '')

    // Export
    fs.writeFileSync(Path.join(__dirname, '..', out), result, { flag: 'w+' })
    console.log(`...build successfully, saved to ${out}`)
}

const main = async () => {
    // Get the tool directory
    if (process.argv.length < 3) return console.error('Please provide the tool directory as a command-line argument')
    const tool = process.argv[2]

    // Build the JS
    await build(
        Path.join('src', tool, 'mount.js'),
        Path.join('dist', tool, 'mount.js')
    )

    // Build the CSS
    await build(
        Path.join('src', tool, 'scss/style.scss'),
        Path.join('dist', tool, 'style.css')
    )

    // Build index
    await index(
        Path.join('src', tool, 'index.html'),
        Path.join('dist', tool, 'index.html')
    )
}

main()
