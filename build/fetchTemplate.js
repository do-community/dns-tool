const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch')
const fs = require('fs')

const main = async () => {
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
}

main()
