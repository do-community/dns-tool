export default {
    v: "This is commonly at the start of a record name to define the version. This is commonly equal to DMARC1.",
    ruf: "This is a comma sepearated list of e-mails where forensic reports should be sent.",
    rua: "This is a comma sepearated list of e-mails where aggregate reports should be sent.",
    pct: "This defines the percentage of e-mail which will have this policy applied.",
    p: "This defines how domain administrators want e-mail treated that fails the DMARC validation checks. The options are none (treat the same as usual), quarantine (mark as spam) or reject (reject the message).",
    aspf: "If this is set to strict (s) mode the domain which e-mails are being sent to must match directly. If not, it will default to relaxed (r) mode where any sub-domain is fine.",
    adkim: "If this is set to strict (s) mode the domain which e-mails are being sent from must match directly. If not, it will default to relaxed (r) mode where any sub-domain is fine.",
} as {[key: string]: string}
