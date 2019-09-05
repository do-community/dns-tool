export default {
    v: "This dictates the DMARC protocol version that is being used. This is normally located at the start of a record and set to DMARC1.",
    ruf: "This is a comma sepearated list of e-mails where forensic reports should be sent.",
    rua: "This is a comma sepearated list of e-mails where aggregate reports should be sent.",
    pct: "This defines the percentage of e-mail which will have this policy applied.",
    p: "This defines how domain administrators want e-mail treated on the primary domain that fail the DMARC validation checks. The options are none (treat the same as usual), quarantine (mark as spam) or reject (reject the message).",
    aspf: "If this is set to strict (s) mode the domain which e-mails are being sent from must exactly pass SPF record validation. If not, it will default to relaxed (r) mode where any sub-domain can inherit the root domain's SPF records.",
    adkim: "If this is set to relaxed (r) mode like it is by default any sub-domain can inherit the root domain's DKIM records. If this is set to strict (s) mode, the domain which e-mails are being sent from must exactly pass DKIM record validation.",
    sp: "This defines how domain administrators want e-mail treated on sub-domains that fail the DMARC validation checks. The options are none (treat the same as usual), quarantine (mark as spam) or reject (reject the message).",
    fo: "This option allows you to configure when failure reports should be sent. The available options are 0 which is the default and specifies that a report should be sent if an email fails SPF and DKIM checks, 1 to send a report if SPF or DKIM checks fail, d to send a report for only DKIM failures and s to send a report for only SPF failures.",
    rf: "This is the format reports are sent in. It currently only has one supported value, \"afrf\", which is the default.",
    ri: "The requested interval between DMARC reports being sent in seconds. This defaults to 86400.",
} as {[key: string]: string}
