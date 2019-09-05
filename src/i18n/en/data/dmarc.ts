export default {
    v: `This dictates the DMARC protocol version that is being used. This is normally located at the start of a record and set to <code class="slim">DMARC1</code>.`,
    ruf: "This is a comma separated list of e-mails where forensic reports should be sent.",
    rua: "This is a comma separated list of e-mails where aggregate reports should be sent.",
    pct: "This defines the percentage of e-mail which will have this policy applied.",
    p: `This defines how domain administrators want e-mail treated on the primary domain that fail the DMARC validation checks. The options are <code class="slim">none</code> (treat the same as usual), <code class="slim">quarantine</code> (mark as spam) or <code class="slim">reject</code> (reject the message).`,
    aspf: `If this is set to strict <code class="slim">s</code> mode the domain which e-mails are being sent from must exactly pass SPF record validation. If not, it will default to relaxed <code class="slim">r</code> mode where any sub-domain can inherit the root domain's SPF records.`,
    adkim: `By default this is set to relaxed <code class="slim">r</code> mode where any sub-domain can inherit the root domain's DKIM records. If this is set to strict <code class="slim">s</code> mode, the domain which e-mails are being sent from must exactly pass DKIM record validation.`,
    sp: `This defines how domain administrators want e-mail treated on sub-domains that fail the DMARC validation checks. The options are <code class="slim">none</code> (treat the same as usual), <code class="slim">quarantine</code> (mark as spam) or <code class="slim">reject</code> (reject the message).`,
    fo: `This option allows you to configure when failure reports should be sent. The available options are <code class="slim">0</code> which is the default and specifies that a report should be sent if an email fails SPF and DKIM checks, <code class="slim">1</code> to send a report if SPF or DKIM checks fail, <code class="slim">d</code> to send a report for only DKIM failures and <code class="slim">s</code> to send a report for only SPF failures.`,
    rf: `This is the format reports are sent in. It currently only has one supported value, <code class="slim">afrf</code>, which is the default.`,
    ri: `The requested interval between DMARC reports being sent in seconds. This defaults to <code class="slim">86400</code>.`,
} as {[key: string]: string}
