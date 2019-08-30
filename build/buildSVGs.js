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

const fs = require("fs");

const main = () => {
    console.log('Locating & building all SVG assets to JS data...');

    // Locate all SVG asset files
    const base = `${__dirname}/../src/assets`;
    const files = fs.readdirSync(base);
    const svgs = files.filter(file => file.endsWith('.svg'));

    // Create target directory
    if (!fs.existsSync(`${__dirname}/svg`)) {
        fs.mkdirSync(`${__dirname}/svg`);
    }

    // Convert to JS & save
    svgs.forEach(svg => {
        const xml = fs.readFileSync(`${base}/dns.svg`);
        fs.writeFileSync(
            `${__dirname}/svg/${svg}.js`,
            `// This file was automatically generated.\nexport default \`\n${xml}\n\`\n`,
            { flag: 'w+' }
        );
    });
};

main();
