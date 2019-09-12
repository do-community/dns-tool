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
            Accept: "application/vnd.github.v3+json",
            Authorization: `Basic JakeMakesStuff:${(new Buffer(process.env.GITHUB_ACCESS_TOKEN)).toString("base64")}`,
        }
    },
).then(x => {
    if (!x.ok) throw x
}).catch(e => { throw e })
