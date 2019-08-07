export default {
    title: "DNS Lookup Tool",
    description: "Enter the (sub-)domain you wish to look up.",
    searchButton: "Search DNS Records",
    backToTop: "Back To Top",
    cfThanks: `
        Thanks to <a href="https://cloudflare.com">Cloudflare</a> for their great WHOIS/DNS-over-HTTPS APIs.
        You can learn more about the importance of DNS-over-HTTPS and how to use it
        <a href="https://developers.cloudflare.com/1.1.1.1/dns-over-https/">here.</a>
    `,
    mattThanks: `
        Thanks to <a href="https://twitter.com/matthewgall">Matthew Gall</a> for his wonderful
        <a href="https://whoisjs.com/">WHOIS API.</a>
    `,
    textRecords: "Get the records in text/markdown form.",
    oss: `This tool is open-source on GitHub under the <a href="https://www.apache.org/licenses/LICENSE-2.0">Apache-2.0</a> license! We welcome feedback and contributions.`,
} as {[key: string]: string}
