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

const posthtml = require('posthtml');
const fs = require('fs');

const main = async () => {
    console.log('Loading in src/index.html & building...');

    // Get source HTML
    let source = fs.readFileSync(`${__dirname}/../src/index.html`).toString();

    // Replace SCSS w/ CSS
    source = source.replace(/href="scss\/style\.scss"/, 'href="style.css"');

    // Load extend plugin
    const post = posthtml([require('posthtml-extend')({
        encoding: 'utf8',
        root: 'src/'
    })]);

    // Process
    const result = await post.process(source);

    // Export
    fs.writeFileSync(`${__dirname}/../dist/index.html`, result.html, { flag: 'w+' });
    console.log('...build successfully, saved to dist/index.html');
}

main();
