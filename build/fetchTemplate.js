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

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch')
const fs = require('fs')

const main = async () => {
    console.log('Fetching Community Tools template from www.digitalocean.com...')
    const res = await fetch('https://www.digitalocean.com/community/tools?render_as_empty=1')
    let rawHTML = await res.text()

    // Parse
    const { document } = (new JSDOM(rawHTML)).window;
    const nav = document.querySelector('nav.do_nav')

    // Nuke top log in button
    nav.querySelectorAll('ul.utility li[role="menuitem"]').forEach(node => {
        if (node.innerHTML.includes('<header>Log in to</header>')) {
            node.remove()
        }
    })

    // Nuke the primary log in button
    nav.querySelectorAll('ul.primary li[role="menuitem"]').forEach(node => {
        if (node.innerHTML.includes('Sign Up</a>')) {
            node.remove()
        }
    })

    // Deal with hard URLs
    document.querySelectorAll('[href]').forEach(node => {
        const href = node.getAttribute('href')
        if (href.startsWith('/')) {
            node.setAttribute('href', `https://www.digitalocean.com${href}`)
        }
    })
    document.querySelectorAll('[src]').forEach(node => {
        const src = node.getAttribute('src')
        if (src.startsWith('/')) {
            node.setAttribute('src', `https://www.digitalocean.com${src}`)
        }
    })

    // Convert back to raw
    rawHTML = document.documentElement.innerHTML

    // Inject title block
    rawHTML = rawHTML.replace(/<title>(.+?)<\/title>/, '<title><block name="title"></block>$1</title>')

    // Inject head block
    rawHTML = rawHTML.replace('</head>', '<block name="head"></block></head>')

    // Inject content block
    rawHTML = rawHTML.replace(/<div class=['"]wrapper layout-wrapper['"]>\s+?<div class=['"]clearfix['"]><\/div>\s+?<\/div>/,
        '<block name="content"></block><div class="clearfix"></div>')

    // Inject last fetch comment
    rawHTML = rawHTML.replace('<head>', `<head><!-- Last fetch from www.digitalocean.com @ ${(new Date()).toISOString()} -->`)

    // Export
    fs.writeFileSync(`${__dirname}/base.html`, rawHTML)
    console.log('...fetching & conversion completed, saved to base.html')
}

main()
