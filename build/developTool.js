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

const main = async () => {
    // Get the tool directory
    if (process.argv.length < 3) return console.error('Please provide the tool directory as a command-line argument')
    const tool = process.argv[2]
    console.log(`\nLoading in ${tool} & watching...`)

    // Define options
    const entry = Path.join(__dirname, '..', 'src', tool, 'index.html')
    const options = {
        outDir: Path.join(__dirname, '..', 'dev', tool),
        publicUrl: './',
        watch: true,
        cache: false,
        minify: false,
        logLevel: 3,
        detailedReport: true,
    }

    // Bundle & watch
    const bundler = new Bundler(entry, options)
    await bundler.serve()
}

main()
