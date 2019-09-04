export default {
    v: "This dictates the DMARC protocol version that is being used. This is normally located at the start of a record and set to DMARC1.",
    ruf: "This is a comma sepearated list of e-mails where forensic reports should be sent.",
    rua: "This is a comma sepearated list of e-mails where aggregate reports should be sent.",
    pct: "This defines the percentage of e-mail which will have this policy applied.",
    p: "This defines how domain administrators want e-mail treated on the primary domain that fail the DMARC validation checks. The options are none (treat the same as usual), quarantine (mark as spam) or reject (reject the message).",
    aspf: "If this is set to strict (s) mode the domain which e-mails are being sent to must match directly. If not, it will default to relaxed (r) mode where any sub-domain is fine. This will use the configuration from your SPF record.",
    adkim: "If this is set to strict (s) mode the domain which e-mails are being sent from must match directly. If not, it will default to relaxed (r) mode where any sub-domain is fine. This will use the configuration from your DKIM record.",
    sp: "This defines how domain administrators want e-mail treated on sub-domains that fail the DMARC validation checks. The options are none (treat the same as usual), quarantine (mark as spam) or reject (reject the message).",
} as {[key: string]: string}
