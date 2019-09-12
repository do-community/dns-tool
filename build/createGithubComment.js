const fetch = require("node-fetch")

const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${process.env.COMMIT_SHA}`

const comment = `This commit has been deployed to DigitalOcean Spaces for easy viewing. ([DNS Tool](${url}/dns-tool/index.html), [SPF Explainer](${url}/spf-explainer/index.html))`

fetch(
    `https://api.github.com/repos/do-community/dns-tool/commits/${process.env.COMMIT_SHA}/comments`,
    {
        method: "POST",
        body: JSON.stringify({
            body: comment,
        }),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
            Authorization: `Basic ${Buffer.from(`JakeMakesStuff:${process.env.GITHUB_ACCESS_TOKEN}`).toString("base64")}`,
        }
    },
).then(async x => {
    if (!x.ok) { console.log(await x.json()); process.exit(1); }
}).catch(async e => { console.log(await e.json()); process.exit(1); })
