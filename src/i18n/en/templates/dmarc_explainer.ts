export default {
    title: "DMARC Explanations",
    intro: `<p>A DMARC record is a normal TXT DNS records that is created at <code class="slim">_dmarc.hostname.</code> instead of just the root hostname.
This record can contain any of the following "tags" formatted as <code class="slim">tag=value</code> and separated by semi-colons.</p>
<p>An example of a DMARC TXT record would be: <pre><code>_dmarc.hostname. 300 IN TXT "v=DMARC1;p=reject;pct=100;rua=mailto:postmaster@hostname"</code></pre></p>`,
    learnMore: "Learn more about DMARC at",
} as {[key: string]: string}
